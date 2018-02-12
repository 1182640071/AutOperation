#coding=utf-8
import json
import urllib2
from AutOperation.settings import url , zabbix_token



def getGroupId():
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



def getHostId():
    '''
    获取用户组用户
    :return:
    '''
    # based url and required header

    group = getGroupId()
    groupid='2'
    for x in group:
        if x['name']=='Linux servers':
            groupid = x['groupid']

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


def getItemId(request , hostname):
    '''
    获取指定用户监控项
    :return:
    '''
    # based url and required header
    response = {}
    if hostname == '':
        hostname = request.session['defult_host']
    header = {"Content-Type":"application/json"}
    # request json
    data = json.dumps(
    {
       "jsonrpc":"2.0",
       "method":"item.get",
       "params":{
           "output":["itemids","key_"],
           "hostids":hostname,
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
       # print "Number Of Hosts: ", len(response['result'])
       # for host in response['result']:
       #     print host
           #print "Host ID:",host['hostid'],"HostName:",host['name']
    return response['result']

# x = getItemId('10117')
# print x