#coding=utf-8
"""AutOperation URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import *
from django.contrib import admin
from code.login import login
from code.port import portManage
from code.servser import serverList
from code.dayManage import manageDay
from code.servser import software
from code.dataManage import dayData
from code.zabbix import getHostList,network , zabbixServerMonitor
from code.JenkinsManage import jenkinsFunction



urlpatterns = patterns('',
    (r'^admin/', include(admin.site.urls)),
    #登录跳转
    (r'^login/$',login.loginUser),
    #成功登录跳转
    (r'^form/$',login.mainFrom),
    #用户登录信息验证
    (r'^onload/$',login.userLoad),
    #获取服务器列表
    (r'^serverlist/$',serverList.getServerList),
    #获取服务器目录
    (r'^servercatalog/$',serverList.getcatalogList),
    #批量执行语句
    (r'^serverCmd/$',serverList.runCmd),
    #监控服务器
    (r'^monitorserver/$',zabbixServerMonitor.monitorServer),
    #跳转至软件管理
    (r'^toSoftware/$',software.returnSoftwareHtml),
    #软件请求处理
    (r'^dealSoftware/$',software.dealSoftware),
    #单点部署
    (r'^serverupload/$',serverList.uploadServer),
    #端口信息展示
    (r'^selectPort/$',portManage.getPort),
    #端口信息展示分页功能
    (r'^changePortPage/$',portManage.changePage),
    #开通端口申请
    (r'^allowPort/$',portManage.allowPort),
    #更新展示的未开通端口列表
    (r'^update/$',portManage.refresh),
    #日常信息列表展示
    (r'^daymanage/$',manageDay.getThings),
    #下载日常管理信息
    (r'^downmanage/$',manageDay.xls_mould),
    #日常信息列表展示分页功能
    (r'^changeThingsPage/$',manageDay.changePage),
    #日常信息数据展示
    (r'^dayData/$',dayData.retrunDayData),
    #跳转监控项
    (r'^hostId/$',getHostList.getHost),
    #获取zabbix默认数据
    (r'^firstAnayse/$',network.getFlow),
    #加载jenkins数据
    (r'^jenkinsList/$',jenkinsFunction.loadList),
    #jenkins发布
    (r'^jenkinsChange/$',jenkinsFunction.codeRelease),
    #验证码
    (r'^check_code/$',login.check_code),

    (r'^test/$',login.testTest),
)