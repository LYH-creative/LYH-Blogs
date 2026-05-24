---
title: 网络嗅探器
published: 2026-05-24
description: 一个计网课设
image: ''
tags: [计网, 网安]
category: 网安
draft: false 
lang: ''
---

# 🔍 网络嗅探器 — 逐行代码详解

> 本程序用于抓取经过你电脑网卡的网络数据包，并解析出 IP 地址、端口、协议等关键信息。

---

## 第 1~5 行：导入库

```python
import socket    # socket：网络通信库，用来获取本机 IP、解析 IP 地址
import struct    # struct：把二进制数据按指定格式"拆开"，好比用尺子量二进制
import sys       # sys：系统相关，这里主要用 sys.exit(1) 来退出程序
import os        # os：操作系统相关（本程序未直接使用，习惯性导入）
import time      # time：时间相关（同上，习惯性导入）
```

> 关键词：`import` = "我要用别人写好的工具箱"

---

## 第 7~15 行：定义协议常量

```python
PROTO_TCP  = 6     # ◆ 在 IP 协议里，协议号 6 代表 TCP（如浏览网页）
PROTO_UDP  = 17    # ◆ 协议号 17 代表 UDP（如看视频、DNS 查询）
PROTO_ICMP = 1     # ◆ 协议号 1 代表 ICMP（如 ping 命令）
```
> 解释：这些是"门牌号"，在数据包的 IP 头里有一个字段叫"协议"，它的值如果是 6 就说明里面装的是 TCP 数据。全大写命名是编程习惯，表示"这是常量，不会改"。

```python
PROTO_NAME = {            # ◆ 定义字典（dict）
    PROTO_TCP:  "TCP",    #   键=6  → 值="TCP"
    PROTO_UDP:  "UDP",    #   键=17 → 值="UDP"
    PROTO_ICMP: "ICMP",   #   键=1  → 值="ICMP"
}                         # 字典的作用：根据协议号快速查到协议名
```
> 关键词：`{ }` = 字典，通过 `键` 查 `值`，像查字典一样。

---

## 第 18~43 行：`parse_ip_header()` — 解析 IP 头部

```python
def parse_ip_header(packet):          # ◆ def = 定义一个函数，名叫 parse_ip_header
                                      #   参数 packet = 收到的原始二进制数据
```

### 第 19~20 行：长度检查

```python
    if len(packet) < 20:              # ◆ len() 获取二进制数据的字节数
                                      #   IP 头最少 20 字节，少于 20 说明数据不完整
        return None                   # ◆ return = 返回，None = 空值/啥也没有
                                      #   直接返回 None，告诉调用者"这包没法解析"
```

### 第 22 行：struct.unpack — 按格式拆解二进制

```python
    ip_header = struct.unpack("!BBHHHBBH4s4s", packet[:20])
```
> 这是最核心的一行，拆开讲：

| 部分 | 含义 |
|------|------|
| `struct.unpack()` | 按指定格式把二进制字节拆成多个数值 |
| `"!BBHHHBBH4s4s"` | **格式字符串**（下面细讲） |
| `packet[:20]` | 切片：取 packet 的前 20 个字节 |

**格式字符串对应表：**

| 字符 | 含义 | 占几个字节 |
|------|------|------------|
| `!` | 网络字节序（大端序），网络数据统一用这个 | 0 |
| `B` | unsigned char，无符号整数 0~255 | 1 |
| `H` | unsigned short，无符号整数 0~65535 | 2 |
| `4s` | 4 个字符（字节串） | 4 |

```
"!BBHHHBBH4s4s" 总共 = 1+1+2+2+2+1+1+2+4+4 = 20 字节，正好是 IP 头

解析结果是一个元组（tuple），对应：
  索引0: B  (版本+首部长度)     ← version_ihl
  索引1: B  (服务类型)           ← 暂不用
  索引2: H  (总长度)             ← total_len
  索引3: H  (标识)               ← 暂不用
  索引4: H  (标志+片偏移)        ← 暂不用
  索引5: B  (TTL 生存时间)       ← 暂不用
  索引6: B  (协议号)             ← protocol
  索引7: H  (首部校验和)         ← 暂不用
  索引8: 4s (源 IP 地址 4 字节)  ← src_ip
  索引9: 4s (目的 IP 地址 4 字节)← dst_ip
```

