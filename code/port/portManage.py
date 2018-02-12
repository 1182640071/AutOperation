#coding=utf-8
from django.views.decorators.csrf import csrf_protect,csrf_exempt
from django.http import HttpResponse
from django.shortcuts import render
import MySQLdb
import json

@csrf_exempt
def getPort(request):
    '''
    获取所有端口记录
    :param request:
    :return:
    '''
    #获取用户自定义每页显示的数量,默认位20行
    pageSize = request.GET.get('pageSize' , 5)
    #获取选择跳转的页数
    pageNow = request.GET.get('pageNow' , 1)
    listx = {}
    try:
        list = mysqlSelect()
    except:
        list = []
    #计算总页数
    pageAll = 0
    if len(list) > 0:
        pageAll = ((len(list) -1) / pageSize) + 1
    maxSize = pageNow * pageSize
    #计算本也应显示的行集最大值
    if maxSize > len(list):
        maxSize = len(list)
    listPage = []
    flag = 0
    #页面分页栏信息
    for index in range(pageNow , pageNow + 10):
        if index > pageAll:
            break
        listPage.append(index)
    if len(list) > 0 and listPage[-1] < pageAll -1:
        flag = 1
    #将所有查询结果所有记录在session中,以便翻页时不用在查询数据库
    request.session['AllPortList'] = list
    _information = {'AllPortList':list , 'pageSize' : pageSize , 'pageNow' : pageNow , 'listPage' : listPage , 'pageAll' : pageAll , 'flag' : flag}
    request.session['AllPortInformation'] = _information
    #截取当前页面显示行集数据
    list = list[(pageNow-1) * pageSize : maxSize ]
    return render(request, 'port_manage.html' ,{'PortInformation': {'listPort':list , 'pageSize' : pageSize , 'pageNow' : pageNow , 'listPage' : listPage , 'pageAll' : pageAll , 'flag' : flag}})

@csrf_exempt
def changePage(request):
    '''
    用户翻页功能
    :param request:
    :return:
    '''
    information = request.session['AllPortInformation']
    #获取用户自定义每页显示的数量,默认位20行
    pageSize = int(request.GET.get('pageSize' , information['pageSize']))
    #获取选择跳转的页数
    pageNow = int(request.GET.get('pageNow' , 1))
    pageAll = int(information["pageAll"])
    if len(information['AllPortList']) > 0:
        pageAll = ((len(information['AllPortList']) -1) / pageSize) + 1
    maxSize = pageNow * pageSize
    #计算本也应显示的行集最大值
    if maxSize > len(information['AllPortList']):
        maxSize = len(information['AllPortList'])
    #截取当前页面显示行集数据
    list = information['AllPortList'][(pageNow-1) * pageSize : maxSize ]
    listPage = []
    flag = 0
    #页面分页栏信息
    for index in range(pageNow , pageNow + 10):
        if index > pageAll:
            break
        listPage.append(index)
    try:
        if listPage[-1] <= pageAll -1:
            flag = 1
    except Exception , e:
        print e
        flag = 0
    _information = {'AllPortList':information['AllPortList'] , 'pageSize' : pageSize , 'pageNow' : pageNow , 'listPage' : listPage , 'pageAll' : pageAll , 'flag' : flag}
    request.session['AllPortInformation'] = _information
    return render(request, 'port_manage.html' ,{'PortInformation': {'listPort':list , 'pageSize' : pageSize , 'pageNow' : pageNow , 'listPage' : listPage , 'pageAll' : pageAll , 'flag' : flag}})



def mysqlSelect():
    '''
    mysql数据库查询操作,查询所有端口信息
    :return:
    '''
    from AutOperation.settings import mysqlip , mysqluser , mysqlpassword , mysqldatabase , mysqlport , mysqlcode
    list = []
        # 打开数据库连接
    conn= MySQLdb.connect(host=mysqlip,port = mysqlport,user=mysqluser,passwd=mysqlpassword,db =mysqldatabase,charset=mysqlcode)

    # 使用cursor()方法获取操作游标
    cursor = conn.cursor()

    sql = "select id,   date_format(create_time, '%Y-%m-%d' ), source_addres, target_addres,port , limit_time , addres , real_service , state , remark , applicant , department , mobile from port_manage_information order by state , create_time desc"
    # 使用execute方法执行SQL语句
    cursor.execute(sql)
    # 使用 fetchall() 方法获取数据。
    data = cursor.fetchall()
    for row in data:
        di = {}
        di["id"] = row[0]
        di["create_time"] = row[1]
        di["source_addres"] = row[2]
        di["target_addres"] = row[3]
        di["port"] = row[4]
        di["limit_time"] = row[5]
        di["addres"] = row[6]
        di["real_service"] = row[7]
        di["state"] = row[8]
        di["remark"] = row[9]
        di["applicant"] = row[10]
        di["department"] = row[11]
        di["mobile"] = row[12]
        list.append(di)
    cursor.close()
    conn.close()
    return list

