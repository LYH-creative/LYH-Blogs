---
title: 2026-GDUTctf-writeup
published: 2026-06-05
description: '记录看完花谱香港后赶的比赛'
image: ''
tags: [网安, ctf]
category: 比赛
draft: false 
lang: ''
---
## [Easy] Hidden Secret

Luminoria 在自己的博客（https://bili33.top）中放了一个秘密，据说只有机器人才能找到这个秘密，试问：你是机器人吗？

第一眼看到想到使用SQL注入，但打开页面后发现跟我使用的静态网站页面超像，于是猜到没有SQL库，决定换方法，先检验输入框会不会搜到东西。输入"我是机器人""I am robot"，发现均返回404。

说明跟搜索框没关系，于是在网页后面加后缀，尝试跟机器人有关的词：bot, robot，并分别访问html, js与txt文件，发现都返回404，后面发现还有bots, robots，终于试出来 https://bili33.top/robots.txt。

![](images/writeup_images/1.png)

发现有：

```
Disallow: /fLaG-15-hERe_lol
Sitemap: https://bili33.top/sitemap.xml
```

访问 https://bili33.top/fLaG-15-hERe_lol，发现下载文件 `fLaG-15-hERe_lol`。
![](images/writeup_images/2.png)
得到字符串：

```
666c61677b77654943304d655f746f2d6744555463736354662d5a4f5a365f454e6a6f792d5448455f67614d457d
```

没有"="，但也不排除base64，打开解码网站全部试一遍发现十六进制解码。

![](images/writeup_images/3.png)

---

## [Normal] Assembly_recovery

一个可疑的DOS程序从1990年代的BBS存档中被恢复，代码中充满了混淆指令和死胡同——显然有人试图在里面隐藏一些东西。找出来。

先找找有没有关于flag的信息发现有。

发现flag的线索在 `off_06AB` 里，并且长度为35。
![](images/writeup_images/4.png)
![](images/writeup_images/5.png)

得到36个十六进制数，转ASCII码都是乱码，重新回代码中找线索。
![](images/writeup_images/6.png)
![](images/writeup_images/7.png)
![](images/writeup_images/8.png)
![](images/writeup_images/9.png)
看不懂在干嘛，喂AI理解一下，去掉豆包的废话后发现。
![](images/writeup_images/11.png)
![](images/writeup_images/12.png)
那么来编写解题脚本并解题。

![](images/writeup_images/10.png)

得到 `flag{8086_r3ver5e_15_a_b@s1c_sk1ll}`。

---

## [Easy] double_crypto

题目：

```
#caesar_13_iv
import os
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad
from Crypto.Util.number import getPrime, bytes_to_long, long_to_bytes
import random

script_dir = os.path.dirname(os.path.abspath(__file__))
output_path = os.path.join(script_dir, "encrypted_params.txt")

p = getPrime(128)
q = getPrime(128)
n = p * q
e = 65537
phi = (p - 1) * (q - 1)
d = pow(e, -1, phi)

print(f"[RSA] n = {n}")
print(f"[RSA] e = {e}")

m = bytes_to_long(flag)
c_rsa = pow(m, e, n)
print(f"[RSA] c_rsa = {c_rsa}")

c_rsa_bytes = long_to_bytes(c_rsa, (n.bit_length() + 7) // 8)
aes_key = random.randbytes(16)
iv = random.randbytes(16)
cipher_aes = AES.new(aes_key, AES.MODE_CBC, iv)
padded_data = pad(c_rsa_bytes, AES.block_size)
c_aes = cipher_aes.encrypt(padded_data)

print(f"[AES] key = {aes_key.hex()}")
print(f"[AES] iv  = {iv.hex()}")
print(f"[AES] ct  = {c_aes.hex()}")

# n = 108460347539116548233850259329362939266582518558734624388997849930646568128401
# key = 8c0c5db5efdd4505b1cd88569b6bf8f5
# IV  = 6144s1oo1s1p7osq442p6qsr5733701p
# ciphertext = 0ffb5c8356bf6a0ea8e541fbc7f27aa00095f302dbc27b7e4842a500cfd9767b16c9fc8f7a8d420e8bd604b727a363fb
```

代码头有注释#caesar_13_iv，说明iv为凯撒密码，要对iv位移13位
接下来看代码，发现flag先被RSA加密又被AES加密