### 第 24~27 行：提取版本号和首部长度

```python
    version_ihl = ip_header[0]        # ◆ ip_header 是元组，[0] 取第一个元素
                                      #   这个字节的前 4 bit 是版本，后 4 bit 是首部长度
    version = version_ihl >> 4        # ◆ >> 是右移运算符
                                      #   比如 0x45 (二进制 0100_0101) >> 4 = 0x04 = 4
                                      #   即 IPv4
    ihl = version_ihl & 0xF           # ◆ & 是"按位与"运算符，0xF = 二进制 0000_1111
                                      #   0x45 & 0x0F = 0x05 = 5
                                      #   即首部长度 = 5 × 4 = 20 字节（不带选项的 IP 头）
    header_len = ihl * 4              # ◆ 首部长度单位是"4字节"，所以要 ×4
```
> 小知识：一个字节 = 8 bit。`>>` 和 `&` 是位运算，就像把一个 8 位数字的前半段和后半段分开。

### 第 29~30 行：版本检查

```python
    if version != 4:                  # ◆ 如果版本号不是 4（即不是 IPv4）
        return None                   #    则无法解析，返回 None
```

### 第 32~35 行：提取关键字段

```python
    total_len  = ip_header[2]         # ◆ 取索引2 → 总长度（整个IP数据包有多少字节）
    protocol   = ip_header[6]         # ◆ 取索引6 → 协议号（6=TCP, 17=UDP, 1=ICMP）
    src_ip     = socket.inet_ntoa(ip_header[8])   # ◆ inet_ntoa：把 4 字节二进制转成"192.168.1.1"
    dst_ip     = socket.inet_ntoa(ip_header[9])   # ◆ 同理把 4 字节转成 IP 字符串
```
> `socket.inet_ntoa()` = Internet Network To ASCII，把电脑用的二进制 IP 转换成人能读的点分十进制。

### 第 37~43 行：返回结果

```python
    return {                           # ◆ return 字典返回解析结果
        "src_ip":     src_ip,          #    源 IP（谁发的）
        "dst_ip":     dst_ip,          #    目的 IP（发给谁）
        "protocol":   protocol,        #    协议号（6/17/1 等）
        "total_len":  total_len,       #    整个 IP 包的长度
        "header_len": header_len,      #    IP 头长度（用于找到传输层数据在哪）
    }
```

---

## 第 46~81 行：`parse_transport()` — 解析传输层（TCP/UDP/ICMP）

```python
def parse_transport(packet, ip_info):
```
> 参数：`packet` = 原始二进制数据，`ip_info` = 上面 `parse_ip_header` 的返回结果（字典）

### 第 47~50 行：定位传输层数据

```python
    protocol = ip_info["protocol"]     # ◆ 从字典取出协议号，["protocol"] 是字典取值语法
    header_len = ip_info["header_len"] # ◆ 从字典取出 IP 头长度

    transport_data = packet[header_len:]   # ◆ 切片：跳过 IP 头，剩下的就是传输层数据
                                           #   [header_len:] 表示"从 header_len 位置到末尾"
```

### 第 52~61 行：解析 TCP

```python
    if protocol == PROTO_TCP and len(transport_data) >= 20:
        # ↑ 如果协议号=6（TCP）且剩余数据至少20字节（TCP头最少20字节）
        tcp = struct.unpack("!HHIIHHHH", transport_data[:20])
        # ↑ 按 TCP 头格式拆解前20字节：
        #   格式 "!HHIIHHHH"：
        #   [0] H 源端口       [1] H 目的端口
        #   [2] I 序号         [3] I 确认号
        #   [4] H 数据偏移+保留 [5] H 标志位+窗口  ← 实际结构更复杂，简化了
        #   [6] H 校验和       [7] H 紧急指针
        return {
            "proto":    "TCP",              # ◆ 协议名
            "src_port": tcp[0],             # ◆ 源端口（如 443 表示 https）
            "dst_port": tcp[1],             # ◆ 目的端口
            "seq":      tcp[2],             # ◆ TCP 序号
            "ack":      tcp[3],             # ◆ TCP 确认号
            "flags":    tcp[5] & 0x3F,      # ◆ & 0x3F 取低6位 = TCP标志位
        }                                    #   （SYN/ACK/FIN/RST 等）
```

