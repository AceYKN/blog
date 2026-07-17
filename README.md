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

### Cloudflare Pages

每次推送都会自动更新站点；PR/分支会得到预览链接。