```
print(f"[RSA] n = {n}")
print(f"[RSA] e = {e}")

print(f"[AES] key = {aes_key.hex()}")
print(f"[AES] iv  = {iv.hex()}")
print(f"[AES] ct  = {c_aes.hex()}")
```

可以得到解题顺序
```
最终密文  →  AES解密  →  中间结果  →  RSA解密  →  flag
```
先编写脚本求iv，得出十六进制串

```
encoded_iv = '6144s1oo1s1p7osq442p6qsr5733701p'
decoded_iv = ''
for char in encoded_iv:
    if char.isdigit():
        decoded_iv = decoded_iv + char
    elif 'a' <= char <= 'z':
        number = ord(char) - ord('a')     
        number = (number + 13) % 26       
        new_char = chr(number + ord('a')) 
        decoded_iv = decoded_iv + new_char
    elif 'A' <= char <= 'Z':
        number = ord(char) - ord('A')
        number = (number + 13) % 26
        new_char = chr(number + ord('A'))
        decoded_iv = decoded_iv + new_char
    else:
        decoded_iv = decoded_iv + char
```

再写AES解题脚本

```
key = bytes.fromhex('8c0c5db5efdd4505b1cd88569b6bf8f5')
iv  = bytes.fromhex(decoded_iv)
ct  = bytes.fromhex('0ffb5c8356bf6a0ea8e541fbc7f27aa00095f302dbc27b7e4842a500cfd9767b16c9fc8f7a8d420e8bd604b727a363fb')
cipher = AES.new(key, AES.MODE_CBC, iv)
padded_data = cipher.decrypt(ct)
c_rsa_bytes = unpad(padded_data, AES.block_size)
c_rsa = int.from_bytes(c_rsa_bytes, 'big')
```

得到RSA需要的c，运用$m = c^d mod n$求解flag
用神秘网站factordb.com，直接分解n
![神秘网站factordb.com](images/writeup_images/13.png)

```
n = 108460347539116548233850259329362939266582518558734624388997849930646568128401
e = 65537

p = 319604865451981917438227037590936720137
q = 339357623313190301253627442856667763273

phi = (p - 1) * (q - 1)
d = inverse(e, phi)
m = pow(c_rsa, d, n)

flag_bytes = long_to_bytes(m)
print(f"  Flag: {flag_bytes.decode()}")
```

得到

```
flag{crypto_1s_fun}
```

---

## [Normal] dlp

题目：
```
from Crypto.Util.number import *
import math


m = bytes_to_long(flag)
n = 12658496303201581987904413378231672705848324463557650748242993254944407255926163828010653564020917857620982783176641954529909922267412737349457807433073478956716588664201001
print(pow(7,m,n))

'''
965034179468698868811585108402708910494957686334522514089846951965123540637986716168374511689067098771159300199946023700677529514020404560754430727137920456537319123516664
'''
```

题目代码里面有print(pow(7,m,n))，属于离散对数问题
直接到ctfwiki里看发现毛都看不懂
决定选个字多的解法先试试看
![ctfwiki神秘资料](images/writeup_images/14.png)

先用 factorint 对 n 进行因子分解

```
actors = factorint(n)
print(f"[*] n = p^5 * q")
p, q = None, None
for k, v in factors.items():
    if v == 5:
        p = k
    elif v == 1:
        q = k
    else:
        print(f"Unexpected factor: {k}^{v}")
print(f"    p = {p}")
print(f"    q = {q}")
print(f"    p^5 * q == n: {p**5 * q == n}")

```

得到

```
n = p^5 * q
    p = 10532208912748542707
    q = 97675309052127525561124163779796696566431155872900589821544185613370103125443
    p^5 * q == n: True
```

那么已知 $7^m ≡ c  mod  p$，可以用discrete_log直接求出 $m mod (p-1)$

```
m_mod_p1 = discrete_log(p, c % p, g % p)
```
得出

```
m ≡ 2302925804021240453 (mod p-1)
```

接下来求$p^5$，运用模数可以有

| 模数 $p^k$ | 对应阶 $\mathrm{prev\_order}$ |
|-----------|-----------------------------|
| $p^1$     | $p-1$                       |
| $p^2$     | $p \times (p-1)$            |
| $p^3$     | $p^2 \times (p-1)$          |
| $p^4$     | $p^3 \times (p-1)$          |
| $p^5$     | $p^4 \times (p-1)$          |

