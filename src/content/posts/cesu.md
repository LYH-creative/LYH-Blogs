---
title: 一个测网速的小程序
published: 2026-07-21
description: '家里拉网线测网速是突发奇想'
image: ''
tags: [python]
category: '玩具'
draft: false 
lang: ''
---
## 灵感
家里装修拉网线是用测速网测网速，突发奇想直接写一个测网速的程序
先用python写
用到了speedtest-cil库
```
import speedtest 
t = speedtest.Speedtest()
t.get_best_server()
download_speed = t.download() / 1_000_000  
upload_speed = t.upload() / 1_000_000  
ping = t.results.ping
print(f"Ping: {ping} ms")
print(f"Download Speed: {download_speed:.2f} Mbps")
print(f"Upload Speed: {upload_speed:.2f} Mbps")
```
这里装库装了很久，vs code的环境跟mac用的环境比赛同一个，于是将vs code的环境删了只留mac的

## 得到运行结果
```
Ping: 1448.905 ms
Download Speed: 294.16 Mbps
Upload Speed: 61.29 Mbps
```
发现不对怎么这么慢，再来一次
```
Ping: 170.267 ms
Download Speed: 154.33 Mbps
Upload Speed: 45.80 Mbps
```
不对怎么差这么多，问问ai看看什么原因
## 查看原因
网页测速会自动匹配同运营商、本地机房高速节点；speedtest-cli 自动选服逻辑经常抽风，匹配到远距离 / 高负载小节点，直接带宽被锁死。
网页用 WebSocket 多并发跑满带宽；Python speedtest-cli 默认并发数少，大带宽下跑不满，Python IO 性能弱，千兆以上瓶颈明显。
你当前用 Wi-Fi，网页测速不受限制，Python 进程被系统节流
无线波动、后台同步、代理 / 防火墙会大幅压低 Python 脚本测速。
## 优化
代码中get_best_server()已经选择了最佳服务器，于是给两个速度更大的带宽
```
import speedtest 
t = speedtest.Speedtest()
t.get_best_server()
download_speed = t.download(threads=32)/ 1_000_000  
upload_speed = t.upload(threads=32)/ 1_000_000  
ping = t.results.ping
print(f"Ping: {ping} ms")
print(f"Download Speed: {download_speed:.2f} Mbps")
print(f"Upload Speed: {upload_speed:.2f} Mbps")
```
比之前大了不少，但是离千兆带宽还是差了不少