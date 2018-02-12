# -*- coding: utf-8 -*-
#NLS_LANG=AMERICAN_AMERICA.UTF8
from django.views.decorators.csrf import csrf_protect,csrf_exempt
from django.http import HttpResponse
import cx_Oracle
import json
import time
import threading

mutex = threading.Lock()
num = 0
sign = 'Dj'

def warning(request):
    '''
    resive the request of warning
    :param request:
    :return:rcode
    '''
    from AutOperation.settings import username,passwd
    result = '0'
    uname = request.GET.get('username').strip()
    pd = request.GET.get('passwd').strip()

    if uname != username:
        result = '-110' #不存在的用户名
    elif pd != passwd:
        result = '-111' #密码错误
    else:
        mobile = request.GET.get('mobile').strip()
        content = request.GET.get('content').strip()
        warning_type = request.GET.get('type').strip()
        if mutex.acquire(1):
            id = getSign()
        mutex.release()
        try:
            OracleOper(id , content , mobile , warning_type)
        except:
            result = '-109'
    response_data = {'rcode':result}
    return HttpResponse(json.dumps(response_data), content_type="application/json")

def OracleOper(id , content , mobile , warning_type):
    '''
    insert id , content , mobile , warning_type into oracle
    :param id: the only one sign
    :param content: the warning content
    :param mobile: the warning mobile
    :param warning_type: the type of warning
    :return:
    '''
    from AutOperation.settings import ip,user,password
    conn = cx_Oracle.connect(user,password,ip + ':1521/gdqxt')
    cursor = conn.cursor()
    sql = 'INSERT INTO GD_WARNING_WX (ID, content, desmobile , warning_type)VALUES(:1,:2,:3,:4)'
    cursor.execute(sql,[id,content,mobile,warning_type])
    conn.commit()
    cursor.close ()
    conn.close ()

def getSign():
    '''
    create the id of request
    :return: id
    '''
    global num
    global sign

    now_time = time.strftime("%Y%m%d%H%M%S",time.localtime(time.time()))
    num = num +1
    if num > 100:
        num = 0
    id = sign + now_time + str(num)
    return id