#coding=utf-8
from django.views.decorators.csrf import csrf_protect,csrf_exempt
from django.http import HttpResponse
from code.util.saltapi import SaltApi
import json , time
from AutOperation.settings import  salt_api , salt_master , salt_user , salt_passwd , keepalivedFilePath

@csrf_exempt
def getKeepAlivedList(request):
    salt_aa=SaltApi(salt_api,salt_user,salt_passwd)
    rt = salt_aa.host_remote_execution_module(salt_master ,'cmd.run','ls ' + keepalivedFilePath)
    return HttpResponse(json.dumps(rt[salt_master].split('\n')), content_type="application/json")

@csrf_exempt
def getServerList(request):
    salt_aa=SaltApi(salt_api,salt_user,salt_passwd)
    rt = salt_aa.host_remote_func('*','test.ping')
    list = []
    for i in rt:
        if rt[i] == True:
            list.append(i)
    return HttpResponse(json.dumps(list), content_type="application/json")

@csrf_exempt
def keepalivedInstall(request):
    from mymiddleware.websocketLog import clients
    try:
        redis = request.POST['redis'].strip()
        type = request.POST['type'].strip()
        server_lists  = request.POST['server'].strip()
    except Exception:
        return HttpResponse(json.dumps('参数异常'), content_type="application/json")
    gg = True
    index = 1
    while gg and index < 5:
        from mymiddleware.websocketLog import clients
        if clients == {}:
            time.sleep(0.1)
            print '休眠2秒'
        else:
            gg = False
        index += index
    content = redis + ' , ' + 'type: ' + type + ' , ' + server_lists
    sendContent(content)
    if type == '1':
        content = server_lists + u'开始安装keepalived'
        sendContent(content)
        rs = installRedis(redis , server_lists)
    return HttpResponse(json.dumps(rs), content_type="application/json")

def installRedis(redis , server_lists):
    salt_aa=SaltApi(salt_api,salt_user,salt_passwd)
    content = u'开始安装依赖包: ncurses-devel gcc rpm-build openssl-devel popt-devel libnl libnl-devel, 时间可能会比较长,请耐心等待'
    sendContent(content)
    salt_aa.group_remote_execution_module(server_lists,'cmd.run','yum install -y ncurses-devel gcc rpm-build openssl-devel popt-devel libnl libnl-devel libnfnetlink-devel')
    rt = salt_aa.group_remote_execution_module(server_lists,'cmd.run','rpm -qa|grep -e ncurses-devel -e gcc -e rpm-build -e openssl-devel -e popt-devel -e libnl -e libnl-devel -e libnfnetlink-devel')
    print rt
    sendContent(u'依赖包安装结果:\n' + str(rt))
    redisFilePathN = keepalivedFilePath.replace('/srv/salt/' , '')
    content = u'文件推送指令:' + 'salt://'+redisFilePathN+'/'+redis + ' /usr/local/src/'+redis
    sendContent(content)
    file_rt = salt_aa.group_remote_execution_module(server_lists,'cp.get_file',('salt://'+redisFilePathN+'/'+redis,'/usr/local/src/'+redis))
    content = u'文件推送结果:' + str(file_rt)
    sendContent(content)
    redisPath = redis.replace('.tar' , '').replace('.gz' , '').replace('.zip' , '')
    cmd = 'tar xvf /usr/local/src/' + redis + ' -C  /usr/local/src/ &>/dev/null'
    content = u'开始进行解压缩.....'
    sendContent(content)
    salt_aa.group_remote_execution_module(server_lists,'cmd.run',cmd)

    content = u'解压缩完成,开始编译.....'
    sendContent(content)
    cmd = 'cd /usr/local/src/' + redisPath + ' &&  ./configure --prefix=/usr/local/keepalived && make && make install &>/dev/null'
    salt_aa.group_remote_execution_module(server_lists,'cmd.run',cmd)

    content = u'编译完成,查看安装结果.....'
    sendContent(content)
    check_rt = salt_aa.group_remote_execution_module(server_lists,'cmd.run','ls /usr/local/keepalived/sbin/keepalived')
    content = u'安装结果: '+str(check_rt)
    sendContent(content)
    cmd = 'cp /usr/local/keepalived/sbin/keepalived /usr/sbin/;cp /usr/local/keepalived/etc/sysconfig/keepalived /etc/sysconfig/;cp /usr/local/src/' + redisPath + '/keepalived/etc/init.d/keepalived /etc/init.d/;cp /usr/local/keepalived/bin/genhash /usr/bin/'
    print cmd
    content = u'添加keepalived,genhash指令...'
    sendContent(content)
    salt_aa.group_remote_execution_module(server_lists,'cmd.run',cmd)
    content = u'指令添加完毕,开始注册keepalived服务'
    sendContent(content)
    cmd = 'chmod +x /etc/init.d/keepalived;mkdir -p /etc/keepalived/;cp /usr/local/keepalived/etc/keepalived/keepalived.conf /etc/keepalived/keepalived.conf;chkconfig --add keepalived;chkconfig keepalived on'
    salt_aa.group_remote_execution_module(server_lists,'cmd.run',cmd)
    content = u'服务注册完毕\n目前配置文件为模版文件,请尽快添加配置文件.\n安装完毕,请关闭websocket页面'
    sendContent(content)
    return []

def sendContent(cont):
    from mymiddleware.websocketLog import clients
    if len(cont) > 40:
        length = 0
        start = 0
        end = 39
        while(length < len(cont)):
            contt = cont[start:end]
            if start != 0:
                contt = '{[}]' + contt
            for connection in  clients.values():
                print contt
                connection.send('%c%c%s' % (0x81,len(contt.encode('utf-8')),contt.encode('utf-8')))
            if start !=0:
                length = length + len(contt)
            else:
                length = length + len(contt) - 4
            start = end
            end += 40
    else:
        # connection.send('%c%c%s' % (0x81,len(cont.encode('utf-8')),cont.encode('utf-8')))
        for connection in  clients.values():
            connection.send('%c%c%s' % (0x81,len(cont.encode('utf-8')),cont.encode('utf-8')))





