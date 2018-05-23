#coding=utf-8
from django.views.decorators.csrf import csrf_protect,csrf_exempt
import json
import urllib2,time , datetime
from django.http import HttpResponse
from code.zabbix import getIZabbix
from code.zabbix.httpPost import HttpPost
from code.zabbix.getValues import getPNG
from AutOperation.settings import url , zabbix_graph , zabbix_url , zabbixuser , zabbixpasswd

@csrf_exempt
def monitorServer(request):
    '''
    接收服务器监控信息,生成监控图片
    :param request: hostname
    :return: signel
    '''
    try:
        servername = request.POST['hostname']
        monitor1 = request.POST['monitor1']
        monitor2 = request.POST['monitor2']
    except Exception :
        return '-101'
    token = getToken()
    grouplist = getGroupId(token)
    groupid = ''
    for dt in grouplist:
        if dt['name'] == 'Linux servers':
            groupid = dt['groupid']
            break
    print groupid

    hostlist = getHostId(token ,groupid )
    hostid = ''
    for dt in hostlist:
        if dt['name'] == servername:
            hostid = dt['id']
            break
    if hostid == '':
        return HttpResponse(json.dumps('-101'), content_type="application/json")

    itemlist = getItemList(token , hostid)
    item = []
    item.append(itemlist[monitor1])
    item.append(itemlist[monitor2])
    starttime=datetime.datetime.now().strftime('%Y%m%d%H%M%S')
    png = getPNG(zabbix_url , zabbix_graph , zabbixuser , zabbixpasswd , 7200 , starttime , 'static/zabbix-png' , 800 , 200)
    rs = []
    for i in item:
        rs.append(png.getPng(i))
    return HttpResponse(json.dumps(rs), content_type="application/json")


def getItemList(token , hostid):
    '''
    获取监控项信息
    :param token:token值
    :return:group数据字典{'itemname':'itemid'}
    '''
    # if header == '' or type(header) != dict:
    #     header = {"Content-Type":"application/json"}

    data = json.dumps(
    {
        "jsonrpc": "2.0",
        "method": "graph.get",
        "params": {
            "output": "extend",
            "hostids": hostid,
            "sortfield": "name"
        },
        "auth": token,
        "id": 1
    })
    list = HttpPost().post(url , data , {"Content-Type":"application/json"})
    dic = {}
    if len(list) <= 0:
        print "[ERROR]group is empty!"
        return dic
    else:
        for dc in list:
            dic[dc['name']]=dc['graphid']
        return dic



def getToken():
    '''
    zabbix登录方法,类对象加载token值,对zabbix的所有操作,查询都需要带有此token值
    :param user:zabbix用户名
    :param password:zabbix密码
    :return:None
    '''
    data = json.dumps(
    {
       "jsonrpc": "2.0",
       "method": "user.login",
       "params": {
       "user": zabbixuser,
       "password": zabbixpasswd
    },
    "id": 0
    })
    token = HttpPost().post(url , data , {"Content-Type":"application/json"})
    return token


def getGroupId(zabbix_token):
    '''
    获取用户组
    :param request:
    :return:
    '''
    # based url and required header
    response = {}
    header = {"Content-Type":"application/json"}
    # request json
    data = json.dumps(
    {
       "jsonrpc":"2.0",
       "method":"hostgroup.get",
       "params":{
           "output":["groupid","name"],
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
       # print response['result']
       # #print response
       # for group in response['result']:
       #     print "Group ID:",group['groupid'],"\tGroupName:",group['name']
    return response['result']

def getHostId(zabbix_token ,groupid):
    '''
    获取用户组用户
    :return:
    '''
    header = {"Content-Type":"application/json"}
    # request json
    data = json.dumps(
    {
       "jsonrpc":"2.0",
       "method":"host.get",
       "params":{
           "output":["hostid","name"],
           "groupids":groupid,
       },
       "auth":zabbix_token, # theauth id is what auth script returns, remeber it is string
       "id":1,
    })
    listdit = []
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
       # print "Number Of Hosts: ", len(response['result'])
       for host in response['result']:
            dit = {}
            # print "Host ID:",host['hostid'],"HostName:",host['name']
            dit['name'] = host['name']
            dit['id'] = host['hostid']
            listdit.append(dit)
    return listdit