可以用已知 $mod pᵏ$ 的解，求 $mod p^(k+1)$


查资料有：“对质数 p，有一个绝对正确的公式：$g^( p^(k-2) * (p-1) ) ≡ 1 (mod p^(k-1))$”


可以用$prev_order = 低一阶模数 p^(k-1) 的欧拉函数 φ(p^(k-1))$，即$prev_order = p**(k-2) * (p-1)$，来保证低阶模数不影响高阶模数


满足$7^prev_order ≡ 1 (mod p^{k-1})$


令 $base = 7^{ordₖ} mod p^{k+1}$，由于 ordₖ 是 mod pᵏ 的阶，有 $base ≡ 1 (mod pᵏ)$，即 $base = 1 + b × pᵏ$，其中b表示base 减去 1后，还包含多少个 pᵏ


令 $ratio = c × (7^{mₖ})^{-1} mod p^{k+1}$，同样有 $ratio ≡ 1 (mod pᵏ)$，即 $ratio = 1 + r × pᵏ$，其中r表示ratio 减去 1后，还包含多少个 pᵏ


由 $(1 + b × pᵏ)^t ≡ 1 + t × b × pᵏ (mod p^{k+1})$ 得：$t ≡ r × b^{-1} (mod p)$（t的作用是把低阶正确的 m升级成高阶也正确的 m）

---
## 泰勒升阶推导
对上式两边取对数，有
$$
\ln\left(\left(1+bp^k\right)^t\right) \approx \ln\left(1+rp^k\right)
$$
化简得：
$$
t\cdot \ln(1+bp^k) \approx \ln(1+rp^k)
$$

当指数为 $nk\ (n>1)$ 取模时，项为 $p^k$ 的倍数，模 $p^{k+1}$ 后高阶小项直接为0，因此一阶泰勒展开成立：
$$
\ln(1+bp^k)\approx bp^k,\quad \ln(1+rp^k)\approx rp^k
$$

代入后得到模 $p^{k+1}$ 同余式：
$$
t\cdot bp^k \equiv rp^k \pmod{p^{k+1}}
$$

两边约去公因子 $p^k$：
$$
tb \equiv r \pmod{p}
$$

$p$ 为素数，两边同乘 $b$ 在模 $p$ 下的逆元 $b^{-1}$：
$$
t \equiv r\cdot b^{-1} \pmod{p}
$$

取区间 $0\le t<p$ 内唯一整数作为本轮修正量。

设低阶已知解为 $m_k$，欧拉函数 $\phi(p^{k-1})=p^{k-2}(p-1)$，更新高阶解：
$$
m_{k+1} = m_k + t\cdot \phi(p^{k-1})
$$

更新后的指数满足高阶同余约束：
$$
g^{m_{k+1}} \equiv c \pmod{p^{k+1}}
$$

### 层 2：$k=2$，升阶至模 $p^2$
对数一阶泰勒近似化简：
$$
t \cdot b p \equiv r p \pmod{p^3} \implies t b \equiv r \pmod{p}
$$

更新指数：
$$
m_2 = m_1 + t \cdot (p-1)
$$

验证条件：
$$
g^{m_2} \equiv c \pmod{p^2}
$$

### 层 3：$k=3$，升阶至模 $p^3$
对数一阶泰勒近似化简：
$$
t \cdot b p^2 \equiv r p^2 \pmod{p^4} \implies t b \equiv r \pmod{p}
$$

更新指数：
$$
m_3 = m_2 + t \cdot p(p-1)
$$

验证条件：
$$
g^{m_3} \equiv c \pmod{p^3}
$$

### 层 4：$k=4$，升阶至模 $p^4$
对数一阶泰勒近似化简：
$$
t \cdot b p^3 \equiv r p^3 \pmod{p^5} \implies t b \equiv r \pmod{p}
$$

更新指数：
$$
m_4 = m_3 + t \cdot p^2(p-1)
$$

验证条件：
$$
g^{m_4} \equiv c \pmod{p^4}
$$

### 层 5：$k=5$，升阶至模 $p^5$（最终解）
对数一阶泰勒近似化简：
$$
t \cdot b p^4 \equiv r p^4 \pmod{p^6} \implies t b \equiv r \pmod{p}
$$

