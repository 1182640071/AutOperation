#coding=utf-8

from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from django.http import HttpResponse
import MySQLdb
import xlwt #xls写

@csrf_exempt
def getThings(request):
    '''
    获取所有时间\任务\故障记录
    :param request:
    :return:
    '''
    #获取用户自定义每页显示的数量,默认位5行
    pageSize = request.GET.get('pageSize' , 5)
    #获取选择跳转的页数
    pageNow = request.GET.get('pageNow' , 1)
    listx = {}
    try:
        list = mysqlSelect()
    except Exception , e:
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
    _information = {'AllThings':list , 'pageSize' : pageSize , 'pageNow' : pageNow , 'listPage' : listPage , 'pageAll' : pageAll , 'flag' : flag}
    request.session['AllThingsInformation'] = _information
    #截取当前页面显示行集数据
    list = list[(pageNow-1) * pageSize : maxSize ]
    return render(request, 'day_Manage.html' ,{'ThingsInformation': {'listThings':list , 'pageSize' : pageSize , 'pageNow' : pageNow , 'listPage' : listPage , 'pageAll' : pageAll , 'flag' : flag}})


@csrf_exempt
def changePage(request):
    '''
    用户翻页功能
    :param request:
    :return:
    '''
    information = request.session['AllThingsInformation']
    #获取用户自定义每页显示的数量,默认位20行
    pageSize = int(request.GET.get('pageSize' , information['pageSize']))
    #获取选择跳转的页数
    pageNow = int(request.GET.get('pageNow' , 1))
    pageAll = int(information["pageAll"])
    if len(information['AllThings']) > 0:
        pageAll = ((len(information['AllThings']) -1) / pageSize) + 1
    maxSize = pageNow * pageSize
    #计算本也应显示的行集最大值
    if maxSize > len(information['AllThings']):
        maxSize = len(information['AllThings'])
    #截取当前页面显示行集数据
    list = information['AllThings'][(pageNow-1) * pageSize : maxSize ]
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
    _information = {'AllThings':information['AllThings'] , 'pageSize' : pageSize , 'pageNow' : pageNow , 'listPage' : listPage , 'pageAll' : pageAll , 'flag' : flag}
    request.session['AllThingsInformation'] = _information
    return render(request, 'day_Manage.html' ,{'ThingsInformation': {'listThings':list , 'pageSize' : pageSize , 'pageNow' : pageNow , 'listPage' : listPage , 'pageAll' : pageAll , 'flag' : flag}})



def mysqlSelect():
    '''
    mysql数据库查询操作,查询所有信息
    :return:
    '''
    from AutOperation.settings import mysqlip , mysqluser , mysqlpassword , mysqldatabase , mysqlport , mysqlcode
    list = []
        # 打开数据库连接
    conn= MySQLdb.connect(host=mysqlip,port = mysqlport,user=mysqluser,passwd=mysqlpassword,db =mysqldatabase,charset=mysqlcode)

    # 使用cursor()方法获取操作游标
    cursor = conn.cursor()

    sql = "select id,   date_format(create_time, '%Y-%m-%d %H:%i:%s' ), type , description , flag , reason , style from event_info order by flag , create_time desc"
    # 使用execute方法执行SQL语句
    cursor.execute(sql)
    # 使用 fetchall() 方法获取数据。
    data = cursor.fetchall()
    for row in data:
        di = {}
        di["id"] = row[0]
        di["create_time"] = row[1]
        di["type"] = row[2]
        di["description"] = row[3]
        di["flag"] = row[4]
        di["reason"] = row[5]
        di["style"] = row[6]
        list.append(di)
    cursor.close()
    conn.close()
    return list

@csrf_exempt
def xls_mould(request):
    response = HttpResponse(content_type='application/vnd.ms-excel')
    response['Content-Disposition'] = 'attachment; filename=日常明细.xls'
    workbook = xlwt.Workbook(encoding='utf-8') #创建工作簿
    sheet = workbook.add_sheet("sheet1") #创建工作页
    row0 = [u'id',u'create_time',u'type',u'description',u'flag',u'reason',u'style']

    print request.session['AllThingsInformation']['AllThings'][0]['create_time']

    for i in range(0,len(row0)):
        sheet.write(0,i,row0[i])
    list = request.session['AllThingsInformation']['AllThings']
    for x in range(1,len(list)+1):
        for j in range(0,len(row0)):
            inf = row0[j]
            sheet.write(x,j,list[x-1][inf])
    workbook.save(response)
    return response