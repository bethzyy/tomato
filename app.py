import webview
import os
import sys
from http.server import HTTPServer, SimpleHTTPRequestHandler
import threading
import socket

def find_free_port():
    """查找一个可用的端口"""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('', 0))
        s.listen(1)
        port = s.getsockname()[1]
    return port

def start_server():
    """启动本地HTTP服务器"""
    # 更改到当前脚本目录
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # 查找一个可用端口
    port = find_free_port()
    
    # 启动HTTP服务器
    server = HTTPServer(('localhost', port), SimpleHTTPRequestHandler)
    
    # 在新线程中启动服务器
    server_thread = threading.Thread(target=server.serve_forever)
    server_thread.daemon = True
    server_thread.start()
    
    return server, port

def main():
    # 启动本地服务器
    server, port = start_server()
    
    # 构建应用URL
    url = f'http://localhost:{port}/index.html'
    
    # 创建webview窗口
    webview.create_window('番茄闹钟', url=url, width=330, height=460, resizable=False, min_size=(280, 400))
    webview.start(debug=False)  # 关闭调试模式以便双击运行
    
    # 应用关闭后停止服务器
    server.shutdown()

if __name__ == '__main__':
    main()