最终指数解：
$$
\boldsymbol{m_5 = m_4 + t \cdot p^3(p-1)}
$$

最终验证条件：
$$
g^{m_5} \equiv c \pmod{p^5}
$$
  
---

由此可以用四轮循环，t修正每一轮的m得到脚本

```
current_m = m_mod_p1
for k in range(2, 6):
    pk = p ** k
    prev_order = p**(k-2) * (p-1)

    g_m = pow(g, current_m, pk)
    base = pow(g, prev_order, pk)

    inv_gm = pow(g_m, -1, pk)
    ratio = (c % pk) * inv_gm % pk

    r = ((ratio - 1) // p**(k-1)) % p
    b = ((base - 1) // p**(k-1)) % p

    if b == 0:
        t = 0
    else:
        t = (r * pow(b, -1, p)) % p

    current_m = current_m + t * prev_order
    print(f"[*] m mod p^{k} = {current_m}")
    assert pow(g, current_m, pk) == c % pk
```

得到结果

```
[*] m mod (p-1) = 2302925804021240453
[*] m mod p^2 = 39176519232581872013670662594510770485
[*] m mod p^3 = 1028507159944028131806916643921869209006575481181279792783
[*] m mod p^4 = 706900059475081675955418970903030737455000707376266479970373529597124989
[*] m mod p^5 = 706900059475081675955418970903030737455000707376266479970373529597124989
```

mod q同样用discrete_log求解

```
m_mod_q = discrete_log(q, c % q, g % q)
print(f"\n[*] m mod (q-1) = {m_mod_q}")
```

得到

```
[*] m mod (q-1) = 706900059475081675955418970903030737455000707376266479970373529597124989
```

若低位的p^5,q求出来的m相等，则m为$7^m mod n = c$中的m可以直接求出flag

```
if m_mod_q == current_m:
    m = current_m
    print(f"\n[+] m = {m}")
    print(f"[+] Flag: {long_to_bytes(m).decode()}")
```

最终使用的m

```
[+] m = 706900059475081675955418970903030737455000707376266479970373529597124989
```

```
Flag: flag{p4d1c_8r34k5_5m007h_d1p!}
```

所有脚本

```
from Crypto.Util.number import long_to_bytes
from sympy.ntheory.residue_ntheory import discrete_log
from sympy import factorint

n = 12658496303201581987904413378231672705848324463557650748242993254944407255926163828010653564020917857620982783176641954529909922267412737349457807433073478956716588664201001
c = 965034179468698868811585108402708910494957686334522514089846951965123540637986716168374511689067098771159300199946023700677529514020404560754430727137920456537319123516664
g = 7

factors = factorint(n)
print(f"[*] n = p^5 * q")
p, q = None, None
for k, v in factors.items():
    if v == 5:
        p = k
    elif v == 1:
        q = k
    else:
        print(f"Unexpected factor: {k}^{v}")
print(f"    p = {p}")
print(f"    q = {q}")
print(f"    p^5 * q == n: {p**5 * q == n}")

m_mod_p1 = discrete_log(p, c % p, g % p)
print(f"\n[*] m mod (p-1) = {m_mod_p1}")

current_m = m_mod_p1
for k in range(2, 6):
    pk = p ** k
    prev_order = p**(k-2) * (p-1)

    g_m = pow(g, current_m, pk)
    base = pow(g, prev_order, pk)

    inv_gm = pow(g_m, -1, pk)
    ratio = (c % pk) * inv_gm % pk

    r = ((ratio - 1) // p**(k-1)) % p
    b = ((base - 1) // p**(k-1)) % p

    if b == 0:
        t = 0
    else:
        t = (r * pow(b, -1, p)) % p

    current_m = current_m + t * prev_order
    print(f"[*] m mod p^{k} = {current_m}")
    assert pow(g, current_m, pk) == c % pk

m_mod_q = discrete_log(q, c % q, g % q)
print(f"\n[*] m mod (q-1) = {m_mod_q}")

if m_mod_q == current_m:
    m = current_m
    print(f"\n[+] m = {m}")
    print(f"[+] Flag: {long_to_bytes(m).decode()}")
else:
    print("\n[-] Need CRT to combine...")
```

---

## [Hard] Hard_RSA

