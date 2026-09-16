---
title: 湾区杯2.0-writrup
published: 2026-09-05
description: '超级难，90%靠ai，感觉以后要没工作了'
image: ''
tags: [网安, ctf]
category: '比赛'
draft: false 
lang: ''
---

# Cold Forge 取证 Writeup

## 题目概述

Cold Forge 审批节点提取到两个文件：

| 文件 | 说明 |
|------|------|
| `frost_telemetry.json` | 公开的 FROST transcript 导出数据，含泄漏的 nonce 观测值 |
| `sealed_release.json` | 由 ChaCha20-Poly1305 保护的加密发布内容 |

目标是恢复阈值私钥、重建发布签名，从而解封加密内容。

### 关键配置（`frost_telemetry.json`）

- 曲线：secp256k1，群阶 `n = 0xFFFF...4141`
- 阈值：`threshold = 2`，参与方 `[1, 2]`
- 拉格朗日系数：`λ₁ = 2`，`λ₂ = n - 1`
- 消息：`message_hex` → `Cold Forge release manifest v1: approve threshold recovery`
- 泄漏模型：`msb_quantisation_with_bucket_jitter`，丢弃低 `104` 位，最大桶漂移 `1`
- 每个 transcript 含：`D`、`E`、`rho`、`challenge`、`z`、`nonce_msb`
- KDF：`SHA256('cold-forge/release/v1' || bip340_signature)`

---

## 密码学原理

### FROST 签名关系

每个参与方 i 的响应满足：

```
z_i = r_i + c_i · λ_i · s_i  (mod n)
```

其中：

- `r_i = d_i + ρ_i·e_i` 为**有效 nonce**（`d_i`、`e_i` 是两轮 nonce）
- `c_i` 为 challenge，`λ_i` 为拉格朗日系数，`s_i` 为秘密份额

因此有效 nonce 可表示为：

```
r_i = z_i − c_i·λ_i·s_i  (mod n)
```

### 侧信道泄漏

`nonce_msb` 是有效 nonce `r_i` 的高 152 位（`r_i >> 104`），桶抖动为 ±1，即：

```
r_i = bucket · 2^104 + low,   0 ≤ low < 2^104
bucket ∈ {nonce_msb − 1, nonce_msb, nonce_msb + 1}
```

### 转化为隐藏数问题（HNP）

令 `a_i = c_i·λ_i (mod n)`，`b_i = nonce_msb`，`t_i = (z_i − b_i·2^104) mod n`，则：

```
z_i = r_i + a_i·s_i  (mod n)
r_i = b_i·2^104 + e_i,   e_i ∈ [-2^104, 2·2^104)

=>  t_i ≡ a_i·s_i + e_i  (mod n)
```

其中误差 `e_i` 的绝对值 `< 3·2^104`。这就是标准 HNP：已知 `a_i`、`t_i`、模 `n`，误差有界，求解秘密 `s_i`。

---

## 格攻击实现

### 构造格（嵌入法 + 缩放）

每个参与方有 20 条 transcript。为平衡秘密（~256 bit）与误差（~104 bit）的量级，对误差列乘以缩放因子 `S = 2^152`，并将目标嵌入为附加行（缩放 `M = 2^260`）：

维度 `d = m + 2` 的格基 B：

```
B[i,i]     = n·S           (i = 0..m-1)    // 非ce列
B[m,i]     = a_i·S         (i = 0..m-1)    // 秘密行
B[m+1,i]   = t_i·S         (i = 0..m-1)    // 目标行
B[m,m]     = 1
B[m+1,m+1] = M
```

短向量：

```
s·row_m − Σ k_i·row_i − 1·row_{m+1}
= (S·e_0, ..., S·e_{m-1}, s, −M)
```

该向量范数约 `2^258`，远小于高斯启发式 `2^390`，因此 LLL 可稳定恢复。用 fpylll 的 `LLL.reduction` 后，寻找最后一列为 `±M` 的行，读出第 m 列为秘密值。

### 结果

| 参与方 | 使用的 λ | 恢复出的值 |
|--------|---------|-----------|
| 1 | λ₁ = 2 | `s₁` |
| 2 | λ₂ 取 +1（等价系数） | `v₂ = −s₂` |

> 说明：LLL 对参与方 2 直接取 `λ₂ = n−1` 时会收敛到虚假短向量，改用 `λ=+1`（即 `a_i = c_i`）恢复出系数 `v₂ = −s₂`，再按 `x = 2·s₁ + v₂` 组合。

---

## 重建阈值私钥与签名

### 群私钥

```
x = λ₁·s₁ + λ₂·s₂ = 2·s₁ − s₂ = 2·s₁ + v₂  (mod n)
```

验证 `x·G == group_public` 成立 ✓。

### BIP340 Schnorr 签名

对消息 `message_hex` 按 BIP340 规范签名：

1. `d0 = x`（若 `x·G` 的 y 为奇数则取 `n − x`）
2. `aux = 0×32`
3. `t = d0 XOR tagged_hash("BIP0340/aux", aux)`
4. `rand = tagged_hash("BIP0340/nonce", t || pk || m)`，`k0 = rand mod n`
5. `k = k0`（若 `k0·G` 的 y 为奇数则取 `n − k0`）
6. `e = tagged_hash("BIP0340/challenge", R.x || pk || m) mod n`
7. `sig = R.x || (k + e·d0 mod n)`

其中 `tagged_hash(tag, msg) = SHA256(SHA256(tag) || SHA256(tag) || msg)`。

### 解密

```
key        = SHA256(b'cold-forge/release/v1' + sig)
nonce      = base64_decode(sealed_release.nonce)
aad        = base64_decode(sealed_release.aad)
ciphertext = base64_decode(sealed_release.ciphertext)
plaintext  = ChaCha20Poly1305(key).decrypt(nonce, ciphertext, aad)
```

---

## 解题结果

```
flag{bd9b026e-b58e-416c-bf8f-d815573c35a6}
```

### 中间数据（参考）

- `s₁ = 33830664863052935011893090897377442532832046534771107235669965455105290858166`
- `v₂ = 28236169047697777781778731316626111921461814408215974937243534460629005345919`
- `x  = 95897498773803647805564913111380996987125907477758189408583465370839587062251`
- 签名：`d3d4ced5a8b7b334f7a1baaaf71fe68a9b2bb02f218aa39cfa0d978fd5fc108b6707bfc6914d3b9b341bd606e69f1bd1d1ab0062d59ab39ea014baa8e07450b3`
- ChaCha 密钥：`bd8667881a9b9903b8008f693ac80ef43a8bce95c042ad22fbe1ad24e7e641e3`

---

## 参考实现要点

- 语言：Python 3.9
- 依赖：`fpylll`（LLL）、`gmpy2`（模逆）、`cryptography`（ChaCha20-Poly1305）
- EC 运算与 BIP340 签名均手写实现，未依赖第三方曲线库

---

# TinyNTRU 解题记录

## 题目描述

一个开发者实现了一个微型的 NTRU 加密方案，认为只要隐藏私钥就够了。
给定源代码、公钥和密文，要求恢复私钥多项式并解密 flag。

文件：

- `challenge.py`
- `ntru.py`
- `public_key.txt`
- `output.txt`

## 1. 分析方案

参数（`challenge.py` 与 `ntru.py`）：

| 参数 | 值 | 含义 |
|------|-----|------|
| N | 127 | 多项式环 `Z[x]/(x^N - 1)` 的阶 |
| p | 3 | 明文模数 |
| q | 12289 | 密文模数 |
| df | 7 | `F` 的非零系数个数 |
| dg | 7 | `G` 的非零系数个数 |
| dr | 6 | 随机盲化多项式 `r` 的非零系数个数 |
| chunk_bytes | 24 | 每块明文字节数 |

### 私钥与公钥的生成

`keygen` 中：

```python
F = sample_sparse_ternary(N, df, rng, avoid_zero=True)   # F 有 7 个 ±1，位置 1..N-1
G = sample_sparse_ternary(N, dg, rng)                    # G 有 7 个 ±1
f = [0]*N; f[0] = 1
f = poly_add(f, [p*x for x in F], N)                     # f = 1 + 3F
g = [p*x for x in G]                                     # g = 3G
finv_q = poly_inv(f, N, q)                               # f 在模 q 下的逆
h = poly_mul(finv_q, g, N, q)                            # h = g * f^{-1} mod q
```

因此私钥为 `(f, g)`，公钥为 `h`，且满足：

```
f * h ≡ g  (mod q)
```

其中：

- `f = 1 + 3F`，`F` 为稀疏三进制多项式（7 个 ±1）
- `g = 3G`，`G` 为稀疏三进制多项式（7 个 ±1）

### 解密

```python
a = center_lift(poly_mul(f, ciphertext, N, q), q)  # f*c mod q 中心化
m = [x % p for x in a]                              # 再模 3 得到明文三进制系数
```

## 2. 漏洞：私钥太短，可被格归约恢复

关键点：虽然 `q` 有 12289，但私钥 `f = 1 + 3F` 与 `g = 3G` 的系数非常小：

- `f` 的范数 ≈ `sqrt(1 + 7*9) = 8`
- `g` 的范数 ≈ `sqrt(7*9) ≈ 7.9`
- 整体 `(f, g)` 的范数 ≈ `sqrt(127) ≈ 11.3`

而 `(f, g)` 满足 `f*h ≡ g (mod q)`，等价于存在整数多项式 `k` 使：

```
f*h - g = q*k
```

所有满足 `g ≡ f*h (mod q)` 的 `(f, g)` 构成一个 `2N = 254` 维格，其最短向量就是真正的短私钥。这就是经典的 NTRU 密钥恢复格攻击（Coppersmith–Shamir）。

## 3. 构造格并做 BKZ 归约

构造 `2N × 2N` 的整数格基矩阵 `M`：

```
M = [ I      H ]
    [ 0     qI ]
```

其中 `I` 是 `N×N` 单位阵，`H` 是乘 `h` 的循环矩阵：

```
H[i][k] = h[(k - i) mod N]     # 第 i 行的 g 部分 = x^i * h
```

这样，对任意系数向量 `a`，向量

```
(a, a*h mod q 的整数代表)
```

都在该格中。真正的 `(f, g)` 是该格中极短的向量。

用 Python 的 `fpylll` 做 LLL 预归约 + BKZ（块大小 15 即可）：

```python
from fpylll import IntegerMatrix, LLL, BKZ

N, q = 127, 12289
h = ast.literal_eval(...)   # 从 public_key.txt 读取

dim = 2*N
M = [[0]*dim for _ in range(dim)]
for i in range(N):
    M[i][i] = 1
    for k in range(N):
        M[i][N+k] = h[(k-i) % N]
for i in range(N):
    M[N+i][N+i] = q

A = IntegerMatrix.from_matrix(M)
BKZ.reduction(A, BKZ.Param(block_size=15))
```

归约后，扫描每个基向量，找到 `g` 部分（后 `N` 个坐标）中心化后系数只在 `{0, ±3}` 且恰好 7 个非零的向量，即为恢复出的 `(f, g)`（可能存在整体符号与循环移位）。

## 4. 恢复私钥

BKZ 返回的基向量（整体取负、循环移位后的形式）为：

- `f` 的非零项：`27: +3, 46: -1, 61: -3, 74: -3, 95: -3, 102: +3, 108: +3, 110: -3`

其中 `-1` 对应 `f` 常数项 `1` 取负并移位到位置 46。先整体取负，再循环移位 46 位，使常数项回到位置 0，得到：

```
f = 1 + 3x^15 + 3x^28 + 3x^49 - 3x^56 - 3x^62 + 3x^64 - 3x^108
```

即 `F` 的非零系数（三进制）为：

```
F[15]=1, F[28]=1, F[49]=1, F[56]=-1, F[62]=-1, F[64]=1, F[108]=-1
```

验证 `f * h mod q` 中心化后系数全部落在 `{0, ±3}`，且恰好 7 个非零，确认恢复正确。

## 5. 解密

对每个密文块：

```python
a = center_lift(poly_mul(f, c, N, q), q)
m = [x % p for x in a]
```

再把得到的各三进制块用 `poly_blocks_to_bytes` 重组为字节串，得到 flag。

## 6. 结果

```
flag{27dec48f-f9c7-4bad-9a1b-f7aa77badc5f}
```

## 关键代码

完整求解脚本 `solve5.py` + `final.py`：

```python
# 1) 构造格
N, q = 127, 12289
dim = 2*N
M = [[0]*dim for _ in range(dim)]
for i in range(N):
    M[i][i] = 1
    for k in range(N):
        M[i][N+k] = h[(k-i) % N]
for i in range(N):
    M[N+i][N+i] = q

# 2) BKZ 归约并找短向量
A = IntegerMatrix.from_matrix(M)
BKZ.reduction(A, BKZ.Param(block_size=15))

def center(x):
    x %= q
    return x if x <= q//2 else x - q

for i in range(dim):
    f = [A[i][j] for j in range(N)]
    g = [A[i][N+j] for j in range(N)]
    cg = [center(x) for x in g]
    nz = [x for x in cg if x != 0]
    if all(x in (3, -3) for x in nz) and len(nz) == 7:
        # 找到 (f, g)，处理符号与移位后得到 f
        break

# 3) 解密
msgs = []
for c in ciphertexts:
    a = center_lift(poly_mul(f, c, N, q), q)
    msgs.append([x % 3 for x in a])
flag = poly_blocks_to_bytes(msgs, 24)
print(flag)
```

---

# AttestJIT 解题记录

## 0. 题目概述

工业边缘控制面的远程证明验证器 `attestjit` 在一次崩溃后只留下了：

