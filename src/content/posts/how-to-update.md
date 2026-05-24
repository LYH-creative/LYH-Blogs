---
title: 更新博客备忘录
published: 2026-05-23
description: 写给我自己的备忘录，提醒以后怎么更新文章。
tags: [教程]
category: 教程
draft: false
lang: zh_CN
---

## 更新流程

### 1. 创建新文章

```bash
pnpm new-post 文章名
```

会自动生成模板文件到 `src/content/posts/`，填好标题、标签、分类等 front-matter 就行。

### 2. 本地预览

```bash
pnpm dev
```

浏览器打开 `http://localhost:4321` 查看效果。

### 3. 构建并部署

#### 方式一：推送到 gh-pages（Vercel 自动部署）

```bash
pnpm gh-deploy
```

自动构建 `dist/` 并推送到 `gh-pages` 分支，**Vercel 检测到更新后自动部署**。

#### 方式二：推送到 main（EdgeOne Pages 构建）

```bash
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy http://127.0.0.1:7890

git add -A
git commit -m "更新内容"
git push -u origin master:main
```

推送代码到 `main` 分支，然后去 **EdgeOne Pages 控制台** 点**重新部署**。

---

## 小结

```bash
pnpm new-post 文章名    # 新建文章
pnpm dev                # 本地预览
pnpm gh-deploy          # [Vercel] 构建 + 推送到 gh-pages
git push                # [EdgeOne] 推送到 main，去控制台重新部署
```