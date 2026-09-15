# blog

一个部署到 Cloudflare Pages 的纯静态个人站，文章由 Markdown 驱动。

## 日常更新

新增或编辑 `content/` 下的 Markdown，然后提交并推送到 GitHub。Cloudflare Pages 会自动构建和发布。

| 想发布什么   | 放到哪里            | 网址会是        |
| ------------ | ------------------- | --------------- |
| 原有课程笔记 | `content/source/`   | `/notes/...`    |
| 随笔         | `content/essays/`   | `/essays/...`   |
| 项目         | `content/projects/` | `/projects/...` |
| 技术文章     | `content/tech/`     | `/tech/...`     |

新文章可以从这个最小模板开始：

```md
---
title: 标题
description: 摘要
date: 2026-07-12
updated: 2026-07-14
tags: [生活, 工具]
draft: false
cover: /og-image.png
---

# 标题

正文写在这里。
```

也可使用 `npm run new -- --type tech --slug my-post` 创建带完整 frontmatter 的草稿。可选类型是 `essays`、`tech` 与 `projects`；草稿不会进入搜索或 sitemap。课程笔记以 `content/source/` 为唯一来源，页面上的编辑链接也会回到本仓库。

## 本地预览

```sh
npm ci
npm run dev
npm run check:content
```

打开终端提示的网址（通常是 `http://localhost:3000`）。

`check:content` 校验内容源和搜索索引；完整构建会额外对生成后的 HTML、canonical、JSON-LD 与标题结构进行检查。

## 部署

### GitHub Pages

仓库已包含 GitHub Actions 工作流。每次推送到 `main` 会自动发布至：

`https://aceykn.github.io/blog/`

工作流会自动使用 `/blog/` 作为资源基路径，并生成 `404.html`，因此刷新或直接打开任意笔记链接都能正常显示。

## PWA

生产静态构建结束后，`scripts/generate-pwa.mjs` 根据 `NUXT_APP_BASE_URL` 生成手工 manifest 和 Workbox `generateSW` Service Worker。Cloudflare canonical deployment 使用 `/`，GitHub Pages mirror 使用 `/blog/`；manifest、Service Worker、离线回退页和所有应用缓存名称都遵循对应 base URL。

### Architecture and cache policy

这是一个渐进式离线知识库，不是 App Shell：

- Initial precache 只包含 `offline.html`、全局 CSS 和当前首页启动所需的 critical JS；不包含文章全文、搜索 index、favicon、PWA icons 或 KaTeX 字体。
- 页面导航使用 NetworkFirst（3 秒网络超时、120 条、30 天）；Nuxt payload 使用 NetworkFirst（150 条、30 天）。
- `search-catalog.json` 和 `search-index-*.json` 使用 StaleWhileRevalidate（7 天），搜索 index 始终按需下载，不进入 initial precache。
- 同源图片和 `/_nuxt/` hashed script/style/font 使用 CacheFirst；所有 runtime cache 只接受同源 GET 的 HTTP 200，并在配额不足时清理。
- 天气、定位、Cloudflare Analytics、GitHub API 和其他第三方请求不进入 Service Worker runtime cache。

访问过的文章会逐渐进入 `aceykn-blog-pages-v1`，而搜索和图片也会按需形成有上限的本地缓存。未访问的离线导航显示独立的 `offline.html`，其返回首页链接会根据 `/` 或 `/blog/` 正确生成。

### Install and update behavior

PWA 是低调的 progressive enhancement：首次访问完成 Service Worker 接管并重新缓存当前页面后，才提示当前内容已可离线阅读。新 Worker 保持 waiting 状态，不会强制刷新；用户可以选择“稍后”或“重新载入”，后者通过 `SKIP_WAITING` 等待 `controllerchange` 后只刷新一次。

Install CTA 只在 `NUXT_PUBLIC_SITE_URL` 对应的 canonical origin 主动显示。Cloudflare preview 和 GitHub Pages mirror 仍支持 PWA，但不主动诱导安装；iOS 教程也只在用户主动点击 Install 后显示。

### Kill switch and rollback

开发服务器默认不注册 Service Worker。生产构建可使用：

```sh
# 普通静态站构建：不输出 manifest link、manifest 或 sw.js
NUXT_PUBLIC_PWA_ENABLED=false npm run generate

# 一次性回滚清理：激活后删除本项目 namespace 下的缓存并注销 Worker
NUXT_PUBLIC_PWA_ENABLED=false NUXT_PUBLIC_PWA_CLEANUP=true npm run generate
```

应用缓存使用 `aceykn-blog-*` namespace；清理逻辑也能识别本项目旧版本的 `aceykn-*` cache 以及同 scope 的旧 Workbox precache，不触碰其他 scope 的缓存。禁用构建不会引用不存在的 manifest，也不会渲染 Install UI。

### Build and testing

```sh
# 生产输出（会生成 dist/、manifest.webmanifest 和 sw.js）
npm run generate

# 单独检查已生成的 PWA 输出和实际 precache 字节数
npm run check:pwa

# 针对生成后的 dist/ 运行 Chromium E2E
npm run test:pwa
```

PWA 只在 production generated output 上测试，不在 `npm run dev` 中默认启用。CI 会分别执行 `/blog/` 的真实 Nuxt generate（用于 GitHub Pages artifact）和 `/` 的独立真实 generate（只做 root deployment smoke check），并覆盖 manifest/baseURL、首访文章离线、已访问文章离线、搜索 index 离线、offline fallback、缺失资源 404 和 waiting Worker 更新流程。

### Cloudflare Pages

每次推送都会自动更新站点；PR/分支会得到预览链接。
