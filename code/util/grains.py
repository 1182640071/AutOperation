#coding=utf-8
import salt.client

def getGrains(list):
    '''
    通过saltstack查看grains信息
    :param list:所有grains的信息组合的list
    :return:列表
    '''
    from AutOperation.settings import state
    if state == '1':
        #FIXME 此句用于测试
        result = [{'name': 'wml-242','os': 'CentOS', 'use': '个人测试', 'lip': '192.168.168.242', 'ipv4': ['127.0.0.1', '192.168.168.242'], 'spath': '本地机房'}, {'name': 'wml-243','os': 'CentOS', 'use': '个人测试2', 'lip': '192.168.168.243', 'ipv4': ['127.0.0.1', '192.168.168.243'], 'spath': '本地机房'}]
        result = [{'osrelease': '6.7', 'use': 'mysql\xe6\x9c\x8d\xe5\x8a\xa1\xe5\x99\xa8\xe4\xb8\xbb\xe6\x9c\xba', 'spath': '\xe5\x8c\x97\xe4\xba\xac\xe6\x9c\xba\xe6\x88\xbf', 'name': 'mysql-master-79', 'num_gpus': 1, 'os': 'CentOS', 'num_cpus': 1, 'locale_info': {'detectedencoding': 'UTF-8', 'defaultlanguage': 'zh_CN', 'defaultencoding': 'UTF8'}, 'mem_total': 1877, 'where': 'K-14\xe6\x9c\xba\xe6\x9f\x9c7-9U', 'ipv4': ['127.0.0.1', '192.168.168.79']}, {'osrelease': '6.7', 'use': 'vip222\xe6\x9c\x8d\xe5\x8a\xa1\xe5\x99\xa8', 'spath': '\xe5\xb0\x8f\xe6\x9c\xba\xe6\x88\xbf', 'name': 'centos6-114', 'num_gpus': 1, 'os': 'CentOS', 'num_cpus': 1, 'locale_info': {'detectedencoding': 'UTF-8', 'defaultlanguage': 'zh_CN', 'defaultencoding': 'UTF8'}, 'mem_total': 1877, 'where': 'J-12\xe6\x9c\xba\xe6\x9f\x9c3-5U', 'ipv4': ['127.0.0.1', '192.168.168.114']}, {'osrelease': '6.7', 'use': 'mysql\xe6\x9c\x8d\xe5\x8a\xa1\xe5\x99\xa8\xe4\xbb\x8e\xe6\x9c\xba', 'spath': '\xe5\x8c\x97\xe4\xba\xac\xe6\x9c\xba\xe6\x88\xbf', 'name': 'mysql-slave-186', 'num_gpus': 1, 'os': 'CentOS', 'num_cpus': 1, 'locale_info': {'detectedencoding': 'UTF-8', 'defaultlanguage': 'zh_CN', 'defaultencoding': 'UTF8'}, 'mem_total': 1877, 'where': 'K-13\xe6\x9c\xba\xe6\x9f\x9c17-19U', 'ipv4': ['127.0.0.1', '192.168.168.186']}, {'osrelease': '6.7', 'use': 'mysql\xe6\x9c\x8d\xe5\x8a\xa1\xe5\x99\xa8\xe4\xb8\xbb\xe6\x9c\xba', 'spath': '\xe5\x8c\x97\xe4\xba\xac\xe6\x9c\xba\xe6\x88\xbf', 'name': 'mysql-master-165', 'num_gpus': 1, 'os': 'CentOS', 'num_cpus': 1, 'locale_info': {'detectedencoding': 'UTF-8', 'defaultlanguage': 'zh_CN', 'defaultencoding': 'UTF8'}, 'mem_total': 1877, 'where': 'K-12\xe6\x9c\xba\xe6\x9f\x9c17-19U', 'ipv4': ['127.0.0.1', '192.168.168.165']}, {'osrelease': '6.7', 'use': '\xe8\xbe\x85\xe5\x8a\xa9DNS\xe6\x9c\x8d\xe5\x8a\xa1\xe5\x99\xa8', 'spath': '\xe5\x8c\x97\xe4\xba\xac\xe6\x9c\xba\xe6\x88\xbf', 'name': 'centos6-100', 'num_gpus': 1, 'os': 'CentOS', 'num_cpus': 4, 'locale_info': {'detectedencoding': 'UTF-8', 'defaultlanguage': 'zh_CN', 'defaultencoding': 'UTF8'}, 'mem_total': 1876, 'where': 'K-12\xe6\x9c\xba\xe6\x9f\x9c7-9U', 'ipv4': ['127.0.0.1', '192.168.168.100']}, {'osrelease': '6.7', 'use': 'mysql\xe6\x9c\x8d\xe5\x8a\xa1\xe5\x99\xa8\xe4\xbb\x8e\xe6\x9c\xba', 'spath': '\xe5\x8c\x97\xe4\xba\xac\xe6\x9c\xba\xe6\x88\xbf', 'name': 'mysql-slave-174', 'num_gpus': 1, 'os': 'CentOS', 'num_cpus': 1, 'locale_info': {'detectedencoding': 'UTF-8', 'defaultlanguage': 'zh_CN', 'defaultencoding': 'UTF8'}, 'mem_total': 1877, 'where': 'K-13\xe6\x9c\xba\xe6\x9f\x9c7-9U', 'ipv4': ['127.0.0.1', '192.168.168.174']}, {'osrelease': '6.7', 'use': 'vip222\xe6\x9c\x8d\xe5\x8a\xa1\xe5\x99\xa8', 'spath': '\xe5\xb0\x8f\xe6\x9c\xba\xe6\x88\xbf', 'name': 'centos6-176', 'num_gpus': 1, 'os': 'CentOS', 'num_cpus': 1, 'locale_info': {'detectedencoding': 'UTF-8', 'defaultlanguage': 'zh_CN', 'defaultencoding': 'UTF8'}, 'mem_total': 1877, 'where': 'F-7\xe6\x9c\xba\xe6\x9f\x9c5-8U', 'ipv4': ['127.0.0.1', '192.168.168.176', '192.168.168.222']}]
        return result
    client = salt.client.LocalClient()
    ret = client.cmd('*' , 'grains.item' , list)
    result = []
    for i in ret.keys():
        result.append(ret[i])
    return result

