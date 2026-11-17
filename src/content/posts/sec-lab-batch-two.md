---
title: 从八个到十四个：sec-lab 第二批靶场，以及一个刻意的分叉
published: 2026-11-18
description: '承接上一篇靶场合集搭建记录。这次新增六个靶场，三个并入根编排、三个保留独立 compose——记录这个取舍的理由、六条带错误结论原文的实测反证，以及把文档口径统一的过程。'
image: ''
tags: [网安, Docker, 靶场, Java]
category: '靶场'
draft: false
lang: ''
---

# 从八个到十四个：sec-lab 第二批靶场，以及一个刻意的分叉

上一篇写到七个靶场合并成一条 `docker compose up`，结尾说"越晚合并越麻烦"。后来靶场还是继续涨——先是 sandbox-escape 成了第八个，最近又补了六个，现在是十四个。

这篇不重复上一篇讲过的编排原理（网络 alias、profile 隔离、容器名冲突那些），只讲这批新增的东西，以及一个我犹豫了一阵的架构决定：六个新靶场里，三个并进了根编排，三个保留独立 compose。

先说结论：**不是因为偏好不统一，是因为这三类靶场对"环境"的要求跟前一批不一样**。把它们硬并进来，主环境会变脆。

仓库地址还是那个：[github.com/LYH-creative/sec-lab](https://github.com/LYH-creative/sec-lab)。

---

## 一、为什么是这六个

还是按攻击链的环节补空白，不是照着 CVE 清单堆。每个靶场负责一段别人没覆盖到的路：

- **Shiro 多版本**（8901~8906）：认证层。同一套源码用 `-Dshiro.version` 打出六个 jar，凑齐 550 硬编码密钥、721 padding oracle、1.4.2→1.7.1 四个路径绕过的补丁对照。框架刻意钉在 Spring Boot 2.3.12 + Tomcat 9.0.46——新版 Tomcat 会把 `..;/` 这类畸形路径归一化掉，绕过就"被意外修好了"，对照就不成立了。
- **Replay / AD CS**（8910）：域内协议链。一个纯标准库 Python 进程里分四个角色，五关从抓包重放一路串到域管证书（ESC8 中继 → ESC1 + PKINIT）。
- **Redis RCE**（8911）：从服务到主机。未授权读全库 → `CONFIG SET` + `SAVE` 把 RDB 写成 webshell → 写 crontab 让 root 自己弹回来。全程手写 RESP，不用 redis-cli。
- **Java 内存马**（19090）：RCE 之后。它不是漏洞，是拿到代码执行后的驻留方式——这一类的设计跟前五个根本不同，后面单独说。
- **Kerberos**（8907）：票据信任关系。黄金 / 白银票据、PAC 双签名、krbtgt 轮换，六关都带可复核的 DC 与成员机日志。
- **Log4Shell**（19080~19082）：第三方组件。漏洞不在自己写的代码里，而在 `log4j-core 2.14.1`；应用只是照常把 User-Agent 记进日志。

---

## 二、一个刻意的分叉：三个并入，三个独立

这批里 shiro / replay-adcs / redis-rce 进了根 `docker-compose.yml`，`./lab.sh up` 一起起；java-memshell / kerberos / log4shell 各自留在子目录的 `compose.yml` 里。

我用的判断标准很朴素：**能不能被统一编排接管，而不改变靶场本身想验证的东西**。

并入的三个都满足：

- shiro 的 Maven 构建在容器里完成，六个 jar 打完镜像就自足；
- replay-adcs 是一个纯 Python 进程，没有外部状态；
- redis-rce 就 redis + web 两个容器，端口绑回环即可。

独立的三个各有各的理由：

- **java-memshell 依赖宿主机 `javac`**，要用 `--release 8` 编出 major 52 的 class。更要紧的是它的"两侧分离"：目标侧 `classes` / `libs` 全部 `:ro`，攻击者侧的 `EvilFilter.class` 根本不挂载进容器。这套划分一旦被根编排接管，很容易变成"构建镜像时把 class 编进去"——那无文件验证就名存实亡了。
- **kerberos 有自己的 project name 和网络**，改的是 KDC 语义，跟 Web 靶场没有共享依赖。
- **log4shell 一个容器里跑三个 JVM**，靠不同 classpath 和 JVM 参数分工（2.14.1 + `trustURLCodebase=true` / 2.14.1 + JDK 默认 / 2.17.1）。独立 project name，改端口不会波及别人。

代价也很实在：**文档统计口径一度是乱的**。门户写 10 靶场 / 27 容器 / 50 关卡，README 写 11 / 29 / 53，两边对不上，还都落后于磁盘上的实际内容。这次统一到 **14 靶场 / 33 容器 / 69 关卡**，其中根编排 11 个（29 容器，默认起 26 个，ARP 按需）、独立三个共 4 容器。门户上把启动命令标成 `1+3`，并加了一句"最后三个不随 `./lab.sh up` 启动"。

---

## 三、三个独立靶场的设计取舍

### 3.1 Java 内存马：把"没落盘"做成可验证的

这个靶场最费心的不是注入，是怎么让别人**相信**它真的没落盘。做法是让"攻击者侧"和"目标侧"在文件系统层面彻底分开：

- 目标侧 `/app` 只读挂载，进程里的 Filter 只存在于运行时注册表和 JVM 堆；
- 攻击者侧编译好的 `.class` 留在宿主，不挂载进容器，注入走一个模拟 RCE 入口送进去；
- 验证分两路：`/__lab/scan` 看 Filter 注册表，容器里 `jcmd 1 GC.class_histogram` 看堆里的类。

于是 `touch /app/classes/.write-test` 会报 `Read-only file system`，但 L2 注入照样 200、L3 带 `X-Lab-Probe` 的请求照样命中。磁盘查不到、运行时查得到，这件事就成了可复核的证据，而不是一句描述。

六关是 L0 基线 → L1 标准 API 被拒 → L2 注入 → L3 命中与放行 → L4 运行时检测 → L5 重启消失。教学版 Filter 只做无害回显，不执行命令、不做免杀——注入和驻留的机制是完整的，但本靶场不实现那部分。

### 3.2 Kerberos：为什么不用 Samba AD DC

Apple Silicon 跑不了 Windows Server AD DC。Samba AD DC 倒是能起，但它的 PAC 生成与校验路径和 Windows 不一致——拿它练"白银票据为什么被完整 PAC 签名挡住"，会得出错误结论。

所以这里做的是协议语义级仿真：真实 TGT 用 krbtgt 封印、TGS 用服务账户密钥封印，这里换成"可读 JSON + 对应密钥的 HMAC-SHA256"。封印不是加密，但保留了决定性的性质：**没有那把密钥，就造不出会被信任的票据**。好处是 `klist` 能直接看到 PAC、SID、组、SPN，不用去解二进制票。

密钥关系、PAC 双签名、krbtgt 双密钥历史、SPN 绑定都按真实逻辑实现。练不了的是真实 AS/TGS/AP 报文、RC4/AES 加密类型、mimikatz 注入和 `ntds.dit` 提取——手册里给了迁移真 AD 的命令。

### 3.3 Log4Shell：一个容器三个 JVM

这个靶场的巧思在于把"加固对照"做成了三个端口，而不是三篇文章：

- 19080：log4j 2.14.1 + `-Dcom.sun.jndi.ldap.object.trustURLCodebase=true`，还原 2021 年的 JDK 环境，L1~L3 在这里打；
- 19081：同样是 2.14.1，但保留 JDK 默认（禁止远程 codebase），做 L4 对照；
- 19082：2.17.1，做版本升级的对照。

三 JVM 同容器，区别只在 classpath 与启动参数。这样"JDK 加固只挡住远程类加载、升级 log4j 才根治"这句话，就是三个 URL 之间的差别，不需要解释。

---

## 四、错误结论与实测反证

这一节是这批靶场里最值钱的部分。下面六条都按「当时的结论原文 → 为什么这么想 → 实测打脸 → 正确说法」写，原文是当时真写下来的判断，不是事后编的教学案例。

**① "用 `addFilterMapBefore` 保证插到链首"**

- 结论原文：*"用 `addFilterMapBefore` 而不是 `addFilterMap`，保证插在链首，`filterStart()` 重建 `filterConfigs` 让它立刻生效。"*
- 为什么这么想：方法名叫 `Before`，直觉上就是"放到最前面"。
- 实测反证：L4 的 `filterMaps` 顺序是 `characterEncodingFilter → formContentFilter → requestContextFilter → lab-probe-filter → WsFilter`，新映射排在**第 4 位（共 5 个）**，不是 index 0。
- 源码反证：反编译 `StandardContext$ContextFilterMaps`，里面有 `private int insertPoint`；`addBefore()` 的字节码用 `System.arraycopy(array, 0, results, 0, insertPoint)` 复制前半段，再 `results[insertPoint] = filterMap`。它插的是 `insertPoint`，不是 0。
- 正确说法：这个方法保证的是"排在 servlet-name 映射之前"，不保证绝对链首。本靶场里够早（L3 的 `/any/path` 命中就是证据），但要真占住 index 0，得反射改 `ContextFilterMaps.array` 本身。

**② "注入返回 500，肯定是反射拿 `StandardContext` 的写法错了"**

- 结论原文：*"HTTP 500，说明 `ApplicationContextFacade → ApplicationContext → StandardContext` 这条反射链字段名对不上，或者 `defineClass` 在 JDK 8 上被拦了。"*
- 为什么这么想：500 发生在注入请求上，自然先怀疑最深的那段代码。
- 实测反证：`docker logs memshell-lab` 的根因是 `Name for argument of type [java.lang.String] not specified, and parameter name information not found in class file either.` ——请求根本没进注入器，在 Spring MVC 绑定 `@RequestParam String b64` 时就挂了。`javac` 默认不写 `MethodParameters` 属性。
- 正确说法：显式写 `@RequestParam("b64")`，或编译时加 `-parameters`。改完重新编译重启，注入立刻返回 `injected: evil.EvilFilter codeSource=(null ...)`。**排障先看根因，别急着怀疑最高深的那段代码。**

**③ "类都注入了，`Class.forName` 应该能找到它"**

- 结论原文：*"L4 里 `/__lab/probe` 还显示 `evilClassOnClasspath=false`，说明检测端点写错了，或者注入其实没成功。"*
- 实测反证：同一时刻 L3 带请求头能命中 `mem-shell alive`，`jcmd` 里也有 `1  16  evil.EvilFilter`。类确实在。原因是 `/__lab/probe` 的 `Class.forName` 由 `lab.MemShellLab` 发起，用的是 `AppClassLoader`；注入用的是 Web 请求线程的 `TomcatEmbeddedWebappClassLoader`。两个加载器。
- 正确说法：`false` 是对的，它只说明"应用类加载器里没有"。检测要遍历 `filterDefs` 里每个 Filter **自己的** `getClass()`，或者用 `jcmd` / Arthas 直接看 JVM 全量类。

**④ "宿主 `javac 17` 编译一下就能给 JDK 8 用"**

- 结论原文：*"就是个普通 Java 类，本机有 `javac` 直接编了发过去就行。"*
- 实测反证：`UnsupportedClassVersionError: ... class file version 61.0, this version of the Java Runtime only recognizes class file versions up to 52.0`。
- 正确说法：目标 JDK 8 只认 major 52。`up.sh` 统一用 `javac --release 8`，编完校验两个 class 都是 52。真实攻防里字节码版本比 payload 技巧更先决定成败。

**⑤ "JDK 够新，Log4Shell 对我没影响"**

- 结论原文：*"我们 JDK 8u3xx / 11+，官方说默认禁了远程 codebase，这条漏洞可以直接关掉。"*
- 实测反证：19081（JDK 默认）上 LDAP 回连 1 次；把 L1 的 `${env:}` 外带 payload 打过去，环境变量照样出来。
- 正确说法：新 JDK 只掐断远程类加载这一步。外带、本地 gadget、DoS 都还在，**受影响面取决于 `log4j-core` 版本**。同理，"WAF 把 `jndi`/`ldap` 过滤掉就安全"也不成立——L3 的 `${::-j}` 混淆后原串里没有任何连续关键字，照样完整 RCE。过滤在解析之前，攻击串在解析过程中才成形。

**⑥ "白银票据也要过域控"**

- 结论原文（入门常见误解）：*"票据总得找 KDC 验一下，DC 日志肯定有 4769。"*
- 实测反证：L3 打白银票据时，左栏 DC 日志一行不增，只有成员机新增 4624。TGS 是直接递给目标服务的 AP-REQ，KDC 全程不参与。
- 正确说法：检测必须把成员服务器日志也收上来，只看 DC 会漏。顺带纠正另一条：白银不是比黄金更强，它只有一个服务的密钥、只对一个 SPN 有效，优势只有**隐蔽**，不是权限。

还有一条不是认知错误、但值得单列：第一版 Kerberos 靶场把每个 SPN 的密钥拆开了，L4 直接返回 `bad_seal`。这正好暴露了一个误解——同一台机器上的 `cifs/host`、`http/host` 等 SPN 注册在同一个计算机账户下，共用一把密钥。修掉之后 L4 才真正验证"SPN 字段必须和访问目标一致"。

---

## 五、文档同步：这次实际做的事

靶场多了，最大的麻烦不是写代码，是让文档别自相矛盾。这次动的地方：

- **README**：统计统一到 14 / 33 / 69，补三节独立靶场说明，端口表、目录树、单独启动命令和 FAQ 同步；
- **门户页**：14 张卡片，统计同步，"1 条启动命令"改成"1+3"，并注明最后三个不随 `./lab.sh up` 启动；
- **answers.md**：flag 总表补 Kerberos 六条、Log4Shell 三条；新增三章答案（Java 内存马没有 flag，用运行时证据代替），原来的"一键验证"顺延为第十四章并纳入独立三靶场；
- **lab.sh**：`answer` 增加 `kerberos` / `log4shell` / `memshell` 别名。

改完做了几项校验：`bash -n lab.sh` 通过；三个新别名都能路由到对应章节；答案手册 14 个章节、代码围栏闭合；门户 14 张卡片、脚本标签闭合。推送前扫了一遍待提交内容里的公网 IP 和密钥，唯一的 `2.2.2.1` 是 MS-NLMP 规范节号，不是地址。

---

## 六、现在它长什么样

```
sec-lab/
├── docker-compose.yml     # 根编排：11 个靶场、29 容器
├── lab.sh                 # up / down / init / reset / status / answer
├── README.md              # 部署、端口表、FAQ
├── docs/answers.md        # 全部 flag + 解题思路
├── portal/html/           # 导航页（8880）
├── dvwa/ deserialization/ xxe/ gopher/ jwt/
├── webshell-hunt/ sandbox-escape/ shiro/
├── arp/ replay-adcs/ redis-rce/
├── java-memshell/         # 独立，19090，需宿主 javac
├── kerberos/              # 独立，8907
└── log4shell/             # 独立，19080~19082 / 19089
```

起法分两步。前 11 个照旧：

```bash
git clone https://github.com/LYH-creative/sec-lab.git
cd sec-lab
chmod +x lab.sh
./lab.sh up
```

下面这段是独立三靶场，先起环境再跑验证脚本（`java-memshell` 需要宿主装了 `javac`）：

```bash
./java-memshell/up.sh && python3 java-memshell/poc/run.py
cd kerberos && sh setup.sh && python3 poc/solve.py
./log4shell/up.sh && python3 log4shell/poc/verify.py
```

全部绑定 `127.0.0.1`。这一点在独立靶场里尤其要守住——Log4Shell 和 Redis 的端口一旦绑到 `0.0.0.0`，就不是练习环境了。

---

## 写在最后

统一是默认选项，但不是唯一选项。当某个靶场的核心价值恰恰依赖它对环境有特殊要求——比如"文件根本没进容器"这件事必须靠两侧分离来证明——把它驯服成标准编排，等于把要验证的东西一起驯服掉了。所以最后留下了一个 `1+3` 的结构：主环境一条命令，三个特殊靶场各走各的，端口不冲突，起停互不影响。

交付上也有个体会：文档里的数字是最容易腐烂的部分。门户、README、答案手册各写一套统计，只要新加一个靶场就会开始漂移。这次把它们一次性对齐，并在门户上明说"最后三个不在 `./lab.sh up` 里"——比多写十行原理更能减少第一次使用时的困惑。

六个新靶场各自的逐层原理、踩坑和完整输出，都在对应目录的 README 和练习手册里。那两份手册比这篇长得多，也是我更推荐读的部分。

---

*仓库：[github.com/LYH-creative/sec-lab](https://github.com/LYH-creative/sec-lab) · 博客：[lyh-blogs.top](https://lyh-blogs.top)。发现非预期解法欢迎开 issue，附复现步骤。*