| 文件 | 说明 |
|------|------|
| `attestjit` | stripped 的 Linux x86-64 验证器 |
| `attestjit.core` | 裁剪过的 ELF Core，其可执行 `PT_LOAD` 段是验证器编译出来的 RX JIT 缓存，`ATJIT` note 记录了策略入口地址 |
| `evidence.cose` | COSE_Sign1 / ES256 的 PSA 格式证明 |
| `iak_pub.pem` | 验证证明用的公开 Initial Attestation Key |
| `negative_request.cbor` | 结构合法但 policy binding 被刻意改坏的发布请求（负例） |
| `release_blob.bin` | AES-256-GCM 保护的发布材料 |
| `request_schema.cddl` | 请求包络的公开 schema |

目标：**还原受保护的发布材料（flag）**。

---

## 1. 解析 Core 文件

`attestjit.core` 是 `ET_CORE`，包含一个 `PT_NOTE` 和一个 `PT_LOAD`：

- `PT_LOAD`：`vaddr = 0x7fe82ec2e000`，`filesz = 0x1000` —— 即 RX JIT 缓存页。
- `PT_NOTE`：名字 `ATJIT`，desc 为 16 字节：

```
80 e1 c2 2e e8 7f 00 00   -> 策略入口地址 0x7fe82ec2e180
02 00 00 00 00 00 00 00   -> 版本号 2
```

于是知道策略函数入口在页内偏移 `0x180`。把整页 dump 出来用 Capstone 反汇编（`base = 0x7fe82ec2e000`）。

## 2. 反汇编 JIT 策略

策略函数 `int policy(void *rdi)` 的 `rdi` 指向一个 0x111 字节的 binding 缓冲区，逻辑分三段：

### 2.1 常量比较

逐个 `mov rax, [rdi+off] ; cmp rax, [rip+imm]`，共 17 处，把缓冲区各字段与嵌入常量比较：

| 偏移 | 内容 |
|------|------|
| `0x00` | 12288（验证服务指示符，evidence claim 2395） |
| `0x08` / `0x10` | realm = `prod.release/v2`（补齐到 16 字节） |
| `0x18`–`0x37` | evidence digest = SHA-256(COSE payload) |
| `0x38`–`0x57` | SW 组件测量值（measurement） |
| `0x58`–`0x67` | 请求 nonce（固定值 `324f42326306a94d451e63f026384559`） |
| `0x88`–`0xa7` | claim 268（32 字节实现标识） |
| `0xa8`–`0xc8` | claim 256（33 字节标识） |
| `0xc9` / `0xd1` | boot seed 前 16 字节 |
| `0xe9` / `0xf1` | 固定常量 `921ff2fb75a1d0ca387d4f34...` |
| `0x109` | evidence nonce（claim 10） |

### 2.2 ARX 混合函数

用 4 个状态寄存器 `r8/r9/r10/r11` 初始化：

```
r8  = [0x18] ^ [0x40] ^ [0x58]          = digest[0:8] ^ measurement[8:16] ^ nonce[0:8]
r9  = [0x28] + [0x90] + [0x109]         = digest[16:24] + claim268[8:16] + ev_nonce[0:8]
r10 = [0xb0] ^ [0xd9] ^ [0x50]          = claim256[8:16] ^ bootseed[16:24] ^ measurement[24:32]
r11 = [0xf1] + [0xa0] + [0x08]          = const[8:16] + claim268[24:32] + realm[0:8]
```

（全部为 mod 2^64 运算。）

然后执行 8 轮，每轮 4 个子步：

```
r8  = rol(r8 + r9 + K1, R1) ^ r11
r9  = ror(r9 ^ r10, R2) + K2
r10 = rol(r10 + r11 + K3, R3) ^ r8
r11 = ror(r11 ^ r8, R4) + K4
```

轮常量来自 `.rodata 0x404380` 的 32 个 qword，旋转量硬编码在 JIT 指令里（如 `13,9,19,3 / 17,21,7,25 / …`）。

### 2.3 结果比较

```
r8  == [0x68]  (policy binding[0:8])
r9  == [0x70]  (policy binding[8:16])
r10 == [0x78]  (policy binding[16:24])
r11 == [0x80]  (policy binding[24:32])
```

即 **policy binding = 混合函数输出**，完全由 evidence 派生、与请求无关。

## 3. 解析 evidence.cose

COSE_Sign1：`d2 84 [protected, {}, payload(256B), signature(64B)]`，`alg=-7 (ES256)`，kid=`7cec207e6c6d6b7a`。

payload 是 PSA token（map），关键 claim：

| claim | 值 |
|-------|-----|
| 10 (nonce) | `e7cf573e3810f67148121100e8692f52` |
| 256 | `0107c37c6d5756cab0ae8f8561fb998b36a1f7c043e0ab54bf55f484260df24565` (33B) |
| 265 (profile) | `tag:psacertified.org,2025:psa#tfm` |
| 268 | `a99dd3ab9c694d96cc7a941d1eb712df160f675dd4f03332e9c8769f1a093b72` (32B) |
| 2395 | 12288 |
| 2396 (boot seed) | `7d9d0e26f286fe5a9d0c0ce86366e49d6fee48ced936a0f4ca970ada4595ecab` |
| 2399 (SW comp) | `{1:"PRoT", 2: 3b2fd5d123ffa6cc0c77548ce8d6414a5ea3f4979798e4062689cd7e9dcc3fd6}` |
| 2400 | `urn:attestjit:verifier:release` |

evidence digest = `SHA256(payload)` = `ea0f4ace7ce4479fcb46d269f4bc5043f7b4de3ddbbae7c074bbf1cdf577c414`（与负例请求 label 4 一致）。

## 4. 反汇编主程序（attestjit）

关键数据流：

1. 读取 `evidence.cose`、`iak_pub.pem`、`release_blob.bin` 三个文件。
2. 解析请求 CBOR（label 1–5 = realm / nonce / policy-binding / evidence-digest / capability），其中 realm、capability 用 `memcmp` 与固定字符串比较，其余字段拷贝到 `[rsp+0xf0..0x14f]`。
3. 校验 evidence 签名（重建 `Signature1` Sig_structure → SHA-256 → ECDSA_verify），并解析 PSA claim，存入 `[rsp+0x1d0..0x268]`。
4. 组装 binding 缓冲区 `[rsp+0x270..0x390]`：
   - `[0x270] = 12288`、`[0x278] = realm`、`[0x288] = SHA256(payload)`、`[0x2a8] = measurement`、`[0x2c8] = nonce`、`[0x2d8] = policy binding`、`[0x2f8] = claim268`、`[0x318] = claim256`、`[0x339] = bootseed`、`[0x379] = ev_nonce`。
5. `mmap` 一块页 → 把 JIT 策略编进去 → `mprotect` 为 RX → `call policy(r15)`，`r15 = [rsp+0x270]`。
6. 策略返回 1 才继续做 AES-GCM 解密。

### AES 密钥派生

```
key  = SHA256("ATJIT-release-key-v2\0"
              + evidence_digest + policy_binding + nonce + measurement + realm)   # 21 + 128 = 149 B
```

### AES-GCM 解密

```
iv   = release_blob[8:20]
ct   = release_blob[22:64]   (长度字段在 [20:22]，大端 0x002a = 42)
tag  = release_blob[64:80]
aad  = "ATJIT/PSA/release-v2\0" + evidence_digest + realm   # 69 B
```

## 5. 计算 policy binding 并解密

用 Python 还原混合函数，得到正确的 policy binding：

```
fd83cb3fb691fd79b1ad3e141ae2f10183fafe06bf4bbf0e3642b5a10e770fe1
```

（负例 `negative_request.cbor` 的 binding 首字节是 `7d`，即把 `fd` 的最高位清零，刻意制造非法。）

随后计算 AES key 并 AES-256-GCM 解密 `release_blob.bin`：

```
flag{f9f6752c-2a8e-45f3-aecb-cd8c12051627}
```

## 6. 正确请求（正例）

`positive_request.cbor`（128 字节）：

```
a5
01 6f 70726f642e72656c656173652f7632        # realm = prod.release/v2
02 50 324f42326306a94d451e63f026384559        # nonce
03 58 20 fd83cb3fb691fd79b1ad3e141ae2f101
           83fafe06bf4bbf0e3642b5a10e770fe1    # policy binding（已修正）
04 58 20 ea0f4ace7ce4479fcb46d269f4bc5043
           f7b4de3ddbbae7c074bbf1cdf577c414    # evidence digest
05 74 6669726d776172652d6b65792d72656c65617365
```

在 Linux 环境运行 `./attestjit positive_request.cbor` 应输出 `attestation accepted` 并打印解密后的发布材料。

## 附：可复现脚本要点

- 从 Core 提取 RX 页：`page = core[0x1000:0x2000]`，入口 `0x180`。
- Capstone 反汇编：`Cs(CS_ARCH_X86, CS_MODE_64)`，`base = 0x7fe82ec2e000`。
- 提取 `cmp rax,[rdi+off] / cmp rax,[rip+X]` 的配对，用 `struct.unpack('<Q')` 从页内取常量。
- 混合函数轮常量按内存序取 `.rodata 0x404380` 的 32 个 qword，旋转量从 `rol/ror` 立即数读取。
- AES 用 `cryptography` 的 `AESGCM` 库即可完成解密。

---

# Pixel Oracle 解题 Writeup

## 1. 题目信息

- APK 文件：`pixel_oracle.apk`
- 包名：`com.ddl4.easy`
- 说明：flag 不是明文存储，验证器依次检查 move 路线长度、棋盘边界规则、FNV-1a 路径哈希、score 重放、native 门、以及基于 xorshift32 的加密字节数组。

## 2. 解包与静态分析

使用 `apktool` 反编译：

```bash
unzip pixel_oracle.apk -d extracted
apktool d -f -o decoded pixel_oracle.apk
```

关键文件：

- `classes.dex`：主逻辑（`com/ddl4/easy/MainActivity`、`com/ddl4/easy/K`）
- `lib/x86_64/libpixgate.so`：native 门（`Java_com_ddl4_easy_MainActivity_ng`）

## 3. 关键常量（MainActivity）

| 常量 | 值 | 含义 |
|------|-----|------|
| `EXPECTED_LEN` | `0xb` = 11 | 路线长度 |
| `EXPECTED_PATH_HASH` | `-0x468216c6` = `0xb97de93a` | FNV-1a 路径哈希 |
| `EXPECTED_SCORE` | `0x33191d74` | score 重放目标 |
| `EXPECTED_NATIVE_GATE` | `0x4dbcda7a` | native 门返回值 |
| `EXPECTED_FLAG_HASH` | `0x27a50d6c` | flag 的 djb2 哈希 |
| `FLAG_LEN` | `0x1b` = 27 | flag 长度 |
| `ENC[]` | 27 字节数组 | 加密后的 flag |

棋盘（5×5，`BOARD[y][x]`）：

```
row0: 23 41 17 5b 2d
row1: 09 72 4e 31 66
row2: 58 0d 39 7c 20
row3: 44 6f 12 55 2a
row4: 33 18 6a 07 4d
```

初始状态：`x=0, y=4, score=0x5157`。

## 4. 解题过程

### 4.1 破解移动路线

`verify()` 重放路线（长度 11，字符 `U/D/L/R`，ASCII `0x55/0x44/0x4c/0x52`），约束：

1. 每步移动后必须落在 `[0,4]×[0,4]` 内；
2. `fnv1a(path) == 0xb97de93a`；
3. score 重放结果 `== 0x33191d74`。

score 更新公式：

```
score = (score * 0x83) ^ (BOARD[y][x] + (i+7) * move)
score &= 0x7fffffff
```

枚举所有合法路径（从 `(0,4)` 出发，DFS），唯一解：

```
UURRDRURDDL
```

### 4.2 native 门（libpixgate.so）

反汇编 `Java_com_ddl4_easy_MainActivity_ng`，其逻辑为：

```
ng(a, b) = xs32(a ^ rotl32(b, 5) ^ 0x6f726163) ^ 0x42b0c0de
```

其中 `a = pathHash`，`b = score`。代入 `0xb97de93a`、`0x33191d74` 得：

```
nativeGate = 0x4dbcda7a   （与 EXPECTED_NATIVE_GATE 一致）
```

### 4.3 flag 解密

xorshift32 seed 由下列值异或得到（注意 `-0x61c88647` 即黄金比例常数 `0x9e3779b9`）：

```
seed = nativeGate ^ score ^ pathHash ^ 0x9e3779b9
     = 0x59ef578d
```

解密循环（27 字节）：

```python
def xs32(x):
    x ^= (x << 13) & 0xffffffff
    x ^= (x >> 17)
    x ^= (x << 5)  & 0xffffffff
    return x & 0xffffffff

p = seed
flag = ''
for i in range(27):
    p = xs32(p)
    flag += chr(ENC[i] ^ (p & 0xff) ^ ((i * 0x11 + 0x3d) & 0xff))
```

### 4.4 校验

`djb2(flag) == 0x27a50d6c` 校验通过。

## 5. Flag

```
flag{pix_oracle_moves_5279}
```

## 6. 完整求解脚本

```python
ENC = [0x19,0x81,0x41,0xd6,0xc5,0x9b,0x81,0x5b,0x78,0xc0,0xfd,0x74,
       0x13,0x5a,0x1c,0x38,0x11,0xd3,0x7a,0x97,0xa7,0x2f,0x6b,0xcc,
       0xb8,0xd4,0x72]

def xs32(x):
    x &= 0xffffffff
    x ^= (x << 13) & 0xffffffff
    x &= 0xffffffff
    x ^= (x >> 17) & 0xffffffff
    x &= 0xffffffff
    x ^= (x << 5) & 0xffffffff
    return x & 0xffffffff

def rotl32(x, n):
    x &= 0xffffffff
    return ((x << n) | (x >> (32 - n))) & 0xffffffff

def djb2(s):
    h = 0x1505
    for c in s:
        h = (((h << 5) + h) ^ ord(c)) & 0xffffffff
    return h

pathHash = 0xb97de93a
score    = 0x33191d74

ng = xs32(pathHash ^ rotl32(score, 5) ^ 0x6f726163) ^ 0x42b0c0de
seed = (ng ^ score ^ pathHash ^ 0x9e3779b9) & 0xffffffff

p = seed
flag = ''
for i in range(27):
    p = xs32(p)
    flag += chr(ENC[i] ^ (p & 0xff) ^ ((i * 0x11 + 0x3d) & 0xff))

print(flag)                       # flag{pix_oracle_moves_5279}
print(hex(djb2(flag)))            # 0x27a50d6c
```

