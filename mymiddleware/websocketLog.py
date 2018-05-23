#-*- coding:utf8 -*-

import threading
import hashlib
import socket , subprocess
import base64 , time , os


global clients
clients = {}
filename = 'log.txt'
logList = []

# #通知指定客户端
# def notifyUser(information):
#     clients[]

#通知客户端
def notify(message):
    global filename
    global flag
    if os.path.exists(message) and filename != message:
        filename = message
        for connection in clients.values():
            connection.send('%c%c%s' % (0x81, len('change path of log'), 'change path of log'))
        #创建日志收集线程
        threadCollectn= collect_log()
        #启动日志收集线程
        threadCollectn.start()
    else:
        for connection in clients.values():
            connection.send('%c%c%s' % (0x81, len('log not exists'), 'log not exists'))


#客户端处理线程
class websocket_thread(threading.Thread):
    def __init__(self, connection, username):
        super(websocket_thread, self).__init__()
        self.connection = connection
        self.username = username

    def run(self):
        global logList
        print '[INFO] new websocket client joined!'
        data = self.connection.recv(100*1024)
        headers = self.parse_headers(data)
        token = self.generate_token(headers['Sec-WebSocket-Key'])
        self.connection.send('\
HTTP/1.1 101 WebSocket Protocol Hybi-10\r\n\
Upgrade: WebSocket\r\n\
Connection: Upgrade\r\n\
Sec-WebSocket-Accept: %s\r\n\r\n' % token)
        self.connection.send('%c%c%s' %  (0x81, len(self.username), self.username))
        # while True:
        #     try:
        #         data = self.connection.recv(1024)
        #     except socket.error, e:
        #         print "unexpected error: ", e
        #         clients.pop(self.username)
        #         break
        #     data = self.parse_data(data)
        #     if len(data) == 0:
        #         continue
        #     message = data
        #     notify(message)

    def parse_headers(self, msg):
        headers = {}
        header, data = msg.split('\r\n\r\n', 1)
        for line in header.split('\r\n')[1:]:
            key, value = line.split(': ', 1)
            headers[key] = value
        headers['data'] = data
        return headers

    def generate_token(self, msg):
        key = msg + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'
        ser_key = hashlib.sha1(key).digest()
        return base64.b64encode(ser_key)

    def parse_data(self, msg):
        v = ord(msg[1]) & 0x7f
        if v == 0x7e:
            p = 4
        elif v == 0x7f:
            p = 10
        else:
            p = 2
        mask = msg[p:p+4]
        data = msg[p+4:]
        return ''.join([chr(ord(v) ^ ord(mask[k%4])) for k, v in enumerate(data)])

#服务端
class websocket_server(threading.Thread):

    def __init__(self, port):
        super(websocket_server, self).__init__()
        self.port = port

    def run(self):
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        sock.bind(('0.0.0.0', self.port))
        sock.listen(5)
        print '[INFO] websocket server started!'
        while True:
            connection, address = sock.accept()
            try:
                if len(clients.keys()) > 0:
                    connection.close()
                    print u'额外连接关闭'
                else:
                    username = "ID" + str(address[1])
                    clients[username] = connection
                    thread = websocket_thread(connection, username)
                    thread.start()
                    # clients[username] = connection
            except socket.timeout:
                print '[ERROR] websocket connection timeout!'


#日志收集线程
class collect_log(threading.Thread):

    def run(self):
        '''
        日志收集线程的功能实现
        将日志的每条新增信息实时收集,用于websocket传送到前端
        :return:
        '''
        global logList
        global filename
        global flag
        print u'日志收集线程启动'
        popen=subprocess.Popen(['bash','-c',"tail -f " + filename],stdout=subprocess.PIPE,stderr=subprocess.PIPE)
        pid=popen.pid
        file = filename
        while file == filename :
            line=popen.stdout.readline().strip()
            #line =popen.communicate()
            if clients == {} or len(clients.values()) < 1 or file != filename:
                print line
            else:
                logList.append(line)
            if subprocess.Popen.poll(popen) is not None:
                break
            time.sleep(0.1)
        print u'收集日志线程停止'

#日志推送线程
class send_log(threading.Thread):

    def run(self):
        '''
        日志收集线程的功能实现
        将日志的每条新增信息实时收集,用于websocket传送到前端
        :return:
        '''
        global logList
        global clients
        while True:
            if clients != {} and len(clients.values()) >0:
                while len(logList) > 0:
                    content = logList.pop(0)
                    for keys in clients.keys():
                        connection = clients[keys]
                        try:
                            cont = unicode(content,'utf-8')
                            if len(cont) > 40:
                                length = 0
                                start = 0
                                end = 39
                                while(length < len(cont)):
                                    contt = cont[start:end]
                                    if start != 0:
                                        contt = '{[}]' + contt
                                    connection.send('%c%c%s' % (0x81,len(contt.encode('utf-8')),contt.encode('utf-8')))
                                    if start !=0:
                                        length = length + len(contt)
                                    else:
                                        length = length + len(contt) - 4
                                    start = end
                                    end += 40
                            else:
                                connection.send('%c%c%s' % (0x81,len(cont.encode('utf-8')),cont.encode('utf-8')))
                        except Exception , e:
                            print Exception , e
                            clients.pop(keys)
                            connection.close()
                            continue
            time.sleep(0.1)

class check_status(threading.Thread):
    def run(self):
        global clients
        while True:
            if len(clients.keys()) > 0:
                for keys in clients.keys():
                    conn =  clients[keys]
                    try:
                        conn.send('%c%c%s' % (0x81, len('{[test}]test info'), '{[test}]test info'))
                    except Exception , e:
                        print Exception , e
                        conn.close()
                        clients.pop(keys)
            time.sleep(2)

# if __name__ == '__main__':
# #创建日志收集线程
# threadCollect = collect_log()
# #启动日志收集线程
# threadCollect.start()
#创建websocket服务
server = websocket_server(9001)
#启动websocket服务
server.start()
#创建日志推送线程
threadSend = send_log()
#启动日志推送线程
threadSend.start()
#创建状态检查线程
threadStatus = check_status()
#启动状态检查线程
threadStatus.start()


