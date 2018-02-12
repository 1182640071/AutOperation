#coding=utf-8

from django.shortcuts import render

def getHost(request):
    '''
    获取主机列表
    :param request:
    :return:
    '''
    from code.zabbix import getIZabbix as gz
    x = gz.getHostId()
    request.session['defult_host']=x[0]
    return render(request, 'monitor/serverMonitor.html' ,{'hostList':x})
