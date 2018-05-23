#coding=utf-8
from django.views.decorators.csrf import csrf_protect,csrf_exempt
from django.http import HttpResponse
from django.shortcuts import render
from code.util import grains
from code.util.saltapi import SaltApi
import json , os , time
from AutOperation.settings import redisFilePath , salt_api , salt_master , salt_user , salt_passwd , redisFilePath

redis_fixed_text = """protected-mode no
tcp-backlog 511
timeout 0
tcp-keepalive 0
daemonize yes
supervised no
loglevel notice
databases 16
stop-writes-on-bgsave-error yes
rdbcompression yes
rdbchecksum yes
slave-serve-stale-data yes
slave-read-only yes
repl-diskless-sync no
repl-diskless-sync-delay 5
repl-disable-tcp-nodelay no
appendonly no
appendfilename "appendonly.aof"
appendfsync everysec
no-appendfsync-on-rewrite no
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb
aof-load-truncated yes
lua-time-limit 5000
slowlog-log-slower-than 10000
slowlog-max-len 128
latency-monitor-threshold 0
notify-keyspace-events \\"\\"
hash-max-ziplist-entries 512
hash-max-ziplist-value 64
list-max-ziplist-size -2
list-compress-depth 0
set-max-intset-entries 512
zset-max-ziplist-entries 128
zset-max-ziplist-value 64
hll-sparse-max-bytes 3000
activerehashing yes
client-output-buffer-limit normal 0 0 0
client-output-buffer-limit slave 256mb 64mb 60
client-output-buffer-limit pubsub 32mb 8mb 60
hz 10
aof-rewrite-incremental-fsync yes
"""

configs = {
'port':"6379",
'pidfile':'"/var/run/redis-6379.pid"',
'logfile':'"/home/redis/log/redis-6379.log"',
'dbfilename':'"dump-6379.rdb"',
'dir':'"/home/redis/dump"',
'maxclients':'10240',
'maxmemory':'50g',
'slave-priority':'100',
}


@csrf_exempt
def createRedisFile(request):
    try:
        input_type = request.POST['input_type'].strip()
        input_port = request.POST['input_port'].strip()
        input_maxcli = request.POST['input_maxcli'].strip()
        input_maxmem = request.POST['input_maxmem'].strip()
        master_ip = request.POST['master_ip'].strip()
        priority = request.POST['priority'].strip()
        serverlists = request.POST['serverlists'].strip()
    except Exception:
        return HttpResponse(json.dumps('参数有误'), content_type="application/json")
    print serverlists
    configs['port'] = input_port
    configs['pidfile'] = '"/var/run/redis-%s.pid"' % (input_port)
    configs['logfile']= '/usr/local/redislog/redis-'+input_port+'.log'
    configs['dbfilename'] = 'dump-'+input_port+'.rdb'
    configs['dir'] = '/usr/local/redisdump/'
    configs['maxclients'] = input_maxcli
    configs['maxmemory'] = '%sgb' % (input_maxmem)
    name = ''
    try:
        if input_type == 'master':
            name = 'redis_'+input_port+'_master.conf'
            write_redis_conf_master(configs)
        elif input_type == 'slave':
            name = 'redis_'+input_port+'_slave.conf'
            configs['slave-priority'] = priority
            write_redis_conf_slave(configs, master_ip , input_port)
    except:
        return HttpResponse(json.dumps('配置文件创建错误'), content_type="application/json")

    salt_aa=SaltApi(salt_api,salt_user,salt_passwd)
    cmd = '/bin/echo "' + redis_fixed_text + '" > /usr/local/redisconf/'+name
    rt = salt_aa.group_remote_execution_module(serverlists,'cmd.run',cmd)
    rslist = []
    for i in rt.keys():
        if rt[i] != '':
            rslist.append(i)
            rslist.append('install faild ')
    return HttpResponse(json.dumps(rslist), content_type="application/json")


def write_redis_conf_master(configs):
    global redis_fixed_text

    for k,v in configs.items():
        redis_fixed_text = redis_fixed_text + k + ' ' + v + '\n'
    # print redis_fixed_text


def write_redis_conf_slave(configs, master_ip , port):
    global redis_fixed_text

    for k,v in configs.items():
        redis_fixed_text = redis_fixed_text + k + ' ' + v + '\n'
    redis_fixed_text = redis_fixed_text + 'slaveof ' + master_ip + ' ' + port
    # print redis_fixed_text


def write_redis_conf_dump(configs, auth, master_ip, save):
    print redis_fixed_text
