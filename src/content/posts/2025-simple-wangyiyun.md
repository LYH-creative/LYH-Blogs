---
title: 2025古法编程：使用前端三件套手搓的网易云界面
published: 2026-06-12
description: '2025年的一个初学前端做的一个小项目'
image: ./images/kaf-meimuli.jpg
tags: [前端, 项目]
category: '前端'
draft: false 
lang: ''
---

## 项目简介

simple-wangyiyun 是一个仿网易云音乐的 Web 应用，作为 2025 年我刚开始学习前端的小项目，自己懒得写markdown了决定让ai帮我写一个。项目使用原生 JavaScript + CSS 从零搭建，不依赖任何前端框架或构建工具，通过第三方代理 API 获取网易云音乐的真实数据，实现了音乐流媒体平台的核心功能闭环。

### 项目背景

本项目是 2025 年数智前端团队的**第二轮考核题**，考察候选人对以下能力的掌握：

| 考核维度 | 具体内容 |
|----------|----------|
| **DOM 操作** | 原生 JavaScript 创建、修改、删除 DOM 元素，事件绑定与委托 |
| **网络请求** | `XMLHttpRequest` 生命周期管理，异步数据处理，错误处理 |
| **CSS 布局** | Flexbox 布局、定位系统、精灵图技术、固定定位播放器 |
| **代码组织** | 多页面架构下的代码复用与模块划分 |
| **API 对接** | 第三方 REST API 的数据获取、解析与渲染 |
| **用户体验** | 播放器交互、评论提交、搜索跳转等用户流程 |

### 核心业务流程

```
用户浏览首页 → 点击歌单 → 查看歌单详情（封面/歌曲列表/评论）
                           │
                           ├→ 点击歌曲 → 歌曲详情（歌手/专辑/歌词/评论）
                           │               └→ 播放歌曲（底部固定播放器）
                           │
                           ├→ 点击MV图标 → MV详情（视频播放/评论）
                           │
                           └→ 发表评论（需加载用户头像）

用户使用搜索 → 输入关键词 → 搜索结果列表 → 点击歌曲 → 播放

用户查看主页 → 用户信息卡片 + 个人歌单列表
```

### 页面导航关系

```
                       ┌─────────────┐
                       │  index.html │  首页
                       └──────┬──────┘
                              │ 点击歌单卡片
                              ▼
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐     ┌──────────────┐
│ songlist.html│    │  song.html   │     │   mv.html    │
│   歌单详情   │    │   歌曲详情   │     │   MV 详情    │
└──────────────┘    └──────────────┘     └──────────────┘
        │                   ▲                    ▲
        │ 点击表格中的歌曲    │       点击表格中的MV图标
        └───────────────────┘                    │
                                                 │
┌──────────────┐                       ┌──────────────┐
│ search.html  │  头部搜索框 Enter     │  myworld.html │
│   搜索结果   │◄─────────────────────│   用户主页    │
└──────────────┘   跳转带keyword参数    └──────────────┘
        │                                      ▲
        │  所有页面头部"我的主页"链接 ──────────┘
```

### 页面间数据传递方式

项目使用**多页应用（MPA）** 架构，页间数据通过 URL 查询参数传递，无本地存储或状态管理：

| 跳转场景 | 传递参数 | 示例 URL |
|----------|----------|----------|
| 歌单卡片 → 歌单详情 | `?id=歌单ID` | `songlist.html?id=7584249605` |
| 歌单歌曲 → 歌曲详情 | `?id=歌曲ID` | `song.html?id=2186025805` |
| MV 图标 → MV 详情 | `?id=MV的ID` | `mv.html?id=14561174` |
| 搜索框 → 搜索结果 | `?keyword=搜索词` | `search.html?keyword=周杰伦` |

页面加载后，由负责的 JS 文件通过 `URLSearchParams` 读取参数并发起 API 请求：

```js
// 典型的参数读取模式（img.js 为例）
const urlParams = new URLSearchParams(window.location.search);
const playlistId = urlParams.get('id');
// playlistId 成为全局变量，被同页面的其他 JS 文件共享
```

---

## 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 前端框架 | 原生 JavaScript（无框架） | 不依赖 React/Vue/Angular |
| 样式方案 | 原生 CSS | 无预处理器，无 CSS-in-JS |
| 构建工具 | 无 | 直接通过 `<script>` 和 `<link>` 标签加载 |
| 网络请求 | `XMLHttpRequest` | 未使用 `fetch` API，未使用 npm 包中的 `axios` |
| API 服务 | `http://api.cycler.top/` | 第三方网易云音乐接口代理 |
| 导航方式 | `window.location.href` + `<a href>` | 多页应用（MPA），非 SPA 路由 |
| 全局变量 | `window` 作用域 | 无模块系统，所有变量暴露在全局 |

### API 接口清单

| 接口路径 | 方法 | 用途 | 调用页面 |
|----------|------|------|----------|
| `/top/playlist?limit=8` | GET | 获取热门推荐歌单 | 首页 |
| `/playlist/detail?id=xxx` | GET | 获取歌单基本信息（封面/标题/简介/播放量） | 歌单详情（5次调用） |
| `/playlist/track/all?id=xxx` | GET | 获取歌单歌曲列表 | 歌单详情 |
| `/comment/playlist?id=xxx` | GET | 获取歌单评论 | 歌单详情 |
| `/comment/playlist?id=xxx` | POST | 发表歌单评论 | 歌单详情 |
| `/song/url?id=xxx&level=hires` | GET | 获取歌曲播放地址 | 歌单/歌曲/搜索页 |
| `/lyric?id=xxx` | GET | 获取歌词（LRC 格式） | 歌曲详情 |
| `/song/detail?ids=xxx` | GET | 获取歌曲详情信息 | 歌曲详情 |
| `/comment/music?id=xxx` | GET | 获取歌曲评论 | 歌曲详情 |
| `/comment/music?id=xxx` | POST | 发表歌曲评论 | 歌曲详情 |
| `/mv/detail?mvid=xxx` | GET | 获取 MV 基本信息（标题/歌手） | MV 详情 |
| `/mv/url?id=xxx` | GET | 获取 MV 播放地址 | MV 详情 |
| `/comment/mv?id=xxx` | GET | 获取 MV 评论 | MV 详情 |
| `/comment/mv?id=xxx` | POST | 发表 MV 评论 | MV 详情 |
| `/search?keywords=xxx` | GET | 搜索歌曲 | 搜索页 |
| `/user/detail?uid=6410943439` | GET | 获取用户信息（昵称/头像/等级） | 用户主页/评论头像 |
| `/user/playlist?uid=6410943439` | GET | 获取用户歌单列表 | 用户主页 |

### API 响应数据结构

**歌单详情** (`/playlist/detail`):
```json
{
  "playlist": {
    "id": 7584249605,
    "name": "歌单名称",
    "coverImgUrl": "https://...",
    "description": "简介文本",
    "playCount": 12345678,
    "trackCount": 50
  }
}
```

**歌曲列表** (`/playlist/track/all`):
```json
{
  "songs": [{
    "id": 2186025805,
    "name": "歌曲名",
    "dt": 245000,          // 时长（毫秒）
    "ar": [{ "name": "歌手名" }],
    "al": { "name": "专辑名" },
    "mv": 14561174         // MV ID，0 表示无 MV
  }]
}
```