@csrf_exempt
def allowPort(request):
    '''
    开通或拒绝开通操作
    :param request:
    :return: 100前端参数获取失败 101端口开通失败(数据库操作失败) 102端口拒绝失败(数据库操作失败) 103操作类型未知 104操作完毕,但通知短信发送失败
    '''
    from interface.warning import OracleOper,getSign,mutex
    from AutOperation.settings import state
    try:
        info = request.POST['info'].strip()
        idd = request.POST['id'].strip()
        mobile = request.POST['mobile'].strip()
        port = request.POST['kport'].strip()
        realIp = request.POST['kip'].strip()
        id = str(idd)
    except:
        return HttpResponse('100')
    result = ''
    if(info.strip() == 'ok'):
        print '从数据库里修改字段'
        # result = '你于'+request.session['port'][id]['create_time']+'申请的'+request.session['port'][id]['target_addres']+":"+request.session['port'][id]['port']+"端口,已开通[信息中心]"
        result = realIp + '申请的' + port + '端口已开通[信息中心]'
        try:
            if state != '1':
                updateIptables(port ,realIp , '' )
        except  Exception , e:
            print '端口开通失败'
            print e
            return HttpResponse('101')
        try:
            # mysqlUpdate(id , info)
            print '端口开通完成'
            print result
        except Exception , e:
            print '端口开通完毕,但数据库状态更新失败!'
            print e
            return HttpResponse('105')
    elif info.strip() == 'no':
        resion = request.POST['resion'].strip()
        result = realIp + '申请的' + port + '端口,拒绝开通,原因为:'+resion+'[信息中心]'
        try:
            print '从数据库里修改字段'
            mysqlUpdate(id , info)
            print result
        except Exception , e:
            print '端口拒绝开通失败'
            print e
            return HttpResponse('102')
    else:
        print '操作失败'
        return HttpResponse('103')
    try:
        if mutex.acquire(1):
            number = getSign()
        mutex.release()
        #FIXME 此处为端口开通\拒绝结果通知,方法自定
        # OracleOper(number , result , mobile , '2')
        print result
    except:
        print result+',发送失败'
        return HttpResponse('104')
    return HttpResponse('0')

def mysqlUpdate(id , flag):
    '''
    数据库更新操作,主要用于端口管理
    :param id:
    :param flag:
    :return:
    '''
    from AutOperation.settings import mysqlip , mysqluser , mysqlpassword , mysqldatabase , mysqlport , mysqlcode
    # 打开数据库连接
    conn= MySQLdb.connect(host=mysqlip,port = mysqlport,user=mysqluser,passwd=mysqlpassword,db =mysqldatabase,charset=mysqlcode)
    conn.autocommit(1)
    # 使用cursor()方法获取操作游标
    cursor = conn.cursor()
    if(flag == 'ok'):
        sql = "update port_manage_information set state = '0' where id = '"+id+"'"
    elif(flag == 'no'):
        sql = "update port_manage_information set state = '2' where id = '"+id+"'"
    else:
        cursor.close()
        conn.commit()
        conn.close()
        return
    # 使用execute方法执行SQL语句
    cursor.execute(sql)
    # 关闭数据库连接
    cursor.close()
    conn.commit()
    conn.close()


def updateIptables(port , ip , targetIP):
    '''
    通过saltstack修改iptables策略
    :return:
    '''
    import salt.client
    client = salt.client.LocalClient()
    ret = client.cmd(ip , 'iptables.append',['filter' , 'INPUT' , 'rule=\'-p tcp --sport '+ port +' -j ACCEPT\''])
    print ret

@csrf_exempt
def refresh(request):
    from code.login import login as lg
    lg.mysqlSelect(request)
    return render(request, "portManage/port_manage.html")