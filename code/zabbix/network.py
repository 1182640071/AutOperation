#coding=utf-8
from django.views.decorators.csrf import csrf_protect,csrf_exempt
import json
import urllib2,time
from django.http import HttpResponse
from code.zabbix import getIZabbix
from AutOperation.settings import url , zabbix_token


@csrf_exempt
def getFlow(request):
    '''
    获取监控数据流
    :return:
    '''
    # based url and required header
    server = ''
    try:
        servername = request.POST['name'].strip()
        monitortype = request.POST['type'].strip()
    except Exception :
        servername = ''
        monitortype = ''
        server = request.session['defult_host']['name']

    rslist = []
    if monitortype == '1':
        rslist = getNetflow(request ,servername , server)
    elif monitortype == '2':
        rslist = getDiskFree(request , servername)
    else:
        rslist = getNetflow(request,servername , server)
    return HttpResponse(json.dumps(rslist), content_type="application/json")


def getDiskFree(request , sernameflow):
    itemKey = {}
    rs = getIZabbix.getItemId(request , sernameflow)
    for x in rs:
        if x['key_'] == 'vfs.fs.size[/,free]':
            itemKey['diskfree'] = x['itemid']
    length = 30
    listDisk = []
    listTime = []
    listAll = []
    maxNum = 0
    flow = ['free disk']
    header = {"Content-Type":"application/json"}
    # request json
    data = json.dumps(
    {
       "jsonrpc":"2.0",
       "method":"history.get",
        # history参数可能的取值
        # 0 - float;
        # 1 - string;
        # 2 - log;
        # 3 - integer;
        # 4 - text.
       "params":{
           "output":"extend",
           "history":3,
           "sortfield":"clock",
           "itemids":itemKey['diskfree'],
           "sortorder":"DESC",
           "limit":length
       },
       "auth":zabbix_token, # theauth id is what auth script returns, remeber it is string
       "id":1,
    })
    # create request object
    request = urllib2.Request(url,data)
    for key in header:
       request.add_header(key,header[key])
    # get host list
    try:
       result = urllib2.urlopen(request)
    except Exception as e:
       if hasattr(e, 'reason'):
           print 'We failed to reach a server.'
           print 'Reason: ', e.reason
       elif hasattr(e, 'code'):
           print 'The server could not fulfill the request.'
           print 'Error code: ', e.code
    else:
       response = json.loads(result.read())
       result.close()
       for host in response['result']:
           mx = int(host["value"])/1000/1000/1024
           if maxNum < mx:
                maxNum = mx
           # print time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(float(host["clock"]))) + ' , ' + str(int(host["value"])/1000/1000/1024)
           listTime.append(time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(float(host["clock"]))))
           listDisk.append(str(int(host["value"])/1000/1000/1024))
       while len(listTime) < length:
           listTime.append('')
       while len(listDisk) < length:
           listDisk.append('0')

    lable = 'zabbix: The Disk Space Free '
    x_lable = 'Y:G X:time'
    if len(listTime) >=30:
        for i in range(1,len(listTime)-1):
            listTime[i] = ''
    listallDisk = []
    listTime.reverse()
    listDisk.reverse()

    listAll.append(listTime)
    listallDisk.append(listDisk)
    listAll.append(listallDisk)
    listAll.append(flow)
    z = round(maxNum , 2) + round(maxNum , 2)/6
    listAll.append(round(z , 1))
    listAll.append(lable)
    listAll.append(x_lable)
    return listAll





