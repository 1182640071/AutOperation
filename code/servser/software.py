#coding=utf-8
from django.views.decorators.csrf import csrf_protect,csrf_exempt
from django.http import HttpResponse
from django.shortcuts import render
from code.util import grains
import json , os
import salt
from code.util.saltapi import SaltApi

from AutOperation.settings import softwareList , salt_api , salt_master , salt_user , salt_passwd , redisFilePath

@csrf_exempt
def returnSoftwareHtml(request):
    '''
    跳转至软件管理页面,将软件列表传至前台
    :param request:跳转请求
    :return:html
    '''
    salt_aa=SaltApi(salt_api,salt_user,salt_passwd)
    rt = salt_aa.host_remote_func('*','test.ping')
    list = []
    for i in rt:
        if rt[i] == True:
            list.append(i)
    return render(request, 'server/software.html' ,{'softwareList':softwareList , 'serverList':list})

@csrf_exempt
def dealSoftware(request):
    '''
    处理软件请求,分别位集群软件安装\升级\卸载和指定服务器安装\升级\卸载
    :param request:软件处理请求
    :return:软件处理结果json
    '''
    from AutOperation.settings import state
    import salt.client
    try:
        # range = request.POST['range'].strip()
        # style = request.POST['style'].strip()
        soft  = request.POST['soft'].strip()
        servers  = request.POST['serverlist'].strip()
        print soft , servers
    except Exception:
        # range = ''
        # style = ''
        soft = ''
    x = {}
    salt_aa=SaltApi(salt_api,salt_user,salt_passwd)
    x = salt_aa.group_remote_execution_module(servers,'state.sls',soft)
    print x
    # if range == '1':
    #     if state != '1':
    #         client = salt.client.LocalClient()
    #         x = client.cmd('*' , 'state.sls' , [soft,])
    #         print x
    #     else:
    #         x = {'centos6-1': {'service_|-apache_|-httpd_|-running': {'comment': 'Started Service httpd', 'name': 'httpd', 'start_time': '02:16:33.796538', 'result': True, 'duration': 187.324, '__run_num__': 1, 'changes': {'httpd': True}}, 'pkg_|-apache_|-httpd_|-installed': {'comment': 'The following packages were installed/updated: httpd', 'name': 'httpd', 'start_time': '02:15:26.140594', 'result': True, 'duration': 67649.572, '__run_num__': 0, 'changes': {'httpd': {'new': '2.2.15-59.el6.centos', 'old': ''}}}}, 'centos6-2': {'service_|-apache_|-httpd_|-running': {'comment': 'Started Service httpd', 'name': 'httpd', 'start_time': '14:47:51.704776', 'result': True, 'duration': 218.627, '__run_num__': 1, 'changes': {'httpd': True}}, 'pkg_|-apache_|-httpd_|-installed': {'comment': 'The following packages were installed/updated: httpd', 'name': 'httpd', 'start_time': '14:46:43.616536', 'result': True, 'duration': 68081.432, '__run_num__': 0, 'changes': {'httpd': {'new': '2.2.15-59.el6.centos', 'old': ''}}}}}
    #         y = {'centos6-1': {'service_|-apache_|-httpd_|-running': {'comment': 'The service httpd is already running', 'name': 'httpd', 'start_time': '02:18:02.092122', 'result': True, 'duration': 20.393, '__run_num__': 1, 'changes': {}}, 'pkg_|-apache_|-httpd_|-installed': {'comment': 'Package httpd is already installed.', 'name': 'httpd', 'start_time': '02:18:01.333465', 'result': True, 'duration': 757.785, '__run_num__': 0, 'changes': {}}}, 'centos6-2': {'service_|-apache_|-httpd_|-running': {'comment': 'The service httpd is already running', 'name': 'httpd', 'start_time': '14:49:19.316312', 'result': True, 'duration': 26.378, '__run_num__': 1, 'changes': {}}, 'pkg_|-apache_|-httpd_|-installed': {'comment': 'Package httpd is already installed.', 'name': 'httpd', 'start_time': '14:49:18.543200', 'result': True, 'duration': 772.083, '__run_num__': 0, 'changes': {}}}}
    # x = {'centos6-1': {'pkg_|-zabbix-gt_|-zabbix-agent_|-installed': {'comment': 'Package zabbix-agent is already installed.', 'name': 'zabbix-agent', 'start_time': '01:38:49.156303', 'result': True, 'duration': 735.766, '__run_num__': 1, 'changes': {}}, 'service_|-zabbix-gt_|-zabbix-agent_|-running': {'comment': 'The service zabbix-agent is already running', 'name': 'zabbix-agent', 'start_time': '01:38:49.892983', 'result': True, 'duration': 45.416, '__run_num__': 2, 'changes': {}}, 'cmd_|-zabbix-yum_|-rpm -ivh http://repo.zabbix.com/zabbix/3.0/rhel/6/x86_64/zabbix-release-3.0-1.el6.noarch.rpm_|-run': {'comment': 'Command "rpm -ivh http://repo.zabbix.com/zabbix/3.0/rhel/6/x86_64/zabbix-release-3.0-1.el6.noarch.rpm" run', 'name': 'rpm -ivh http://repo.zabbix.com/zabbix/3.0/rhel/6/x86_64/zabbix-release-3.0-1.el6.noarch.rpm', 'start_time': '01:38:45.253018', 'result': False, 'duration': 3613.953, '__run_num__': 0, 'changes': {'pid': 45583, 'retcode': 1, 'stderr': '\tpackage zabbix-release-3.0-1.el6.noarch is already installed', 'stdout': 'Retrieving http://repo.zabbix.com/zabbix/3.0/rhel/6/x86_64/zabbix-release-3.0-1.el6.noarch.rpm\nPreparing...                ##################################################'}}, 'file_|-zabbix-gt_|-/etc/zabbix/zabbix_agentd.conf_|-managed': {'comment': 'File /etc/zabbix/zabbix_agentd.conf updated', 'name': '/etc/zabbix/zabbix_agentd.conf', 'start_time': '01:38:49.941526', 'result': True, 'duration': 22.905, '__run_num__': 3, 'changes': {'diff': '---  \n+++  \n@@ -144,7 +144,7 @@\n # Default:\n # Hostname=\n \n-Hostname=localhost243.localdomain\n+Hostname=localhost.localdomain\n \n ### Option: HostnameItem\n #\tItem used for generating Hostname if it is undefined. Ignored if Hostname is defined.\n'}}}, 'centos6-2': {'pkg_|-zabbix-gt_|-zabbix-agent_|-installed': {'comment': 'Package zabbix-agent is already installed.', 'name': 'zabbix-agent', 'start_time': '19:54:56.176148', 'result': True, 'duration': 773.496, '__run_num__': 1, 'changes': {}}, 'service_|-zabbix-gt_|-zabbix-agent_|-running': {'comment': 'The service zabbix-agent is already running', 'name': 'zabbix-agent', 'start_time': '19:54:56.950481', 'result': True, 'duration': 38.052, '__run_num__': 2, 'changes': {}}, 'cmd_|-zabbix-yum_|-rpm -ivh http://repo.zabbix.com/zabbix/3.0/rhel/6/x86_64/zabbix-release-3.0-1.el6.noarch.rpm_|-run': {'comment': 'Command "rpm -ivh http://repo.zabbix.com/zabbix/3.0/rhel/6/x86_64/zabbix-release-3.0-1.el6.noarch.rpm" run', 'name': 'rpm -ivh http://repo.zabbix.com/zabbix/3.0/rhel/6/x86_64/zabbix-release-3.0-1.el6.noarch.rpm', 'start_time': '19:54:50.138444', 'result': False, 'duration': 5623.682, '__run_num__': 0, 'changes': {'pid': 84644, 'retcode': 1, 'stderr': '\tpackage zabbix-release-3.0-1.el6.noarch is already installed', 'stdout': 'Retrieving http://repo.zabbix.com/zabbix/3.0/rhel/6/x86_64/zabbix-release-3.0-1.el6.noarch.rpm\nPreparing...                ##################################################'}}, 'file_|-zabbix-gt_|-/etc/zabbix/zabbix_agentd.conf_|-managed': {'comment': 'File /etc/zabbix/zabbix_agentd.conf updated', 'name': '/etc/zabbix/zabbix_agentd.conf', 'start_time': '19:54:56.991335', 'result': True, 'duration': 17.586, '__run_num__': 3, 'changes': {'diff': '---  \n+++  \n@@ -144,7 +144,7 @@\n # Default:\n # Hostname=\n \n-Hostname=local_centos6-2\n+Hostname=localhost\n \n ### Option: HostnameItem\n #\tItem used for generating Hostname if it is undefined. Ignored if Hostname is defined.\n'}}}, 'centos6-3': {'pkg_|-zabbix-gt_|-zabbix-agent_|-installed': {'comment': 'Package zabbix-agent is already installed.', 'name': 'zabbix-agent', 'start_time': '00:32:36.317957', 'result': True, 'duration': 770.078, '__run_num__': 1, 'changes': {}}, 'service_|-zabbix-gt_|-zabbix-agent_|-running': {'comment': 'The service zabbix-agent is already running', 'name': 'zabbix-agent', 'start_time': '00:32:37.088801', 'result': True, 'duration': 22.072, '__run_num__': 2, 'changes': {}}, 'cmd_|-zabbix-yum_|-rpm -ivh http://repo.zabbix.com/zabbix/3.0/rhel/6/x86_64/zabbix-release-3.0-1.el6.noarch.rpm_|-run': {'comment': 'Command "rpm -ivh http://repo.zabbix.com/zabbix/3.0/rhel/6/x86_64/zabbix-release-3.0-1.el6.noarch.rpm" run', 'name': 'rpm -ivh http://repo.zabbix.com/zabbix/3.0/rhel/6/x86_64/zabbix-release-3.0-1.el6.noarch.rpm', 'start_time': '00:32:30.318503', 'result': False, 'duration': 5604.986, '__run_num__': 0, 'changes': {'pid': 20323, 'retcode': 1, 'stderr': '\tpackage zabbix-release-3.0-1.el6.noarch is already installed', 'stdout': 'Retrieving http://repo.zabbix.com/zabbix/3.0/rhel/6/x86_64/zabbix-release-3.0-1.el6.noarch.rpm\nPreparing...                ##################################################'}}, 'file_|-zabbix-gt_|-/etc/zabbix/zabbix_agentd.conf_|-managed': {'comment': 'File /etc/zabbix/zabbix_agentd.conf is in the correct state', 'name': '/etc/zabbix/zabbix_agentd.conf', 'start_time': '00:32:37.113687', 'result': True, 'duration': 12.362, '__run_num__': 3, 'changes': {}}}}
    # dicUser = {}
    # dic = {}
    # dicc= {}
    # dichange = {}
    # for k in x.keys():
    #     for kk in x[k]:
    #         if kk.startswith('service') and kk.endswith('running'):
    #             dicc['state'] = x[k][kk]['comment']
    #         if kk.startswith('pkg') and kk.endswith('installed'):
    #             dicc['result'] = x[k][kk]['comment']
    #             dichange = x[k][kk]['changes']
    #             dicc['version'] = 'none'
    #             for z in dichange.keys():
    #                 if dichange[z].has_key('new'):
    #                     dicc['version'] = dichange[z]['new']
    #     dic[k] = dicc
    # username = request.session['userName']
    # dicUser['user'] = str(username)
    # dicUser['userResult'] = dic
    # print dicUser
    return HttpResponse(json.dumps(str(x)), content_type="application/json")
