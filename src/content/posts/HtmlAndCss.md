---
title: 之前学习前端的一些笔记只有html与css
published: 2026-07-15
description: 'HTML与CSS的笔记'
image: ''
tags: [前端]
category: '前端'
draft: false 
lang: ''
---
# HTML

创建文件后缀为\.html

写完先保存再刷新网页Ctrl\+S

URL指存储位置和名字

分析内容（整体\-\>局部）\-\>写代码\-\>保存\-\>刷新浏览器看效果

## 标签

### 双标签

\<\(开始标签\)\>内容\</\(结束标签\)\>\(双标签\)

\<\>成对出现，中间为内容，\<\>里放英语，结束标签要多一个/

### 单标签

无结束标签

\<br\>:换行\<hr\>:水平线



## 基本骨架

### 网页模板

`<html>`//整个网页

`<head>`//网页头部，放给浏览器看的代码

`<title>网页标题</title>`

`<head>`

`<body>`

`网页主体`//放给用户看的代码

`</body>`

`</html>`

\(vs code中\!配合Enter/Tab键生成\)



## 标签的关系

嵌套关系

并列关系

向后缩进:Tab     向前缩进:Shift \+ Tab

## 注释

<\!\-\-\.\.\.\-\-\>

不会在浏览器中显示

(vs code添加删除快捷键Ctrl \+ /\)

## 标题标签

标签名: h1 \~ h6\(双标签\)

特点:   1\.文字加粗   2\.字号逐渐减小   3\.独占一行\(换行\)

h1在网页中只能用一次



## 段落标签

标签名: p\(双标签\)

特点：1\.独占一行   2\.段落之间存在间隙

文字太多可alt \+ z换行（vs code中）



## 换行和水平线标签

换行：\<br\>（单标签）

`<body>`

`第一行内容`

`<br>`

`第二行内容`

`</body>`

（浏览器不识别代码中的回车键）

水平线：\<hr\>（单标签）

`<body>`

`内容`

`<hr>`

`</body>`

## 文本格式化标签

两个文本格式化标签在一行显示

|标签名\(常用\)|标签名|效果|
|---|---|---|
|strong|b|加粗|
|em|i|倾斜|
|ins|u|下划线|
|del|s|删除线|

## 图像标签

\<img src="图片的URL" alt="文字"\>（单标签）

src \-\> 指定图像的位置和名称，是\<img\>的必须属性

alt \-\> 图像显示失败后显示的文字，不是必须属性

(URL \-\> \./ \+ 文件名\(文件要与html文件在同一个文件夹\)在vs code中有快捷提示\)

|属性|作用|说明|
|---|---|---|
|alt|替换文本|图像显示失败后显示的文字|
|title|提示文本|鼠标悬停在图片上时显示的文字|
|width|图片的宽度|值为数字，没有单位|
|height|图片的高度|值为数字，没有单位|

浏览器缩放图片默认时等比例缩放

属性名="属性值"

标签名和属性之间用空格隔开，不分先后顺序



## 路径

查找文件时从起点到终点经历的路线

### 相对路径（重点）

从当前文件位置出发查找目标文件

/表示进入某个文件夹里面                          文件夹名字/

\.表示当前文件所在文件夹                           \./

\.\.表示当前文件上一级文件夹                       \.\.

|\./1\.jpg|图片在html文件所在文件夹|
|---|---|
|\./文件夹/2\.jpg|图片在html文件所在文件夹的下级文件夹|
|\.\./3\.jpg|图片在html文件所在文件夹的上级文件夹|

### 绝对路径

从盘符出发查找目标文件（Windows电脑从盘符出发   Mac电脑从根目录\(/\)出发）

例：\<img src="C:\\iimages\\mao\.jpg"\>

Windows 默认是\\ ，其他系统是/，建议统一写为/ \(Windows也可\)

也可以用其他网页中的图片地址（右键选复制图片地址）

应用场景：友情链接

## 超链接标签

作用：点击跳转到其他页面

\<a href="网址"\>文字内容\</a\>

href属性值是跳转地址，是超链接的必须属性

href属性值写其他\.html文件的位置可以跳转到本地文件（相对路径查找）

在href后面尖括号前面加\(要空格\)target="\_blank"打开新窗口不会覆盖原窗口

href属性值写\#表示空链接，不会跳转（开发初期）

段落中写超链接标签可先空格刷出代码提示在删除空格