def getNetflow(request ,sernameflow , serverNet):
    '''
    获取网卡流量
    :param sernameflow:
    :param serverNet:
    :return:
    '''
    itemKey = {'in':'24114' , 'out':'24115'}
    rs = getIZabbix.getItemId(request , sernameflow)
    for x in rs:
        if x['key_'].startswith('net.if.in'):
            itemKey['in'] = x['itemid']
        elif x['key_'].startswith('net.if.out'):
            itemKey['out'] = x['itemid']
    length = 50
    listIn = []
    listOut = []
    listTime = []
    maxNum = 0
    listAll = []
    listFlow = []
    flow = ['net.if.in' , 'net.if.out']
    header = {"Content-Type":"application/json"}
    # request json
    data = json.dumps(
    {
       "jsonrpc":"2.0",
       "method":"history.get",
        # history参数可能的取值
        # 0 - float;
        # 1 - string;
        # 2 - log;
        # 3 - integer;
        # 4 - text.
       "params":{
           "output":"extend",
           "history":3,
           "sortfield":"clock",
           "itemids":itemKey['in'],
           "sortorder":"DESC",
           "limit":length
       },
       "auth":zabbix_token, # theauth id is what auth script returns, remeber it is string
       "id":1,
    })
    # create request object
    request = urllib2.Request(url,data)
    for key in header:
       request.add_header(key,header[key])
    # get host list
    try:
       result = urllib2.urlopen(request)
    except Exception as e:
       if hasattr(e, 'reason'):
           print 'We failed to reach a server.'
           print 'Reason: ', e.reason
       elif hasattr(e, 'code'):
           print 'The server could not fulfill the request.'
           print 'Error code: ', e.code
    else:
       response = json.loads(result.read())
       result.close()
       # print "in- Number Of Hosts: ", len(response['result'])
       for host in response['result']:
           mx = int(host["value"])/1024
           if maxNum < mx:
                maxNum = mx
           # print host["clock"] + ' , ' + time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(float(host["clock"]))) + ' , ' + str(int(host["value"])/1024)
           # print time.strftime("%Y-%m-%d",time.localtime())
           #print "Host ID:",host['hostid'],"HostName:",host['name']
           listIn.append(str(int(host["value"])/1024))
           listTime.append(time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(float(host["clock"]))))
       while len(listIn) < length:
           listOut.append('0')
       while len(listTime) < length:
           listOut.append('')

    data = json.dumps(
    {
       "jsonrpc":"2.0",
       "method":"history.get",
        # history参数可能的取值
        # 0 - float;
        # 1 - string;
        # 2 - log;
        # 3 - integer;
        # 4 - text.
       "params":{
           "output":"extend",
           "history":3,
           "sortfield":"clock",
           "itemids":itemKey['out'],
           "sortorder":"DESC",
           "limit":length
       },
       "auth":zabbix_token, # theauth id is what auth script returns, remeber it is string
       "id":1,
    })
    # create request object
    request = urllib2.Request(url,data)
    for key in header:
       request.add_header(key,header[key])
    # get host list
    try:
       result = urllib2.urlopen(request)
    except Exception as e:
       if hasattr(e, 'reason'):
           print 'We failed to reach a server.'
           print 'Reason: ', e.reason
       elif hasattr(e, 'code'):
           print 'The server could not fulfill the request.'
           print 'Error code: ', e.code
    else:
       response = json.loads(result.read())
       result.close()
       # print "out- Number Of Hosts: ", len(response['result'])
       for host in response['result']:
           mx = int(host["value"])/1024
           if maxNum < mx:
                maxNum = mx
           # print time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(float(host["clock"]))) + ' , ' + str(int(host["value"])/1024)
           # print time.strftime("%Y-%m-%d",time.localtime())
           #print "Host ID:",host['hostid'],"HostName:",host['name']
           listOut.append(str(int(host["value"])/1024))
       while len(listOut) < length:
           listOut.append('0')

    lable = 'zabbix: The Network Card Traffic ' + serverNet
    x_lable = 'Y:kb/s   X:time'

    listTime.reverse()
    listIn.reverse()
    listOut.reverse()

    if len(listTime) >=30:
        for i in range(1,len(listTime)-1):
            listTime[i] = ''
    listAll.append(listTime)
    listFlow.append(listIn)
    listFlow.append(listOut)
    listAll.append(listFlow)
    listAll.append(flow)
    z = round(maxNum , 2) + round(maxNum , 2)/6
    listAll.append(round(z , 1))
    listAll.append(lable)
    listAll.append(x_lable)
    return listAll