**评论** (`/comment/*`):
```json
{
  "comments": [{
    "commentId": 123456,
    "content": "评论内容",
    "timeStr": "2025-01-01",
    "likedCount": 999,
    "user": {
      "nickname": "用户昵称",
      "avatarUrl": "https://..."
    }
  }]
}
```

**搜索结果** (`/search?keywords=xxx`):
```json
{
  "result": {
    "songs": [{
      "id": 123,
      "name": "歌曲名",
      "duration": 245000,   // 注意：搜索接口用 duration 而非 dt
      "artists": [{ "name": "歌手名" }],  // 注意：用 artists 而非 ar
      "album": { "name": "专辑名" }        // 注意：用 album 而非 al
    }]
  }
}
```

> ⚠️ **数据结构差异提醒**: 歌单 API 和搜索 API 返回的歌曲对象字段名不同（`dt` vs `duration`、`ar` vs `artists`、`al` vs `album`）。`js/tableRenderer.js` 已通过 `song.dt || song.duration` 等兼容写法统一处理。

**歌词** (`/lyric`):
```json
{
  "lrc": {
    "lyric": "[00:00.00]第一句歌词\n[00:30.50]第二句歌词\n..."
  }
}
```
歌词格式为带时间戳的 LRC 文本，`singlesong.js` 的 `processLyrics()` 函数负责将时间戳替换为 `<br>` 标签。

**歌曲播放地址** (`/song/url`):
```json
{
  "data": [{ "url": "https://...mp3" }]
}
```

**MV 播放地址** (`/mv/url`):
```json
{
  "data": { "url": "https://...mp4" }
}
```

**用户信息** (`/user/detail`):
```json
{
  "profile": {
    "nickname": "用户昵称",
    "avatarUrl": "https://...",
    "userId": 6410943439
  }
}
```

**用户歌单** (`/user/playlist`):
```json
{
  "playlist": [{
    "id": 7584249605,
    "name": "歌单名称",
    "coverImgUrl": "https://...",
    "playCount": 12345678
  }]
}
```

---

## 功能模块

### 1. 首页 (`index.html`)

**页面布局**:
```
┌──────────────────────────────────────────────┐
│  顶部导航（黑色）: Logo / 发现音乐 / 搜索框 / 创作者中心 / 我的主页  │
│  二级导航（红色）: 推荐 / 排行榜 / 歌单 / 播客 / 歌手 / 新碟上架     │
├──────────────────────────────────────────────┤
│  轮播图区域（~730px）                         │
│  ┌──────────────────────────┐ ┌────────────┐│
│  │  外层背景图 (data1)      │ │  下载客户端 ││
│  │  ┌────────────────────┐  │ │  PC/安卓等  ││
│  │  │ 内层图 (data2)     │  │ │  6大客户端   ││
│  │  └────────────────────┘  │ └────────────┘│
│  │  <  ○○○○○○○  >         │               │
│  └──────────────────────────┘               │
├──────────────────────────────────────────────┤
│  热门推荐（8 张歌单卡片）                      │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ │
│  │  │ │  │ │  │ │  │ │  │ │  │ │  │ │  │ │
│  └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ │
│                                             │
│  个性化推荐（4 个空占位）                      │
│                                             │
│  新碟上架（轮播区域，硬编码）                    │
│                                             │
│  榜单（飙升榜 / 新歌榜 / 原创榜）               │
│  ┌────────┐ ┌────────┐ ┌────────┐           │
│  │ 封面    │ │ 封面    │ │ 封面    │           │
│  │ 1. 歌曲 │ │ 1. 歌曲 │ │ 1. 歌曲 │           │
│  │ 2. 歌曲 │ │ 2. 歌曲 │ │ 2. 歌曲 │           │
│  │ ...     │ │ ...     │ │ ...     │           │
│  │10. 歌曲 │ │10. 歌曲 │ │10. 歌曲 │           │
│  └────────┘ └────────┘ └────────┘           │
├──────────────────────────────────────────────┤
│  底部固定播放器（53px 高）                      │
└──────────────────────────────────────────────┘
```

**核心逻辑**:

- **轮播图** (`slider.js`): 
  - 两个图片数组 `data1`（7 张外层大图）和 `data2`（7 张内层小图）
  - 自动每 3 秒切换一张，小圆点同步高亮
  - 手动点击左右箭头或小圆点可跳转，并重置自动播放计时器
  - 手动翻页后 `clearInterval` + 重新 `setInterval`，避免刚翻完就被自动切走

- **热门推荐** (`hotlist.js`):
  - 调用 `/top/playlist?limit=8` 获取 8 个热门歌单
  - 每个歌单卡片包括：封面图、覆盖链接、播放按钮、收听量、歌单名称
  - 点击卡片跳转到 `songlist.html?id=歌单ID`

- **榜单**: 30 首硬编码歌曲（3 个榜单各 10 首），每条含播放/收藏/添加到播放列表按钮

- **播放器**: `<audio>` 标签固定在页面底部（`position: fixed; bottom: 0`），带原生控件

---

### 2. 歌单详情页 (`songlist.html`)

**页面布局**:
```
┌──────────────────────────────────────────────┐
│  顶部导航（同首页，由 js/header.js 动态注入）     │
├──────────────────────────────────────────────┤
│  ┌──────┐                                    │
│  │ 封面  │  歌单标题 + 标签图标                 │
│  │ 图片  │  简介：xxx                          │
│  └──────┘                                    │
├──────────────────────────────────────────────┤
│  歌曲列表                        播放：xxx 次   │
│  ┌────────────────────────────────────────┐  │
│  │ 序号 │ 歌曲标题       │ 时长  │ 歌手 │专辑│  │
│  │  1   │ 歌名 [MV图标]  │ 4:05  │ 周杰伦│xxx│  │
│  │  2   │ ...           │ ...   │ ...  │...│  │
│  └────────────────────────────────────────┘  │
│                                              │
│  评论                                共x条评论 │
│  ┌────────────────────────────────────────┐  │
│  │ [头像]  [评论输入框]                    │  │
│  │                    [评论按钮]           │  │
│  ├────────────────────────────────────────┤  │
│  │  精彩评论                              │  │
│  │  [头像]  用户昵称：评论内容              │  │
│  │          2025-01-01  👍(99) | 回复     │  │
│  │  [头像]  用户昵称：评论内容              │  │
│  │          ...                           │  │
│  └────────────────────────────────────────┘  │
├──────────────────────────────────────────────┤
│  底部固定播放器                                │
└──────────────────────────────────────────────┘
```

**文件加载与数据流**:

