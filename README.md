# Studiorum

一个部署到 Cloudflare Pages 的纯静态个人站。它不需要服务器；课程笔记、文章、项目、分享和日常记录都由 Markdown 驱动。

## 日常更新

只需要新增或编辑 `content/` 下的 Markdown，然后提交并推送到 GitHub。Cloudflare Pages 会自动构建和发布。

| 想发布什么   | 放到哪里            | 网址会是        |
| ------------ | ------------------- | --------------- |
| 原有课程笔记 | `content/source/`   | `/notes/...`    |
| 文章         | `content/posts/`    | `/posts/...`    |
| 项目         | `content/projects/` | `/projects/...` |
| 分享         | `content/shares/`   | `/shares/...`   |
| 记录         | `content/records/`  | `/records/...`  |

新文章可以从这个最小模板开始：

```md
---
title: 标题
description: 一句话摘要
date: 2026-07-12
tags: [生活, 工具]
---

# 标题

正文写在这里。
```

例如保存为 `content/records/2026-07-12-summer.md`，发布后就是 `/records/2026-07-12-summer`。课程原文在 `content/source/`；迁移完成前不要在这里改动它们。

## 本地预览

```sh
npm ci
npm run dev
```

打开终端提示的网址（通常是 `http://localhost:3000`）。

## 部署

### GitHub Pages

仓库已包含 GitHub Actions 工作流。首次使用时，在 GitHub 仓库的 **Settings → Pages** 中，把 **Build and deployment → Source** 设为 **GitHub Actions**。之后推送到 `main` 会自动发布至：

`https://aceykn.github.io/blog/`

工作流会自动使用 `/blog/` 作为资源基路径，并生成 `404.html`，因此刷新或直接打开任意笔记链接都能正常显示。

### Cloudflare Pages

1. 在 GitHub 新建一个仓库，把本项目推送上去。
2. 登录 Cloudflare，进入 **Workers & Pages → Create → Pages → Connect to Git**，选择仓库。
3. 填入构建设置：
   - Framework preset: `Nuxt.js`
   - Build command: `npm run generate`
   - Build output directory: `dist`
   - Environment variable: `NODE_VERSION` = `24.11.0`
4. 点击部署。之后每次 `git push` 都会自动更新站点；PR/分支会得到预览链接。

Cloudflare Pages 使用网站根路径，因此不需要设置 `NUXT_APP_BASE_URL`。构建过程会移除顶层 `404.html`，启用 Cloudflare Pages 原生的 SPA 回退，使访客直接打开任意文章、项目或笔记网址也能正常进入。
