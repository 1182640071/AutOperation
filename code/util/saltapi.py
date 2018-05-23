# -*- coding: utf-8 -*-
#python2.7

import pycurl
from io import BytesIO
import json

class PyCurl(object):
    def __init__(self, url, **kwargs):
        # 传入url地址
        self.url = url
        # 取出header相关信息
        self.header = kwargs.get("header", None)
        # 创建一个curl对象
        self.curl = pycurl.Curl()
        # setopt 来设置一些请求选项
        # 指定请求的URL
        self.curl.setopt(self.curl.URL, self.url)
        # 设置代理浏览器
        self.curl.setopt(self.curl.HEADER, False)
        # 设置请求方式
        self.curl.setopt(self.curl.POST, True)
        # 设置https方式
        self.curl.setopt(pycurl.SSL_VERIFYPEER, 0)
        self.curl.setopt(pycurl.SSL_VERIFYHOST, 0)
        # 判断header是否存在
        if self.header:
            # 设置模拟浏览器
            self.curl.setopt(self.curl.HTTPHEADER, self.header)

    def request(self, data=None, timeout=None):
        # 判断对象类型 是否为 str
        if isinstance(data, str):
            #将数据提交
            self.curl.setopt(pycurl.POSTFIELDS, data)
        header_buf = BytesIO()
        body_buf = BytesIO()
        # 强制获取新的连接，即替代缓存中的连接
        self.curl.setopt(self.curl.FRESH_CONNECT, True)
        # 完成交互后强制断开连接，不重用
        self.curl.setopt(self.curl.FORBID_REUSE, True)
        if str(timeout).isdigit() and timeout > 0:
            # 设置timeout超时时间
            self.curl.setopt(self.curl.TIMEOUT, timeout)
        # 将返回的HTTP HEADER定向到回调函数header_buf
        self.curl.setopt(self.curl.HEADERFUNCTION, header_buf.write)
        # 将返回的内容定向到回调函数body_buf
        self.curl.setopt(self.curl.WRITEFUNCTION, body_buf.write)
        try:
            # 服务器返回信息
            self.curl.perform()
        except pycurl.error:
            return False
        # 状态码
        http_code = self.curl.getinfo(self.curl.HTTP_CODE)
        # 关闭连接
        self.curl.close()
        # 返回状态码 header body
        return {"http_code": http_code, "header": header_buf.getvalue(), "body": body_buf.getvalue(), "url": self.url}


