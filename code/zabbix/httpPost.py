#coding=utf-8
#create by wml
#date 2017.09.14
import json , urllib2
class HttpPost():
    def post(self ,url , data , header={"Content-Type":"application/json"}):
        '''
        处理http发送请求
        :param upper:
        :param data:
        :return:
        '''
        request = urllib2.Request(url,data)
        for key in header:
            request.add_header(key,header[key])
        try:
            result = urllib2.urlopen(request)
        except Exception:
            print "http failed :",Exception.code
            return ''
        else:
            response = json.loads(result.read())
            result.close()
            return response['result']