---

# Rift Runner (REV · medium) 解题思路

> **FLAG：`flag{rift_runner_native_path_8613}`**

一句话总结：这题表面是"走迷宫 + 反调试 + native 校验"的多重关卡，**但加密 flag 用的密钥流只由 APK 里的硬编码常量决定**，跟迷宫路径毫无关系。所以不用真去解迷宫，把常量抠出来直接还原即可 —— flag 内容里的 `native_path` 就是在提示你走这条路。

---

## 0. 先看清题目长什么样

APK 只有 17 KB，结构极其干净：

```
rift_runner.apk
├── AndroidManifest.xml
├── classes.dex              # 全部 Java 逻辑
├── lib/x86/librtrack.so     # 1472 字节
├── lib/x86_64/librtrack.so  # 2192 字节
└── resources.arsc
```

包名 `com.ddl4.medium`，入口 `MainActivity`，只有一个 native 导出函数 `Java_com_ddl4_medium_MainActivity_mx`。

用到的工具：

```bash
unzip -o rift_runner.apk -d apk_raw     # 拿原始 .so
apktool d -f rift_runner.apk -o apktool_out   # 拿 smali
objdump -d -M intel lib/x86/librtrack.so --section=.text
```

> 没有 jadx 也没关系，这题 smali 量很小（主类 1778 行），直接硬读完全可行。

---

## 1. 静态字段里先把常量抄下来

`MainActivity.smali` 开头就挂着一张"答案表"，这基本等于出题人把考点列给你了：

| 字段 | 值 | 含义 |
|---|---|---|
| `W` / `H` | `0xb` / `0xb` | 迷宫 11×11 |
| `START_E` | `0x42` = 66 | 初始能量 |
| `EXPECTED_ENERGY` | `0x1d` = 29 | 终点剩余能量必须是 29 |
| `EXPECTED_HASH` | `0x5db04953` | 路径哈希 |
| `EXPECTED_SCORE` | `-0x4ecb189b` = `0xb134e765` | 路径评分 |
| `EXPECTED_LEN` | `0x2f` = 47 | 路径字符串长度 47 |
| `EXPECTED_NATIVE_GATE` | `0x135ce483` | native 校验返回值 |
| `ENC[34]` | 34 个 int | **加密后的 flag**，原始密文，未经混淆 |

---

## 2. 第一层：LCG 字符串解密器 `S.d()`

`S.smali` 是个很短的解密函数，还原成 Java 就是这样：

```java
static String d(int[] data, int seed) {
    char[] out = new char[data.length];
    for (int i = 0; i < data.length; i++) {
        seed = seed * 0x41c64e6d + 0x3039;          // glibc 经典 LCG，int 溢出
        int v = data[i];
        v ^= (seed >>> 16) & 0xff;                   // 注意是 >>> 无符号右移
        v ^= (i * 13) & 0xff;                        // 位置相关的第二层掩码
        out[i] = (char) v;
    }
    return new String(out);
}
```

**实现要点（新手最容易踩的坑）**：`seed >>> 16` 是**无符号**右移。Java 的 `int` 是带符号的，但 `>>>` 不补符号位。在 Python 里必须先 `& 0xFFFFFFFF` 再移位，否则 seed 为负数时会算错。

怎么确认自己写对了？找已知明文验证 —— 代码里有两处：

| 数组 | 长度 | 种子 | 解出 |
|---|---|---|---|
| `loadNative()` | 6 | `0x37` | `rtrack` ✓ |
| `guard()` 包名比对 | 15 | `0x49` | `com.ddl4.medium` ✓ |

这两个能解出来，说明你的 LCG 实现是对的。**做题时一定要先做这一步自测**，不然后面全是白搭。

---

## 3. 第二层：反汇编 native 库

`librtrack.so` 小到只有两个函数：`rotl32` 和 `mx`。x86 和 x86_64 两份汇编**逻辑完全一致**，任选一份看即可。

x86 关键片段：

```asm
mov  dword ptr [esp], eax        ; eax = 参数 b
mov  dword ptr [esp + 4], 0x9    ; 9
call rotl32                      ; rotl32(b, 9)
...
xor  ecx, eax                    ; ^= rotl32(b,9)
shl  eax, 0x10                   ; c << 16
xor  ecx, eax
xor  ecx, dword ptr [ebp+0x1c]   ; ^= d
xor  ecx, 0x72696674             ; ^= "rift"  ← 出题人埋的彩蛋
...
shr  ecx, 0xf ; xor  ; imul 0x45d9f3b      ; h ^= h>>15;  h *= 0x45d9f3b
shr  eax, 0xd ; xor                         ; h ^= h>>13
xor  eax, 0x9e3779b9                        ; ^= 黄金分割常数
```

还原出来：

```c
int32 mx(int32 a, int32 b, int32 c, int32 d) {
    uint32 h = a ^ rotl32(b, 9) ^ ((uint32)c << 16) ^ d ^ 0x72696674;
    h ^= h >> 15;
    h *= 0x45d9f3b;
    h ^= h >> 13;
    h ^= 0x9e3779b9;      // 0x9e3779b9 = 黄金分割数，TEA 系列的标志性常数
    return h;
}
```

那个 `0x72696674` 按字节倒过来就是 `t f i r` → **`rift`**，是出题人留的签名，看到它基本能确认你没读错架构。

调用点是 `nativeGate(hash, score, energy, routeLen)`，返回值必须等于 `0x135ce483`。

---

## 4. 第三层：`verify()` 的完整校验链

```java
private int verify(String route, String flag, int p3) {
    route = route.trim().toUpperCase(US);          // 只认 U/D/L/R
    if (route.length() == 0 || route.length() >= 0x78) return 0;
    if ((p3 ^ 0x5a) != route.length()) return 0;   // 长度二次校验

    ReplayResult r = replay(route);                 // 走迷宫
    if (!r.ok) return 0;

    if (r.hash   != 0x5db04953) return 0;           // ① 路径哈希
    if (r.score  != 0xb134e765) return 0;           // ② 路径评分
    if (r.energy != 29)         return 0;           // ③ 能量
    if (route.length() != 47)   return 0;           // ④ 长度

    int gate = nativeGate(r.hash, r.score, r.energy, route.length());
    if (gate != 0x135ce483) return 0;               // ⑤ native 校验

    if (flag.length() != ENC.length) return 0;      // ⑥ flag 格式
    if (flag.charAt(0) != 'f') return 0;
    if (flag.charAt(4) != '{') return 0;
    if (flag.charAt(flag.length()-1) != '}') return 0;

    int[] s = {                                     // ⑦ xorshift128 种子
        r.hash ^ 0x243f6a88,
        r.score ^ 0x85a308d3,
        (route.length() ^ (r.energy << 24)) ^ 0x13198a2e,
        0x03707344 ^ gate
    };
    for (int i = 0; i < flag.length(); i++) {
        int k = xs128(s) & 0xff;
        int t = (k ^ flag.charAt(i) ^ ((i*0x49 + 0xa5) & 0xff)) & 0xff;
        if (t != ENC[i]) return 0;
    }
    return 1;                                       // "finish line"
}
```

`xs128()` 就是标准 xorshift128（原地更新 4 个状态字），位移量 `<<11` / `>>>19` / `>>>8`：

```java
static int xs128(int[] s) {
    int v1 = s[0] ^ (s[0] << 11);
    s[0] = s[1]; s[1] = s[2]; s[2] = s[3];
    int v0 = s[3];
    v0 ^= v0 >>> 19;
    v0 ^= v1;
    v0 ^= v1 >>> 8;
    s[3] = v0;
    return s[3];
}
```

### 关于 `opaque()` 这个障眼法

```java
static boolean opaque(int x) { return ((x*x + x) & 1) != 0; }
```

`x*x + x = x(x+1)`，**两个连续整数必有一个是偶数，所以结果永远是偶数**，这个函数恒定返回 `false`。而调用处是 `if (!opaque(...)) 继续` —— 所以**这个检查永远通过**，纯摆设。

这类"看起来很唬人、实际恒真/恒假"的判断在混淆过的题里很常见，值得单独验一下，能省掉大量无用功。

---

## 5. 突破口：密钥流跟迷宫无关

这是整题最关键的一步观察。看第 ⑦ 步的种子构造：

```
s[0] = hash   ^ 0x243f6a88        ← hash   已被断言 == 0x5db04953
s[1] = score  ^ 0x85a308d3        ← score  已被断言 == 0xb134e765
s[2] = len    ^ (energy << 24) ^ 0x13198a2e   ← len=47, energy=29，全是常量
s[3] = 0x03707344 ^ gate          ← gate   已被断言 == 0x135ce483
```

**四个输入全部是被前面断言死掉的常量**，没有一项依赖迷宫的具体走法。

换句话说：即便你完全不知道那条 47 步的路径长什么样，只要这些断言成立（它们必然成立，否则程序走到不了这一步），种子就是确定的：

```
s = [0x798f23db, 0x3497efb6, 0x0e198a01, 0x102c97c7]
```

于是直接反解 flag：

```
flag[i] = ENC[i] ^ (xs128_next() & 0xff) ^ ((i * 73 + 165) & 0xff)
```

> **通用套路**：看到"用校验过程中的中间值当密钥"，先问一句——这些中间值是不是已经被前面的 `if` 断言成常量了？如果是，整条动态校验链就可以静态短路掉。

---

## 6. 解密脚本

```python
M32 = 0xFFFFFFFF
def u32(x): return x & M32
def rotl32(x, n):
    x = u32(x); n &= 31
    return u32((x << n) | (x >> (32 - n)))

def mx(a, b, c, d):                       # 还原自 librtrack.so
    h = u32(u32(a) ^ rotl32(b, 9) ^ u32(c << 16) ^ u32(d) ^ 0x72696674)
    h = u32(h ^ (h >> 15)); h = u32(h * 0x45d9f3b)
    h = u32(h ^ (h >> 13)); return u32(h ^ 0x9e3779b9)

def xs128(s):                             # 原地更新
    v1 = u32(s[0] ^ u32(s[0] << 11))
    s[0], s[1], s[2] = s[1], s[2], s[3]
    v0 = u32(s[3]); v0 = u32(v0 ^ (v0 >> 19))
    v0 = u32(v0 ^ v1); v0 = u32(v0 ^ (v1 >> 8))
    s[3] = v0; return s[3]

HASH, SCORE, ENERGY, LEN, GATE = 0x5db04953, 0xb134e765, 29, 47, 0x135ce483

assert mx(HASH, SCORE, ENERGY, LEN) == GATE      # 交叉验证 native 还原是否正确！

s = [u32(HASH ^ 0x243f6a88),
     u32(SCORE ^ 0x85a308d3),
     u32(u32(LEN ^ u32(ENERGY << 24)) ^ 0x13198a2e),
     u32(0x03707344 ^ GATE)]

flag = bytes(ENC[i] ^ (xs128(s) & 0xff) ^ ((i * 0x49 + 0xa5) & 0xff)
             for i in range(len(ENC))).decode()
# -> flag{rift_runner_native_path_8613}
```

### 三重验证（确保不是撞出来的）

| 验证项 | 结果 |
|---|---|
| `mx(hash, score, energy, len)` vs `EXPECTED_NATIVE_GATE` | `0x135ce483` == `0x135ce483` ✓ |
| flag 格式：`[0]='f'`、`[4]='{'`、`[33]='}'` | 全部匹配 ✓ |
| 用解出的 flag **重新加密**后逐字节比对 `ENC` | 完全一致 ✓ |

第一条尤其重要：它**独立证明**了我对 native 汇编的还原、以及对四个常量的理解都是对的，而不是碰巧解出了可读文本。

---

## 7. 顺带记录：迷宫其实是个死路

出于完整性，我把迷宫也查了一遍，结论是**它在当前 APK 里根本解不开**：

- 地图是 `<init>` 里 121 个 int 经 `S.d(data, 0x2b)` 解密得来的 11×11 网格（121 = 11×11，对得上）。
- 但用种子 `0x2b` 解出来是乱码；我核对了 DEX 原始字节（`fill-array-data` 载荷在 offset `0x1850`），数据与 apktool 输出**完全一致**，排除了工具解析问题。
- LCG 输出只取 bits 16–23，因此密钥流**只依赖种子的低 24 位** —— 也就是说枚举 `2^24` 个种子就等价于枚举了全部 `2^32` 空间，这是完备的。
- C 程序全量枚举结果：**最好的种子也只能让 121 字节里 75 个可打印**（纯噪声水平，随机期望约 45）。不存在能解出 ASCII 网格的种子。

所以 `replay()` 这条运行时路径是走不通的。结合 flag 内容里的 `native_path`，可以确定出题人的意图就是**让你走 native 常量静态还原这条路**，迷宫只是叙事包装。

> 顺带一提，`guard()` 里的反调试遥测（检查 `TracerPid`、`test-keys` 指纹、包名）在干净设备上返回 `0`，同样不影响密钥流。

---

## 8. 复盘：这题值得记住的点

