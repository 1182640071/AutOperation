#!/usr/bin/env python
# -*- coding: utf-8 -*-
import sys
import web

#port, user, maxclients, maxmemory, auth, master_ip


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
notify-keyspace-events ""
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
#'slave-priority':'100',
}

save = ['900 1', '300 10', '60 1000']

auth = ''


class createconfig():
    def GET(self):
        i = web.input()
        input_type = i['input_type']
        input_port = i['input_port']
        input_user = 'root'
        input_maxcli = i['input_maxcli']
        input_maxmem = i['input_maxmem']
        auth = i['auth_passwd']
        master_ip = i['master_ip']

        configs['port'] = input_port
        configs['pidfile'] = '"/var/run/redis-%s.pid"' % (input_port)
        if input_user=='root':
            configs['logfile']='"/%s/log/redis-%s.log"' % (input_user, input_port)
        else:
            configs['logfile'] = '"/home/%s/log/redis-%s.log"' % (input_user, input_port)
        configs['dbfilename'] = '"dump-%s.rdb"' % (input_port)

        if input_user=='root':
            configs['dir'] = '"/%s/dump"' % (input_user)
        else:
            configs['dir'] = '"/home/%s/dump"' % (input_user)
        configs['maxclients'] = input_maxcli
        configs['maxmemory'] = '%sgb' % (input_maxmem)

        if input_type == 'master':
            name = write_redis_conf_master(configs, auth)

        elif input_type == 'slave':
            name = write_redis_conf_dump(configs, auth, master_ip, save)
        return name
        # write_redis_conf_slave(configs, auth, master_ip)
        # write_redis_conf_dump(configs, auth, master_ip, save)



def write_redis_conf_master(configs, auth):
    from top import redis_path
    file_name = "redis-%s-master.conf" % (configs['port'])
    with open(redis_path+ '/' + file_name, 'w+') as conf_file:
        conf_file.write(redis_fixed_text)
        for k,v in configs.items():
            conf_file.write("%s %s\n" % (k, v))
        if auth != '':
            conf_file.write('masterauth "%s"\nrequirepass "%s"\n' % (auth, auth))
        conf_file.write('slave-priority 100\n')
    return file_name

def write_redis_conf_slave(configs, auth, master_ip):
    from top import redis_path
    file_name = "redis-%s-slave.conf" % (configs['port'])
    with open(redis_path + '/' + file_name, 'w+') as conf_file:
        conf_file.write(redis_fixed_text)
        for k,v in configs.items():
            conf_file.write("%s %s\n" % (k, v))
        if auth != '':
            conf_file.write('masterauth "%s"\nrequirepass "%s"\n' % (auth, auth))
        conf_file.write('slaveof %s %s\n' % (master_ip, configs['port']))
        conf_file.write('slave-priority 110\n')
    return file_name

def write_redis_conf_dump(configs, auth, master_ip, save):
    from top import redis_path
    file_name = "redis-%s-slave.conf" % (configs['port'])
    with open(redis_path + '/' + file_name, 'w+') as conf_file:
        conf_file.write(redis_fixed_text)
        for k,v in configs.items():
            conf_file.write("%s %s\n" % (k, v))
        for i in save:
            conf_file.write("save %s\n" % (i))
        if auth != '':
            conf_file.write('masterauth "%s"\nrequirepass "%s"\n' % (auth, auth))
        conf_file.write('slaveof %s %s\n' % (master_ip, configs['port']))
        conf_file.write('slave-priority 120\n')
    return file_name