## 音频标签

\<audio src="音频的URL"\>\</audio\>（双标签）

|属性|作用|特殊说明|
|---|---|---|
|src\(必须属性\)|音频URL|支持格式:MP3,Ogg,Wav|
|controls|显示音频控制面板||
|loop|循环播放||
|autoplay|自动播放|一般浏览器禁用|

例:\<audio src="\./media/music\.mp3" controls\> \</audio\>

若属性名和属性值一样，可简写为一个单词（controls后面没有东西）

(\-\>controls="controls"\)



## 视频标签

\<video src="视频的URL"\>\</video\>（双标签）

|属性|作用|特殊说明|
|---|---|---|
|src\(必须属性\)|视频URL|支持格式:MP3,Ogg,Wav|
|controls|显示音频控制面板||
|loop|循环播放||
|muted|静音播放||
|autoplay|自动播放|一般浏览器支持在静音状态自动播放|

与音频标签一样controls等属性不用属性值



## 列表

### 无序列表

不需要规定顺序

标签：ul嵌套li，ul是无序列表，li是列表条目

`<ul>`

`<li>...</li>`

`<li>...</li>`

`...`

`</ul>`

ul标签里只能包裹li标签

li标签里可以包裹任何内容

### 有序列表

需要规定顺序

标签：ol嵌套li，ol是有序列表

`<ol>`

`<li>...</li>`

`<li>...</li>`

`...`

`</ol>`

ol标签里只能包裹li标签

li标签里可以包裹任何内容

### 定义列表

标签：cl嵌套dt和dd，dl是定义列表，dt是定义列表的标题，dd是定义列表的内容

`<dl>`

`<dt>列表标题</dt>`

`<dd>列表内容</dd>`

`...`

`</dl>`

dl标签里只能包裹dt标签和dd标签

dt标签和dd标签里可以包裹任何内容

## 表格

标签：table嵌套tr，tr嵌套td / th

|标签名|说明|
|---|---|
|table|表格|
|tr|行|
|th|表头单元格（第一行）|
|td|内容单元格（第一行往下）|

在网页中表格默认没有边框线，用border属性可添加

例：\<table border="1"\>

### 表格的结构标签

双标签

作用：把表格划分区域（其实看不出效果）

|标签名|含义|特殊说明|
|---|---|---|
|thead|表格头部|表格头部内容|
|tbody|表格主体|主要内容区域|
|tfoot|表格底部|汇总信息区域|

### 合并单元格

合并同类信息

跨行合并\-\>保留最上单元格，添加属性rowspan

跨列合并\-\>保留最左单元格，添加属性colspan

取值为数字，表示需要合并的单元格数量

注意要删除其他单元格

例：\<td rowspan="2"\>\.\.\.\</td\>

例：\<td colspan="2"\>\.\.\.\</td\>

## 表单

\<from action="\.\.\."\>\.\.\.\</from\>表单区域

action的属性值为发送数据的地址

作用：登录页面，注册页面，搜索区域

CSS:加outline: none;去掉焦点框

### input标签

type属性值不同，功能不同

\<input type="\.\.\."\>（单标签）

|type属性值|说明|
|---|---|
|text|文本框，输入单行文本|
|password|密码框|
|radio|单选框|
|checkbox|多选框|
|file|上传文件|

占位文本：提示信息\(文本框和密码框可以用\)

\<input type="\.\.\." placeholder="提示信息"\>

::placeholder 选中placeholder属性文字样式

#### 单选框

|属性名|作用|特殊说明|
|---|---|---|
|name|控件名称|控件分组，同组只能选中一个（单选功能）|
|checked|默认选中|属性名和属性值系统，简写为一个单词|

name自定义属性值

例：\<input type="radio" name="gender" checked\>男

\<input type="radio" name="gender"\>女

#### 上传文件

添加multiple属性可以实现文件多选功能

\<input type="file" multiple\>

（Ctrl \+ A 可全选文件）

#### 多选框

checked默认选中

\<input type="checkbox" checked\>

### 下拉菜单

标签：select嵌套option，select是下拉菜单整体，option是下拉菜单的每一项

selected默认选中

`<select >`

`<option>...</option>`

`<option>...</option>`

`<option selected>...</option>`

`</select>`

### 文本域

多行输入文本

标签：textarea，双标签

\<textarea\>默认提示文字\</textarea\>

