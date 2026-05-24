---
title: 用网页展示vrm模型
published: 2026-05-24
description: 一个用网页展示vrm模型的网站
image: .\images\kaf-web.png
tags: [前端, Docker]
category: Docker
draft: false 
lang: ''
---

# vrm-kaf-hatdown-v1.0
A project about displaying VRM on the Internet, such as KAF.
首先特别标注VRM来源：B站@46亿年的

# VRM-Kaf-Hatdown 3D 模型展示项目
基于 Three.js 实现的 VRM 角色 3D 展示项目，支持自动旋转、正面视角、明亮打光，可通过 Docker 一键运行。

## 项目特性
- 正面视角展示模型，画面干净明亮
- 模型自动缓慢旋转，可查看全身细节
- 纯白背景，视觉效果舒适
- 支持 Docker 容器化部署，跨平台一键启动

## 文件说明
- `index.html` - 主页面与 3D 渲染逻辑
- `kaf_fukuro_hatdown.vrm` - VRM 模型文件
- `Dockerfile` - Docker 镜像构建配置

## 本地直接运行
将所有文件放在同一目录，用浏览器打开 `index.html` 即可预览。

## Docker 一键使用（他人使用）
```bash
# 拉取镜像
docker pull lyh0689/vrm-kaf-hatdown:v1.0

# 启动容器
docker run -d -p 8080:80 lyh0689/vrm-kaf-hatdown:v1.0
```

打开浏览器访问：
http://localhost:8080

## 自行构建镜像
```bash
docker build -t lyh0689/vrm-kaf-hatdown:v1.0 .
```

## 可调整参数
- 模型亮度：修改 DirectionalLight / AmbientLight 强度
- 模型位置：调整 model.position.y
- 相机距离：修改 camera.position.z
- 旋转速度：修改 model.rotation.y 增量
- 背景颜色：修改 CSS background 与 renderer.setClearColor

## 新加功能：人物跟随鼠标轻微移动
```
//监听鼠标移动
window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});
function animate(){
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();
  if(model) {
    // 呼吸轻微上下
    model.position.y = 0.4 + Math.sin(t * 1.2) * 0.02;
    // 身体微晃
    model.rotation.z = Math.sin(t * 0.6) * 0.015;
    // 鼠标跟随注视
    model.rotation.y = Math.PI + mouse.x * 0.12;  
    model.rotation.x = mouse.y * 0.08;           
  }

  renderer.render(scene, camera);
}
```
![项目预览](.\images\kaf-web.png)