准备用老方法，在factordb.com上解出p,q，结果直接爆炸了
!(images/writeup_images/15.png)

不能一下就出结果只能重新看题


看回代码发现hint = p ^ int(bin(q)[:1:-1], 2)，这里是说明hint是p与q的二进制取反后的按位与的结果


那可以发现是hint是p的低位和q的低位的按位与。


由于pq都是质数，那么p的低位与q的高位都是1


那么有$p[0] = hint[0] rev(q)[0] = hint[0] q[1023] = hint[0] 1，p[1023] = hint[1023] rev(q)[1023] = hint[1023] q[0] = hint[1023]$


按这个式子往后推，按00，01，10，11来一个一个验证，会发现要验证4的512次方的次数，电脑
肯定跑不动，那么要利用提示“本题考察的是p高位异或q低位, 若当前位为1, 则有两种情况(p该位
,q低位) = (1,0) 或 (0,1), 之后需深搜剪枝”，给验证增加限制。


限制：
 1、低位限制。p的高k位与q的低k位相乘的结果的低k位等于n的低k位，n已知，可以用这个来
保证每次最多产出两组数据（就是若当前位为1, 则有两种情况(p该位,q低位) = (1,0) 或 (0,1)），但
是依旧要算2的512次方次。


 2、高位限制。将p与q拆成高k位和低k位，低位有低位限制较为精准的匹配，而高位有可能因
为低位相乘而进位所以不能精准匹配只能限制范围。


 $n = p × q = (p_hi × 2^k + p_lo) × (q_hi × 2^k + q_lo)= p_hi × q_hi × 2^(2k) + (p_hi × q_lo + q_hi × p_lo) × 2^k + p_lo × q_lo$ 


因为p与q相乘，n的高k位基本受到p_hi × q_hi × 2^(2k)的影响，中间交叉项除以2^m，严格小于$p_hi+q_hi$；低位乘积项除以$2^2m$小于1，只占小数部分；两项之和小于$p_hi+q_hi+1$，向下取整
后，整数进位最大不超过$p_hi+q_hi$,那可以得到$0 (n 的高 2k 位) - (p_hi × q_hi) p_hi + q_hi$。


然后发现通过的数据量还是比较多，通过高位限制的减法的差值剪枝保留最符合的500个数据。


将这些喂给deepseek得到解题脚本