右下角有拖拽功能，一般禁用，用CSS设置尺寸

### label标签

网页中某个标签的说明文本 

可用来绑定文字和表单控件的关系，增大表单控件的点击范围

\(如点击文字可以选中单选框\)

#### 写法1

只包裹内容，不包裹表单控件

设置label标签的for属性值和表单控件的id属性值相同

例：\<input type="radio" id="man"\>\<label for="man"\>男\</label\>

#### 写法2

包裹文字和表单控件，不需要属性

例：\<label\>\<input type="radio"\>女\</label\>



### 按钮

\<button type="\.\.\."\>\.\.\.\</button\>

|type属性值|说明|
|---|---|
|submit|提交按钮，提交数据到后台（默认功能）|
|reset|重置按钮，将表单控件恢复默认值|
|button|普通按钮，默认没有功能|



## 无语义的布局标签

div：独占一行（大盒子）

\<div\>\.\.\.\</div\>

与p标签相比div标签可以加很多东西

span：不换行（小盒子）

\<span\>\.\.\.\</span\>

## 字符实体

作用：在网页中显示预留字符

|显示结果|描述|实体名称|
|---|---|---|
||空格|\&nbsp;|
|\<|小于号|\&lt;|
|\>|大于号|\&gt;|

## 显示模式

布局网页时选择合适的标签摆放内容

### 块级元素

如div标签

独占一行

宽度默认是父级的100%

添加宽高属性生效

### 行内元素

如span标签,a标签

一行内存在多个

尺寸由内容撑开

加宽高不生效

#### 内外边距问题

添加margin和padding，无法改变元素垂直位置

可添加line\-height来改变垂直位置

### 行内块元素

如img元素

一行共存多个

默认尺寸由内容撑开

加宽高生效

### vertical\-align

行内块和行内垂直方向对齐方式

## 转换显示模式\(CSS\)

display

|属性值|效果|
|---|---|
|block|块级|
|inline\-block|行内块|
|inline|行内|



## 浮动

让块元素水平排列（脱离标准流）

float

属性值

|left（fll）|左对齐|
|---|---|
|right（flr）|右对齐|

顶对齐，有行内块显示模式特点

### 清除浮动

若父级没有高度，子级无法撑开父级高度

1，额外标签法

在父元素内容的最后添加一个块级元素，设置CSS属性clear:both

2\.单伪元素法

放父级元素的CSS中

\.clearfix::after\{

content:"";

display:block;

clear:both;

\}

3\.双伪元素法

\.clearfix::before,

\.clearfix::after\{

content:"";

display:table;

\}



,clearfix::after\{

clear::both;

\}

before解决外边距塌陷问题

after清除浮动

4\.overflow

父级元素添加CSS属性overflow:hidden



# CSS

美化HTML文档的内容

## 内部样式表

title标签下面添加style双标签，style标签里写CSS代码

`<title>...</title>`

`<style>`

`/*选择器{}*/`//找目标标签

例：`p{`

`/*CSS属性，如color:red;（文字颜色）font-size:30px;（字号） */`

`}`

`</style>`

## 外部样式表

CSS代码在单独的CSS文件中（\.css）

在HTML使用link标签引入

例：`<link rel="stylesheet" href="./my.css">`

## 行内样式

CSS写在标签的style属性值里

例：`<div style="color: red;font-size:30px;">...</div>`



## 选择器

### 标签选择器

使用标签名作为选择器，选中同名标签设置相同的样式

无法差异化同名标签的样式

### 类选择器

差异化同名标签的样式

一个类选择器可以给多个标签使用

一个标签可以使用多个类名，class属性值写多个类名 ，类名用空格隔开

1\.定义选择器\-\>\.类名（注意有点）（尽量用英语）

2\.使用类选择器\-\>标签添加class="类名"（注意没点）

例：`<style>`

`.red{`

`color:red;`

`}`

`</style>`

`...`

`<div class="red">...</div>`



### id选择器

差异化设置标签的显示效果

一般配合JS使用

同一个id选择器在一个页面只能使用一次

1\.定义id选择器 \-\> \#id名

2\.使用id选择器 \-\> 标签添加id="id名"

例：`<style>`

`#red{`

`color:red;`

`}`

`</style>`

`<div id="red">...</div>`

### 通配符选择器

查找页面所有标签，设置相同样式

\*，不需要调用，浏览器自动查找页面所有标签，设置相同的样式