### 第 63~70 行：解析 UDP

```python
    elif protocol == PROTO_UDP and len(transport_data) >= 8:
        # ↑ 如果协议号=17（UDP）且剩余≥8字节（UDP头固定8字节）
        udp = struct.unpack("!HHHH", transport_data[:8])
        # ↑ 格式 "!HHHH"：
        #   [0] H 源端口    [1] H 目的端口
        #   [2] H 长度      [3] H 校验和
        return {
            "proto":    "UDP",
            "src_port": udp[0],
            "dst_port": udp[1],
            "length":   udp[2],
        }
```

### 第 72~78 行：解析 ICMP

```python
    elif protocol == PROTO_ICMP and len(transport_data) >= 4:
        # ↑ 如果协议号=1（ICMP）且剩余≥4字节
        icmp = struct.unpack("!BBH", transport_data[:4])
        # ↑ 格式 "!BBH"：[0] B 类型  [1] B 代码  [2] H 校验和
        return {
            "proto": "ICMP",
            "type":  icmp[0],     # ◆ 如 8=回显请求(ping), 0=回显应答(pong)
            "code":  icmp[1],     # ◆ 子类型
        }
```

### 第 80~81 行：兜底处理

```python
    else:
        return {"proto": f"Other({protocol})", "src_port": 0, "dst_port": 0}
        # ↑ f"Other({protocol})" 是 f-string 格式化字符串
        #   比如协议号=2，显示 "Other(2)"，表示无法详细解析
```

---

## 第 84~104 行：`format_packet()` — 格式化输出

```python
def format_packet(index, ip, trans, packet_len):
```
> 参数：`index`=第几个包，`ip`=IP解析结果，`trans`=传输层解析结果，`packet_len`=包长

### 第 85 行：取协议名（带默认值）

```python
    proto_name = trans.get("proto", "?")
    # ◆ .get() 是字典的安全取值方法
    #   如果字典有 "proto" 这个键 → 返回其值
    #   如果没有 → 返回默认值 "?"
    #   等价于 trans["proto"] 但不会因为键不存在而报错
```

### 第 87~98 行：根据协议拼接不同的输出文本

```python
    if proto_name == "TCP":
        transport_str = f"TCP  {trans['src_port']:>5} -> {trans['dst_port']:<5}"
        #   :>5 = 右对齐，占5字符宽度
        #   :<5 = 左对齐，占5字符宽度
        #   效果: "TCP    443 -> 54321"
        flags_str = f" [flags=0x{trans['flags']:02X}]"
        #   :02X = 十六进制大写，至少2位，不足前面补0
        #   效果: " [flags=0x12]"

    elif proto_name == "UDP":
        transport_str = f"UDP  {trans['src_port']:>5} -> {trans['dst_port']:<5}"
        flags_str = ""   # UDP 没有标志位，所以为空

    elif proto_name == "ICMP":
        transport_str = f"ICMP type={trans['type']} code={trans['code']}"
        flags_str = ""

    else:
        transport_str = f"{proto_name:<8}"   # 左对齐，占8字符
        flags_str = ""
```

### 第 100~104 行：拼接 IP 列和长度列，最终打印

```python
    ip_str = f"{ip['src_ip']:<16} -> {ip['dst_ip']:<16}"
    #   左右对齐各16字符，输出如： "192.168.1.5      -> 10.0.0.1        "

    len_str = f"{packet_len:>5}B"
    #   右对齐5字符，输出如： " 1500B"

    print(f"  [{index:>4}] {ip_str} | {transport_str} | {len_str}{flags_str}")
    #   [{index:>4}] → 序号右对齐4字符
    #   最终输出示例：
    #   [   1] 192.168.1.5      -> 10.0.0.1         | TCP    443 -> 54321 |  1500B [flags=0x18]
```