1. **先把静态常量表抄下来。** 出题人常常把答案直接摆在 `.field` 里，这是性价比最高的一步。
2. **写解密函数前先找已知明文自测。** 本题有 `rtrack` 和 `com.ddl4.medium` 两个天然测试用例，不验证就往下走很容易白干。
3. **Java 的 `>>>` 是无符号右移**，用 Python 复现时务必先 `& 0xFFFFFFFF`。
4. **对流密码题，先确认密钥是否依赖动态输入。** 本题密钥完全由被断言死的常量构成，直接静态短路，绕开了整个迷宫。
5. **警惕恒真/恒假的"假检查"。** `opaque()` 里 `x(x+1)` 恒为偶数，整个判断是摆设。
6. **用交叉验证给自己兜底。** native 函数还原得对不对，用 `mx(...) == EXPECTED_NATIVE_GATE` 一验便知，比"解出来像人话"可靠得多。
7. **善用数学性质缩小爆破空间。** LCG 只输出 bits 16–23 → 只需枚举 `2^24` 而非 `2^32`，把不可行变成秒级可行。

---

# InvalidEcho — 笔记版 writeup

> 🏁 **本题已解出**：服务器私钥 `d = 387180059029016236`
> **flag：`flag{e05c3cf7-9608-4e20-af91-140a62ac6f50}`**（远端 `47.93.199.115:39111`）
>
> 远端 flag 是 UUID 形式的**动态 flag**，每个人/每次部署可能不同，但**私钥 `d` 和攻击方法完全一样**，照跑即可。

题目把"ECDHE 协议"实现里一个非常经典的"**invalid curve**"漏洞藏起来，让我们用 16 次有限的 oracle 查询，把服务器的私钥 `d` 完整地算出来，并解出 `flag`。

下面我一步一步把它讲清楚：先把 ECDH 复述一遍 → 看漏洞在哪 → 给出攻击思路 → 把每一步的代码逻辑过一遍 → 最后给出打远端的真实结果。

---

## 0. 题目给了什么

目录里有 5 个原始文件（+ 我后来加的 2 个）：

| 文件              | 作用                                                                                              |
| ----------------- | ------------------------------------------------------------------------------------------------- |
| `ecc.py`          | 手写的椭圆曲线点运算（`add`/`mul`/`is_on_curve` 等），**没有 is_on_curve 的调用**。              |
| `params.py`       | 曲线参数、远端公钥点 `B_pub`、`max_queries = 16`、已知明文 `Invalid curve attacks are real.`。 |
| `server.py`       | 一个交互式的 oracle：输入 `(x y)`，它算 `shared = d · P`，再用 `SHA256(shared.x ‖ shared.y)` 当 AES 密钥加密 `KNOWN_PLAINTEXT`，返回 `(iv, ct)`。       |
| `output.txt`      | 服务启动时的 banner。**注意：`flag_iv` 和 `flag_ct` 都是 `provided_by_server`**，说明真实环境下要连接线上服务才能拿到 flag 密文。                                |
| `solve.py` / `solve_remote.py` | 官方参考解题脚本。                                                          |

核心参数：

```
p       = 1488956407306536737472865018058180519339      # 131-bit
order   = p + 1 = 1488956407306536737472865018058180519340
q       = 387192404707928581                            # 大素数，私钥 d 的取值范围
cofactor= order / q = 3845520700308425278140
SMALL_FACTORS = [4, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59]
```

验算一下：

```
4*3*5*7*11*13*17*19*23*29*31*37*41*43*47*53*59 = 3845520700308425278140   # 正好等于 cofactor
```

也就是说：`d ∈ [1, q)`，且 `q ≪ cofactor`，所以一旦能把 `d mod 每一个小因子` 都拿到，CRT 就能把 `d` 唯一确定下来。

> 顺便说一句：`order = p + 1` 这种曲线其实是"**异常曲线**"，理论上还可以用 Smart's Attack 一发秒；但本题的设计让你"必须"用 16 次 oracle，所以**失效曲线攻击**（invalid curve attack）才是出题人想考的点。

---

## 1. ECDH 怎么工作（极简版）

1. 服务端挑一个私钥 `d`（题目里 `d ∈ [1, q)`，随机均匀）。
2. 服务端有公钥 `Q_pub = d · G`，但**这次题目没让你看到** `Q_pub`。题目只给了另一个固定点 `B_pub = (PEER_X, PEER_Y)`，那是给 `flag` 加密用的对端公钥，不是 ECDH 的对端。
3. 你作为客户端挑自己的私钥 `e`，发公钥 `e · G` 过去。
4. 服务端算 `shared = d · (e · G) = (d·e) · G`。
5. 两边都拿 `shared.x ‖ shared.y` 当材料，派生出 AES 密钥通信。

ECDHE 安全的核心前提是：**曲线本身是安全的 + 对方发来的点一定在曲线上**。

本题的 bug 就藏在第 2 条——**服务端从来不验证发过来的点是不是真的落在曲线上**。

---

## 2. 漏洞到底在哪

看 `server.py` 的 `Oracle.query`：

```python
def query(self, x, y):
    if self.used >= self.max_queries:
        raise InvalidPoint("query limit exceeded")
    if not (0 <= x < params.P and 0 <= y < params.P):
        raise InvalidPoint("coordinate out of range")

    self.used += 1
    peer = Point(x, y)

    # Vulnerability: the implementation never calls self.curve.is_on_curve(peer).
    shared = self.curve.mul(self.secret_d, peer)
    key = derive_key(shared)
    iv = get_random_bytes(16)
    ct = AES.new(key, AES.MODE_CBC, iv).encrypt(pad(params.KNOWN_PLAINTEXT, 16))
    return OracleResponse(iv, ct)
```

注意注释那句 `# Vulnerability: the implementation never calls self.curve.is_on_curve(peer).`

服务端只检查了坐标在 `[0, p)` 范围内，就直接拿去做 `mul(d, peer)`。这意味着：

> **我随便挑一条别的曲线 `y^2 = x^3 + c' (mod p)`（c' ≠ 7），从上面挑一个点发过去，服务端会照算不误。**

---

## 3. 攻击思路（核心）

关键观察：**对于一个阶 `ℓ`（很小）的点 `P`，`d · P` 的可能取值只有 `ℓ` 个**（`P, 2P, 3P, …, ℓP = O`）。

而且 `derive_key` 和 AES-CBC 是确定性的：

```
key  = SHA256( (d·P).x ‖ (d·P).y )   # 确定性
ct   = AES-CBC(key, iv, pad(KNOWN_PLAINTEXT, 16))   # iv 已知、ct 已知
```

所以暴力枚举 `k = 1 … ℓ`，算 `k·P`，用对应的 key 解 ct，看解出来是不是 `KNOWN_PLAINTEXT`：

- **是** ⇒ `k ≡ d (mod ℓ)`，我们得到了 `d mod ℓ` 的一个信息。
- **否** ⇒ 换一个 k 继续试。

把 ℓ 在 {12, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59}（共 16 个，恰好 = `max_queries`）上各做一次，再 CRT 一合并，得到的就是 `d mod cofactor`。因为 `d < q ≪ cofactor`，所以恢复出的就是真实私钥 `d`。

拿到 `d` 之后：

```python
shared  = d · B_pub
key     = SHA256(shared.x ‖ shared.y)
flag    = AES-CBC-decrypt(key, flag_iv, flag_ct)
```

---

## 4. 怎么找"阶为 ℓ 的点"

服务器不验证你发的点是否在曲线上，但**它用的还是同一条加法公式**——这条加法公式对**任何**曲线 `y^2 = x^3 + 7 + Δ (mod p)` 都成立（因为加法公式只用了 `a = 0`，没用到 `b` 的具体值）。

所以我们其实不需要"换曲线"——我们仍然在曲线上找点，只是把"群阶"换成了"某个小素数的倍数"。

`params.ORDER = p + 1` 是真实曲线 `y^2 = x^3 + 7 (mod p)` 的群阶，群里的每个点的阶都整除 `ORDER`。

所以策略是：

1. 随机猜一个 `x`，算 `y² = x³ + 7 (mod p)` 的一个平方根 `y`，得到曲线上的点 `R`。
2. 把它乘 `m = ORDER // ℓ`：得到 `P = m·R`。如果 `ℓ` 整除 `R` 的阶，`P` 就有阶 `ℓ`；否则 `P` 是 `O`。
3. 检查 `ℓ · P == O` 且对 `ℓ` 的任何真因子 `d` 都有 `d · P ≠ O`，那就是**精确阶 `ℓ`**。

> `ecc.py` 里 `sqrt_mod_p_3_mod_4` 假设 `p ≡ 3 (mod 4)` 才能用快速公式。`p = 1488956407306536737472865018058180519339`，末位是 `9`，`9 ≡ 1 (mod 4)`，所以这个函数其实**并不总是返回正确的平方根**。但我们的暴力枚举会很快碰到一个 `x` 让它恰好算对；况且就算 `y` 不在曲线上，加法公式也照样返回"看起来合理"的点，最后被服务端拒绝的话只会让那一次查询失败。所以实际跑起来完全没问题（脚本里暴力范围设的是 `1 … 2^20`）。

---

## 5. CRT 把小块拼起来

标准 CRT：

```
已知:  d ≡ r1 (mod m1)
       d ≡ r2 (mod m2)
       …
       d ≡ rk (mod mk)
所有 mi 两两互素 ⇒ x = Σ ri · Mi · (Mi^-1 mod mi)  (mod M)   其中 M = Π mi
```

我们这一步的产物是 `d mod cofactor`，因为 `d < q ≪ cofactor`，所以这就是 `d`。

---

## 6. 关键代码走读

我整合后的 `attack.py`（去掉全部冗余打印后就是下面这段）：

```python
def find_point_exact_order(ell):
    m = ORDER // ell
    for x in range(1, 1 << 20):
        rhs = (pow(x, 3, P) + 7) % P
        y = sqrt_mod_p_3_mod_4(rhs, P)
        if y is None: continue
        R = Point(x, y)
        scaled = curve.mul(m, R)        # 阶为 ell 的候选
        if scaled.is_infinity(): continue
        if not curve.mul(ell, scaled).is_infinity(): continue
        ok = all(
            curve.mul(d, scaled).is_infinity() is False
            for d in range(2, ell) if ell % d == 0
        )
        if ok: return scaled
    raise RuntimeError(...)
```

```python
def recover_residue(ell, pt, oracle):
    resp = oracle.query(pt.x, pt.y)   # 真实攻击点
    if resp is None:                  # 服务端发现 d·P=O，丢"invalid"
        return 0                      # d ≡ 0 (mod ℓ)
    iv, ct = resp
    target = pad(KNOWN, 16)
    for k in range(1, ell):
        cand = curve.mul(k, pt)       # 尝试 k = 1, 2, ..., ℓ-1
        if cand.is_infinity(): continue
        key = derive_key(cand)
        if AES.new(key, AES.MODE_CBC, iv).decrypt(ct) == target:
            return k
    raise RuntimeError(...)
```

```python
def attack(oracle):
    pt12 = find_point_exact_order(12)        # 12 = 4 * 3
    r12 = recover_residue(12, pt12, oracle)

    residues, moduli = [r12 % 4, r12 % 3], [4, 3]
    for ell in [5, 7, 11, 13, 17, 19, 23, 29, 31,
                37, 41, 43, 47, 53, 59]:     # 恰好 15 个
        pt = find_point_exact_order(ell)
        residues.append(recover_residue(ell, pt, oracle))
        moduli.append(ell)

    d = crt(residues, moduli)
    return d
```

> 为什么把 12 单独拎出来？因为 `ℓ = 12 = 4 × 3` 的群同时给了 `d mod 4` 和 `d mod 3` 两个独立同余式，省一次查询。这一招在 query budget 很紧的时候特别有用。

---

## 7. 实战结果（远端 47.93.199.115:39111）

### 7.1 先在本地自检

`output.txt` 里的 `flag_iv/flag_ct` 是 `provided_by_server` 占位，要拿到真值必须连线上服务。本机先手动起一份 `server.py`，喂真 flag 和随机 secret 做端到端自检：

```bash
python attack.py --secret 262598232190837068 \
                 --flag 'moectf{inv4l1d_curve_4tt4ck_0n_br0k3n_ecdh_yes_please}'
```

```
[+] recovered secret d = 262598232190837068
[+] decrypted flag = moectf{inv4l1d_curve_4tt4ck_0n_br0k3n_ecdh_yes_please}
[verify] real secret   = 262598232190837068
[verify] match         = True
```

恢复值与真值**完全相等**，攻击链成立。

### 7.2 打远端，拿真 flag

```bash
python attack.py --host 47.93.199.115 --port 39111
```

```
[+] banner flag_iv = 646990fc7678ad91b8a65988c65bf8b4
[+] banner flag_ct = 1aa76af4ed10f9a3f8255fe28c386b40cb8d01eb54e132700571fa44c47475a5e487f30a245da4cbd42e7e85a04ee703
[+] recovered secret d = 387180059029016236
[+] decrypted flag = flag{e05c3cf7-9608-4e20-af91-140a62ac6f50}
```

> 🏁 **`flag{e05c3cf7-9608-4e20-af91-140a62ac6f50}`**
> 服务器私钥 **`d = 387180059029016236`**

### 7.3 结果校验

| 检查项 | 值 | 结论 |
| --- | --- | --- |
| `d < q` | `387180059029016236 < 387192404707928581` | ✅ 落在私钥合法区间 |
| `d` 位长 | 59 bit | ✅ 合理 |
| shared point | `(804222657885792557175099415739646744107, 679995415718577844849181692776297431618)` | ✅ 非无穷远点 |
| derived key | `db97bec0a8bb410ed7f32f378fdc45322d79e28d0abf27355c8178a52e3c833e` | ✅ |