优先级较低

在开发初期用于清除默认样式（清除间隔）


### 画盒子

使用合适的选择器画盒子

|属性名|作用|
|---|---|
|width|宽度|
|height|高度|
|background\-color|背景色|

## 复合选择器

由两个或多个基础选择器，通过不同的方式组合而成（更准，更精确）

### 后代选择器

父选择器 子选择器，两个选择器之间用空格隔开

例：`<style>`

`div span{`

`color:red;`

`}`

`</style>`

`<div>`

`<span>...</span>`

`</div>`

选中所有后代，即div标签内的所有内容

### 子代选择器

选中某元素的子代元素（最近的子集）

父选择器 \> 子选择器，父子选择器之间用 \> 隔开

例：`<style>`

`div > span {`

`color:red;`

`}`

`</style>`

`<div>`

`<span>...</span>`

`<p>`

`<span>...</span>`

`</p>`

`</div>`

只选中了第一个span

### 并集选择器

选中多组标签设置相同的样式

选择器1，选择器2，选择器3，\.\.\.，选择器N\{CSS属性\}，选择器之间用，隔开

例：`<style>`

`div,`

`p,`

`span{`

`color:red;`

`}`

`</style>`

### 交集选择器

选中同时满足多个条件的元素

选择器1选择器2\{CSS属性\}，选择器之间连写，没有任何符号

例：`p.box{`

`color:red;`

`}`

标签选择器必须写在最前面

## 伪类选择器

伪类表示元素状态，选中元素的某个状态设置样式

鼠标悬停状态：选择器：hover\{CSS属性\}

例：`<style>`

`a:hover{`

`color:red;`

`}`

`.box:hover{`

`color:green;`

`}`

`</style>`

|选择器|作用|
|---|---|
|:link|访问前|
|:visited|访问后|
|:hover|鼠标悬停|
|:active|点击时（激活）|

多状态按LVHA的顺序书写

## 文字控制属性

|描述|属性||
|---|---|---|
|大小|font\-size||
|粗细|font\-weight||
|倾斜|font\-style||
|行高|line\-height|行与行之间的间隔\(间距为letter\-spacing\)|
|字体族|font\-family|字体样式如仿宋等|
|复合属性|font||
|缩进|text\-indent||
|对齐|text\-align||
|修饰线|text\-decoration ||
|颜色|color||

### 字体大小

font\-size

常用单位为px（像素）必须要有单位

例：`P{`

`font-size:30px;`

`}`



### 字体粗细

font\-weight

属性值为数字

|正常|400|
|---|---|
|加粗|700|

属性值为关键字

|正常|normal|
|---|---|
|加粗|bold|

### 倾斜

font\-style

清除文字默认的倾斜效果（em标签默认倾斜）

|正常|normal|
|---|---|
|倾斜|italic|

### 行高

设置多行文本的间距

line\-height

属性值：数字 \+ px 或 数字(当前标签font\-size属性值的倍数\)

例：`line-height:30px;`

`line-height:2;`//当前标签字体大小为16px (运行后变32px\)

测量行高：从一行文字的最顶端（最底端）量到下一行文字的最顶端（最底端）

垂直居中：行高属性值等于盒子高度属性值（只能单行文字）

### 字体族

font\-family

属性值：字体名

例：`font-family:楷体；`

可以写多个字体名，各个字体名用逗号隔开，执行顺序为从左到右依次查找

`font-family:Microsoft YaHei, Heiti SC, tahoma, arial, Hiragino Sans GB, "\5B8B\4F53", sans-serif;`

属性最后设置一个字体族名，网页开发建议使用无衬线字体



### font复合属性

设置网页文字公共样式

例：`div{`

`font:italic 700 30px/2 楷体;`

`}`倾斜，加粗，字号，行高，字体

必须按顺序书写

字号和字体值必须书写，否则font属性值不生效



### 缩进

text\-indent

属性值：数字 \+ px 或 数字  \+ em\(1 em为当前标签的字号大小\)



### 对齐

text\-align

|属性值|效果|
|---|---|
|left|左对齐|
|center|居中对齐|
|right|右对齐|

调整文字内容，不改变标签位置

也可以用于图片居中

### 修饰线

text\-decoration

|属性值|效果|
|---|---|
|none|无|
|underline|下划线|
|line\-through|删除线|
|overline|上划线|

### 颜色