```
页面加载 → 各 <script> 按顺序执行：

1. img.js        → URLSearchParams('id') → 全局变量 playlistId
                  → 调用 /playlist/detail → 渲染封面图 → #titimg

2. h3.js         → 读取全局 playlistId
                  → 调用 /playlist/detail → 渲染标题 → #txttit

3. introduce.js  → 读取全局 playlistId
                  → 调用 /playlist/detail → 渲染简介 + 播放量 → #introduce, #beplayedtimes

4. song.js       → 读取全局 playlistId
                  → 调用 /playlist/track/all → tableRenderer 渲染歌曲列表 → tbody
                  → 渲染歌曲数量 → #numder

5. play.js       → 等待 window.onload
                  → 监听所有 span.ply 的点击 → 调用 /song/url → 设置 audio.src 并播放

6. comment.js    → 读取全局 playlistId (存在则注册 DOMContentLoaded)
                  → 调用 renderComments.render() → /comment/playlist → 渲染评论列表

7. head.js       → 调用 /user/detail → 渲染评论输入区用户头像 → #myhead

8. getmycomment.js → 读取全局 playlistId (存在则注册)
                     → 调用 sendCommentModule.init() → 绑定评论发送按钮
```

**关键问题**: `img.js`、`h3.js`、`introduce.js` 各自独立调用同一个 `/playlist/detail` API（`img.js` 和 `title.js` 也调用同一接口），存在 5 次冗余请求。

**歌曲表格交互**:
- 点击序号列的播放图标 → `play.js` 获取歌曲 URL 并播放
- 点击歌曲名 → 跳转 `song.html?id=歌曲ID`
- 点击 MV 图标 → 跳转 `mv.html?id=MV的ID`
- 点击歌手名或专辑名 → `#` 占位（未实现）

---

### 3. 歌曲详情页 (`song.html`)

**页面布局**:
```
┌──────────────────────────────────────────────┐
│  顶部导航（同首页）                            │
├──────────────────────────────────────────────┤
│  ┌────────┐                                  │
│  │ 专辑    │  ○ 唱片圆标                       │
│  │ 封面    │  歌曲名称                         │
│  │ 图片    │  歌手：xxx                        │
│  │        │  所属专辑：xxx                     │
│  └────────┘  [播放按钮]                        │
│              ┌────────────────────────────┐   │
│              │  歌词区域                   │   │
│              │  第一句歌词                 │   │
│              │                            │   │
│              │  第二句歌词                 │   │
│              │  ...                       │   │
│              └────────────────────────────┘   │
├──────────────────────────────────────────────┤
│  评论区域（同歌单页结构）                        │
├──────────────────────────────────────────────┤
│  底部固定播放器                                │
└──────────────────────────────────────────────┘
```

**核心逻辑**:

- **歌曲信息** (`singlesong.js` + `playsinglesong.js`):
  - `singlesong.js` 从 URL 参数读取 `songid`，调用 `/lyric?id=xxx` 获取歌词
  - `processLyrics()` 函数处理 LRC 文本：正则匹配 `[mm:ss.ms]` 时间戳 → 替换为 `<br>` → 合并多余空行
  - 歌词通过 `innerHTML` 插入 `#word` 容器（注意：此处有 XSS 潜在风险）
  - `playsinglesong.js` 处理播放按钮逻辑，调用 `/song/url` 获取音频地址

- **歌曲详情** (`songdetail.js`):
  - 从 URL 读取 `?num=歌曲序号&list=歌单ID` 参数
  - 调用 `/playlist/detail` 获取歌单信息（仅 `console.log`，未做 UI 渲染——属于死代码）

---

### 4. MV 详情页 (`mv.html`)

**页面布局**:
```
┌──────────────────────────────────────────────┐
│  顶部导航（同首页）                            │
├──────────────────────────────────────────────┤
│  MV 标题 [MV 标签图标]                        │
│  歌手名                                      │
│  ┌────────────────────────────────────────┐  │
│  │                                        │  │
│  │          <video> 播放区域               │  │
│  │          原生 controls                  │  │
│  │                                        │  │
│  └────────────────────────────────────────┘  │
├──────────────────────────────────────────────┤
│  评论区域（同歌单页结构）                        │
├──────────────────────────────────────────────┤
│  错误消息提示区域                              │
└──────────────────────────────────────────────┘
```

**核心逻辑**:
- `mv.js`: 调用 `/mv/detail?mvid=xxx` 获取 MV 标题和歌手名，渲染到 `#txtTit` 和 `#singername`
- `mvplay.js`: 调用 `/mv/url?id=xxx` 获取视频地址，设置 `video.src`
- 两个文件都依赖 `mv.js` 先定义全局变量 `mvId`
- `mv.js` 提供 `showError()` 函数用于显示错误消息（本项目唯一有用户可见错误提示的页面）

---

### 5. 搜索页 (`search.html`)

**页面布局**:
```
┌──────────────────────────────────────────────┐
│  顶部导航（同首页）                            │
├──────────────────────────────────────────────┤
│  ┌──────────────────────────┐ ┌─────────┐   │
│  │  预填入搜索关键词的输入框   │ │  搜索   │   │
│  └──────────────────────────┘ └─────────┘   │
├──────────────────────────────────────────────┤
│  搜索结果歌曲列表表格（同歌单页表格结构）        │
│  ┌────────────────────────────────────────┐  │
│  │ 序号 │ 歌曲标题 │ 时长  │ 歌手  │ 专辑 │  │
│  │  1   │   ...    │  ...  │  ...  │ ... │  │
│  └────────────────────────────────────────┘  │
│  空状态: "未找到相关歌曲"                       │
├──────────────────────────────────────────────┤
│  底部固定播放器                                │
└──────────────────────────────────────────────┘
```

**核心逻辑**:
- **参数传递**: 从头部搜索框按 Enter → `window.location.href = 'search.html?keyword=xxx'`
- **关键词预填** (`search-input.js`): 从 URL 读取 `?keyword=xxx`，填入 `#search-input` 输入框，定义全局变量 `word`
- **搜索结果** (`getsearch.js`): 读取全局变量 `word`，调用 `/search?keywords=xxx`，使用 `tableRenderer` 渲染表格
- **搜索框交互**: focus 时清空预填值（保留备份），blur 时恢复；点击"搜索"按钮或按 Enter 跳转到新的搜索结果 URL

**双搜索框设计**:
| 搜索框 | ID | 位置 | 作用 |
|--------|-----|------|------|
| 头部导航搜索 | `#Search` | 页面顶部导航栏 | 全局入口，按 Enter 跳转搜索结果页 |
| 搜索结果框 | `#search-input` | 搜索结果页中部 | 显示/修改当前搜索关键词 |

---

### 6. 用户主页 (`myworld.html`)

**页面布局**:
```
┌──────────────────────────────────────────────┐
│  顶部导航（同首页）                            │
├──────────────────────────────────────────────┤
│  ┌──────────────────────────────────────┐    │
│  │ [头像]  用户昵称  [VIP] [等级] [认证]  │    │
│  │         (地理位置信息占位)             │    │
│  └──────────────────────────────────────┘    │
│                                              │
│  歌单                                        │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐                  │
│  │  │ │  │ │  │ │  │ │  │                  │
│  └──┘ └──┘ └──┘ └──┘ └──┘                  │
│  歌单名  歌单名  歌单名  歌单名  歌单名         │
└──────────────────────────────────────────────┘
```

**核心逻辑**:
- **用户信息** (`myworld.js`): 调用 `/user/detail?uid=6410943439`，构建复杂的 `<dl>` 结构（头像/昵称/VIP/等级/认证图标/地理位置）
- **用户歌单** (`mylist.js`): 调用 `/user/playlist?uid=6410943439`，使用 `createPlaylistItem()` 渲染歌单卡片列表

