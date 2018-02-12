# -*- coding: utf-8 -*-
#NLS_LANG=AMERICAN_AMERICA.UTF8
import time
import threading
import MySQLdb
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from warning import OracleOper

Mutex = threading.Lock()
number = 0
Sign = 'Djp'

@csrf_exempt
def portSysOnload(request):
    '''
    resive the request of warning
    :param request:
    :return:rcode
    '''
    from AutOperation.settings import userlist
    result = '0'
    uname = request.POST['username'].strip()
    pd = request.POST['passwd'].strip()

    if "" == userlist.get(uname).strip():
        result = '-110' #不存在的用户名
        HttpResponse(result)
    elif pd != userlist.get(uname).strip():
        result = '-111' #密码错误
        HttpResponse(result)
    else:
        now_time = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))
        print uname + '用户于' + now_time + '登录端口管理系统'
    return HttpResponse(result)


@csrf_exempt
def portRequest(request):
    '''
    resive the request of warning
    :param request:
    :return:rcode
    '''
    from AutOperation.settings import userlist
    result = '0'
    # print request.body
    # _s = eval(request.body)
    # print _s['username']
    # return HttpResponse('1000')
    try:
        uname = request.POST['username'].strip()
        pd = request.POST['passwd'].strip()
        mobile = request.POST['mobile'].strip()
        bumen = request.POST['bumen'].encode('utf-8').strip()
        user = request.POST['user'].encode('utf-8').strip()
        information = request.POST['information'].encode('utf-8').strip()
    except:
        result = '-112'
        return HttpResponse(result)

    if "" == userlist.get(uname).strip():
        result = '-110' #不存在的用户名
        return HttpResponse(result)
    elif pd != userlist.get(uname).strip():
        result = '-111' #密码错误
        return HttpResponse(result)
    else:
        now_time = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))
        print uname + '用户于' + now_time + '登录端口管理系统'
        messqge = mysqlOper(user , bumen , mobile , information)
        try:
            id = getSign()
            OracleOper(id , messqge , mobile , '2')
        except:
            print '数据库插入失败'
            result = '-109'
    return HttpResponse(result)

def getSign():
    '''
    create the id of request
    :return: id
    '''
    global number
    global Sign

    now_time = time.strftime("%Y%m%d%H%M%S",time.localtime(time.time()))
    number = number +1
    if number > 100:
        number = 0
    id = Sign + now_time + str(number)
    return id

def mysqlOper(user , bumen , mobile , information):
    from AutOperation.settings import mysqlip , mysqluser , mysqlpassword , mysqldatabase , mysqlport , mysqlcode
    result = '你申请的'
    try:
        # 打开数据库连接
        conn= MySQLdb.connect(host=mysqlip,port = mysqlport,user=mysqluser,passwd=mysqlpassword,db =mysqldatabase,charset=mysqlcode)
        conn.autocommit(1)
        # 使用cursor()方法获取操作游标
        cursor = conn.cursor()
        list =information.split('!|')
        for z in list:
            if Mutex.acquire(1):
                id = getSign()
                Mutex.release()
            s = z.split(',')
            result = result + s[1]+':'+s[2]+','
            # now_time = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))
            sql = "insert into port_manage_information values('" + id + "' , now(),'"+s[0]+"','"+s[1]+"','"+s[2]+"','"+s[3]+"','"+s[4]+"','"+s[5]+"', '-1' , '"+s[6]+"','" + user +"' , '" + bumen + "' , '" + mobile +"' )"
            # 使用execute方法执行SQL语句
            cursor.execute(sql)
        result = result + '正在审核,请耐心等待[信息中心]'
        # 关闭数据库连接
        cursor.close()
        conn.commit()
        conn.close()
    except:
        cursor.close()
        conn.commit()
        conn.close()
        result = '端口申请失败,请重新尝试或联系管理员[信息中心]'
    return result