```
from Crypto.Util.number import long_to_bytes

# ===== 题目数据 =====
n = 15506029124581759883731877010026678084317596564623845887899438092385502505788876763933964579361424109382021382231528496798732059024524482151713325171639486420457394941860866209473196191369593552699332037800406803188425744888879341669298117415522135256197760970433068295376433901825213472877775961650704735980110797478663530226550826927371472539708004955260217467349256084341561939393239965422086991362274959066287273337775441222341779953501432423374860117147450567097601484513951627635181267391943247398991455924080275444033891766100290675621003429909230692808817844612088084185283952020514285897020048017098285487607
hint = 35080869474740923288440667226139263766809663972741616010125167413870818807731263611720339202493658576179169864796373789589720908588556372613040136899161161977582187646286542111786933046030864726526268890301129489800434114004740826222610096433130207488091525467451311102574449006410417503469441144272955120060
e = 65537
c = 3404828797407616762356057717328373023632337739358306740074913353654682753878441781707680321614928566526027104942039703664029951473159370373414396427796575662072885942253508395714925320824108994494818019552089038861843245914594176758067401273263619855151412631121305316746504116601393720951436954904410743447522317796529783182597484907144278305759260804616925210823084069899530710204757384834603517279458503129155125367916881883415239168542343899364769463318925187623514473074347933245188732089331953708333419481376964544509315472577419374465938363973415564516515135968931067578017564025321585478866998020572475056104

NBITS = 1024    # p 和 q 都是 1024 位

# ===== 工具函数 =====
def get_bit(x, i):
    """取整数 x 的第 i 位（0 = 最低位）"""
    return (x >> i) & 1

def init_rev(q):
    """初始化 rev(q) —— 只设置已知的两个位（位 0 = q 的 MSB，位 1023 = q 的 LSB）"""
    rev_q = 0
    if get_bit(q, 0):           # q[0] = 1，放到 rev 的最高位
        rev_q |= 1 << (NBITS - 1)
    if get_bit(q, NBITS - 1):   # q[1023] = 1，放到 rev 的最低位
        rev_q |= 1
    return rev_q

# ===== 初始化候选 =====
q_init = (1 << (NBITS - 1)) | 1      # q = 2^1023 + 1 (只有 MSB 和 LSB 是 1)
rev_q_init = init_rev(q_init)         # rev(q) = 2^1023 + 1 (对称)
p_init = hint ^ rev_q_init            # p = hint ⊕ rev(q)

candidates = [(q_init, rev_q_init, p_init, 1)]  # (q, rev_q, p, k=已确定对数)

# ===== BFS 主循环 =====
for step in range(1, NBITS // 2):     # step 从 1 到 511
    new_candidates = set()             # 用 set 去重

    for q_val, rev_q, p_val, k in candidates:
        # 尝试 q[k] 和 q[1023-k] 的 4 种组合
        for qk in (0, 1):              # q[k] 的值
            for q_mk in (0, 1):        # q[1023-k] 的值

                # --- 增量更新 q ---
                q_new = q_val | (qk << k) | (q_mk << (NBITS - 1 - k))

                # --- 增量更新 rev(q) ---
                # rev(q)[k] = q[1023-k], rev(q)[1023-k] = q[k]
                rev_q_new = rev_q | (q_mk << k) | (qk << (NBITS - 1 - k))

                # --- 增量更新 p ---
                p_new = p_val
                # p[k] = hint[k] ⊕ q[1023-k]
                if ((p_val >> k) & 1) != ((hint >> k) & 1 ^ q_mk):
                    p_new ^= (1 << k)
                # p[1023-k] = hint[1023-k] ⊕ q[k]
                if ((p_val >> (NBITS - 1 - k)) & 1) != ((hint >> (NBITS - 1 - k)) & 1 ^ qk):
                    p_new ^= (1 << (NBITS - 1 - k))

                # ===== 检查约束 =====

                # 低位约束：(p_low × q_low) mod 2^(k+1) == n mod 2^(k+1)
                mask_low = (1 << (k + 1)) - 1          # 低 k+1 位的掩码
                p_low = p_new & mask_low
                q_low = q_new & mask_low
                if (p_low * q_low) & mask_low != n & mask_low:
                    continue    # 不通过，丢弃

                # 高位约束：0 ≤ n_hi - p_hi×q_hi ≤ p_hi + q_hi
                shift_top = NBITS - (k + 1)            # 右移量，保留高 k+1 位
                p_hi = p_new >> shift_top              # p 的高 k+1 位
                q_hi = q_new >> shift_top              # q 的高 k+1 位
                shift_n = 2 * NBITS - 2 * (k + 1)      # n 的对应移位
                n_hi = n >> shift_n                    # n 的高 2(k+1) 位
                prod = p_hi * q_hi
                if not (0 <= n_hi - prod <= p_hi + q_hi):
                    continue    # 不通过，丢弃

                # 两个约束都通过，加入下一轮
                new_candidates.add((q_new, rev_q_new, p_new, k + 1))

    # ===== 剪枝：候选太多时只保留最好的 500 个 =====
    if len(new_candidates) > 500:
        nc_list = list(new_candidates)
        # 按高位匹配度排序（差值越小越好）
        nc_list.sort(key=lambda x:
            abs((n >> (2 * NBITS - 2 * x[3])) - ((x[0] >> (NBITS - x[3])) * (x[2] >> (NBITS - x[3]))))
        )
        new_candidates = set(nc_list[:500])

    candidates = list(new_candidates)

# ===== 验证并解密 =====
for q_val, rev_q, p_val, k in candidates:
    if p_val * q_val == n:                          # 找到了！
        phi = (p_val - 1) * (q_val - 1)             # 计算 φ(n)
        d = pow(e, -1, phi)                         # 计算私钥 d
        m = pow(c, d, n)                             # 解密
        flag = long_to_bytes(m)                      # 大整数 → 字符串
        print(flag.decode())
        break
```

得到

```
flag{4160r17hm1c_15_4150_1mp0r74n7!}
```

---



## 总结

那么我的writeup就到这里了。感谢各位出题人，这次比赛真的学到了很多东西，特别是第一次知道还有ctfwiki这种网站。

这里收录了所有AI写的markdown：https://lyh-blogs.vercel.app/posts/gdut-2026-ctf-crypto_writeup/
