yum -y install epel-release
yum install -y python-pip
cd Django-1.9
python setup.py install
yum install python
cx_oracle
####Django pip install django
MySQLdb  yum install -y MySQL-python
pip install pillow(如果失败,可以升级pip python -m pip install --upgrade pip)
pip install xlwt #xls文件
pip install python-jenkins
django-admin.py startproject ManagerPrograme 创建项目
python manage.py migrate 创建数据库



Django1.9+ python manage.py migrate
Django1.9- python manage.py syncdb



ZzJ1NmQ1YzQ=    g2u6d5c4



包括功能:

1 日常管理
    包括任务,事件,故障记录,并有任务分配管理等功能

2 自动化部署
    自动部署上线程序

3 端口等信息(策略,静态或动态信息等)的管理
    管理的同时添加任务的一键处理功能,如防火墙策略一键开启

4 ELK
    包括日志的收集,分析,展示

5 监控
    包括网卡流量监控,redis积压等