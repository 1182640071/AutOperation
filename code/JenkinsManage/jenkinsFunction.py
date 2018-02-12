#coding=utf-8
from django.views.decorators.csrf import csrf_protect,csrf_exempt
from django.http import HttpResponse
from django.shortcuts import render
import urllib2
from AutOperation.settings import jenkinsList
import MySQLdb , json

@csrf_exempt
def loadList(request):
    #FIXME数据库加载数据返回前端,测试阶段使用测试数据

    from AutOperation.settings import mysqlip , mysqluser , mysqlpassword , mysqldatabase , mysqlport , mysqlcode
    list = []
        # 打开数据库连接
    conn= MySQLdb.connect(host=mysqlip,port = mysqlport,user=mysqluser,passwd=mysqlpassword,db =mysqldatabase,charset=mysqlcode)

    # 使用cursor()方法获取操作游标
    cursor = conn.cursor()

    sql = "select ID,   date_format(CreateTime, '%Y-%m-%d %H:%i:%s' ), ProjectName , version , belong_user , state , CodeName , explanation , CodeType from build"
    # 使用execute方法执行SQL语句
    cursor.execute(sql)
    # 使用 fetchall() 方法获取数据。
    data = cursor.fetchall()
    # {'ProjectName':'CCBWEB', 'create_time':'2017.10.10', 'version':'1.01',
    #  'CodeName':'springmvcMaven1','Explain':'jenkins测试代码','state':'-1' , 'type':'WEB'},
    for row in data:
        di = {}
        di["id"] = row[0]
        di["create_time"] = row[1]
        di["ProjectName"] = row[2]
        di["version"] = row[3]
        di["belong_user"] = row[4]
        di["state"] = row[5]
        di["CodeName"] = row[6]
        di["Explain"] = row[7]
        di["type"] = row[8]
        list.append(di)
    cursor.close()
    conn.close()
    return render(request,'jenkins_release.html',{'codeList':list})

import jenkins , time , os
from AutOperation.settings import salt_api
from salt_key_manage import SaltApi
@csrf_exempt
def codeRelease(request):
    #定义远程的jenkins master server的url，以及port
    jenkins_server_url='http://192.168.168.119:8080/jenkins'
    #定义用户的User Id 和 API Token，获取方式同上文
    user_id='wangminglang'
    api_token='omygad911'
    #实例化jenkins对象，连接远程的jenkins master server
    server=jenkins.Jenkins(jenkins_server_url, username=user_id, password=api_token)
    num = server.get_job_info('maven_web')['lastBuild']['number']
    #构建job名为job_name的job（不带构建参数）
    server.build_job('maven_web')
    time.sleep(3)
    num1 = num
    while(num1 == num):
        time.sleep(2)
        num1 = server.get_job_info('maven_web')['lastBuild']['number']
#判断job名为job_name的job的某次构建是否还在构建中
    while(server.get_build_info('maven_web',num1)['building']):
        time.sleep(2)
    rs = server.get_build_info('maven_web',num1)['result']

    salt_aa=SaltApi(salt_api,'saltapi','omygad911')
    rss=salt_aa.group_remote_execution_module('WEBnginx-119','cp.push','/root/.jenkins/jobs/maven_web/lastSuccessful/archive/springmvcMaven1/target/springmvcMaven1.war')
    cmd = 'mv /var/cache/salt/master/minions/WEBnginx-119/files/root/.jenkins/jobs/maven_web/builds/'+str(num1)+'/archive/springmvcMaven1/target/springmvcMaven1.war  /srv/salt/rootPath/springmvcMaven1.war'
    cprs = salt_aa.group_remote_execution_module('centos7-147','cmd.run',cmd)
    os.system('mv /var/cache/salt/master/minions/WEBnginx-119/files/root/.jenkins/jobs/maven_web/builds/'+str(num1)+'/archive/springmvcMaven1/target/springmvcMaven1.war  /srv/salt/rootPath/springmvcMaven1.war')
    cprs = salt_aa.group_remote_execution_module('WEBnginx-119,centos6-100','cp.get_file',('salt://rootPath/springmvcMaven1.war' , '/root/jenkinsTest/springmvcMaven1.war'))
    cprs = salt_aa.group_remote_execution_module('WEBnginx-119,centos6-100','cp.get_file',('salt://rootPath/model.config' , '/root/jenkinsTest/test.config'))
    list1='test1!|test2!|test3'
    list2='test21!|test22!|test23'
    index = 1
    cmd = ''
    for i in list1.split('!|'):
        # sed -r 's/shuju1/xx/' model.config
        cmd = 'sed -i s/{shuju' + str(index) + '}/' + i + '/ /root/jenkinsTest/test.config ;' + cmd
        index=index+1
    cprs = salt_aa.group_remote_execution_module('WEBnginx-119','cmd.run',cmd)
    index = 1
    cmd = ''
    for i in list2.split('!|'):
        # sed -r 's/shuju1/xx/' model.config
        cmd = 'sed -i s/{shuju' + str(index) + '}/' + i + '/ /root/jenkinsTest/test.config ;' + cmd
        index=index+1
    cprs = salt_aa.group_remote_execution_module('centos6-100','cmd.run',cmd)
    rs = 'ok'
    return HttpResponse(rs)