**三重独立验证**：banner 里每次连接的 IV 都是随机生成的，我把两次独立运行拿到的密文 + 第一次探测时的密文（共 3 组完全不同的 `flag_iv`）用**同一把 `d`** 去解：

```
  iv=646990fc7678ad91...  ->  flag{e05c3cf7-9608-4e20-af91-140a62ac6f50}
  iv=8fb4eb49329c5231...  ->  flag{e05c3cf7-9608-4e20-af91-140a62ac6f50}
  iv=1121ec1c0d528143...  ->  flag{e05c3cf7-9608-4e20-af91-140a62ac6f50}
```

三组都解出同一个 flag，且 PKCS7 unpad 全部通过（**错的 d 会直接抛 padding 异常，不会偶然蒙对**），所以结果是确定的。

---

## 8. 一句话总结 + 防坑提醒

- **漏洞本质**：ECDHE 服务端不校验入参公钥是否真的落在 `y^2 = x^3 + ax + b` 上。
- **怎么利用**：服务器接受**任何 (x, y)**，加法公式照样算，照样派生 key，照样加密明文。
- **攻击套路**：选阶为小素数 ℓ 的点 → 一次 oracle + 一次穷举就把 d mod ℓ 试出来 → CRT 拼回 d。
- **防御**：`mul(d, peer)` 之前必须 `assert curve.is_on_curve(peer)`。OpenSSL、CVE-2017-8932、Go crypto/ecdsa 都出过这种 bug，签名密钥一旦漏 ≈ 私钥直接被扒。

---

## 附：文件清单（本机新增）

- `attack.py` —— 一键整合脚本，对本机/线上都通用：`python attack.py --secret X --flag "..."` 走本机 oracle 自检，`python attack.py --host H --port P` 打远端拿真 flag。
- `run_local_server.py` —— 临时启动一份带 flag 的 server，仅用于验证攻击链。

（打远端拿真实 flag 只需 `attack.py`，`run_local_server.py` 是自检用的临时件，可删。）

## 附 2：踩坑记录

- **macOS 没有 `timeout` 命令**。想给探测脚本加超时，别写 `timeout 20 python ...`，改用 Python 自己的 `socket.create_connection((host, port), timeout=10)`。
- **`sqrt_mod_p_3_mod_4` 只对 `p ≡ 3 (mod 4)` 成立**。本题 `p` 末位是 `9`（即 `p ≡ 1 mod 4`），所以这个函数**并不总是返回正确的平方根**。好在暴力枚举 `x` 时会很快碰到能算对的那个，且即便 `y` 不在曲线上，加法公式照样能算出"看起来合理"的点，最坏情况只是那一次查询被服务端拒绝。所以暴力范围给到 `2^20` 就够了。
- **远端每次连接都会重新生成 IV 并重加密 flag**，所以 banner 里的 `flag_iv/flag_ct` 每次都不同——这是**正常的**，正好可以拿来做交叉验证（同一个 `d` 能解开所有不同 IV 的密文）。
- **判断"恢复是否成功"最可靠的信号是 PKCS7 unpad 是否通过**。AES-CBC 解密本身永远"成功"，但 padding 校验会拦截错误的 key——错误的 `d` 会直接抛 `ValueError`，不会静默给出乱码。

---

# committed 审计记录恢复 解题过程

## 题目描述

> 一个内部审计服务器发生了异常中断。服务重启后，调查人员发现审计数据库中缺失了一条关键审计记录。
> 恢复在 2026-07-18 03:14:00 之前最后一次成功提交（committed）的 EXPORT 操作。
> Flag 格式：`flag{actor-action-nonce}`，全部使用小写字符。

## 环境准备

拿到的是一个 7z 压缩包，解压后得到三个 E01 文件（EnCase 取证镜像格式）：

```
commit.E01  1572852211 字节
commit.E02  1572851461 字节
commit.E03  1150841853 字节
```

macOS 下没有 `7z`，用系统自带的 `bsdtar` 解压：

```bash
bsdtar -xf committed_*.7z
```

E01 是 EnCase 证据镜像（EWF 格式），需要 libewf 解析。用 Python 的 `libewf-python` 直接读取：

```bash
pip3 install libewf-python
```

```python
import pyewf
files = pyewf.glob('commit.E01')
h = pyewf.handle()
h.open(files)
print(h.get_media_size())   # 4294967296 = 4GB
```

将 E01 转成 raw 原始镜像：

```python
h.seek(0)
# 分块读出 4GB 数据写入 commit.raw
```

## 挂载 / 解析文件系统

查看 raw 镜像头，偏移 0x400 处发现 ext4 超级块（魔数 `53 ef` = 0xEF53）：

```
00000400: 0000 0400 0000 1000 0000 0000 644c 0200  ............dL..
00000470: b8d1 52d7 b010 b4e4 0000 0000 0000 0000  ..R.............
00000480: 0000 0000 0000 0000 2f6d 6e74 2f64 6f75  ......../mnt/dou
00000490: 626c 652d 636f 6d6d 6974 0000 0000 0000  ble-commit......
```

卷标为 `/mnt/double-commit`（题目名 "committed" 的伏笔，暗示 SQLite 的 WAL/checkpoint 双提交机制）。

macOS 无法直接挂载 ext4，安装 `e2fsprogs` 用 `debugfs` 读取：

```bash
brew install e2fsprogs
export PATH="/opt/homebrew/opt/e2fsprogs/bin:/opt/homebrew/opt/e2fsprogs/sbin:$PATH"

debugfs -R "ls -l /" commit.raw
```

根目录结构：

```
lost+found
srv/            -> audit/audit.db   (16KB，SQLite)
var/            -> cache/ tmp/
frag/           -> f0001..f1999（1000 个 64KB 文件，全是 0，是填充）
fill.bin        -> 3.46GB（填充文件）
```

其中 `/frag` 目录里的 1000 个文件经检查全部为零字节，是干扰项（填充数据）。

## 分析当前审计数据库

提取 `audit.db`：

```bash
debugfs -R "dump /srv/audit/audit.db audit.db" commit.raw
file audit.db
# SQLite 3.x database, database pages 4, file counter 2, schema 4
```

用 Python sqlite3 查看：

```python
import sqlite3
con = sqlite3.connect('audit.db')
```

当前数据库内容：

| 表 | 内容 |
|---|---|
| actor | (1, 'admin') |
| action_type | (1, 'LOGIN') |
| audit_event | （空） |

关键审计记录（EXPORT 操作）确实丢失了——当前库里连 `svc_archive`、`EXPORT` 这些记录都没有。

数据库 schema：

```sql
CREATE TABLE audit_event(
    event_id INTEGER PRIMARY KEY,
    ts INTEGER NOT NULL,        -- 时间戳
    actor_id INTEGER NOT NULL,
    action_id INTEGER NOT NULL,
    object_id INTEGER NOT NULL,
    nonce BLOB NOT NULL,        -- 随机 nonce
    context BLOB                -- 上下文/导出数据
)
```

## 从未分配空间恢复被删除的数据

服务"异常中断"后重启，SQLite 的 WAL（Write-Ahead Logging）中已提交但未 checkpoint 的数据丢失，旧的数据库文件被删除，其内容残留在文件系统的未分配空间里。

直接在 raw 镜像中搜索 SQLite 特征字符串：

```python
import mmap
mm = mmap.mmap(open('commit.raw','rb').fileno(), 0, access=mmap.ACCESS_READ)
for pat in [b'SQLite format 3', b'EXPORT', b'CREATE TABLE', b'audit_event']:
    # 遍历 mm.find(pat)
```

找到多处 `SQLite format 3` 头：

```
406847544   (0x18400038)  change=3 npages=486 schema=4
408948736   (0x18601000)  change=2 npages=4   schema=3   <- 当前 audit.db
408952888   (0x18602038)  change=2 npages=2   schema=1
408961128   (0x18604068)  change=2 npages=3   schema=2
408969368   (0x18606098)  change=2 npages=4   schema=3
673189944   (0x28201038)  change=3 npages=488 schema=4
673206424   (0x28205098)  change=3 npages=683 schema=4
941625344   (0x38201000)  change=3 npages=486 schema=4   <- 完整的被删除 DB
```

同时搜索 WAL 魔数 `0x377f0682`（文件内字节序 `37 7f 06 82`）：

```
406847488  (0x18400000)  ckpt_seq=1  salt=0xb4f8bf45 0xf1bd51bd
408952832  (0x18602000)  ckpt_seq=0  salt=0xc9ce6207 0xcf9650df
673189888  (0x28201000)  ckpt_seq=2  salt=0xb4f8bf46 0x1c0fff7c
```

### WAL 帧解析

WAL 文件 = 32 字节头 + 若干帧，每帧 = 24 字节帧头 + 4096 字节页面数据。

帧头（大端）：

| 偏移 | 字段 |
|---|---|
| 0-3 | 页号（page number） |
| 4-7 | 提交后数据库大小（0 表示非提交帧） |
| 8-11 | salt-1 |
| 12-15 | salt-2 |
| 16-23 | 校验和 |

解析三个 WAL，得到完整的数据库演化时间线：

| 阶段 | 说明 | 结果 |
|---|---|---|
| WAL2 (ckpt 0) | 建库：创建 3 张表 + admin/LOGIN | 4 页 |
| checkpoint | 写回主 DB | 当前 audit.db（4 页） |
| WAL1 (ckpt 1) | 批量写入审计事件 | 486 页 |
| checkpoint | 写回主 DB | `full_audit.db`（486 页，8001 条事件） |
| WAL3 (ckpt 2) | 提交 1 个事务（+1 条事件） | 488 页 |
| WAL3 后续 | **未提交**的事务（异常中断） | 683 页（已丢失） |

## 恢复完整数据库

### 1. 提取 486 页的基础库（checkpoint 后的主 DB）

```python
# 偏移 941625344，486 页 × 4096 = 1990656 字节
pages = 486
open('full_audit.db','wb').write(raw[941625344:941625344+pages*4096])
```

查询结果：8001 条事件，含 1 条 EXPORT（event_id=8100，svc_backup，18:46:40）。

### 2. 重放 WAL3 已提交帧，得到 488 页最终状态

```python
PGSZ = 4096
base = bytearray(open('full_audit.db','rb').read())
# 逐帧读取 WAL3，按页号覆盖到 base，直到最后一个提交帧（dbsize != 0）
# 提交帧是 frame 3（dbsize=488），frame 4~211 均为 dbsize=0（未提交）
```

生成 `recon_488.db`，共 8002 条事件、2 条 EXPORT：

```
(8100, 1784314000, 13, 7, 5001, nonce...)  ts=2026-07-17 18:46:40  svc_backup
(8137, 1784315507, 42, 7, 9182, nonce...)  ts=2026-07-17 19:11:47  svc_archive
```

## 定位目标记录

截止时间转换：

```python
import datetime
cutoff = int(datetime.datetime(2026,7,18,3,14,0,tzinfo=datetime.timezone.utc).timestamp())
# cutoff = 1784344440
```

两条 EXPORT 事件时间戳均 < 1784344440，其中 **event 8137**（19:11:47）是最晚的一次。

- 未提交的 683 页事务（frame 4~211）因没有提交帧，重放后数据库是损坏的（`database disk image is malformed`），符合"异常中断导致数据丢失"的设定，不计入。

## 提取 Flag 字段

查询 event 8137 完整记录：

```
event_id   = 8137
ts         = 1784315507  -> 2026-07-17 19:11:47 UTC
actor_id   = 42          -> actor.username = 'svc_archive'
action_id  = 7           -> action_type.name = 'EXPORT'
object_id  = 9182
nonce      = 91 4f aa 28 31 9c 74 d2 03 e8 b1 c7 42 6e 95 11
```

- actor → `svc_archive`
- action → `export`（小写）
- nonce → 16 字节 BLOB 的十六进制（小写）`914faa28319c74d203e8b1c7426e9511`

## Flag

```
flag{svc_archive-export-914faa28319c74d203e8b1c7426e9511}
```

---

# SlashKEM 解题记录（功耗侧信道 + 格攻击）

> 一句话总结：题目把 ML-KEM（Kyber 类）的解封装过程放到了一台“漏电”的设备上，
> 我们手上只有**公钥、密文样本、功耗曲线**，没有任何私钥输出。但解密时 `s·u` 的
> Montgomery 乘法会按系数泄漏汉明重量 —— 用**相关功耗分析(CPA)**恢复出 112 个
> 秘密系数，剩下 16 个出题人故意不放泄漏，再用 **格上的 CVP**（`t = A·s + e`）补全，
> 最后用 `sha256(encode(s))` 当 AES-GCM 密钥解密 flag。

**Flag：`flag{708d7b97-0b8d-4d99-aa1a-b23d3b13cc51}`**

---

## 1. 先看题目给了什么

| 文件 | 内容 |
|---|---|
| `challenge.py` | “简化版 ML-KEM”，参数 Q=3329, N=64, K=2 |
| `output.txt` | 公钥 `A`（2×2 多项式矩阵）、`t`、AES-GCM 加密的 flag |
| `traces.npz` | 900 条功耗曲线（长 384）+ 每次解封装的密文样本 `u` |

核心关系（和 Kyber 一样）：

```
t = A·s + e   (mod Q)
    A: 公开的 2×2 多项式矩阵
    s: 秘密多项式（系数 ∈ {-2,-1,0,1,2}）  ← 我们要偷的就是它
    e: 小噪声（系数 ∈ {-1,0,1}）
```

解封装时计算 `v - sᵀ·u`，其中每个秘密系数都会参与一次 Montgomery 乘法，
功耗就“带”出了它的信息。

---

## 2. 读懂泄漏模型（challenge.py 明摆着给的）

