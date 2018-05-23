#coding=utf-8
from django.views.decorators.csrf import csrf_protect,csrf_exempt
from django.http import HttpResponse
from django.shortcuts import render
from code.util import grains
from code.util.saltapi import SaltApi
import json , os , time
from AutOperation.settings import redisFilePath , salt_api , salt_master , salt_user , salt_passwd , redisFilePath

configs = {
'network':"em1",
'virtual_router_id':'211',
'priority':'100',
'advert_int':'1',
'vip':'172.16.1.200'
}


@csrf_exempt
def createKeepAlivedFile(request):
    global redis_fixed_text
    try:
        input_port = request.POST['input_port'].strip()
        input_maxcli = request.POST['input_maxcli'].strip()
        input_maxmem = request.POST['input_maxmem'].strip()
        master_ip = request.POST['master_ip'].strip()
        priority = request.POST['priority'].strip()
        serverlists = request.POST['serverlists'].strip()
    except Exception:
        return HttpResponse(json.dumps('参数有误'), content_type="application/json")
    configs['network'] = input_port
    configs['virtual_router_id'] = input_maxcli
    configs['priority']= input_maxmem
    configs['advert_int'] = priority
    configs['vip'] = master_ip
    # redis_fixed_text = redis_fixed_text.replace("['network']" , configs['network'])
    # redis_fixed_text = redis_fixed_text.replace("['virtual_router_id']" , configs['virtual_router_id'])
    # redis_fixed_text = redis_fixed_text.replace("['priority']" , configs['priority'])
    # redis_fixed_text = redis_fixed_text.replace("['advert_int']" , configs['advert_int'])
    # redis_fixed_text = redis_fixed_text.replace("['vip']" , configs['vip'])
    # print redis_fixed_text

    name = ''
    print configs
    listServers = serverlists.split(',')
    salt_aa=SaltApi(salt_api,salt_user,salt_passwd)
    rslist = []
    for i in range(len(listServers)):
        redis_fixed_text = """! Configuration File for keepalived

global_defs {
   `hostname`
}

vrrp_instance VI_1 {
    state BACKUP
    nopreempt
    interface ['network']
    virtual_router_id ['virtual_router_id']
    priority ['priority']
    advert_int ['advert_int']
    authentication {
        auth_type PASS
        auth_pass 1111
    }
    virtual_ipaddress {
        ['vip']
    }
}
"""
        if listServers[i].strip() != '':
            print listServers[i]
            redis_fixed_text = redis_fixed_text.replace("['network']" , configs['network'])
            redis_fixed_text = redis_fixed_text.replace("['virtual_router_id']" , configs['virtual_router_id'])
            redis_fixed_text = redis_fixed_text.replace("['priority']" , str(int(configs['priority'])-i))
            redis_fixed_text = redis_fixed_text.replace("['advert_int']" , configs['advert_int'])
            redis_fixed_text = redis_fixed_text.replace("['vip']" , configs['vip'])
            print redis_fixed_text
            cmd = '/bin/echo "' + redis_fixed_text + '" > /etc/keepalived/keepalived.conf'
            # rt = salt_aa.group_remote_execution_module(serverlists,'cmd.run',cmd)
            rt = salt_aa.host_remote_execution_module(listServers[i],'cmd.run',cmd)
            print rt
            for i in rt.keys():
                if rt[i] != '':
                    rslist.append(i)
                    rslist.append(rt[i])
        else:
            continue

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
