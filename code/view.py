#coding=utf-8
from django.http import HttpResponse
from django.shortcuts import render ,render_to_response,HttpResponseRedirect
from django.views.decorators.csrf import csrf_protect,csrf_exempt
from django.db import connection
import json
from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.contrib.auth import login,authenticate,logout
from django.contrib.auth.models import User
def loginUser(request):
    return render(request, "system/Login.html")


def mainFrom(request):
    return render(request, "system/main.html")

@csrf_exempt
def userLoad(request):
    from ManagerPrograme.settings import webuser,portManage,portShow,serverShow,showlist
    username = request.POST['username']
    passwd = request.POST['password']
    result = '1'
    if username in webuser and passwd == webuser[username].strip():
        request.session['userName'] = username
        request.session['passWd'] = passwd
        request.session['userList'] = showlist[username]
        print username + '登录成功'
        result = '0'
    else:
        result = '1'
    return HttpResponse(result)