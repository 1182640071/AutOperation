#coding=utf-8
from django.shortcuts import render
from django.views.decorators.csrf import csrf_protect,csrf_exempt
from django.http import HttpResponse
# import MySQLdb

def loginUser(request):
    '''
    用户登录跳转 , 跳转至登录界面
    :param request:
    :return:
    '''
    return render(request, "system/Login.html")


def mainFrom(request):
    '''
    登录成功跳转
    :param request:
    :return:
    '''
    return render(request, "system/main.html")

def check_code(request):
    '''
    产生登录界面的验证码
    :param request:
    :return:
    '''
    import io
    from code import check_code as CheckCode

    stream = io.BytesIO()
    # img图片对象,code在图像中写的内容
    img, code = CheckCode.create_validate_code()
    img.save(stream, "png")
    # 图片页面中显示,立即把session中的CheckCode更改为目前的随机字符串值
    request.session["CheckCode"] = code.upper()
    return HttpResponse(stream.getvalue())

    # 代码：生成一张图片，在图片中写文件
    # request.session['CheckCode'] =  图片上的内容

    # 自动生成图片，并且将图片中的文字保存在session中
    # 将图片内容返回给用户

@csrf_exempt
def userLoad(request):
    '''
    用户登录信息验证,如果是管理员,则加载代处理的端口申请信息
    :param request:
    :return:
    '''
    from AutOperation.settings import webuser,portManage,portShow,serverShow,showlist
    try:
        username = request.POST['username']
        passwd = request.POST['password']
        vcode = request.POST['vcode']
        print username , passwd , vcode
        print request.session['CheckCode']
        result = '1'
        if username in webuser and passwd == webuser[username].strip() and vcode.upper() == request.session['CheckCode'] :
            request.session['userName'] = username
            request.session['passWd'] = passwd
            request.session['userList'] = showlist[username]
            print username + '登录成功'
            result = '0'
        else:
            result = '1'
    except:
        result = '1'
    return HttpResponse(result)


# def mysqlSelect(request):
#     '''
#     查询所有待处理的端口申请记录
#     :param request:
#     :return:
#     '''
#     from AutOperation.settings import mysqlip , mysqluser , mysqlpassword , mysqldatabase , mysqlport , mysqlcode
#     dic = {}
#         # 打开数据库连接
#     conn= MySQLdb.connect(host=mysqlip,port = mysqlport,user=mysqluser,passwd=mysqlpassword,db =mysqldatabase,charset=mysqlcode)
#
#     # 使用cursor()方法获取操作游标
#     cursor = conn.cursor()
#
#     sql = "select id,date_format(create_time, '%Y-%m-%d' ), source_addres, target_addres,port , limit_time , addres , real_service , state , remark , applicant , department , mobile from port_manage_information where state = '-1'"
#     # 使用execute方法执行SQL语句
#     cursor.execute(sql)
#     # 使用 fetchall() 方法获取数据。
#     data = cursor.fetchall()
#     for row in data:
#         di = {}
#         di["id"] = row[0]
#         di["create_time"] = row[1]
#         di["source_addres"] = row[2]
#         di["target_addres"] = row[3]
#         di["port"] = row[4]
#         di["limit_time"] = row[5]
#         di["addres"] = row[6]
#         di["real_service"] = row[7]
#         di["state"] = row[8]
#         di["remark"] = row[9]
#         di["applicant"] = row[10]
#         di["department"] = row[11]
#         di["mobile"] = row[12]
#         dic[row[0]] = di
#
#     cursor.close()
#     conn.close()
#     request.session['port'] = dic

@csrf_exempt
def testTest(request):
    '''
    测试跨域使用,非本平台使用方法
    :param request:
    :return:
    '''
    print 'ssssssssssss'
    try:
        vcode = request.POST['vcode']
        print vcode
        if request.session.has_key('test'):
            request.session['test'] = str(request.session['test']) + vcode
        else:
            request.session['test'] = vcode
    except Exception:
        print Exception
    rs = request.session['test']
    print rs
    return HttpResponse(rs)