color

|表示方式|属性值|说明|使用场景|
|---|---|---|---|
|颜色关键字|颜色英语单词|red,green,blue\.\.\.|学习测试|
|rgb表示法|rgb\(r,g,b\)|r,g,b表示红绿蓝三原色，取值：0\-255|了解|
|rgba表示法|rgb\(r,g,b,a\)|a表示透明度，取值：0\-1|开发使用，实现透明色|
|十六进制表示法|\#RRGGBB|\#000000,\#ffcc00,简写：\#000,\#fc0|开发使用（从设计稿复制）|

## 继承性

子级默认继承父级的文字控制属性

若标签有自己的样式则不继承

例：`body{`

`font-size: 30px;`

`}`

`<body>`

`<h1>...</h1>`

`</body>`

h1标签内容大小不变

## 层叠性

相同的属性会覆盖：后面的CSS属性覆盖前面的属性

不同的属性会叠加：不同的CSS属性会生效

从上往下读取代码

## 优先性

当一个标签使用了多种选择器时，基于不同种类的选择器的匹配规则

规则：选择器优先级高的样式生效

公式：通配符选择器＜标签选择器＜类选择器\<id选择器＜行内样式\<！important（选中标签的范围越大，优先级越低）

\! important 加在分号前面\-\>提权功能，将权重/优先级提到最高

例：`* {`

`color:red !important;`

`}`

使用复合选择器需要权重叠加计算（每一级之间不存在进位）

（行内样式，id选择器个数，类选择器个数，标签选择器个数）

从左向右依次比较选个数，同一级个数多的优先级高，如果个数相同，则向后比较

\!important权重最高

继承权重最低



## 背景属性

|描述|属性|
|---|---|
|背景色|background\-color|
|背景图|background\-image|
|背景图平铺方式|background\-repeat|
|背景图位置|background\-position|
|背景图缩放|background\-size|
|背景图固定|background\-attachment|
|背景复合属性|background|

### 背景色

透明：background\-color: transparent;

### 背景图

background\-image（bgi）

属性值：url(背景图URL)

例：`div{`

`width:400px;`

`height:400px;`

`background-image:url(./images/1.png);`

`}`

背景图默认是平铺（复制）的效果



### 背景图平铺方式

background\-repeat（bgr）

属性值

|属性值|效果|
|---|---|
|no\-repeat|不平铺|
|repeat|平铺（默认效果）|
|repeat\-x|水平方向平铺|
|repeat\-y|垂直方向平铺|



### 背景图位置

background\-position（bgp）

属性值 \-\> 水平方向，垂直方向

关键字

|关键字|位置|
|---|---|
|left|左侧|
|right|右侧|
|center|居中|
|top|顶部|
|botton|底部|

坐标（数字 \+ px，正负都可以）

0 0表示左上角（left top）

水平：正数向右，负数向左

垂直：正数向下，负数向上

例：`div{`

`width:400px;`

`height:400px;`

`background-image:url(./images/1.png);`

`background-repeat:no-repeat;`

`background-position:center botton;`

`background-position:50px -100px;`

`background-position:50px center;`

`}`

关键字取值方式写法，可以颠倒顺序

可以只写一个关键字，另一个方向默认为居中

数字只写一个表示水平方向，垂直方向为居中



### 背景图缩放

background\-size（bgz）

属性值

关键字：

cover:等比例缩放背景图片以完全覆盖背景区，\(图片完全覆盖盒子\)可能背景图片部分看不见

contain:等比例缩放背景图片以完全装入背景区，\(图的宽高跟盒子尺寸相等停止缩放\)可能背景区部分空白

百分比：根据盒子尺寸计算图片大小（图片的宽度跟盒子宽度一样，图片的高度按照图片比例等比缩放）

数字 \+ 单位（例如：px）



### 背景图固定

背景不会随元素的内容滚动

background\-attachment（bga）

属性值：fixed

例：`body{`

`background-image:url(./images/bg.jpg);`

`background-repeat:no-repeat;`

`background-attachment:fixed;`

`}`



### 背景复合属性

background（bg）

