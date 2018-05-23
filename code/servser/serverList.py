#coding=utf-8
"""
用户获取各机房信息,结合saltstack,通过查看grains来获取各服务器静态信息
"""
from django.views.decorators.csrf import csrf_protect,csrf_exempt
from django.http import HttpResponse
from django.shortcuts import render
from code.util import grains
from code.util.saltapi import SaltApi
import json , os
from AutOperation.settings import salt_api , salt_user , salt_passwd

@csrf_exempt
def getServerList(request):
    '''
    获取所有从机静态信息
    :param request:
    :return:
    '''
    from AutOperation.settings import salt_api
    resultList = []
    target = ['name', 'ipv4', 'use' ,'spath', 'where', 'mem_total' ,'num_gpus', 'num_cpus','locale_info','os','osrelease']
    tgt= ('id', 'ipv4', 'cpu_model' ,'kernelrelease', 'where', 'mem_total' ,'num_gpus', 'num_cpus','locale_info','os','osrelease' , 'used')

    # try:
    #     resultList = grains.getGrains(target)
    # except:
    #     resultList = []

    salt_aa=SaltApi(salt_api,'saltapi','omygad911')
    rt = salt_aa.host_remote_execution_module('*','grains.item',tgt)
    print rt
    for key in rt.keys():
        resultList.append(rt[key])

    print resultList

    #将所有查询结果所有记录在session中,以便翻页时不用在查询
    request.session['all_server_info'] = resultList

    return render(request, 'server/serverShow.html' ,{'serverList':resultList})

@csrf_exempt
def getcatalogList(request):
    '''
    获取目录信息
    :param request:
    :return:-100目录获取失败 -101表单提交异常 -102操作类型异常 0表示session存储
    '''
    try:
        name = request.POST['name'].strip()
        order = request.POST['order'].strip()
        path = request.POST['path'].strip()
    except:
        return HttpResponse(json.dumps('-101'), content_type="application/json")
    cmd = ''
    try:
        if order == 'next':
            cmd = 'ls -l ' + path
        elif order == 'HOME':
            cmd = 'ls -l '+ path
        elif order == 'up':
            cmd = 'ls -l ' + path
        elif order == 'save':
            request.session['server_cmd_path'] = path
            return HttpResponse(json.dumps('0'), content_type="application/json")
        elif order == 'delete':
            cmd = 'rm -r ' + path
        elif order == 'del':
            cmd = 'rm ' + path
        else:
            return HttpResponse(json.dumps('-102'), content_type="application/json")
        salt_aa=SaltApi(salt_api, salt_user , salt_passwd)
        information = salt_aa.host_remote_execution_module(name,'cmd.run',cmd)
        if order.startswith('del'):
            uppath = ''
            r = path.split("/")
            for i in range(len(r) -1):
                uppath = uppath + '/' + r[i]
            if uppath == '':
                uppath = '/'
            information = salt_aa.host_remote_execution_module(name,'cmd.run','ls -l ' + uppath)
        # information = grains.getOders(name , cmd)
        listrs = information[name].split('\n')
        list_info = []
        result_info = []
        for x in range(1,len(listrs)):
            list_info.append(listrs[x].split()[0])
            list_info.append(listrs[x].split()[4])
            list_info.append(listrs[x].split()[-1])
            result_info.append(list_info)
            list_info = []
    except Exception , e:
        print Exception , e
        return HttpResponse(json.dumps('-100'), content_type="application/json")
    return HttpResponse(json.dumps(result_info), content_type="application/json")

@csrf_exempt
def runCmd(request):
    '''
    批量执行指令
    :param request:
    :return:
    '''
    from AutOperation.settings import state

    try:
        name = request.POST['name'].strip()
        cmd = request.POST['cmd'].strip()
    except:
        return HttpResponse(json.dumps('-101'), content_type="application/json")
    nameList=name.split(',')
    nameList.append(name.replace(',','').strip())
    result_info=''
    salt_aa=SaltApi(salt_api, salt_user , salt_passwd)
    rt = salt_aa.group_remote_execution_module(nameList,'cmd.run',cmd)
    for key in rt.keys():
        result_info = result_info + key + ':\n'
        result_info = result_info + '    ' + rt[key].replace('\n',' '+'\n    ') + '\n'
        result_info = result_info + str('\n')
    return HttpResponse(json.dumps(result_info), content_type="application/json")



@csrf_exempt
def uploadServer(request):
    from AutOperation.settings import salt_root_path
    if request.method == 'POST':
        # 保存上传的文件
        myFile = request.FILES['file[]']
        destination = open(os.path.join(salt_root_path, myFile.name), 'wb+') # 打开特定的文件进行二进制的写操作
        for chunk in myFile.chunks(): # 分块写入文件
            destination.write(chunk)
        destination.close()

    from AutOperation.settings import state
    if state == '1':
        return HttpResponse('当前为测试环境')

    type = request.POST['submitIputType'].strip()
    flag = '-1'
    if type == '1':
        name = request.POST['submitIputName'].strip()
        path = request.POST['submitIput'].strip()
        rs = grains.uploadStack(path , name , myFile.name)
        if rs == '0':
            flag = '0'
    else:
        information = request.POST['submitIput'].strip()
        if information != '':
            information = "{" + information + "}"
        info = eval(information)
        grains.uploadStackMany(info , myFile.name)
        print information
        flag = '2'
    return HttpResponse(flag)

