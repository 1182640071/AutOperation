#coding=utf-8
from django.views.decorators.csrf import csrf_protect,csrf_exempt
from django.http import HttpResponse
from django.shortcuts import render
import MySQLdb , json


@csrf_exempt
def retrunDayData(request):
    '''
    将日常信息数据返回前端
    :param request:
    :return:
    '''
    import datetime
    date_list = []
    #此处的日期应由前端传过来 而不是定值,目前只是demo,所以将日期手动写入
    begin_date = datetime.datetime.strptime('2017-03-06', "%Y-%m-%d")
    end_date = datetime.datetime.strptime('2017-03-10', "%Y-%m-%d")
    while begin_date <= end_date:
        date_str = begin_date.strftime("%Y-%m-%d")
        date_list.append(date_str)
        begin_date += datetime.timedelta(days=1)
    type = [u'故障',u'其他',u'事件']
    _result = []
    list_result = []
    all = []
    maxNum = 0
    for tp in type:
        dt = getDayData(tp)
        for i in date_list:
            if dt.has_key(i):
                _result.append(dt[i])
                if maxNum < dt[i]:
                    maxNum = dt[i]
            else:
                _result.append(0)
        list_result.append(_result)
        _result = []
    all.append(date_list)
    all.append(list_result)
    all.append(type)
    z = round(maxNum , 2) + round(maxNum , 2)/6
    all.append(round(z , 1))
    return HttpResponse(json.dumps(all), content_type="application/json")




@csrf_exempt
def getDayData(tp):
    '''
    获取日常信息数据
    :param request:跳转请求
    :return:list
    '''
    from AutOperation.settings import mysqlip,mysqluser,mysqlpassword,mysqldatabase,mysqlport,mysqlcode
    #获得 mysql 查询的链接对象
    con = MySQLdb.connect(mysqlip,port = mysqlport,user=mysqluser,passwd=mysqlpassword,db =mysqldatabase,charset=mysqlcode)
    with con:
    #获取连接上的字典 cursor，注意获取的方法，
    #每一个 cursor 其实都是 cursor 的子类
        cur = con.cursor(MySQLdb.cursors.DictCursor)
        sql = "SELECT date_format(create_time , '%Y-%m-%d') , count(*)  FROM event_info where style = '" + tp + "' group by date_format(create_time , '%Y-%m-%d')"
        #执行语句不变
        cur.execute(sql)
        #获取数据方法不变
        rows = cur.fetchall()
        dt = {}
        #遍历数据也不变（比上一个更直接一点）
        for dit in rows:
            dt[dit["date_format(create_time , '%Y-%m-%d')"]] = dit["count(*)"]
            #print str(row["create_time"]) + ' , ' + str(row["count(*)"])
            #这里，可以使用键值对的方法，由键名字来获取数据
            #print "%s %s" % (row["id"], row["description"])
    return dt

retrunDayData(11)