属性值：背景色 背景图 背景图平铺方式 背景图位置/背景图缩放 背景图固定\(空格隔开各个属性值，不区分顺序）

例：`div{`

`width:400px;`

`height:400px;`

`background:pink url(./images/1.png) no-repeat right center/cover;`

`}`



## 结构伪类选择器

根据元素的结构关系查找元素

|选择器|说明|
|---|---|
|E:first\-child|查找第一个E元素|
|E:last\-child|查找最后一个E元素|
|E:nth\-child\(N\)|查找第N个E元素\(第一个元素N值为1\)|

例：`li:first-child{`

`background-color:green;`

`}`

:nth\-child公式

查找多个元素

|功能|公式|
|---|---|
|偶数标签|2n|
|奇数标签|2n\+1;2n\-1|
|找到倍数为5的标签|5n|
|找到第5个以后的标签|n\+5|
|找到第5个以前的标签|\-n\+5|



## 伪元素选择器

摆放装饰性的内容

|选择器|说明|
|---|---|
|E::before|在E元素里面最前面添加一个伪元素|
|E::after|在E元素里面最后面添加一个伪元素|

必须设置context:""属性，用来设置伪元素内容，若没有内容，则引号留空

伪元素默认是行内显示模式

权重和标签选择器相同

例：`div::before{`

`context:"...";`

`}`

## 盒子模型

内容区域\-\-\-width \& height

内边距\-\-\-padding（出现在内容于盒子边缘之间）

边框线\-\-\-border

外边距\-\-\-margin（出现在盒子外面）

### 边框线

border（bd）

属性值：边框线粗细 线条样式 颜色 （不分顺序）

|属性值|线条样式|
|---|---|
|solid|实线|
|dashed|虚线|
|dotted|点线|

border\-方位名词（bd\+方位名词首字母，例如bdl）

属性值：边框线粗细 线条样式 颜色 （不分顺序）

例：`div{`

`border-top: 2px solid red;`

`border-right: 3px dashed green;`

`border-bottom: 4px dotted blue;`

`border-left: 5px solid orange;`



`width: 200px;`

`height: 200px;`

`background-color: pink;`

`}`

### 内边距

设置内容与盒子边缘之间的距离

padding/padding\-方位名词

多值写法

|取值个数|示例|含义|
|---|---|---|
|1|padding:10px;|四个方向内边距均为10px|
|4|padding:10px 20px 30px 40px|上右下左|
|3|padding:10px 20px 30px|上  左右  下|
|2|padding:10px 20px|上下  左右|

从上开始顺时针转一圈，如果当前方向没有数值，则与对面一样

### 尺寸计算

盒子尺寸 = 内容尺寸 \+ border尺寸 \+ 内边距尺寸

内减模式：box\-sizing:border\-box;（不会撑大盒子）



### 外边距

margin

与padding属性值写法，含义相同

不会撑大盒子

版心居中：margin: 0 auto;

#### 合并现象

垂直排列的兄弟元素，上下margin会合并

取两个margin中的较大值生效

#### 塌陷问题

父子级的标签，子级的添加上边距会产生塌陷问题 \-\> 导致父级一起向下移动

可：取消子级margin,父级设置padding

父级设置overflow:hidden;

父级设置border\-top;

### 元素溢出

overflow

|属性值|效果|
|---|---|
|hidden|溢出隐藏|
|scroll|溢出滚动（无论是否溢出，都显示滚动条位置）|
|auto|溢出滚动（溢出才显示滚动条位置）|

### 圆角

设置外边框为圆角

border\-radius

属性值：数字 \+ px / 百分比（圆角半径）

最大值为50%，超过没有效果

从左上角顺时针赋值，没有取值的角与对角取值相同

四值：左上  右上   右下   左下

三值：左上   右上\+左下   右下

两值：左上\+右下   右上\+左下

正圆形状：正方形盒子设置圆角属性值为宽高的一半/50%

例：`img{`

`width:200px;`

`height:200px;`

`border-radius:100px;`

`border-radius:50%;`

`}`

胶囊形状：长方形盒子设置圆角属性值为盒子高度的一半

例：`div{`

`width:200px;`

`height:80px;`

`background-color:orange;`

`border-redius:40px;`

`}`

### 阴影

box\-shadow

属性值：x轴偏移量  y轴偏移量  模糊半径  扩散半径  颜色  内外阴影

内阴影 inset

## 清除默认样式

\*\{

margin:0;

padding:0;

\}

去掉列表的项目符号

li\{

list\-style:none;

\}

## flex布局

网页中经典排列布局（一个接一个盒子）（横向）

给父元素设置display:flex,子元素可以自动挤压或拉伸

组成：弹性容器，弹性盒子，主轴（默认水平），侧轴/交叉轴（默认垂直）

|描述|属性|
|---|---|
|创建flex容器|display:flex|
|主轴对齐方式|justify\-content|
|侧轴对齐方式|align\-items|
|某个盒子侧轴的对齐方式|align\-self|
|修改主轴方向|flex\-direction|
|弹性伸缩比|flex|
|弹性盒子换行|flex\-wrap|
|行对齐方式|align\-content|

### 主轴对齐方式 

属性名：justify\-content

|||
|---|---|
|属性值|效果|
|flex\-start|默认值，弹性盒子从起点开始排列|
|flex\-end|弹性盒子从终点开始排列|
|center|弹性盒子沿主轴居中排列|
|space\-between|弹性盒子沿主轴均匀排列，空白间距均分在弹性盒子之间|
|space\-around|弹性盒子沿主轴均匀排列，空白间距均分在弹性盒子两侧|
|space\-evenly|弹性盒子沿主轴均匀排列，弹性盒子与容器之间间距相等|

### 侧轴对齐方式

align\-items\-\> 弹性容器

align\-self \-\> 弹性盒子

|属性值|效果|
|---|---|
|stretch|弹性盒子沿侧轴线被拉伸至铺满容器|
|center|弹性盒子沿主轴居中排列|
|flex\-start|弹性盒子从起点开始排列|
|flex\-end|弹性盒子从终点开始排列|

### 修改主轴方向

主轴默认水平，侧轴默认垂直

flex\-direction

|属性值|效果|
|---|---|
|row|水平方向，从左向右（默认）|
|column|垂直方向，从上向下|
|row\-reverse|水平方向，从右向左|
|column\-reverse|垂直方向，从下向上|

### 弹性伸缩比

控制主轴的尺寸

属性值：整数     表示占用父级剩余尺寸的份数

### 弹性盒子换行

默认：所有弹性盒子都在一行显示

属性值：wrap  换行

nowrap 不换行\(默认\)

### 行对齐方式

对单行盒子不生效

|属性值|效果|
|---|---|
|flex\-start|默认值，弹性盒子从起点开始排列|
|flex\-end|弹性盒子从终点开始排列|
|center|弹性盒子沿主轴居中排列|
|space\-between|弹性盒子沿主轴均匀排列，空白间距均分在弹性盒子之间|
|space\-around|弹性盒子沿主轴均匀排列，空白间距均分在弹性盒子两侧|
|space\-evenly|弹性盒子沿主轴均匀排列，弹性盒子与容器之间间距相等|



## 版心效果

`.wrapper{`

`margin: 0 auto;`

`width: 1200px;`

`}`

有时1240px

## header区域

height和background\-color

通栏：宽度与浏览器窗口相同的盒子

标签结构：通栏\>版心（display:flex;）\>logo\+导航\+搜索\+用户

### logo

单击跳转首页，搜索引擎优化

标签结构：h1 \> a \> 网站名称（关键字）

CSS样式：例：

`.logo a{`

`display: block;`

`width: 195px;`

`height: 41px;`

`back-ground-image: url(../images/logo.png);`

`font-size: 0;`//不可以直接删除文字要用来超链接

`}`



### 导航

单击跳转页面

标签结构：ul \> li\*n \> a
li设置 右侧margin

a设置 左右padding

鼠标悬停状态 \-\> 伪类选择器

### 搜索区域

标签结构：\.search （display: flex;）\> input \+ a / button

### 用户区域

标签结构：\.user \> a \> img \+ span

## banner区域

### 左侧侧导航

标签结构：\.left \> ul \> li\*9 \> a



### 右侧课程表

标签结构：\.right \> h3 \+ \.content



## recommend区域

标签结构：\.recommend \> h3 \+ ul \+ a\.modify

flex布局



## 盒子区域

标签结构：\.hd \(标题\)\+ \.bd \(内容\)  \(div\)

flex布局



## 定位

改变盒子在网页中的位置

模式：position

边偏移：设置盒子的位置 

left,right,top,bottom

### 相对定位

position：relative

改变位置的参照物是自己原来的位置

不脱标，占位

标签显示特点不变

### 绝对定位

position: absolute

使用场景：子级绝对定位，父级相对定位

脱标，不占位

参照物：先找最近的已经定位的祖先元素；如果所有祖先元素都没有定位，参照浏览器开始区改位置

标签显示特点改变：宽高生效（具备了行内块的特点）

### 定位居中

绝对定位

水平，垂直边偏移为50%

子级向左，上移动自身尺寸的一半

左，上的外边距为尺寸的一半

transform: translate(\-50%,\-50%\)

### 固定定位

position: fixed

元素位置在网页滚动时不会改变

脱标，不占位

参照物：浏览器窗口

显示模式特点，具备行内块的特点

## 堆叠层级z\-index

默认效果：按标签顺序，后来者居上

作用：设置定位元素的层级顺序，改变定位元素的显示顺序

取值是整数，默认是0，取值越大显示顺序越靠上

例：`z-index: 1;`



## CSS Sprites

处理网页图片

1\.创建盒子，盒子尺寸与小图尺寸相同

2\.设置盒子图片背景图为sprites图

3\.添加background\-position属性，改变背景图位置（小图左上角坐标取负数）



## 字体图标

展示的是图标，本质是字体

在网页中添加简单的，元素单一的小图标

### 下载字体

iconfont图标库: https://www\.iconfont\.cn/

### 使用字体

引入字体样式表（iconfont\.css）

标签使用状态图标类名

iconfont:字体图标基本样式（字体名，大小等）\(注意选择器优先级要高于iconfont类\)

icon\-xxx:图标对应的类名

\<link rel="stylesheet" href="\./iconfont/iconfont\.css"\>

### 上传矢量图

网站里上传svg文件

## 垂直对齐方式

vertical\-align

|属性值|效果|
|---|---|
|baseline|基线对齐|
|top|顶部对齐|
|middle|居中对齐|
|bottom|底部对齐|

## 过渡属性

transition（复合属性）

元素在不同状态之间切换时添加的效果

属性值：过渡的属性（可以是具体的CSS属性）  花费时间（s）

也可以是all（属性值不同的所有属性，都产生过渡效果）

设置给元素本身（不给伪类选择器hover）

## 透明度

opacity

设置整个元素的透明度（包括背景和内容）

属性值：0\-1

0：完全透明

1：不透明

## 光标类型

cursor

鼠标悬停在元素上时指针显示样式

|属性值|效果|
|---|---|
|default|默认值，箭头|
|pointer|小手，提示点击|
|text|工字型，提示选择文字|
|move|十字光标，提示移动|

## favicon图标

网页图标，出现在标题栏

favicon\.ico一般放根目录

\<link rel="shortcut icon" href="favicon\.ico" type="image/x\-icon"\>



## 快捷导航

结构：通栏 \> 版心 \> 导航ul

布局：flex\-end

# 工具

## 调试工具

检查，调试代码

1\.打开调试工具

浏览器窗口内任意位置/选中标签\-\>鼠标右键\-\>检查

F12

2\.使用调试工具

如果是错误的属性，有黄色叹号

CSS属性的前面有多选框，如果勾选，这个属性生效；如果不勾选，这个属性不生效，



## Emmet写法

代码简写方式

HTML

|说明|标签结构|Emmet|
|---|---|---|
|类选择器|\<div class="box"\>\</div\>|标签名\.类名|
|id选择器|\<div id="box"\>\</div\>|标签名\#id名|
|同级标签|\<div\>\</div\>\<p\>\</p\>|div\+p|
|父子级标签|\<div\>\<p\>\</p\>\</div\>|div\>p|
|多个相同标签|\<span\>1\</span\>\<span\>2\</sapn\>|span\*3|
|有内容的标签|\<div\>内容\</div\>|div\{内容\}|

CSS

大多数简写方式为属性单词的首字母

例：`w500+h200+bgc`

\-\>`width:500px;`

`height:200px;`

`background-color:#fff;`



## PxCook像素大厨

可识别PSD文件

## 项目目录

### 网站根目录

存放位置的第一层文件夹

大文件夹包括：

images文件夹：放固定用的图片素材

uploads文件夹：放非固定用的图片素材

iconfont文件夹：字体图标素材

css文件夹：放css文件（link标签引入）（先清除再设置）

base\.css:基础公共样式

common\.css:各个网页相同模块的重复样式

index\.css:首页CSS样式

index\.html:首页HTML文件

## 优化网站

### SEO搜索引擎优化

网页标题title，网页描述description，网页关键词keywords

\<meta name="" content=""\>

\<meta:desc/kw

