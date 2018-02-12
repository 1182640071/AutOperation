# -*- coding:utf-8 -*-
'''
Created on 2016-12-12

@author: wml
'''
#标准模块
from urllib import quote

#第三方模块
from django.http import HttpResponseRedirect
from django.shortcuts import render

import logging
#自定义模块


class QtsAuthenticationMiddleware(object):
    def process_request(self, request):

        logger = logging.getLogger("test1")
        logger.info("justtest : " + request.path)

        log = logging.getLogger("test2")
        log.error('日志内容')

        if (request.path == '/login/') or (request.path == '/portLoad/') or (request.path == '/warning/')or (request.path == '/portRequest/') or (request.path == '/onload/') or (request.path == '/check_code/') or (request.path == '/test/'):
            pass
        else:
            if request.session.get('userName') != '' and request.session.get('userName') != None:
                if request.path.endswith('.html'):
                    stt = request.path.split('/')
                    return render(request, stt[-1])
                else:
                    pass
            else:
                return HttpResponseRedirect('/login/')