---

## 第 107~122 行：`match_filter()` — 协议过滤

```python
def match_filter(ip_info, trans, filter_proto):
```
> 判断一个数据包是否匹配用户选择的过滤协议

```python
    if filter_proto is None:        # ◆ 如果没设过滤器（None 是 Python 的空对象）
        return True                 #    返回 True，表示"通过，显示这个包"

    filter_upper = filter_proto.upper()      # ◆ .upper() 把小写变大写，如 "tcp" → "TCP"
    proto_name = trans.get("proto", "").upper()   # ◆ 同样取协议名并转大写

    if filter_upper in ("IP", "ALL", ""):   # ◆ in 运算符：检查是否在元组里
        return True                 #    选了 IP/ALL/空 → 所有包都显示
    if filter_upper == "TCP" and "TCP" in proto_name:
        return True                 #    选了 TCP 且包是 TCP → 显示
    if filter_upper == "UDP" and "UDP" in proto_name:
        return True
    if filter_upper == "ICMP" and "ICMP" in proto_name:
        return True

    return False                    # ◆ 都不匹配 → 不显示
```

---

## 第 125~138 行：`get_interfaces()` — 获取网卡列表

```python
def get_interfaces():
    try:                                    # ◆ try = "试着执行，如果出错了跳到 except"
        from scapy.all import get_if_list, IFACES
        # ↑ 从 scapy 库导入两个东西：
        #   get_if_list() → 获取网卡名字的列表
        #   IFACES         → 网卡详细信息

        interfaces = []                     # ◆ 创建空列表，准备装结果

        for iface_name in get_if_list():    # ◆ for = 循环，遍历每个网卡名
            try:
                iface = IFACES.dev_from_name(iface_name)    # 根据网卡名获取详细信息

                ip = iface.ip if hasattr(iface, 'ip') and iface.ip else "N/A"
                # ◆ 三元表达式：条件成立取前面，不成立取后面
                #   if hasattr(iface, 'ip') → 先检查对象有没有 ip 属性
                #   and iface.ip           → 有的话再检查 ip 不为空
                #   满足 → 用 iface.ip；不满足 → 用 "N/A"

                interfaces.append((iface_name, ip, iface.description))
                # ◆ .append() 往列表末尾添加一个元素
                #   每个元素是一个元组 (名字, IP, 描述)

            except:                         # ◆ 出错了（如有些虚拟网卡没有IP）
                interfaces.append((iface_name, "N/A", ""))
        return interfaces

    except ImportError:                     # ◆ 如果 scapy 没有安装
        return []                           #    返回空列表
```

---

## 第 141 行起：`main()` — 主程序（程序入口）

```python
def main():
```

### 第 142~145 行：打印欢迎横幅

```python
    print("=" * 70)                           # ◆ "=" * 70 = 70个等号连起来
    print("  网络嗅探器（scapy + Npcap 驱动版）")
    print("  协议栈分层分析：IP → TCP/UDP/ICMP")
    print("=" * 70)
```

### 第 147~153 行：获取本机信息

```python
    hostname = socket.gethostname()           # ◆ 获取本机的计算机名（如 "DESKTOP-ABC"）
    try:
        local_ip = socket.gethostbyname(hostname)  # ◆ 根据计算机名查本机 IP
    except:                                   # ◆ 如果查不出来（如没联网）
        local_ip = "0.0.0.0"                  #    就用 "0.0.0.0" 代替
    print(f"\n本机 IP: {local_ip}")           # ◆ \n = 换行符
    print(f"本机名:  {hostname}")
```

### 第 155~161 行：检查 scapy 是否安装