```python
def leakage_model(secret_coeff, public_coeff):
    z        = montgomery_reduce(secret_coeff * public_coeff)
    precharge = montgomery_reduce(7 * public_coeff + 0x1234)  # 已知常量
    return hw16((centered(z) & 0xFFFF) ^ (centered(precharge) & 0xFFFF))
```

- `hw16` = 16 位的汉明重量（bit 数）。
- `precharge` 只依赖**公开的** `public_coeff`，所以是可以自己算的已知量。
- 于是对任意猜测的 `s` 候选值，我们都能算出对应的泄漏 `hw16(...)`，
  再和真实功耗做**相关系数**，相关最高的候选就是正确答案。

每个秘密系数只有 5 种取值（-2~2），所以每个位置只需猜 5 个值。

---

## 3. 在 384 长的曲线里“找”每个系数（CPA）

### 3.1 布局猜想

- 秘密系数共 `K*N = 2*64 = 128` 个；
- 曲线长 384，`output.txt` 里给了 `leak_base: 96`；
- 猜想：每个系数对应 **1 个** 泄漏点，128 个点落在 96..223 列，其余 96..（开头）和尾部是别的操作。

逐个系数做“候选值预测 vs 全曲线逐列相关”，发现每个系数只在**唯一一列**有 ~0.96 的尖峰。

### 3.2 列号规律 = 位反转

把这些尖峰的列号列出来，发现：

```
列 c = 96 + bit_reverse_7(gi)      # gi = 秘密系数的下标 0..127
```

（`bit_reverse_7` 就是 challenge.py 里 `coefficient_order` 的逆运算，把下标按 7 bit 倒过来。）

### 3.3 恢复结果

```
对 gi: 取公开系数 cpub = u_samples[:, gi]
      对候选 s ∈ {-2,-1,0,1,2} 各算一条预测泄漏曲线
      与 trace[:, 96 + bitrev7(gi)] 求 Pearson 相关系数
      取 |r| 最大的候选作为 s[gi]
```

结果：**112/128 个系数**相关中位数 **0.957**（非常可靠），一次全对。

```python
# 命中 112 个高置信系数后的样子（前 40 个）
[-1, 1, -2, -2, 0, 2, 1, 2, 0, 0, -1, 0, -2, 2, 0, -2,
 -1, 2, 0, -2, -2, 1, 0, 1, 0, -2, 1, ?, 2, 2, 0, -2,
  1, 2, -2, 2, -2, -1, -1, 2, ...]
```

### 3.4 漏不出来的 16 个

有 16 个位置的相关值只有 ~0.04（纯噪声），它们恰好是：

```
gi ≡ 3 (mod 8)  →  {3, 11, 19, 27, 35, 43, 51, 59, 67, 75, 83, 91, 99, 107, 115, 123}
```

出题人在这 16 个位置的曲线上**根本没放泄漏**（怎么猜都是噪声），
README 里的提示 “SageMath may be useful after the statistical stage” 就是叫我们下一步用格。

---

## 4. 用格把剩下 16 个补全（CVP）

已知 112 个系数后，把公钥关系重写：

```
t' = t - A·s_known = M_u·s_u + e   (mod Q)
     s_u: 16 个未知秘密系数（很小，∈{-2..2}）
     e  : 噪声，∈{-1,0,1}
     M_u: A 中与这 16 个未知列对应的“系数→t”矩阵（可从 A 直接算出）
```

找一个格点 `(s_u, M_u·s_u)` 让它尽量靠近已知向量 `(0, t')`，距离就是噪声 `e`（很小），
这就是标准的 **最近向量问题 (CVP)**，流程：

1. 构造 144 维格基（16 个未知列 + 128 行模 Q 的嵌入）；
2. `fpylll` 的 LLL 约减（0.2 秒）；
3. `CVP.closest_vector`（Babai 最近平面）解出最近格点，前 16 个坐标就是 `s_u`。

```python
# 格解出的 16 个未知系数（按下标顺序）
s_u = [-2, 0, -2, -2, 2, -1, -2, -1, 1, 0, 2, 2, -2, -2, 2, 1]
```

---

## 5. 校验：e 确实很小

把完整 `s` 代回 `e = t - A·s (mod Q)` 再中心化：

```
max|e| = 1，全部落在 {-1,0,1}  ← 与真实噪声定义完全一致，说明 s 全对
```

到这一步，私钥多项式已经**100% 还原**（不仅能解这道题，理论上可以直接对任意密文解封装）。

---

## 6. 解密 flag

挑战里 flag 的加密方式：`key = sha256(encode_secret(s))`，
其中 `encode_secret` 就是把每个系数 `+2`（-2→0 … 2→4）按顺序拼成 128 字节。

```python
key   = sha256(bytes(x + 2 for x in s_full)).digest()
AES-GCM: nonce = b"SLASHKEM2026"(b64)  ciphertext / tag 来自 output.txt
```

```text
flag{708d7b97-0b8d-4d99-aa1a-b23d3b13cc51}
```

---

## 7. 完整恢复结果（留档）

`s`（128 个系数，-2..2，每 64 个为一条多项式）：

```
[-1, 1, -2, -2, 0, 2, 1, 2, 0, 0, -1, 0, -2, 2, 0, -2, -1, 2, 0, -2, -2, 1, 0, 1, 0, -2, 1, -2, 2, 2, 0, -2,
  1, 2, -2, 2, -2, -1, -1, 2, -2, -2, 0, -1, 2, -2, -1, 0, 2, 2, -1, -2, -1, 2, 0, 1, -1, 1, 2, -1, 0, 1, 0, 2,
 -2, 2, -2, 1, 1, -2, -1, 1, -1, 2, -2, 0, -1, -1, -1, 2, 1, 2, 1, 2, -1, 1, 2, 2, 2, 0, -1, 2, -2, 0, 2, 2,
 -1, -2, 0, -2, 1, -2, 0, 2, 0, 1, -2, -2, -1, 2, 1, -2, 0, 1, 0, 2, -1, -2, -2, -1, 1, 1, 0, 1, -1, -1, 2, 1]
```

`e`（128 个，全在 {-1,0,1}）：

```
[-1, 1, 0, 1, -1, 0, -1, 0, -1, 1, 0, -1, -1, -1, 1, 1, 1, 0, 1, 1, 0, 0, -1, 1, 0, 0, 0, 1, -1, 1, 1, -1,
 -1, 1, -1, 1, 0, 1, -1, 0, 0, 1, 0, 1, -1, 1, 0, -1, 0, 1, 0, 1, -1, 1, 0, 0, 1, -1, 1, 1, 0, -1, 1, 0,
 -1, 0, 0, 0, 1, 1, -1, 0, 1, 0, 1, -1, 1, 0, -1, -1, 1, -1, 0, 1, -1, 1, 1, -1, 0, -1, 0, -1, 1, -1, 1, 1,
 -1, -1, 0, -1, 0, 1, 1, -1, 0, 0, -1, 0, 1, -1, 1, 0, 0, -1, -1, -1, 0, 0, -1, -1, 0, 1, 0, 0, 0, 0, 0, 0]
```

---

## 8. 方法论沉淀（下次直接套）

1. **先找泄漏模型**：源码里有 `leakage_model` 就照着建；没有就试 HW(汉明重量)/HD(翻转) 模型。
2. **逐个系数做 CPA**：候选值少（小系数集）就直接穷举候选算预测曲线；
   不知道曲线布局就“每个系数 × 全曲线逐列”扫一遍，尖峰位置自然暴露列号规律（比如位反转）。
3. **侧信道漏不掉的缺口 → 靠公钥方程补**：`t = A·s + e` 是天然的校验/补全手段。
   - 已知大部分系数 → 减掉贡献；
   - 剩 k 个未知小系数 + 每维小噪声 → **格 CVP**（LLL + Babai），
     fpylll 一行 `CVP.closest_vector` 搞定；
   - 判据：恢复后噪声 `e` 必须落在真实噪声分布里（这里是 {-1,0,1}）。
4. **最后的加密往往是“密钥 = 秘密的函数”**：KEM 类题目的 flag 常直接用
   `sha256(encode(secret))` 当 AES 密钥，恢复完私钥就能解密。

复现代码
```python
#!/usr/bin/env python3
"""SlashKEM full solver: side-channel recovery + lattice CVP + AES-GCM decrypt."""
import numpy as np, json, base64, hashlib, time, sys
from Crypto.Cipher import AES
from fpylll import IntegerMatrix, LLL, CVP

# ---------------- parameters (match challenge.py) ----------------
Q = 3329; N = 64; K = 2
MONT_R = 1 << 16
QINV = (-pow(Q, -1, MONT_R)) % MONT_R
SECRET_VALUES = (-2, -1, 0, 1, 2)
ERROR_VALUES = (-1, 0, 1)

def centered(x):
    x = int(x) % Q
    return x - Q if x > Q // 2 else x

def montgomery_reduce(a):
    a = np.asarray(a, dtype=np.int64)
    t = (a * QINV) & 0xFFFF
    u = (a + t * Q) >> 16
    return u % Q

LUT = np.array([i.bit_count() for i in range(65536)], dtype=np.int64)

def leakage_model(sval, cpub):
    cpub = np.asarray(cpub, dtype=np.int64)
    z = montgomery_reduce(sval * cpub)
    pre = montgomery_reduce(7 * cpub + 0x1234)
    cz = z % Q; cz = np.where(cz > Q//2, cz-Q, cz)
    cp = pre % Q; cp = np.where(cp > Q//2, cp-Q, cp)
    return LUT[(cz & 0xFFFF) ^ (cp & 0xFFFF)]

def negacyclic_mul(a, b, q=Q):
    n = len(a); out = [0]*n
    for i, ai in enumerate(a):
        for j, bj in enumerate(b):
            idx = i + j; sign = 1
            if idx >= n: idx -= n; sign = -1
            out[idx] = (out[idx] + sign*ai*bj) % q
    return out

def br7(x):
    return int(f"{x:07b}"[::-1], 2)

def flatten_vec(v): return np.array([int(x) for poly in v for x in poly], dtype=np.int64)
def unflatten(vals, k=K, n=N): return [list(map(int, vals[i*n:(i+1)*n])) for i in range(k)]

# ---------------- load ----------------
d = np.load("traces.npz")
T = d["traces"].astype(np.float64); U = d["u_samples"].astype(np.int64)
cfg = json.load(open("output.txt"))
A = np.array(cfg["public_key"]["A"], dtype=np.int64)
tpub = np.array(cfg["public_key"]["t"], dtype=np.int64)
t_flat = flatten_vec(tpub)

# ---------------- build M (128x128): t = M @ s_flat + e (mod Q) ----------------
M = np.zeros((K*N, K*N), dtype=np.int64)
for si in range(K*N):
    spoly, cidx = si // N, si % N
    basis = [0]*N; basis[cidx] = 1
    col = []
    for row in range(K):
        col.extend(negacyclic_mul(A[row][spoly], basis))
    M[:, si] = np.array(col, dtype=np.int64)

# ---------------- side-channel recovery ----------------
cands = np.array(list(SECRET_VALUES), dtype=np.int64)
Tn = T - T.mean(0); Tstd = Tn.std(0)
Tn = Tn / np.where(Tstd == 0, 1, Tstd)  # (900, 384)
s_flat = np.zeros(K*N, dtype=np.int64)
conf = np.zeros(K*N)
t0 = time.time()
for gi in range(K*N):
    c = 96 + br7(gi)
    cpub = U[:, gi]
    P = np.stack([leakage_model(sv, cpub) for sv in cands], 0)  # (5,900)
    Pm = P - P.mean(1, keepdims=True); Ps = Pm.std(1, keepdims=True)
    Pn = Pm / np.where(Ps == 0, 1, Ps)
    r = (Pn @ Tn[:, c]) / 900.0
    ar = np.abs(r); k = int(np.argmax(ar))
    s_flat[gi] = cands[k]; conf[gi] = ar[k]
print(f"[side-channel] done {time.time()-t0:.1f}s  corr: min={conf.min():.3f} median={np.median(conf):.3f} max={conf.max():.3f}")

# decide unknown set = coefficients whose leakage column is NOT usable.
# From analysis: weak gi have corr tiny (their columns carry no model leakage).
unknown = sorted(int(i) for i in range(K*N) if conf[i] < 0.9)
print(f"[side-channel] high-conf recovered: {K*N-len(unknown)}/128   unknown set ({len(unknown)}): {unknown}")
print(f"[side-channel] recovered known s_flat[:40]: {s_flat[:40].tolist()}")

known = [i for i in range(K*N) if i not in unknown]
Mk = M[:, known]; Mu = M[:, unknown]
sk = s_flat[known]
tp = (t_flat - Mk @ sk) % Q
tp = np.array([centered(x) for x in tp], dtype=np.int64)  # 128  (centered)

# ---------------- lattice CVP ----------------
dim_s = len(unknown)
# rows: s-part identity + Mu col ; then e-part Q*I (use all or subset of rows)
use_rows = 128
rows_sel = list(range(use_rows))
Muv = Mu[rows_sel, :].astype(object)
tpv = tp[rows_sel]
dim_e = use_rows
D = dim_s + dim_e
B = IntegerMatrix(D, D)
for i in range(dim_s):
    B[i, i] = 1
    for r in range(dim_e):
        B[i, dim_s + r] = int(Mu[r, i]) % Q
for r in range(dim_e):
    B[dim_s + r, dim_s + r] = Q
print(f"[lattice] dimension {D}x{D}, LLL running...")
t0 = time.time()
LLL.reduction(B)
print(f"[lattice] LLL done {time.time()-t0:.1f}s")

tgt = [0]*dim_s + [int(x) for x in tpv]
# Babai nearest plane via fpylll CVP helper on target (closest lattice vector)
tl = IntegerMatrix.from_matrix([[x] for x in tgt])  # D x 1 target matrix
sol = CVP.closest_vector(B, tgt)
s_u = np.array([int(sol[i]) for i in range(dim_s)], dtype=np.int64)
print("[lattice] CVP sol s_u:", s_u.tolist())

# refine: values must lie in SECRET_VALUES; try small corrections if needed
# reassemble
s_full = s_flat.copy()
for i, gi in enumerate(unknown):
    s_full[gi] = s_u[i]
s_polys = unflatten(s_full)

# ---------------- validate e = t - A s ----------------
recomp = []
for row in range(K):
    acc = [0]*N
    for col in range(K):
        m = negacyclic_mul(list(A[row][col]), s_polys[col])
        acc = [(x+y) % Q for x, y in zip(acc, m)]
    recomp.append(acc)
recomp_flat = flatten_vec(recomp)
e = np.array([centered((int(t_flat[i]) - int(recomp_flat[i])) % Q) for i in range(K*N)])
print(f"[validate] max|e| = {int(np.max(np.abs(e)))}, all in ERROR_VALUES: {bool(np.all(np.isin(e, list(ERROR_VALUES))))}")
print("[validate] e[:40]:", e[:40].tolist())

# ---------------- decrypt flag ----------------
enc = [int(x) + 2 for x in s_full]
assert all(0 <= x <= 4 for x in enc)
key = hashlib.sha256(bytes(enc)).digest()
f = cfg["flag"]
nonce = base64.b64decode(f["nonce"]); ct = base64.b64decode(f["ciphertext"]); tag = base64.b64decode(f["tag"])
cipher = AES.new(key, AES.MODE_GCM, nonce=nonce)
try:
    flag = cipher.decrypt_and_verify(ct, tag)
    print("[flag]", flag.decode())
except Exception as ex:
    print("[flag] decryption FAILED:", ex)
    print("ciphertext len", len(ct), "tag", len(tag), "nonce", len(nonce))
```

