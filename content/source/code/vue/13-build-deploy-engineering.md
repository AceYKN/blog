---
title: '13 构建、部署和工程化'
order: 13
---

# 13 构建、部署和工程化

工程化不是高级项目才需要。只要你希望项目能稳定运行、多人协作、可以上线，就需要理解基本工具链。

本章目标：你能理解 Vite、package.json、开发服务器、生产构建、环境变量、部署刷新 404 和项目目录组织。

## 1. Vite 做了什么

开发时：

```powershell
npm run dev
```

Vite 提供：

- 本地开发服务器。
- 热更新。
- Vue 单文件组件编译。
- 模块导入处理。
- 错误提示。

生产构建时：

```powershell
npm run build
```

Vite 会：

- 编译 `.vue` 文件。
- 压缩 JS 和 CSS。
- 拆分资源。
- 生成 `dist/`。

## 2. package.json 是什么

`package.json` 是项目说明书和命令表。

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "dependencies": {
    "vue": "^3.5.35"
  },
  "devDependencies": {
    "vite": "^8.0.16"
  }
}
```

字段解释：

- `scripts`：可运行命令。
- `dependencies`：生产运行需要的依赖。
- `devDependencies`：开发和构建需要的依赖。

运行：

```powershell
npm run dev
```

本质上会执行：

```powershell
vite
```

## 3. npm install 做了什么

```powershell
npm install
```

它会：

- 根据 `package.json` 和 `package-lock.json` 安装依赖。
- 生成 `node_modules`。
- 确保项目能运行。

`node_modules` 很大，不应该手动编辑，也不应该提交到 Git。

`package-lock.json` 记录具体安装版本，团队项目应该提交它，保证大家依赖一致。

## 4. `dev`、`build`、`preview` 区别

`dev`：

```powershell
npm run dev
```

用于开发。速度快，有热更新，不是生产产物。

`build`：

```powershell
npm run build
```

生成生产文件到 `dist/`。

`preview`：

```powershell
npm run preview
```

在本地预览 `dist/`，检查构建产物能否正常运行。

不要把 `npm run dev` 当部署方式。上线应该部署构建产物。

## 5. dist 是什么

构建后：

```text
dist/
  index.html
  assets/
    index-xxxx.js
    index-xxxx.css
```

这些文件就是浏览器最终需要的静态资源。

部署静态站点时，通常把 `dist/` 交给平台。

## 6. 环境变量

Vite 暴露给前端的变量通常以 `VITE_` 开头：

```env
VITE_API_BASE_URL=https://api.example.com
```

使用：

```js
const baseUrl = import.meta.env.VITE_API_BASE_URL
```

注意：前端环境变量不是秘密。只要被打包进前端，用户就可能看到。

常见文件：

```text
.env
.env.development
.env.production
```

不要提交包含秘密的 `.env.local`。

## 7. 单页应用刷新 404

Vue Router 使用 history 模式时，URL 可能是：

```text
/lessons/core
```

如果用户直接刷新，浏览器会向服务器请求 `/lessons/core`。

服务器如果不知道这个路径，就返回 404。

解决：服务器把未知路径都返回 `index.html`。

```text
未知路径 -> index.html -> Vue Router 接管
```

很多部署平台叫：

- fallback。
- rewrite。
- SPA fallback。

## 8. 项目目录组织

推荐：

```text
src/
  assets/
  components/
  composables/
  data/
  router/
  services/
  stores/
  types/
  views/
```

职责：

- `assets`：图片、全局 CSS 等静态资源。
- `components`：可复用组件。
- `views`：路由页面组件。
- `composables`：组合式函数。
- `data`：本地静态数据。
- `router`：路由配置。
- `services`：请求接口封装。
- `stores`：Pinia。
- `types`：共享 TypeScript 类型。

## 9. README 应该写什么

一个项目 README 至少写：

- 项目做什么。
- 技术栈。
- 如何安装。
- 如何运行。
- 如何测试。
- 如何构建。
- 目录结构。
- 环境变量说明。

示例：

````md
# Project Name

## Setup

```powershell
npm install
npm run dev
```

## Scripts

- `npm run dev`
- `npm run test`
- `npm run build`
````

好的 README 能让新同事少问很多重复问题。

## 10. 提交前检查

最小检查：

```powershell
npm run test
npm run build
```

如果项目有 lint：

```powershell
npm run lint
```

如果改了页面：

- 打开本地页面。
- 点一遍关键流程。
- 检查控制台错误。
- 检查移动端布局。

## 11. 常见工程化错误

### 错误一：删除 package-lock

这会让团队依赖版本更不稳定。一般不要随便删。

### 错误二：提交 node_modules

`node_modules` 应该由 `npm install` 生成，不应该提交。

### 错误三：构建前没跑测试

测试能提前发现逻辑问题，构建能发现语法和打包问题，两者都重要。

### 错误四：把开发服务器地址当生产地址

`http://localhost:5173` 只适合本地开发。线上应该使用部署平台提供的域名。

## 本章练习

1. 解释 `npm run dev` 和 `npm run build` 区别。
2. 运行 `npm run build`，观察 `dist`。
3. 运行 `npm run preview`，预览构建产物。
4. 写一份项目 README 大纲。
5. 解释 SPA 刷新 404 的原因和解决思路。
6. 判断哪些文件应该提交，哪些不应该提交。