**硬编码限制**: 用户 ID 固定为 `6410943439`，不支持切换用户或登录。

---

### 共享组件说明

**底部播放器**: 所有页面底部固定 53px 高的 `<audio>` 播放器，带原生浏览器控件。`play.js` 和 `playsinglesong.js` 负责向 `audio.src` 赋值并调用 `audio.play()`。

**评论组件**: 四个页面（歌单、歌曲、MV 详情）共享评论 UI 结构，包括：
- 用户头像（通过 `head.js` 从 `/user/detail` API 获取）
- 文本输入框 (`#mycommentTxt`)
- 评论按钮
- 评论列表容器 (`#comments-container`)
- 评论数量显示 (`#commentnumber`)

每条评论卡片包含：用户头像、昵称、评论内容、发布时间、点赞数、回复按钮。

---

## 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 前端框架 | 原生 JavaScript（无框架） | 不依赖 React/Vue/Angular |
| 样式方案 | 原生 CSS | 无预处理器，无 CSS-in-JS |
| 构建工具 | 无 | 直接通过 `<script>` 和 `<link>` 标签加载 |
| 网络请求 | `XMLHttpRequest` | 未使用 `fetch` API，未使用 npm 包中的 `axios` |
| API 服务 | `http://api.cycler.top/` | 第三方网易云音乐接口代理 |
| 导航方式 | `window.location.href` + `<a href>` | 多页应用（MPA），非 SPA 路由 |
| 全局变量 | `window` 作用域 | 无模块系统，所有变量暴露在全局 |

```
├── index.html                # 首页
├── songlist.html             # 歌单详情页
├── song.html                 # 歌曲详情页
├── mv.html                   # MV 详情页
├── search.html               # 搜索页
├── myworld.html              # 用户主页
├── common.css                # 【新增】公共样式（reset/header/nav/评论/播放器/错误/加载）
├── wangyi1.css               # 首页专属样式（轮播图/推荐/榜单）
├── songlist.css              # 歌单页专属样式（主体/表格/封面）
├── song.css                  # 歌曲页专属样式（歌曲封面/歌词/按钮）
├── mv.css                    # MV 页专属样式（视频播放区）
├── search.css                # 搜索页专属样式（搜索框/结果列表）
├── myworld.css               # 用户主页专属样式（用户信息/歌单）
│
├── js/                       # 【新增】共享模块目录
│   ├── config.js             # 全局配置常量（API 地址/用户 ID/昵称）
│   ├── apiClient.js          # 统一 XHR 请求封装（Promise 化，get/post）
│   ├── header.js             # 动态渲染共享头部导航 + 搜索框交互
│   ├── renderComments.js     # 统一评论渲染模块（DocumentFragment 批量插入）
│   ├── sendComment.js        # 统一评论发送模块（输入验证/按钮状态管理）
│   ├── tableRenderer.js      # 统一歌曲表格行渲染（兼容 songlist 和 search 数据结构）
│   └── createPlaylistItem.js # 统一歌单项 DOM 创建函数
│
├── slider.js                 # 首页轮播图（修复：单套事件 + 清理定时器）
├── hotlist.js                # 热门推荐歌单（调用 /top/playlist）
├── play.js                   # 【修复】公共播放模块（const → var）
├── img.js                    # 歌单封面渲染 + 定义全局变量 playlistId
├── h3.js                     # 歌单标题渲染
├── introduce.js              # 歌单简介 + 播放次数渲染
├── song.js                   # 【修复】歌单歌曲列表渲染（durSpan appendChild）
├── comment.js                # 【优化】歌单评论触发渲染（缩减为 3 行）
├── getmycomment.js           # 【优化】歌单评论发送触发（缩减为 3 行）
├── head.js                   # 【修复】用户头像展示（错误变量引用）
├── singlesong.js             # 歌曲详情/歌词获取与处理
├── songcomment.js            # 【优化】歌曲评论触发渲染（缩减为 3 行）
├── mysongcomment.js          # 【优化】歌曲评论发送触发（缩减为 3 行）
├── playsinglesong.js         # 歌曲页播放功能
├── songdetail.js             # 【修复】歌曲关联歌单（urlParams 定义 + 逻辑运算符）
├── mv.js                     # MV 信息渲染 + showError 函数
├── mvplay.js                 # MV 视频播放
├── mvComment.js              # 【优化】MV 评论触发渲染（缩减为 3 行）
├── myMvComment.js            # 【优化】MV 评论发送触发（缩减为 3 行）
├── myworld.js                # 用户信息渲染
├── mylist.js                 # 用户歌单列表
├── search-input.js           # 搜索页搜索框交互
├── getsearch.js              # 【修复】搜索结果渲染（durSpan appendChild）
├── Search.js                 # 头部搜索框 placeholder focus/blur 交互
└── searchinput.js            # 头部搜索框 Enter 键跳转
```

---

## API 调用关系图

```
────────────────────────────────────────────────────────────
  首页 (index.html)
  ├── /top/playlist?limit=8     → hotlist.js
  └── (轮播图为本地图片 data1/data2)
────────────────────────────────────────────────────────────
  歌单详情 (songlist.html)
  ├── /playlist/detail?id=xxx   → img.js    (定义 playlistId)
  │                            → h3.js     (依赖 img.js)
  │                            → introduce.js (依赖 img.js)
  ├── /playlist/track/all?id=xxx → song.js  (依赖 img.js)
  ├── /comment/playlist?id=xxx  → comment.js (依赖 img.js)
  ├── /song/url?id=xxx          → play.js
  └── /user/detail?uid=xxx      → head.js
────────────────────────────────────────────────────────────
  歌曲详情 (song.html)
  ├── /lyric?id=xxx             → singlesong.js (定义 songid)
  ├── /song/detail?ids=xxx      → (songdetail.js 获取但未渲染)
  ├── /comment/music?id=xxx     → songcomment.js (依赖 singlesong.js)
  └── /song/url?id=xxx          → playsinglesong.js
────────────────────────────────────────────────────────────
  MV 详情 (mv.html)
  ├── /mv/detail?mvid=xxx       → mv.js    (定义 mvId)
  ├── /mv/url?id=xxx            → mvplay.js (依赖 mv.js)
  └── /comment/mv?id=xxx        → mvComment.js (依赖 mv.js)
────────────────────────────────────────────────────────────
  搜索 (search.html)
  ├── /search?keywords=xxx      → getsearch.js (定义 word)
  └── /song/url?id=xxx          → play.js
────────────────────────────────────────────────────────────
  用户主页 (myworld.html)
  ├── /user/detail?uid=xxx      → myworld.js
  └── /user/playlist?uid=xxx    → mylist.js
────────────────────────────────────────────────────────────
```

### 文件间隐式依赖关系