class SaltApi(object):

    def __init__(self, url,username,password,**kwargs):
        # 设置超时时间
        self.timeout = kwargs.get("timeout", 300)
        # 设置头信息
        self.header = kwargs.get("header", ["Content-Type:application/json"])
        # 获取url
        self.__url = url

        # 获取
        self.__username = username
        self.__password = password

    # token id 获取
    def token_id(self):
        obj = {'eauth': 'pam', 'username': self.__username, 'password': self.__password}
        result = self.post(prefix="/login",**obj)
        if result:
            try:
                self.__token_id = result['return'][0]['token']
            except KeyError:
                raise KeyError
        print self.__token_id
        return self.__token_id

    def post(self, prefix="/",token=None,**data):

        # url拼接
        url = self.__url + prefix
        # 实例化
        self.header.append(str(token))
        curl = PyCurl(url, header=self.header)
        # 发起请求
        result = curl.request(data=json.dumps(data), timeout=self.timeout)
        # 判断值
        if not result:
            return result
        # 判断状态码是否等于200
        if result["http_code"] != 200:
            self.response = "response code %s".format(result["info"]["http_code"])
            return self.response
        result = json.loads(result["body"].decode())
        # 判断是否有error
        if "error" in result and result["error"]:
            self.response = "%s(%s)" % (result["error"]["data"], result["error"]["code"])
            return self.response
        #返回正确的数据
        return result

    def all_key(self):
        '''
        获取所有的minion_key
        '''
        token = 'X-Auth-Token:%s'%self.token_id()
        # token = 'X-Auth-Token:db4feaffd511deba9f18743ba88892b903138c4b'
        print token
        # token = "X-Auth-Token:3b70714050498580117855619ff8db23cfd38b8a"
        obj = {'client': 'wheel', 'fun': 'key.list_all'}
        content = self.post(token=token,**obj)
        # 取出认证已经通过的
        minions = content['return'][0]['data']['return']['minions']
        print('已认证',minions)
        # 取出未通过认证的
        minions_pre = content['return'][0]['data']['return']['minions_pre']
        print('未认证',minions_pre)
        return minions,minions_pre

    def accept_key(self,node_name):
        '''
        如果你想认证某个主机 那么调用此方法
        '''
        token = 'X-Auth-Token:%s' % self.token_id()
        obj = {'client': 'wheel', 'fun': 'key.accept','match':node_name}
        content = self.post(token=token,**obj)
        ret = content['return'][0]['data']['success']
        return ret

    # 删除认证方法
    def delete_key(self, node_name):
        obj = {'client': 'wheel', 'fun': 'key.delete', 'match': node_name}
        token = 'X-Auth-Token:%s' % self.token_id()
        content = self.post(token=token, **obj)

        ret = content['return'][0]['data']['success']
        return ret

    # 针对主机远程执行模块
    def host_remote_func(self, tgt, fun):
        ''' tgt是主机 fun是模块
            写上模块名 返回 可以用来调用基本的资产
            例如 curl -k https://ip地址:8080/ \
        >      -H "Accept: application/x-yaml" \
        >      -H "X-Auth-Token:b50e90485615309de0d83132cece2906f6193e43" \
        >      -d client='local' \
        >      -d tgt='*' \
        >      -d fun='test.ping'  要执行的模块
        return:
        - iZ28r91y66hZ: true
          node2.minion: true
        '''
        obj = {'client': 'local', 'tgt': tgt, 'fun': fun}
        token = 'X-Auth-Token:%s' % self.token_id()
        content = self.post(token=token, **obj)
        ret = content['return'][0]
        return ret

    def group_remote_func(self,tgt,fun):
        obj = {'client': 'local', 'tgt': tgt, 'fun': fun,'expr_form': 'nodegroup'}
        token = 'X-Auth-Token:%s' % self.token_id()
        content = self.post(token=token, **obj)
        print content
        ret = content['return'][0]
        return ret

    def host_remote_execution_module(self,tgt,fun,arg):
        '执行fun 传入传入参数arg '
        obj = {'client': 'local', 'tgt': tgt, 'fun': fun,'arg': arg}
        token = 'X-Auth-Token:%s' % self.token_id()
        content = self.post(token=token, **obj)
        ret = content['return'][0]
        return ret
        #print(salt_aa.host_remote_execution_module('*', 'cmd.run', 'ifconfig'))

    # 基于分组来执行
    def group_remote_execution_module(self, tgt, fun, arg):
        '''
        根据分组来执行
        tgt =
        '''
        obj = {'client': 'local', 'tgt': tgt, 'fun': fun, 'arg': arg, 'expr_form': 'list'}
        token = 'X-Auth-Token:%s' % self.token_id()
        content = self.post(token=token, **obj)
        jid = content['return'][0]
        return jid

    def host_sls(self, tgt, arg):
        '''主机进行sls'''
        obj = {'client': 'local', 'tgt': tgt, 'fun': 'state.sls', 'arg': arg}
        token = 'X-Auth-Token:%s' % self.token_id()
        content = self.post(token=token, **obj)
        return content

    def group_sls(self, tgt, arg):
        ''' 分组进行sls '''
        obj = {'client': 'local', 'tgt': tgt, 'fun': 'state.sls', 'arg': arg, 'expr_form': 'nodegroup'}
        token = 'X-Auth-Token:%s' % self.token_id()
        content = self.post(token=token, **obj)
        jid = content['return'][0]['jid']
        return jid

    def host_sls_async(self, tgt, arg):
        '''主机异步sls '''
        obj = {'client': 'local_async', 'tgt': tgt, 'fun': 'state.sls', 'arg': arg}
        token = 'X-Auth-Token:%s' % self.token_id()
        content = self.post(token=token, **obj)
        jid = content['return'][0]['jid']
        return jid

    def group_sls_async(self, tgt, arg):
        '''分组异步sls '''
        obj = {'client': 'local_async', 'tgt': tgt, 'fun': 'state.sls', 'arg': arg, 'expr_form': 'nodegroup'}
        token = 'X-Auth-Token:%s' % self.token_id()
        content = self.post(token=token, **obj)
        jid = content['return'][0]['jid']
        return jid

    def server_group_pillar(self, tgt, arg, **kwargs):
        '''分组进行sls and pillar'''
        obj = {'client': 'local', 'tgt': tgt, 'fun': 'state.sls', 'arg': arg, 'expr_form': 'nodegroup',
               'kwarg': kwargs}
        token = 'X-Auth-Token:%s' % self.token_id()
        content = self.post(token=token, **obj)
        jid = content['return'][0]
        print jid

    def server_hosts_pillar(self, tgt, arg,**kwargs):
        '''针对主机执行sls and pillar '''
        obj = {"client": "local", "tgt": tgt, "fun": "state.sls", "arg": arg,"kwarg":kwargs}
        token = 'X-Auth-Token:%s' % self.token_id()
        content = self.post(token=token, **obj)
        jid = content['return'][0]
        return jid

    def jobs_all_list(self):
        '''打印所有jid缓存'''
        token = 'X-Auth-Token:%s' % self.token_id()
        obj = {"client": "runner", "fun": "jobs.list_jobs"}
        content = self.post(token=token, **obj)
        print content

    def jobs_jid_status(self, jid):
        '''查看jid运行状态'''
        token = 'X-Auth-Token:%s' % self.token_id()
        obj = {"client": "runner", "fun": "jobs.lookup_jid", "jid": jid}
        content = self.post(token=token, **obj)
        print content
        return content


# if __name__ == '__main__':
#     salt_aa=SaltApi('https://192.168.168.147:9000','saltapi','omygad911')
#     # print(salt_aa.host_remote_func('*','cmd.run "ipconfig"'))
#
#     #删除从机
#     # print salt_aa.delete_key('centos6-3')
#
#     #获取所有从机id
#     # print salt_aa.all_key()
#
#
#     # print salt_aa.accept_key('centos6-3')
#
#     #单机执行指令
#     # print salt_aa.host_remote_execution_module('centos6-1','cmd.run','ls')
#
#     #主机列表执行指令
#     # print salt_aa.group_remote_execution_module('centos6-100,nginx-136','cmd.run','ls -l')
#     print salt_aa.group_remote_execution_module('centos6-100,nginx-136','grains.item',('os','mem_total'))
#
#     # print salt_aa.group_remote_execution_module('centos7-147','cmd.run','mv /var/cache/salt/master/minions/WEBnginx-119/files/root/.jenkins/jobs/maven_web/builds/88/archive/springmvcMaven1/target/springmvcMaven1.war  /srv/salt/rootPath/springmvcMaven1.war')