```python
    try:
        from scapy.all import sniff           # ◆ sniff = scapy 的抓包函数
        from scapy.layers.inet import IP      # ◆ IP = scapy 用来判断数据包是否有 IP 层
    except ImportError:                       # ◆ 如果 import 失败（没装 scapy）
        print("\n[!] 未安装 scapy，请运行: pip install scapy")
        print("[!] 同时请确保已安装 Npcap 驱动: https://npcap.com/#download")
        sys.exit(1)                           # ◆ 退出程序，1 表示异常退出
```

### 第 163~183 行：网卡选择

```python
    interfaces = get_interfaces()              # ◆ 调用前面写的函数，拿到网卡列表
    print("\n可用网卡：")
    if interfaces:                             # ◆ if 列表非空 → 有网卡
        for i, (name, ip, desc) in enumerate(interfaces):
            # ◆ enumerate() 同时给序号和内容
            #   第1轮 i=0, (name,ip,desc)=("以太网","192.168...","...")
            #   第2轮 i=1, ...
            desc_str = f" ({desc})" if desc else ""
            print(f"  [{i}] {name}  IP={ip}{desc_str}")

        print("\n" + "-" * 40)
        try:
            choice = input("选择网卡编号（直接回车=自动选择）: ").strip()
            # ◆ input() 等待用户输入，.strip() 去掉首尾空格
            if choice != "":
                iface_idx = int(choice)        # ◆ int() 把字符串转成整数
                iface = interfaces[iface_idx][0]   # ◆ interfaces[索引] 取元组 → [0] 取名字
            else:
                iface = None                   # ◆ None 表示让 scapy 自己选
        except (ValueError, IndexError):       # ◆ 两种可能的错误一起捕获
            #   ValueError: 输入的不是数字（如 "abc"）
            #   IndexError: 编号超出范围
            print("[!] 无效选择，使用自动选择")
            iface = None
    else:
        print("  (无法获取网卡列表，将使用默认网卡)")
        iface = None
```

### 第 185~197 行：协议过滤输入

```python
    print("\n" + "-" * 40)
    print("协议过滤选项：IP / TCP / UDP / ICMP / ALL（默认ALL=全部分析）")
    filter_proto = input("输入要分析的协议（直接回车=全部分析）: ").strip()
    if not filter_proto:                       # ◆ 空字符串在 Python 中会被当作 False
        filter_proto = "ALL"                   #    直接回车 → 默认 ALL

    bpf_filter = ""                            # ◆ BPF 是底层过滤语法，提升性能
    if filter_proto.upper() == "TCP":          #    让 Npcap 驱动只给 scapy "TCP 的包"
        bpf_filter = "tcp"
    elif filter_proto.upper() == "UDP":
        bpf_filter = "udp"
    elif filter_proto.upper() == "ICMP":
        bpf_filter = "icmp"
```

### 第 199~203 行：数据包数量输入

```python
    try:
        count_str = input("捕获数据包数量（直接回车=不限，Ctrl+C 停止）: ").strip()
        max_count = int(count_str) if count_str else 0
        # ◆ int(count_str) if count_str else 0
        #   是 Python 的三元表达式：
        #   如果 count_str 非空 → int(count_str)
        #   如果 count_str 为空 → 0（0表示不限量）
    except ValueError:                         # ◆ 如果输入的不是数字
        max_count = 0
```

### 第 205~210 行：确认信息 + 初始化统计

```python
    print(f"\n[+] 过滤器: {filter_proto.upper()}")
    print(f"[+] 网卡: {iface if iface else '自动'}")
    print(f"[+] 开始嗅探...（按 Ctrl+C 停止）\n")
    print("-" * 70)

    stats = {"total": 0, "TCP": 0, "UDP": 0, "ICMP": 0, "Other": 0}
    # ◆ 创建一个字典来计数：每种协议抓到多少包
```

### 第 212~243 行：`packet_handler()` — 核心回调函数

```python
    def packet_handler(pkt):                   # ◆ 嵌套函数！每抓到一个包，scapy 就调用它
```
> 参数 `pkt`：scapy 解析好的数据包对象