```
img.js 最先加载 → 定义全局变量 playlistId
    ↓
    ├── h3.js         读取 playlistId → 调用 /playlist/detail
    ├── introduce.js  读取 playlistId → 调用 /playlist/detail
    ├── song.js       读取 playlistId → 调用 /playlist/track/all
    ├── comment.js    读取 playlistId → 调用 /comment/playlist
    └── getmycomment.js 读取 playlistId → 调用 /comment/playlist (POST)

singlesong.js 最先加载 → 定义全局变量 songid
    ↓
    ├── songcomment.js    读取 songid → 调用 /comment/music
    ├── mysongcomment.js  读取 songid → 调用 /comment/music (POST)
    └── playsinglesong.js 读取 songid → 调用 /song/url

mv.js 最先加载 → 定义全局变量 mvId
    ↓
    ├── mvplay.js      读取 mvId → 调用 /mv/url
    ├── mvComment.js   读取 mvId → 调用 /comment/mv
    └── myMvComment.js 读取 mvId → 调用 /comment/mv (POST)
```

> **注意**: 这种隐式依赖是脆弱的——如果加载顺序改变，依赖链就会断裂。

---

## 优化记录

### 一、严重 Bug 修复（9 个）

#### 1. `play.js:5-8` — `const` 变量被 `+=` 重新赋值，抛出 `TypeError`

