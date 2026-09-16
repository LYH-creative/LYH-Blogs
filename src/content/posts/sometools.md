---
title: 比赛途中下载下来的一些工具
published: 2026-09-12
description: '打ctf分好用的工具'
image: ''
tags: [网安, ctf]
category: '工具'
draft: false 
lang: ''
---
# CTF 工具速查（已装在 `~/tools`）

安装位置：

| 工具 | 形态 | 位置 |
| --- | --- | --- |
| sqlmap 1.10.9 | Python 源码 | `~/tools/sqlmap` → 启动器 `~/tools/bin/sqlmap` |
| SSTImap | Python 源码 + venv | `~/tools/SSTImap` → 启动器 `~/tools/bin/sstimap` |
| nuclei 3.11.1 | Go 二进制 | `~/tools/bin/nuclei` |
| ffuf 2.3.0 | Go 二进制 | `~/tools/bin/ffuf` |

PATH 已写入 `~/.zshrc`（`export PATH="$HOME/tools/bin:$PATH"`），**新开终端窗口生效**，
或先执行 `source ~/.zshrc`。

> 只打自己有权限的靶机／CTF 平台，别对真实站点乱扫。

---

## sqlmap（SQL 注入专用，必装）

```bash
# 最简：GET 参数
sqlmap -u "http://target/page?id=1" --batch

# POST 表单，指定测哪个字段（-p 必须给，否则全字段都测）
sqlmap -u "http://target/login" --data "username=admin&password=123" -p username --batch

# 带 Cookie / 自定义头（需要登录后的场景）
sqlmap -u "http://target/x?id=1" --cookie "session=xxxx" --batch
sqlmap -u "http://target/x?id=1" -H "X-Forwarded-For: 127.0.0.1" --batch

# 指定注入技术：B=布尔盲注 T=时间盲注 U=联合查询 E=报错 S=堆叠
sqlmap -u "..." --technique=B --batch          # 页面只有"有/无"两种状态时用这个
sqlmap -u "..." --technique=T --batch          # 完全没回显时用时间盲注

# 提高强度（默认 level1/risk1 探测很保守，很多题扫不出来）
sqlmap -u "..." --level 3 --risk 2 --batch

# 绕黑名单 / WAF
sqlmap -u "..." --tamper=space2comment,between,randomcase --batch

# 拖数据
sqlmap -u "..." --dbs                          # 库名
sqlmap -u "..." -D dbname --tables             # 表名
sqlmap -u "..." -D dbname -T users --columns   # 列名
sqlmap -u "..." -D dbname -T users --dump      # 出数据

# 其他常用
sqlmap -u "..." --threads 5                    # 并发
sqlmap -u "..." --flush-session                # 清缓存重扫（改 payload 后必加）
sqlmap -u "..." --os-shell                     # 条件满足时拿系统 shell
```

常见坑：

- 扫不出来先加 `--level 3 --risk 2`，默认的 level1 只测很基础的 payload
- 改了参数重扫一定要 `--flush-session`，否则它直接读上次的缓存结论
- 目标有随机 token / 每次响应都变时，布尔盲注会误判，加 `--string=` 或 `--not-string=` 指定判断依据

---

## SSTImap（SSTI 专用）

```bash
# 基本：测 URL 参数
sstimap -u "http://target/?name=test"

# 测 POST 表单字段
sstimap -u "http://target/login" --data "username=test&password=a" -p username

# 指定模板引擎，省探测时间
sstimap -u "http://target/?name=test" -e jinja2

# 拿到 shell 后执行命令
sstimap -u "..." --os-shell
```

**它的局限（重要）**：SSTImap 靠**回显**判断引擎和注入是否成功。
像「旧能源管理系统」这种渲染结果被丢弃、异常也被吞掉的**盲 SSTI**，它基本识别不出来 ——
所以那题还得靠手工 + 带外通道（见 writeup）。它是"省时间工具"，不是"万能钥匙"。

---

## ffuf（fuzz 参数 / 目录 / 绕过过滤）

```bash
# fuzz 参数值
ffuf -u "http://target/?id=FUZZ" -w wordlist.txt

# fuzz 参数名（找隐藏参数）
ffuf -u "http://target/?FUZZ=1" -w params.txt -fs 1234

# POST 表单 fuzz
ffuf -u "http://target/login" -X POST -d "user=admin&pass=FUZZ" -w pass.txt -fc 401

# 目录/文件扫描
ffuf -u "http://target/FUZZ" -w wordlist.txt -e .php,.bak,.txt

# 过滤噪声（-fs 按响应大小、-fc 按状态码、-mr 按正则匹配内容）
ffuf -u "http://target/FUZZ" -w list.txt -fs 0          # 去掉空响应
ffuf -u "http://target/FUZZ" -w list.txt -fc 404,403
ffuf -u "http://target/?q=FUZZ" -w list.txt -mr "flag"   # 只看含 flag 的

# 限速（靶机脆弱时）
ffuf -u "..." -w list.txt -rate 20
```

词表：自带没有，常用的是 SecLists

```bash
git clone --depth 1 https://github.com/danielmiessler/SecLists.git ~/tools/SecLists
# 常用路径
# ~/tools/SecLists/Discovery/Web-Content/common.txt
# ~/tools/SecLists/Fuzzing/SQLi/Generic-SQLi.txt
```

---

## nuclei（已知漏洞批量扫，CTF 单题用得少）

```bash
nuclei -u http://target                        # 全量模板跑（很慢，几千个）
nuclei -u http://target -tags ssti,sqli        # 按标签跑
nuclei -u http://target -severity high,critical
nuclei -l targets.txt -o result.txt            # 批量目标
nuclei -ut                                     # 更新模板库
nuclei -tl                                     # 列出所有标签
```

模板默认目录：`~/nuclei-templates`。单题 CTF 一般用不上，适合比赛开局做信息收集。

---

## 选型速记

| 情况 | 用什么 |
| --- | --- |
| 确认是 SQL 注入，想省事 | sqlmap（先 `--level 3 --risk 2`） |
| 确认是 SSTI 且有回显 | SSTImap |
| SSTI 无回显 | 手工 + 带外通道，别指望扫描器 |
| 找隐藏参数 / 目录 | ffuf |
| 批量打已知洞 | nuclei |
| 反复调一个包看响应 | Burp Repeater / Yakit |

**顺序别反**：先手工打穿一遍，再用工具自动化。扫描器说"没洞"不等于真没洞。