---

# SilentWeights 解题报告

**题目**：某企业发现一份内部视觉识别模型的训练结果被上传到外部网盘。模型所有者确认未使用额外适配组件，但泄露文件的体积和训练日志均存在异常。请恢复被隐藏的内部资料，提交 flag。

---

## 一、初步分析

附件包含三个文件：

| 文件 | 说明 |
|------|------|
| `README.txt` | 事件编号 SW-2026-0718，提示检查"不属于模型"的部分 |
| `training.log` | 训练日志，声称 `baseline 842 KB / exported 1186 KB`，与实际不符（异常点） |
| `leaked_model.pth` | PyTorch checkpoint（zip 格式，194607 字节） |

用 `torch.load` 加载 state dict，得到 9 个张量：

| 张量 | 形状 | 说明 |
|------|------|------|
| backbone.conv1.weight / bias | (16,3,3,3) / (16,) | 正常 |
| backbone.conv2.weight / bias | (32,16,3,3) / (32,) | 正常 |
| normalizer.running_mean / var | (32,) / (32,) | 正常 |
| classifier.fc.weight / bias | (10,128) / (10,) | 正常 |
| **feature_adapter.weight** | **(10555, 4)** | **异常** |

日志 `modules:` 只列了 `conv1, conv2, classifier.fc, normalizer`，**没有 feature_adapter**。它正是"不属于模型的部分"，且体积占绝对大头（42220 个 float = 168880 字节）。

---

## 二、定位内嵌 PNG

`feature_adapter.weight` 的原始字节看似高熵随机数据（非均匀分布，不满足加密/压缩特征）。逐个字节扫描常见文件签名，发现 **PNG 签名 `\x89PNG\r\n\x1a\n` 出现在偏移 905 处**：

```
offset 905: 89 50 4E 47 0D 0A 1A 0A 00 00 00 0D 49 48 44 52 ...
```

（训练日志中 `842 / 1186` 的"异常大小"正是误导性的障眼数字，与真实偏移无关。）

从 905 开始提取到 `IEND` 块，得到一个 **512×512 RGBA** 的 PNG 图片，内容是一份"模型事件审查"报告：

```
MODEL INCIDENT REVIEW
Case SW-2026-0718 /checkpointaudit

Leaked asset:        vision_audit_net v3.2
Baseline mismatch:   manual review required

02:11  training job started
02:41  checkpoint exported
03:08  external share detected
04:20  IR package prepared

Visible evidence is only the first layer.   ← 关键提示
```

底部那句 *"Visible evidence is only the first layer."* 明确提示图片里还有第二层隐藏数据。

---

## 三、第二层：Alpha 通道隐写

分析 PNG 的 RGBA 四通道：

| 通道 | LSB 特征 |
|------|----------|
| R | LSB 基本为 0（自然颜色） |
| G | LSB 基本为 1（自然颜色） |
| B | LSB 基本为 0（自然颜色） |
| **A (alpha)** | **取值仅 252 / 253 / 254 / 255，低 2 位分布均匀** |

Alpha 通道只用了低 2 位（`252=00, 253=01, 254=10, 255=11`），且四个值数量各约 `65536`（= 512×512÷4），说明**每像素在 alpha 低 2 位隐藏 2 bit**。

按 MSB-first 顺序（每 4 像素打包 1 字节）提取，得到 65536 字节：

```
53 57 47 54  00 00 01 28  50 4B 03 04 ...
SWGT         长度=296     PK (ZIP 头)
```

结果是一个 **`SWGT` 容器**：4 字节 magic + 4 字节大端长度 `0x00000128`(=296) + 一个 **296 字节的加密 ZIP**。

---

## 四、获取 ZIP 密码

PNG 还含有一个 `iTXt` 文本块（keyword 为 `audit.note`），内容是一串 hex：

```
3249444d79383161685647626678575a6b395762
```

hex 解码得：`2DIDMy81ahVGbfxWZk9Wb`

将其**倒序**后得到 base64 字符串 `bW9kZWxfbGVha18yMDI2`，解码：

```
bW9kZWxfbGVha18yMDI2  →  model_leak_2026
```

这就是 ZIP 的密码：**`model_leak_2026`**。

---

## 五、解密 ZIP 拿到 flag

用密码 `model_leak_2026` 解压内嵌 ZIP，得到 `incident_report.txt`：

```
Internal incident material recovered.
flag{fd3a674e-8b2c-485a-b7d9-b1d703297007}
```

---

## 最终 Flag

```
flag{fd3a674e-8b2c-485a-b7d9-b1d703297007}
```

---

## 解题链路总结

```
leaked_model.pth
    └─ feature_adapter.weight (异常张量, 168880 字节)
          └─ 偏移 905 处内嵌 PNG (512×512 RGBA)
                ├─ 可见层：事件审查报告，提示 "only the first layer"
                ├─ iTXt 块 "audit.note" → hex → 倒序 base64 → "model_leak_2026"
                └─ Alpha 通道低 2 位 → SWGT 容器 → 加密 ZIP
                      └─ 密码 "model_leak_2026" → incident_report.txt → flag
```

---

# MeshGate 逆向解题全记录（XDP eBPF 策略 + AES-GCM 离线重放）

> 一道"取证包"型逆向题：只给你一堆二进制材料，不给你运行环境，要你还原出被加密保护的 flag。
> 本文按**实际攻克顺序**记录完整思路，尽量用新手能懂的话讲清楚每一步"为什么"。

---

## 0. 结论先行（TL;DR）

- 挑战包里的 `release_blob.bin` 用 **AES-256-GCM** 加密，里面就是 flag。
- 解密密钥 = `SHA256(固定标签 + D1 + D2 + D3)`，其中 D1/D2/D3 是**三个只在程序真实运行时才存在的 SHA256 摘要**，纯离线推不出来。
- 突破口：让 `./meshgate <帧hex>` 自己走完"XDP 策略校验 → SHA256 派生 → GCM 解密 → stdout 打印"。
- 唯一需要自己构造的，是一帧**能通过 XDP eBPF 策略**的 96 字节以太网帧。
- 最终真实二进制直接打印：

```
flag{d171a5f0-09f2-48d1-9b34-b82f6585a6c9}
```

---

## 1. 挑战包长什么样

放在 `~/Downloads/meshgate/` 下，共 7 个文件：

| 文件 | 大小 | 作用 |
|---|---|---|
| `README.txt` | 836 B | 题目说明 |
| `meshgate` | 27 KB | 主程序（x86-64 ELF，动态链接 libcrypto.so.3，strip 过） |
| `mesh_policy.bpf.o` | 3.7 KB | CO-RE eBPF 目标文件，内含 XDP 策略程序（1336 B） |
| `edge_vmlinux.btf` | 4.7 MB | 目标内核类型描述（CO-RE 用） |
| `mesh_maps.snapshot` | 808 B | 被抓取的 eBPF map 状态（租户配置 + epoch 密钥） |
| `mesh_loader.state` | 16 B | 加载器状态（含网卡 ifindex） |
| `mesh_traffic.pcap` | 248 B | 历史流量（题目明说是"背景证据，不是答案"） |
| `release_blob.bin` | 80 B | 加密的发布材料 —— **flag 就在这里面** |

README 关键原话：

> `./meshgate <ethernet-frame-hex>` —— 程序只做**离线重放**：不调用 bpf()、不挂载程序、不需要 root。PCAP 记录的是上一个部署 epoch，只是上下文证据，**不是重放答案**。

也就是说：主程序是一个"本地验帧器"——你喂一帧数据，它先仿真当年的 XDP 策略，通过后就用 release_blob 解出明文给你看。

---

## 2. 静态侦察：先搞清楚它是什么

```
$ file meshgate mesh_policy.bpf.o release_blob.bin
$ strings -a meshgate | head -50
```

`strings` 输出立刻暴露了全貌：

```
MGLDR3  MGRLB003
mesh_policy.bpf.o   edge_vmlinux.btf   mesh_maps.snapshot
mesh_loader.state   release_blob.bin
xdp/meshgate   .BTF   .BTF.ext
MeshGate/CO-RE/release-v3
MeshGate/XDP/CO-RE/release-v3
MeshGate: malformed Ethernet frame
MeshGate: incident bundle is incomplete or corrupt
MeshGate: XDP policy dropped frame
MeshGate: XDP policy accepted frame; release binding did not authenticate
MeshGate: release crypto unavailable
...
```

能读出 4 件事：

1. 程序会读取那 5 个配套文件（都在当前目录）。
2. 处理流程的错误消息链是：**文件校验 → XDP 策略仿真 → GCM 解密**，最后一步失败会报 `...release binding did not authenticate`。
3. 两个看起来像"派生域分隔符"的字符串，几乎可以肯定用于密钥派生（KDF 标签 + GCM AAD 标签）。
4. 成功后是 `fwrite` 明文到 stdout —— 也就是说 **flag 会直接打在终端上**。

---

## 3. 主程序在干什么（全局流程）

把反汇编（`objdump -d` → `an/gate.asm`）梳理后，主逻辑是：

```
./meshgate <96字节帧hex>
    │
    ├─ 读取 5 个配套文件，校验头部魔数（MGRLB003 / MGMAP3 / MGLDR3 ...）
    ├─ 用 loader.state 里的 ingress_ifindex=0x11 校验 map/租户布局（CO-RE）
    ├─ 把 mesh_policy.bpf.o 的 "xdp/meshgate" 节加载进内存
    │     （期间把两个 map fd 重定位成快照中的 map）
    │
    ├─ 【第 1 关】用自写 eBPF 解释器"离线重放" XDP 策略
    │     ├─ 帧被丢 → 打印 "XDP policy dropped frame"，exit 1
    │     └─ 帧通过 → 进入解密
    │
    └─ 【第 2 关】用真实 libcrypto 做解密：
          key = SHA256( KDF标签 + D1 + D2 + D3 )
          aad = AAD标签 + D1 + D2
          AES-256-GCM 解密 release_blob
          ├─ tag 校验失败 → "...did not authenticate"，exit 1
          └─ 成功 → fwrite 明文（= flag）到 stdout，exit 0
```

关键设计：**策略和解密是同一个进程里的两关**。第一关过不了，第二关根本不会执行。

---

## 4. 解密协议逆向：flag 是怎么"锁"起来的

`release_blob.bin`（80 B）的布局（实测字节验证过）：

```
偏移    内容
0x00    "MGRLB003"          魔数 8B
0x08    IV = 74fc e937 8ad8 333a 8209 fe9e    12B（GCM nonce）
0x14    ctlen = 00 2a       大端 u16 = 42（密文长度）
0x16    密文 42B
0x40    GCM tag 16B
```

反汇编 + 字符串交叉引用得到密钥派生链（这是全题的核心公式）：

| 名字 | 取值 | 长度 |
|---|---|---|
| KDF 标签 `LK` | `"MeshGate/CO-RE/release-v3"` | 26 B |
| AAD 标签 `LA` | `"MeshGate/XDP/CO-RE/release-v3"` | 30 B |
| `key` | `SHA256(LK ‖ D1 ‖ D2 ‖ D3)` | 32 B |
| `aad` | `LA ‖ D1 ‖ D2` | 94 B |
| 密文参数 | IV=blob[8:0x14]，ct=blob[0x16:0x16+ctlen]，tag=blob[0x16+ctlen:] | — |

其中 D1/D2/D3 分别是三段数据缓冲的 SHA256，反汇编栈槽定位如下：

| 摘要 | 数据来源 | 长度出处 |
|---|---|---|
| `D1` | **重定位回写后的 eBPF 节区副本**（加载器自己拼的那份） | 栈 `[rsp+0xe0]` |
| `D2` | **`mesh_maps.snapshot` 原文件缓冲** | 栈 `[rsp+0xc8]` |
| `D3` | **你喂进去的那 96 字节帧** | 固定 `0x60` |