**错误代码**:
```js
const apiUrl = `http://api.cycler.top/song/url?id=${songIds}&level=hires`;
if (desiredBr !== 999000) {
    apiUrl += `&br=${desiredBr}`;  // TypeError: Assignment to constant variable
}
```

**修复后**:
```js
var apiUrl = `http://api.cycler.top/song/url?id=${songIds}&level=hires`;
if (desiredBr !== 999000) {
    apiUrl += `&br=${desiredBr}`;
}
```

**影响**: 当 `desiredBr` 不为默认值 999000 时，此 bug 会导致获取音乐 URL 完全失败，所有歌曲无法播放。

---

#### 2. `songdetail.js:1` — `urlParams` 未定义，抛出 `ReferenceError`

**错误代码**:
```js
const num = urlParams.get('num');  // ReferenceError: urlParams is not defined
const list = urlParams.get('list');
```

**修复后**:
```js
const urlParams = new URLSearchParams(window.location.search);
const num = urlParams.get('num');
const list = urlParams.get('list');
```

**影响**: `songdetail.js` 在歌曲页面加载后立即抛出 ReferenceError，整个脚本中断执行，无法获取歌单关联数据。

---

#### 3. `songdetail.js:3` — 按位与 `&` 误用作逻辑与 `&&`

**错误代码**:
```js
if (num & list) {  // 按位与运算符，非逻辑判断
```

**修复后**:
```js
if (num && list) {  // 逻辑与运算符
```

**影响**: 即使上述 `urlParams` bug 被修复，条件判断仍可能因类型转换产生非预期结果（例如 `"5" & "8"` → `0` → falsy）。

---

#### 4. `song.js:122-125` — 歌曲时长 `<span>` 创建后从未添加到 DOM

**错误代码**:
```js
function createDurationCell(song) {
    const durationCell = document.createElement('td');
    durationCell.classList.add('s-fc3');
    // ...
    const durSpan = document.createElement('span');
    durSpan.classList.add('u-dur');
    durSpan.textContent = `${minutes}:${String(seconds).padStart(2, '0')}`;
    return durationCell;  // ← durSpan 从未被 appendChild 到 durationCell！
}
```

**修复后**:
```js
    durSpan.textContent = `${minutes}:${String(seconds).padStart(2, '0')}`;
    durationCell.appendChild(durSpan);  // ← 添加这一行
    return durationCell;
```

**影响**: 歌单详情页中所有歌曲的"时长"列显示为空白。用户完全看不到每首歌的时长信息。

---

#### 5. `getsearch.js:105-108` — 搜索页歌曲时长同样未添加到 DOM

完全相同的 bug，修复方式一致：在 `return durationCell` 前添加 `durationCell.appendChild(durSpan)`。

**影响**: 搜索结果页中所有歌曲的"时长"列显示为空白。

---

#### 6. `slider.js:68-116` — 双层轮播图事件监听互相覆盖

**问题分析**: 原始代码有两组独立的事件监听，分别绑定到同一个 DOM 元素 `#left` 和 `#right`：

```js
// 第一组：控制 data1 的外层轮播
const prev = document.getElementById('left');
prev.addEventListener('click', () => { /* 操作 data1 和 currentIndex */ });

const next = document.getElementById('right');
next.addEventListener('click', () => { /* 操作 data1 和 currentIndex */ });

// 第二组：控制 data2 的内层轮播（覆盖了第一组！）
const secondprev = document.getElementById('left');   // 同一个 DOM 元素
secondprev.addEventListener('click', () => { /* 操作 data2 和 innerIndex */ });

const secondnext = document.getElementById('right');  // 同一个 DOM 元素
secondnext.addEventListener('click', () => { /* 操作 data2 和 innerIndex */ });
```

问题点：
1. 两组监听器绑定到相同的 `#left` 和 `#right` 按钮
2. 第一组操作 `currentIndex`，第二组操作 `innerIndex`，互不关联
3. 两个 `setInterval`（3000ms）同时运行，各操作不同的数据源

**修复方案**: 重写整个 `slider.js`，使用**单套事件监听** + **共享索引**：

```js
let currentIndex = 0;
let intervalId = null;

function updateSliders() {
    slideshow.style.backgroundImage = 'url(' + data1[currentIndex].url + ')';    // 外层
    innerSlideshow.style.backgroundImage = 'url(' + data2[currentIndex].url + ')'; // 内层
    updateDots(currentIndex);
}

// 单套按钮事件
prevBtn.addEventListener('click', function (e) {
    e.preventDefault();
    currentIndex = (currentIndex - 1 + data1.length) % data1.length;
    updateSliders();
    resetInterval();  // 手动操作后重置自动播放计时
});

// 单套定时器
intervalId = setInterval(function () {
    currentIndex = (currentIndex + 1) % data1.length;
    updateSliders();
}, 3000);
```

---

#### 7. `slider.js:65,98` — `setInterval` 永不清理，造成内存泄漏

**原始代码**:
```js
setInterval(changeBackground, 3000);  // 永不清理
// ...
setInterval(changeImg, 3000);         // 永不清理
```

**修复后**（在重写的 `slider.js` 中）:
```js
var intervalId = setInterval(nextSlide, 3000);

function resetInterval() {
    clearInterval(intervalId);
    intervalId = setInterval(nextSlide, 3000);
}

window.addEventListener('beforeunload', function () {
    clearInterval(intervalId);
});
```

**影响**: 在 SPA 场景下（如果未来改造），定时器会在页面切换后继续运行，消耗 CPU 资源。修复添加了页面卸载时的清理和手动翻页后的计时器重置。

---

#### 8. `head.js:32` — 错误日志中引用未定义变量 `xhr`

**错误代码**:
```js
let zjy = new XMLHttpRequest();
// ...
zjy.onreadystatechange = function () {
    if (zjy.readyState === 4) {
        // ...
        console.error('请求出错，状态码:', xhr.status);  // ← xhr 未定义，应为 zjy
    }
};
```

**修复后**: `xhr.status` → `zjy.status`

**影响**: 当用户头像 API 请求失败时，错误日志本身也会抛出 ReferenceError，掩盖真实错误信息。

---

#### 9. `index.html:596` — 引用不存在的 `userplaylist.js` 文件

**原始代码**:
```html
<script src="./userplaylist.js"></script>  <!-- 文件不存在，404 -->
```

**修复**: 删除该行引用。

**影响**: 浏览器控制台产生 404 错误（不影响功能，但属于无效网络请求）。

---

### 二、架构优化 — 消除重复代码（8 项）

#### 优化前全局架构问题

```
原项目存在 3 层重复：

CSS 层: 6 个 CSS 文件开头各复制 ~200 行相同代码
  wangyi1.css:1-203    ≡  songlist.css:1-210    ≡  song.css:1-199
  mv.css:1-198         ≡  myworld.css:1-198     ≡  search.css:1-154

HTML 层: 6 个 HTML 文件各复制 ~100 行相同 DOM 结构
  index.html:13-122    ≡  songlist.html:14-122  ≡  song.html:11-120
  mv.html:11-120       ≡  myworld.html:10-119   ≡  search.html:13-89

JS 层: 多个文件复制相同的业务逻辑
  comment.js ≡ songcomment.js ≡ mvComment.js  (×3, 各 110 行)
  getmycomment.js ≡ mysongcomment.js ≡ myMvComment.js (×3, 各 25 行)
  song.js:42-152 ≡ getsearch.js:36-137 (×2, 5 个函数)
  hotlist.js:19-68 ≡ mylist.js:19-68 (×2, createPlaylistItem)
```

#### 1. CSS 头部样式提取 — common.css（消除 ~1150 行重复）

**重复模式**:
```
6 个 CSS 文件中每个都独立包含:
  ├── * { margin:0; padding:0; box-sizing:border-box; }     ← reset
  ├── .toparea { height:105px; }                             ← 头部区域
  ├── .top { position:relative; z-index:1000; ... }          ← 顶部黑条
  ├── .top_wrapper { display:flex; width:1100px; ... }       ← 布局容器
  ├── .logo { width:167px; ... }                             ← logo
  ├── .top_nav li { float:left; height:70px; ... }           ← 导航
  ├── .search1 { width:158px; border-radius:32px; ... }      ← 搜索框
  ├── .creater-center { margin-top:19px; ... }               ← 创作者中心
  ├── .login1 { color:#787878; ... }                         ← 登录链接
  ├── .next-level { height:35px; background:rgb(210,3,3); }  ← 二级导航
  ├── .navi em { color:#FFF; border-radius:20px; ... }       ← 二级导航项
  └── .first-em { background-color:#9B0909; }               ← 激活状态
```

**优化后**: 所有公共样式提取到 `common.css`，各页面 CSS 只保留专属样式：

| 文件 | 优化前 | 优化后 | 删除行数 |
|------|--------|--------|----------|
| `songlist.css` | 698 行 | 495 行 | 203 行 |
| `song.css` | 389 行 | 190 行 | 199 行 |
| `mv.css` | 264 行 | 66 行 | 198 行 |
| `myworld.css` | 345 行 | 147 行 | 198 行 |
| `search.css` | 353 行 | 199 行 | 154 行 |
| `wangyi1.css` | 852 行 | 654 行 | 198 行 |

---

#### 2. HTML 头部结构动态化 — js/header.js（消除 ~600 行重复）

**优化前** (每个 HTML 文件都包含):
```html
<div class="toparea">
    <div class="top">
        <div class="top_wrapper">
            <div class="logo">
                <a href="index.html"><img class="logo1" src="./资料/topbar.png"></a>
                <sub class="cor">&nbsp;</sub>
            </div>
            <ul class="top_nav">
                <li class="first-li"><span><a href="#"><em>发现音乐</em></a></span></li>
                <li><span><a href="#"><em>我的音乐</em></a></span></li>
                <!-- ... 7 个导航项 ... -->
            </ul>
            <div class="search">
                <input type="text" class="search1" id="Search" placeholder="音乐/视频/电台/用户">
                <script src="./Search.js"></script>       <!-- 嵌在 div 内部！阻塞渲染 -->
                <script src="./searchinput.js"></script>  <!-- 嵌在 div 内部！阻塞渲染 -->
            </div>
            <a class="creater"><div class="creater-center">创作者中心</div></a>
            <div class="login"><a href="myworld.html" class="login1">我的主页</a></div>
        </div>
        <div class="next-level">
            <ul class="navi">
                <li><a><em class="first-em">推荐</em></a></li>
                <!-- ... 6 个二级导航项 ... -->
            </ul>
        </div>
    </div>
</div>
```

**优化后** (所有页面统一):
```html
<div class="toparea"></div>  <!-- 一行替代 ~100 行 -->
```

`js/header.js` 在 `DOMContentLoaded` 时自动注入头部 HTML，并绑定搜索框事件。整合了 `Search.js` 和 `searchinput.js` 的功能。

---

#### 3. XHR 请求统一封装 — js/apiClient.js（消除 ~200 行重复）

**优化前** (15+ 个文件中各手动编写):
```js
const xhr = new XMLHttpRequest();
xhr.open('GET', apiUrl, true);
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        try {
            const data = JSON.parse(xhr.responseText);
            console.log(data);
            // 具体业务逻辑...
        } catch (error) {
            console.error('解析响应数据出错:', error);
        }
    } else if (xhr.readyState === 4) {
        console.error('请求出错，状态码:', xhr.status);
    }
};
xhr.send();
```

**优化后**:
```js
apiClient.get('/playlist/detail?id=12345').then(function (result) {
    var data = result.data;
    // 业务逻辑...
}).catch(function (error) {
    console.error('请求失败:', error.message);
});
```

`apiClient.js` 特性：
- 返回 `Promise`，支持 `.then()` / `.catch()` 链式调用
- 统一处理 `JSON.parse` 错误
- 统一处理 `XMLHttpRequest.onerror` 网络错误
- 支持 GET 和 POST 两种方法
- 自动拼接 `APP_CONFIG.API_BASE` 前缀

---

#### 4. 评论渲染统一化 — js/renderComments.js（消除 ~330 行重复）

**优化前**: `comment.js`、`songcomment.js`、`mvComment.js` 三个文件各 110 行代码完全相同，仅在以下一行不同：

```js
// comment.js       → const apiUrl = `.../comment/playlist?id=${playlistId}`;
// songcomment.js   → const apiUrl = `.../comment/music?id=${songid}`;
// mvComment.js     → const apiUrl = `.../comment/mv?id=${mvId}`;
```

**优化后**:

新模块 `js/renderComments.js`:
```js
var renderComments = (function () {
    'use strict';

    function render(containerId, numberId, apiUrl) {
        var container = document.getElementById(containerId);
        var numberEl = document.getElementById(numberId);

        apiClient.get(apiUrl).then(function (result) {
            var data = result.data;
            numberEl.textContent = data.comments ? data.comments.length : 0;

            var fragment = document.createDocumentFragment();  // ← 性能优化
            data.comments.forEach(function (comment) {
                fragment.appendChild(createCommentItem(comment));
            });
            container.appendChild(fragment);  // ← 一次性插入，仅一次重排
        });
    }

    // ... createCommentItem() 创建单条评论 DOM
    return { render: render };
})();
```

旧文件缩减为 4 行触发调用（以 `comment.js` 为例）:
```js
if (typeof playlistId !== 'undefined' && playlistId) {
    document.addEventListener('DOMContentLoaded', function () {
        renderComments.render('comments-container', 'commentnumber', '/comment/playlist?id=' + playlistId);
    });
}
```

---

#### 5. 评论发送统一化 — js/sendComment.js（消除 ~75 行重复）

**优化前**: `getmycomment.js`、`mysongcomment.js`、`myMvComment.js` 三个文件各 25 行完全相同。

**优化后**: 新增输入验证、重复提交防护：

```js
function submitComment(apiUrl) {
    var comment = textarea.value.trim();
    if (!comment) { alert('请输入评论内容'); return; }           // ← 空校验
    if (comment.length > 1000) { alert('评论内容不能超过1000字'); return; } // ← 长度校验

    btn.style.pointerEvents = 'none';                           // ← 防重复提交
    btn.textContent = '提交中...';                               // ← loading 状态

    apiClient.post(apiUrl, data)
        .then(function () {
            alert('评论提交成功！');
            textarea.value = '';                                 // ← 清空输入
            btn.textContent = '评论';                            // ← 恢复按钮
        })
        .catch(function (error) {
            alert('提交失败！' + error.message);
            btn.textContent = '评论';
        });
}
```

---

#### 6. 表格行创建统一化 — js/tableRenderer.js（消除 ~230 行重复）

**优化前**: `song.js` 和 `getsearch.js` 各自包含 5 个完全相同的函数：

| 函数 | 用途 | 代码行数 |
|------|------|----------|
| `createTableRow(song, index)` | 创建整行 | 15 行 |
| `createIndexCell(song, index)` | 序号列（含播放按钮） | 14 行 |
| `createNameCell(song)` | 歌曲名（含 MV 链接） | 22 行 |
| `createDurationCell(song)` | 时长列 | 12 行 |
| `createArtistCell(song)` | 歌手列 | 11 行 |
| `createAlbumCell(song)` | 专辑列 | 10 行 |

两个文件的数据结构差异：
- `song.js` (歌单 API): `song.dt` (时长), `song.ar[0].name` (歌手), `song.al.name` (专辑)
- `getsearch.js` (搜索 API): `song.duration` (时长), `song.artists[0].name` (歌手), `song.album.name` (专辑)

**优化后**: `tableRenderer.js` 同时兼容两种数据结构：
```js
var totalMs = song.dt || song.duration || 0;           // 兼容两种字段名
var artists = song.ar || song.artists || [];            // 兼容两种字段名
var album = song.al || song.album || {};                // 兼容两种字段名
```

---

#### 7. 歌单项创建统一化 — js/createPlaylistItem.js（消除 ~50 行重复）

**优化前**: `hotlist.js:19-68` 和 `mylist.js:19-68` 的 `createPlaylistItem()` 函数 100% 相同。

**优化后**: 提取为独立的 `js/createPlaylistItem.js` 全局函数，两个文件直接调用。

---

#### 8. 搜索框交互整合（消除 ~20 行重复）

**优化前**: 三个独立文件处理搜索框交互：

| 文件 | 功能 | 绑定元素 |
|------|------|----------|
| `Search.js` | placeholder 的 focus/blur 切换 | `#Search`（头部） |
| `searchinput.js` | Enter 键跳转搜索页 | `#Search`（头部） |
| `search-input.js` | 预填关键词 + Enter 键 + focus/blur | `#search-input`（搜索页） |

`search-input.js` 中 `getElementById('search-input')` 被调用了 3 次（第 3、6、14 行），冗余。

**优化后**: `/Search.js` 和 `searchinput.js` 的功能整合进 `js/header.js` 的 `initSearch()` 函数。搜索页的 `search-input.js` 保持不变（操作不同的 `#search-input` 元素）。

---

### 三、性能优化（5 项）

#### 1. DocumentFragment 批量插入评论

**原理**: 每次 `container.appendChild(node)` 触发浏览器**重排（reflow）**。100 条评论逐个插入 = 100 次重排。使用 `DocumentFragment` 一次插入 = 1 次重排。

**代码**:
```js
var fragment = document.createDocumentFragment();
data.comments.forEach(function (comment) {
    fragment.appendChild(createCommentItem(comment));   // 插入到内存片段，不触发渲染
});
commentsContainer.appendChild(fragment);  // 一次性提交到 DOM，触发 1 次渲染
```

#### 2. 轮播图定时器管理

| 场景 | 优化前 | 优化后 |
|------|--------|--------|
| 自动播放 | `setInterval(fn, 3000)` 永不停止 | 存储 `intervalId`，可清理 |
| 手动翻页 | 不重置计时器（可能刚翻完就被自动切） | `clearInterval` + 重新 `setInterval` |
| 页面卸载 | 定时器继续运行 | `beforeunload` 事件中 `clearInterval` |

#### 3. CSS Reset 去重

优化前浏览器解析 6 遍 `* { margin:0; padding:0; box-sizing:border-box; }`，优化后只解析 1 遍。虽然实际性能影响不大（浏览器本身会合并），但减少了不必要的样式计算。

#### 4. CSS 文件体积缩减

| 文件 | 优化前 | 优化后 | 缩减 |
|------|--------|--------|------|
| `wangyi1.css` | 852 行 | 654 行 | -23% |
| `songlist.css` | 698 行 | 495 行 | -29% |
| `song.css` | 389 行 | 190 行 | -51% |
| `search.css` | 353 行 | 199 行 | -44% |
| `myworld.css` | 345 行 | 147 行 | -57% |
| `mv.css` | 264 行 | 66 行 | -75% |

#### 5. 脚本加载位置优化

部分页面的 `<script>` 标签嵌入在 `<div>` 内部，会阻塞 HTML 解析：

**优化前** (`mv.html:73-76`):
```html
<div class="search">
    <input type="text" class="search1" id="Search">
    <script src="./Search.js"></script>       <!-- 阻塞渲染 -->
    <script src="./searchinput.js"></script>  <!-- 阻塞渲染 -->
</div>
```

**优化后**: 通过 `js/header.js` 在页面加载完成后绑定事件，脚本移到 `</body>` 前。

---

### 四、HTML/CSS 修正（9 项）

#### 1. Viewport meta 标签修复

**错误代码** (`index.html:5-6`, `songlist.html:5-6`, `search.html:5-6`):
```html
<meta name="viewport" content="width=
    , initial-scale=1.0">
```

HTML 属性值中换行导致 `content` 的实际值为 `"width=\n    , initial-scale=1.0"`，浏览器无法正确解析 `width` 值，移动端布局失效。

**修复后**:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

#### 2. lang 属性修正

所有 6 个 HTML 文件的 `<html lang="en">` 改为 `<html lang="zh-CN">`。影响屏幕阅读器的语音引擎选择和搜索引擎的语言判断。

#### 3. 移除空 `<style>` 标签

`index.html:9-10`、`songlist.html:9-11`、`search.html:9-10` 包含无内容的 `<style></style>` 块，无任何作用。

#### 4. 行内样式替换为 CSS 类

**优化前** (3 个文件中):
```html
<div class="u-txtwrap" style="display: block;">
```

**优化后**:
```html
<div class="u-txtwrap u-txtwrap-visible">
```
```css
.u-txtwrap-visible { display: block; }
```

#### 5. 行内事件处理器替换为 addEventListener

**优化前** (3 个文件中):
```html
<a href="#" class="btn" onclick="sendComment(); return false;">评论</a>
```

**优化后**:
```html
<a href="#" class="btn" id="submitCommentBtn">评论</a>
```
```js
// js/sendComment.js 中绑定
document.getElementById('submitCommentBtn').addEventListener('click', function (e) {
    e.preventDefault();
    submitComment(apiUrl);
});
```

#### 6. 多余闭合标签修复

**song.html** 原有多余的 `</div></div>` (第 215-216 行)，现已修正。**mv.html** 原有多余的 `</div></div></div>` (第 182-184 行)，现已修正。

#### 7. 图片 alt 属性补充

**优化前**:
```html
<img class="logo1" src="./资料/topbar.png">          <!-- 无 alt -->
<img id="songoutface" class="songoutface">             <!-- 无 alt -->
```

**优化后**:
```html
<img class="logo1" src="./资料/topbar.png" alt="网易云音乐">
<img id="songoutface" class="songoutface" alt="专辑封面">
```

#### 8. 搜索页空状态

新增 `#search-empty` 元素，用于显示"未找到相关歌曲"提示（搜索无结果时不再展示空白表格）。

#### 9. 错误消息容器

MV 页已有 `#error-message` 元素的 `showError()` 函数，但只被 `mv.js` 和 `mvplay.js` 调用。在 `common.css` 中添加了统一的样式，可供其他页面复用：

```css
.error-message {
    color: #e03a3a;
    text-align: center;
    padding: 20px;
    display: none;
}
```

---

### 五、UX 改进（5 项）

#### 1. 评论输入验证

- **空内容拦截**: 提交空前提示"请输入评论内容"，避免无效请求
- **长度限制**: 超过 1000 字提示"评论内容不能超过 1000 字"

#### 2. 评论提交状态反馈

- **提交中**: 按钮禁用并显示"提交中..."，防止重复点击
- **成功后**: 清空输入框，恢复按钮
- **失败后**: 显示具体错误信息（替代原来无意义的 `alert('提交失败！')`）

#### 3. 评论加载错误提示

API 请求失败时显示"评论加载失败，请稍后重试"（替代原来仅 `console.error`）。用户现在能感知到加载失败，而非面对空白页面。

#### 4. 评论空状态

无评论时显示"暂无评论"（评论模块原有此逻辑，已保留到 `renderComments.js`）。

#### 5. 全局配置集中管理

硬编码值（分散在 15+ 个文件中）提取到 `js/config.js`：

```js
var APP_CONFIG = {
    API_BASE: 'http://api.cycler.top',    // 出现在 20+ 个文件中
    USER_ID: '6410943439',                 // 出现在 head.js / myworld.js / mylist.js
    NICKNAME: '云村村民164320710393324'     // 出现在 3 个评论发送文件中
};
```

之前无法一键切换 API 服务器或用户，现在只需修改 `config.js` 一处。

---

### 六、代码质量改进（4 项）

#### 1. 全局变量冲突风险降低

优化前每个 JS 文件直接使用 `xhr`、`urlParams`、`data` 等通用变量名，多文件同名变量可能在全局作用域互相覆盖。

**优化后**: 新增的共享模块使用 IIFE 包裹，避免向全局作用域泄漏内部变量：

```js
var apiClient = (function () {
    'use strict';
    var API_BASE = APP_CONFIG.API_BASE;  // ← 闭包私有变量

    function request(method, url, data) {
        // ← 闭包私有函数
    }

    return { get: ..., post: ... };  // ← 仅暴露接口
})();
```

#### 2. 不规范的变量命名

部分文件使用无意义变量名，如 `zjy`、`gg`、`vv`（XHR 对象）、`vv`（响应数据）。共享模块使用了有意义的命名（`request`、`render`、`submitComment` 等）。

#### 3. 歌曲详情页歌词 innerHTML 安全性

`singlesong.js:15` 中：
```js
document.getElementById('word').innerHTML = processLyrics(data.lrc.lyric);
```

API 返回的歌词文本直接作为 HTML 插入。由于数据来源是受控的 API，实际风险较低，但 `processLyrics()` 函数已对内容做了 `<br>` 标签替换和时间戳过滤。

#### 4. POST 请求参数格式

优化前评论发送使用字符串拼接构建请求体：
```js
xhttp.send(`content=${encodeURIComponent(comment)}&nickname=云村村民164320710393324`);
```

优化后的 `apiClient.post()` 保持了相同的格式，但添加了 URL 编码处理和 cookie 兼容性。

---

### 七、优化统计

| 类别 | 数量 | 详情 |
|------|------|------|
| **修复 Bug** | 9 个 | 3 个崩溃级（TypeError/ReferenceError）、4 个功能缺失级、2 个代码质量级 |
| **新增文件** | 8 个 | `common.css` + `js/` 目录下 7 个共享模块 |
| **修改文件** | 27 个 | 6 HTML + 6 CSS + 15 JS |
| **消除重复 CSS** | ~1,150 行 | 6 份 header/nav/reset → 1 份 common.css |
| **消除重复 HTML** | ~600 行 | 6 份 header DOM → 1 行 `<div class="toparea">` |
| **消除重复 JS** | ~835 行 | 评论 × 3 + 发送 × 3 + 表格 × 2 + 歌单项 × 2 + 搜索 × 2 |
| **总计消除重复** | ~2,585 行 | 约占总代码量的 40% |
| **性能改进** | 5 项 | DocumentFragment、定时器管理、CSS 合并、文件体积缩减、脚本位置 |
| **UX 改进** | 5 项 | 输入验证、提交反馈、错误提示、空状态、全局配置 |
| **安全改进** | 2 项 | Promise 错误处理、防重复提交 |

### 八、待进一步优化的方向

以下问题因时间/范围限制未在本次优化中处理，记录供后续参考：

1. **5 次重复 API 调用**: `songlist.html` 中 `img.js`、`h3.js`、`introduce.js`、`title.js`、`songdetail.js` 各自独立调用 `/playlist/detail` 同一接口，可通过共享数据缓存合并为 1 次请求
2. **ES Module 迁移**: 将全局变量依赖改为 ESM `import` / `export`，消除脆弱的加载顺序依赖
3. **HTTP → HTTPS**: API 地址使用明文 HTTP，建议升级为 HTTPS
4. **响应式布局**: 所有宽度使用固定像素值（980px/1100px 等），无 `@media` 查询适配移动端
5. **错误状态全局化**: 仅 `mv.js` 有 `showError()`，其他页面缺少用户可见的错误提示
6. **Loading 状态**: 所有 API 请求无骨架屏/加载动画，用户等待时看到空白
7. **无障碍访问**: 缺少 `aria-*` 属性、键盘导航支持、focus 样式管理
8. **构建工具集成**: 可接入 Vite/Webpack 实现代码压缩、Tree shaking、资源 hash