```python
        if max_count > 0 and stats["total"] >= max_count:
            return True                        # ◆ return True 告诉 scapy "停止抓包"

        if IP not in pkt:                      # ◆ 判断数据包有没有 IP 层
            return                             #    没有就跳过（如纯 ARP 包）

        raw_bytes = bytes(pkt[IP])             # ◆ 把 scapy 的 IP 层对象转成原始二进制字节
        packet_len = len(raw_bytes)            # ◆ len() 获取字节数 = 数据包长度

        stats["total"] += 1                    # ◆ 总计数 +1，等价于 stats["total"] = stats["total"] + 1

        ip_info = parse_ip_header(raw_bytes)   # ◆ 调用我们自己写的 IP 头解析函数
        if ip_info is None:                    # ◆ 解析失败 → 跳过
            return

        trans_info = parse_transport(raw_bytes, ip_info)  # ◆ 调用传输层解析函数

        if not match_filter(ip_info, trans_info, filter_proto):  # ◆ 过滤检查
            return                             #    不匹配 → 不显示

        proto_name = trans_info.get("proto", "Other")   # ◆ 取协议名用于分类统计
        if "TCP" in proto_name:
            stats["TCP"] += 1
        elif "UDP" in proto_name:
            stats["UDP"] += 1
        elif "ICMP" in proto_name:
            stats["ICMP"] += 1
        else:
            stats["Other"] += 1

        format_packet(stats["total"], ip_info, trans_info, packet_len)
        # ◆ 调用格式化函数，在屏幕上打印这一条
```

### 第 245~267 行：启动嗅探 + 异常处理

```python
    try:
        sniff(                                # ◆ scapy 的核心抓包函数
            prn=packet_handler,               # ◆ prn = 回调函数，每抓到一个包就调用
            store=False,                      # ◆ store=False = 不把包存内存（省内存）
            iface=iface,                      # ◆ iface = 网卡名，None=自动选择
            filter=bpf_filter if bpf_filter else None,
            # ◆ filter = BPF 过滤表达式，空字符串则传 None
        )
```

> 下面是用 `try...except` 捕获各种异常（错误），程序不会崩溃而是给出友好的提示：

```python
    except KeyboardInterrupt:                 # ◆ 用户按了 Ctrl+C
        print("\n\n[*] 用户中断")

    except PermissionError:                   # ◆ 以管理员身份运行的错误
        print("\n[!] 权限不足！")
        print("[!] 请以管理员身份运行终端，并确保已安装 Npcap:")
        print("    https://npcap.com/#download")
        print("[!] 安装时请勾选「Install Npcap in WinPcap API-compatible Mode」")

    except OSError as e:                      # ◆ as e = 把异常对象存到变量 e 中
        print(f"\n[!] 系统错误: {e}")          #    可以打印出具体的错误描述
        print("[!] 可能原因：")
        print("    1. Npcap 未安装 → 请访问 https://npcap.com/#download")
        print("    2. 网卡选择错误 → 请重新运行并选择正确的网卡")
        print("    3. 被安全软件拦截 → 请检查防火墙/杀毒软件设置")

    except Exception as e:                    # ◆ Exception 是通用异常，兜底用的
        print(f"\n[!] 错误: {e}")
        print("[!] 请确认 Npcap 已正确安装: https://npcap.com/#download")
```

### 第 269~277 行：打印最终统计

```python
    print("\n" + "=" * 70)
    print("  嗅探统计")
    print("=" * 70)
    print(f"  总数据包:  {stats['total']}")     # ◆ f-string 直接嵌入变量
    print(f"  TCP 包:    {stats['TCP']}")
    print(f"  UDP 包:    {stats['UDP']}")
    print(f"  ICMP 包:   {stats['ICMP']}")
    print(f"  其他协议:  {stats['Other']}")
    print("=" * 70)
```

---

## 第 280~281 行：程序入口

```python
if __name__ == "__main__":                  # ◆ Python 的特殊变量
    main()                                   # ◆ 如果这个文件被直接运行（而非被 import）→ 执行 main()
```