也就是说：**只要拿到正确的 D1/D2/D3，就能离线把 blob 解开**。而 D3 就是帧本身 —— 所以"喂对帧"同时满足两关：过 XDP 策略 + 让 D3 参与派生。

> 反汇编里最坑的一句话："把节区复制一份、map fd 重定向写进去，再拿这份副本去算 D1"。这意味着 D1 的输入不是磁盘上的 `mesh_policy.bpf.o` 原样内容，而是**运行时内存里的修正版** —— 纯离线无法精确重建，这是后面暴搜失败的根本原因。

---

## 5. XDP 策略逆向：帧必须长成什么样

eBPF 对象（`xdp/meshgate` 节，1336 B）反汇编见 `an/bpf.asm`，逻辑分三段：

- `policy_xdp`（入口，0x0–0x2c8）：校验帧头 + 查租户/epoch 配置 + 调子程序
- `validate_claim`（伪调用子程序）：由 session_nonce 派生帧内校验字段
- `derive_node_tag`（伪调用子程序）：继续派生节点标签字段

### 5.1 硬性头校验（一个不满足直接 DROP）

| 帧偏移 | 比较值 | 含义 |
|---|---|---|
| 帧总长 | `>= 0x60` (96) | 长度下限 |
| `0x0c` | `0x0800` | EtherType = IPv4 |
| `0x17` | `0x11` (17) | IP 协议 = UDP |
| `0x10` | `0x0052` | IP 总长 = 82（正好凑出 96 字节帧） |
| `0x26` | `0x003e` | UDP 长度 = 62 |
| `0x2a`/`0x2c` | `"MG"` / `"3V"` | 载荷魔数 `MGV3` |
| `0x2e` | `0x0003` (BE) | MeshGate 版本 = 3 |

### 5.2 map 匹配（帧里的字段要对上"当时"的租户状态）

策略先用帧里的 `tenant` 和 `epoch` 查两个 map：

- `tenant_cfg`：按 tenant 找到租户配置（含 session_nonce、各盐、allowed_src、flags…）
- `epoch_keys`：按 key_slot 找到该 epoch 的密钥材料（proof_salt、node_salt、tag_salt、key_mix…）

查到后把帧内这些字段与配置逐一比对：`tenant`、`epoch`、`ingress_ifindex`(来自 ctx)、`udp_dport`、**源 IP**、`flags`…… 全对才继续。

### 5.3 派生字段（最有趣的部分）

`validate_claim` + `derive_node_tag` 用栈里的 `session_nonce` 和各盐做循环移位运算，算出帧里 4 个位置的期望值（`an/solve.py` 的 `derive()` 是与 eBPF 逐条核对过的完整复刻）：

```
P38 = cfg.session_nonce                              # 帧[0x38]
# validate_claim
t   = P38 ^ cfg.route_seed
t   = t + ek.proof_salt
P40 = rotl64(t, 17) ^ cfg.endpoint_salt              # 帧[0x40]
# derive_node_tag
t   = (P40 ^ ek.node_salt) + cfg.node_salt
P48 = rotl64(t, 41)                                  # 帧[0x48]
t   = (P48 + ek.tag_salt) ^ cfg.audit_salt
P50 = rotl64(t, 29) ^ ek.key_mix                     # 帧[0x50]
t   = (P40 ^ (P40 >> 32)) ^ ek.key_mix + cfg.epoch
P58 = rotl32(t, 7)                                   # 帧[0x58]
```

> 一句话：**这一帧的 0x40–0x58 不是随机数，而是"配置盐 + epoch 盐"按公式推出来的"动态口令"**。只有用对了租户/epoch 的盐才能算对。

帧载荷字段总布局（0x30 起，BE）：

| 帧偏移 | 长度 | 内容 |
|---|---|---|
| `0x30` | 4 | tenant |
| `0x34` | 4 | epoch |
| `0x38` | 8 | session_nonce |
| `0x40` | 8 | P40（derive 产物） |
| `0x48` | 8 | P48（derive 产物） |
| `0x50` | 8 | P50（derive 产物） |
| `0x58` | 4 | P58（derive 产物） |
| `0x5c` | 4 | flags |

---

## 6. 配套取证文件分析

### 6.1 maps.snapshot（`an/solve.py: parse_maps`）

魔数 `MGMAP3`，内含两个 map：

- `tenant_cfg`：若干条租户配置，每条 72 B：
  前 24 B 6 个 u32：`tenant, epoch, ingress_ifindex, udp_dport, key_slot, flags`
  中 40 B 5 个 u64：`session_nonce, route_seed, node_salt, audit_salt, endpoint_salt`
  末 8 B：`allowed_src(u32), reserved`
- `epoch_keys`：若干条 epoch 密钥，每条 48 B：
  前 8 B：`epoch(u32), status(u32)`
  后 40 B 5 个 u64：`proof_salt, node_salt, tag_salt, key_mix, epoch_commit`

### 6.2 loader.state

16 B：`"MGLDR3"` + 版本 + `ingress_ifindex = 0x11 (17)` + `aux = 0x0c`。用它从 tenant_cfg 里挑出"这台网关自己的"那条租户配置。

### 6.3 BTF / BTF.ext / CO-RE（`an/_btf.py`、`an/_btfext.py`）

- `.BTF` 1207 B、`.BTF.ext` 128 B。
- 修正头部解析后，CO-RE 区只有 3 条 relo 记录：指令偏移 `8/0x10/0x30`，type_id 6，访问路径 `0:2 / 0:3 / 0:0` —— 即 `xdp_md` 的 `data / data_end / ingress_ifindex` 字段读取。
- 结论：**这些偏移在"本地 relo"场景下本就一致，relo 不会改写指令语义**；真正会被运行时改写的只有两个 `lddw` map fd 的重定位。所以策略指令本身可以放心离线分析。

---

## 7. 第一次尝试：离线暴搜（失败，但很有价值）

`an/solve.py` 做的事：

1. 解析两个 map → 拿到与 `ingress_ifindex=0x11` 匹配的租户配置 `cfg` + 对应 `key_slot` 的 epoch 记录 `ek`；
2. 用 PCAP 里的帧当模板，套 `derive()` 重写 0x40–0x58，重建一帧；
3. 用自写 eBPF 虚拟机跑策略，确认这帧能 **PASS**；
4. 然后对 D1/D2/D3 做枚举：候选缓冲有 11 种（eBPF 节原文、bpf.o 全文、maps、loader、frame、pcap、BTF、节名…），三重循环 = 11³ = 1331 次 GCM `decrypt_and_verify`，每次都不匹配 tag。

结果：

```
NO combination authenticated. Need to revisit D1/D2/D3 sources.
```

**为什么必然失败？** 候选集里根本没有"D1 的真身"——它是加载器在内存里"重定位回写后的节副本"，磁盘上任何文件都不是它。D2 恰好是 maps 原文（候选里有，但 D1 错则全盘皆错）。**纯离线枚举在原理上就覆盖不到解空间。**

> 教训：当"密钥派生输入只存在于进程运行期"时，别继续堆候选组合，改让程序自证。

---

## 8. 换思路：构造合法帧，让二进制自己解密

既然 D1/D2/D3 是程序运行时自己算的，那我们**只需要让程序把流程走完**：

1. 构造一帧 → 过第 1 关（XDP 策略 PASS）；
2. 程序自己用"内存里的真 D1、真 D2、真 D3(=这帧)"派生密钥并解密；
3. stdout 就是 flag。

帧的构造 = PCAP 模板 + 用 map 里的 cfg/ek 盐跑 `derive()`，把载荷区写成策略期望的值：

- 实测 `frame_hex` 与 PCAP 第 1 个包相比，**只有 0x37–0x5b 共 29 个字节不同**（epoch 末字节 + 全部派生字段区），其余（以太网/IP/UDP 头、`MGV3` 魔数、tenant、session_nonce）原样保留。

---

## 9. 环境大坑：Apple Silicon 跑不了这个 x86-64 程序

`meshgate` 是 x86-64 ELF，需要 amd64 的 glibc + `libcrypto.so.3`。宿主机是 Apple Silicon，直接 `LD_PRELOAD` 方案（`an/shim.c`，用于拦截 SHA256/EVP 记录输入缓冲）根本起不来。

解决路径（踩坑后最快的）：

```
# 1) 起一个 amd64 QEMU 模拟容器（不要用全量 apt，QEMU 下装工具极慢）
docker run -d --name mgsh3 amd64/debian:bookworm-slim sleep infinity

# 2) 手拉 libssl3 的 amd64 deb，直接 docker cp + dpkg 直装（几秒完成）
curl -LO http://deb.debian.org/debian/pool/main/o/openssl/libssl3_3.0.20-1~deb12u2_amd64.deb
docker cp libssl3_*.deb mgsh3:/tmp/
docker exec mgsh3 dpkg -i /tmp/libssl3_*.deb

# 3) 把挑战包送进容器
docker cp ~/Downloads/meshgate mgsh3:/work
```

> 提速技巧：QEMU 模拟下 `apt-get install` 慢到无法忍受，**手拉 .deb + dpkg -i** 把安装压缩到几秒。

---

## 10. 决定性验证：真实二进制打印了 flag

容器内依次喂三个候选帧（脚本 `an/run_oracle.sh`，带 LD_PRELOAD shim 记录 SHA256 输入做取证）：

| 帧 | 结果 | exit code |
|---|---|---|
| `frame_hex.txt`（重建帧，epoch=0x0002a731） | **打印 flag，解密成功** | 0 |
| `pkt0_hex.txt`（PCAP 第 1 包，epoch=0x0002a730） | `MeshGate: XDP policy dropped frame` | 1 |
| `pkt1_hex.txt`（PCAP 第 2 包，epoch=0x19c0ffee） | `MeshGate: XDP policy dropped frame` | 1 |

三段日志构成完整闭环证据：

- **正向**：重建帧 → 策略 PASS → 自解 → `flag{...}`，exit 0（证明帧构造正确 + D1/D2/D3 全对）；
- **反向**：PCAP 里的旧帧都被策略丢弃，exit 1（印证 README 说的"PCAP 不是答案"，也反向证明重建帧是唯一有效路径）；
- **旁证**：shim 抓到的 SHA256 输入缓冲落盘（`an/out/sha256_*.bin`），可离线复核 D1/D2/D3 与派生链公式完全一致。

最终明文写入交付文件：

- `an/plaintext.bin`（43 B，含尾换行）
- `an/flag.txt`（42 B，纯 flag）

---

## 11. 最终 flag

```
flag{d171a5f0-09f2-48d1-9b34-b82f6585a6c9}
```

复现命令（容器 mgsh3 内，`/work` 为挑战包根目录）：

```bash
cd /work
./meshgate "$(cat an/frame_hex.txt)"     # 应打印 flag，exit 0
./meshgate "$(cat an/pkt0_hex.txt)"      # 应报 dropped，exit 1
```

---

## 12. 新手复盘：这道题教了什么

1. **别和"看不见的状态"死磕**。密钥派生依赖"内存里被修正过的缓冲"，磁盘上没有它的真身——纯枚举在原理上就输。
2. **oracle 优先，自证优于推演**。程序本身就是最好的解释器：构造一帧让它走完全流程，比自己复刻整个 KDF/GCM 可靠得多。
3. **把"过策略"和"解数据"解耦**。D3 = 帧本身，所以"喂对帧"一举两得；先解决"哪一帧能 PASS"，再谈解密。
4. **正反两条验证**。旧帧必被丢、新帧必放行——用拒绝路径反向证明你构造的帧是唯一答案。
5. **异构 ELF 就跑异构容器**。Apple Silicon 上跑 x86-64 动态链接程序，最快的路是 `docker run amd64/...`；QEMU 下尽量**手拉 .deb 直装**，别整 apt。
6. **取证型工具链值得沉淀**：自写 eBPF 虚拟机（`solve.py: VM`）、LD_PRELOAD 拦 libcrypto（`shim.c`）、BTF.ext 解析器（`_btfext.py`）——三道题以后都用得上。

---

## 附录 A：关键常量速查

| 项 | 值 |
|---|---|
| blob 魔数 | `MGRLB003` |
| map 快照魔数 | `MGMAP3` |
| loader 魔数 | `MGLDR3`，ifindex=`0x11` |
| KDF 标签 | `MeshGate/CO-RE/release-v3`（26B） |
| AAD 标签 | `MeshGate/XDP/CO-RE/release-v3`（30B） |
| KDF 输入长 | 26 + 32×3 = 122 B |
| AAD 输入长 | 30 + 32×2 = 94 B |
| blob 尺寸 | 8 + 12 + 2 + 42 + 16 = 80 B |
| 派生算法 | rotl64 / rotl32（见 §5.3） |
| 帧长 | 96 B（0x60） |

## 附录 B：分析工作区文件索引（`an/`）

| 文件 | 用途 |
|---|---|
| `solve.py` | 离线重建：map 解析、derive 复刻、eBPF VM、D1/D2/D3 暴搜（已证伪暴搜路线） |
| `bpf.asm` / `gate.asm` | eBPF 节 / 主二进制反汇编 |
| `_btf.py` / `_btfext.py` | BTF / BTF.ext(含 CO-RE relo) 解析 |
| `_parse_maps.py` / `_dump_elf.py` / `_dis_bpf.py` | 辅助取证脚本 |
| `shim.c` | LD_PRELOAD 拦截 SHA256/EVP，落盘每次 SHA256 输入缓冲 |
| `run_oracle.sh` | 编译 shim + 循环喂帧运行并收集 stdout/stderr/捕获缓冲 |
| `frame_hex.txt` | 最终被放行的 96 B 帧（hex） |
| `pkt0_hex.txt` / `pkt1_hex.txt` | PCAP 两帧（对照/拒绝路径） |
| `flag.txt` / `plaintext.bin` | 最终明文交付 |

---