def getOders(name , order):
    '''
    通过saltstack在各分级执行终端指令
    :param name:目标从机
    :param order:指令
    :return:数据字典,key为name
    '''
    from AutOperation.settings import state
    if state == '1':
        #FIXME 此句用于测试
        return {name: 'total 12\ndrwx------. 4 userTest userTest 4096 Dec  8 13:44 userTest\ndrwx------. 4 wml      wml      4096 Dec  8 13:44 wml\ndrwx------. 3 wmlTest  wmlTest  4096 Dec  8 15:43 wmlTest'}
    client = salt.client.LocalClient()
    listOrder = []
    listOrder.append(order)
    ret = client.cmd(name, 'cmd.run' , listOrder)
    return ret

def uploadStack(path , name , filename):
    '''
    通过saltstack向各从机同步文件
    :param path:
    :param name:
    :return:
    '''
    client = salt.client.LocalClient()
    newName = path + '/' +filename
    ret = client.cmd(name , 'cp.get_file' , ['salt://'+filename , newName])
    result = '1'
    if ret[name] == newName:
        result = '0'
    return result

def uploadStackMany(_dict , filename):
    '''
    集群部署
    :param _dict:
    :return:
    '''
    client = salt.client.LocalClient()
    result = {}
    for k in _dict.keys():
        print k + '  ' + _dict[k]
        newName = _dict[k] + '/' +filename
        ret = client.cmd(k.replace(_dict[k] , '') , 'cp.get_file' , ['salt://'+filename , newName])
        # result = '1'
        # if ret[k] == newName:
        #     result[k] = 'true'
    return result