> **解释**：当你执行 `python sniffer.py` 时，Python 会把 `__name__` 设为 `"__main__"`，于是 `if` 条件成立，调用 `main()`。如果这个文件被其他文件 `import sniffer` 引用，`__name__` 就是 `"sniffer"`，不会自动运行，方便别人复用你的函数。

---

## 🎯 整体数据流（对照代码看图）

```
┌─────────────────────────────────────────────────────┐
│                    程序启动                          │
│               python sniffer.py                     │
└──────────────────────┬──────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────┐
│  main()  →  显示欢迎界面 → 获取本机信息 → 检查scapy │
│  → 选网卡 → 选过滤协议 → 输入数量                    │
└──────────────────────┬──────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────┐
│  sniff(prn=packet_handler)   ← scapy + Npcap 抓包   │
│    每抓到一个数据包就调用 packet_handler()            │
└──────────────────────┬──────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────┐
│  packet_handler(pkt)                               │
│    ├─ bytes(pkt[IP]) → 取出原始二进制数据            │
│    ├─ parse_ip_header()   → 解析 IP 头              │
│    │    ├─ 版本 & 首部长度                           │
│    │    ├─ 协议号                                   │
│    │    ├─ 源 IP / 目的 IP                          │
│    │    └─ 总长度                                   │
│    ├─ parse_transport()   → 解析传输层头             │
│    │    ├─ TCP: 源/目的端口 + 标志位                  │
│    │    ├─ UDP: 源/目的端口 + 长度                    │
│    │    └─ ICMP: 类型 + 代码                         │
│    ├─ match_filter()      → 协议过滤                │
│    └─ format_packet()     → 打印一行                 │
└──────────────────────┬──────────────────────────────┘
                       ▼
                  用户按 Ctrl+C
                       ▼
┌─────────────────────────────────────────────────────┐
│             打印最终统计（各协议数量）                 │
└─────────────────────────────────────────────────────┘
```

---

## 📚 本程序涉及的 Python 知识点速查

| 知识点 | 出现位置 | 一句话说明 |
|--------|----------|------------|
| `import` | 第1~5行 | 导入别人写好的库 |
| 变量 & 常量 | 第7~9行 | 大写命名 = 约定不修改的常量 |
| `dict` 字典 | 第11、37、210行 | `{键: 值}`，通过键快速查值 |
| `def` 函数 | 第18行等 | 定义一段可重复使用的代码 |
| `struct.unpack` | 第22行 | 按格式拆解二进制数据 |
| `>>` 和 `&` 位运算 | 第25~26行 | 拆出字节中的某几个 bit |
| `return` | 第20行 | 函数返回结果 |
| `None` | 第20行 | 空值/啥也没有 |
| `len()` | 第19行 | 获取字节数/长度 |
| 切片 `[:]` | 第22、50行 | 截取序列的一部分 |
| `if/elif/else` | 第52行 | 条件分支 |
| `f-string` | 第88行 | 格式化字符串，`f"值{变量}"` |
| `.format()` 格式化 | 第88行 | `:>5` 右对齐5字符，`:02X` 十六进制补零 |
| `.get()` | 第85行 | 字典安全取值，带默认值 |
| `.upper()` | 第110行 | 转大写 |
| `in` 运算符 | 第113行 | 判断元素是否在容器中 |
| `for` 循环 | 第129行 | 遍历可迭代对象 |
| `enumerate()` | 第166行 | 同时给序号和内容 |
| `try/except` | 第126行 | 异常处理，程序不崩溃 |
| `sys.exit(1)` | 第161行 | 退出程序 |
| `.append()` | 第133行 | 往列表末尾添加 |
| `input()` | 第172行 | 等待用户键盘输入 |
| `.strip()` | 第172行 | 去除首尾空格 |
| `int()` | 第174行 | 字符串转整数 |
| `+=` | 第222行 | `x += 1` 等价于 `x = x + 1` |
| 三元表达式 | 第201行 | `A if 条件 else B` |
| 嵌套函数 | 第212行 | 函数里面定义函数 |
| `if __name__ == "__main__"` | 第280行 | 只有直接运行时才执行 |
