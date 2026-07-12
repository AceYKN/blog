---
title: '07 Vue Router 路由'
order: 7
---

# 07 Vue Router 路由

Vue Router 负责“当前 URL 对应哪个页面组件”。没有 Router，Vue 也能写组件；有了 Router，才方便做首页、列表页、详情页、设置页等多页面结构的单页应用。

本章目标：你能创建路由、使用链接跳转、读取动态参数、处理查询参数、写 404 页面，并理解 Router 和普通组件状态的边界。

## 1. 什么是单页应用里的路由

传统多页网站：

```text
/index.html
/about.html
/products.html
```

点击链接时，浏览器向服务器请求一个新的 HTML 页面。

Vue 单页应用：

```text
/
/lessons
/lessons/core
/settings
```

浏览器通常只加载一个 `index.html`。URL 变化后，Vue Router 根据路径决定显示哪个组件。

```text
URL 变化 -> Router 匹配 routes -> 渲染对应 view 组件
```

## 2. 安装和注册 Router

创建路由：

```js
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/about', name: 'about', component: AboutView }
  ]
})

export default router
```

注册到应用：

```js
// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')
```

根组件放出口：

```vue
<!-- App.vue -->
<template>
  <RouterView />
</template>
```

`RouterView` 是一个占位区域。当前路径匹配到哪个组件，哪个组件就显示在这里。

## 3. `routes` 每个字段什么意思

```js
{
  path: '/about',
  name: 'about',
  component: AboutView
}
```

- `path`：URL 路径。
- `name`：路由名字，方便编程式跳转。
- `component`：这个路径要渲染的组件。

你可以理解为：

```text
当 URL 是 /about 时，把 AboutView 放进 RouterView。
```

## 4. `RouterLink` 跳转

```vue
<RouterLink to="/">首页</RouterLink>
<RouterLink to="/about">关于</RouterLink>
```

不要在应用内部优先用：

```vue
<a href="/about">关于</a>
```

普通 `<a>` 可能触发整页刷新。`RouterLink` 会交给 Vue Router 处理，保持单页应用体验。

### 激活样式

当前链接匹配时，`RouterLink` 会自动添加类名：

```css
.router-link-active {
  color: #2563eb;
}
```

也可以配置自定义类名。

## 5. 动态路由

课程详情页通常有多个：

```text
/lessons/js
/lessons/core
/lessons/router
```

不可能给每个课程都写一条路由。用动态参数：

```js
{
  path: '/lessons/:id',
  name: 'lesson-detail',
  component: LessonDetailView
}
```

`:id` 表示这一段是变量。

读取参数：

```js
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { lessons } from '../data/lessons'

const route = useRoute()

const lesson = computed(() => {
  return lessons.find((item) => item.id === route.params.id)
})
```

模板：

```vue
<p v-if="!lesson">课程不存在</p>
<article v-else>
  <h1>{{ lesson.title }}</h1>
</article>
```

## 6. 查询参数

查询参数长这样：

```text
/lessons?keyword=vue&page=2
```

它适合表达：

- 搜索词。
- 筛选条件。
- 分页页码。
- 排序方式。

读取：

```js
const route = useRoute()

const keyword = computed(() => {
  return route.query.keyword ?? ''
})
```

跳转时带查询参数：

```js
router.push({
  name: 'lessons',
  query: {
    keyword: keyword.value,
    page: 1
  }
})
```

查询参数的好处：用户可以复制 URL，把当前筛选状态分享给别人。

## 7. 编程式导航

除了 `<RouterLink>`，你也可以在 JS 中跳转。

```js
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.push('/')
}
```

按路由名字跳转：

```js
router.push({
  name: 'lesson-detail',
  params: {
    id: lesson.id
  }
})
```

推荐在复杂跳转中使用 `name`，因为路径以后改了，名字可以不变。

## 8. 404 页面

用户访问不存在的路径时，应该显示 404 页面。

```js
{
  path: '/:pathMatch(.*)*',
  name: 'not-found',
  component: NotFoundView
}
```

这条路由应该放在最后。因为它会匹配所有前面没匹配到的路径。

## 9. 路由懒加载

页面很多时，不必一开始加载所有页面组件。

```js
{
  path: '/settings',
  name: 'settings',
  component: () => import('../views/SettingsView.vue')
}
```

这表示访问 `/settings` 时才加载 `SettingsView.vue`。

好处：

- 减少首屏加载体积。
- 用户不访问的页面不急着下载。

## 10. 路由守卫

如果某些页面需要登录后才能访问：

```js
router.beforeEach((to) => {
  const isLoggedIn = Boolean(localStorage.getItem('token'))

  if (to.meta.requiresAuth && !isLoggedIn) {
    return {
      name: 'login',
      query: {
        redirect: to.fullPath
      }
    }
  }
})
```

路由配置：

```js
{
  path: '/settings',
  name: 'settings',
  component: SettingsView,
  meta: {
    requiresAuth: true
  }
}
```

守卫适合判断“能不能进入页面”，不适合塞所有业务逻辑。

## 11. Router 和 Pinia 的边界

Router 管页面位置和 URL 状态。

适合放在 URL：

- 当前页面。
- 详情 id。
- 搜索词。
- 分页。
- 排序。

Pinia 管业务状态。

适合放 Pinia：

- 当前登录用户。
- 购物车。
- 跨页面任务列表。
- 课程完成进度。

组件内状态：

- 弹窗是否打开。
- 输入框正在输入但不需要分享的文字。
- 当前组件内部 tab。

## 12. 常见错误

### 错误一：忘记放 `RouterView`

配置了路由，但页面不显示，检查 `App.vue` 是否有：

```vue
<RouterView />
```

### 错误二：路由路径和链接不一致

配置：

```js
{ path: '/lessons', component: LessonsView }
```

链接：

```vue
<RouterLink to="/lesson">课程</RouterLink>
```

`/lesson` 少了 s，会进入 404。

### 错误三：动态参数名字写错

配置：

```js
path: '/lessons/:id'
```

读取：

```js
route.params.lessonId // undefined
```

应该：

```js
route.params.id
```

### 错误四：部署后刷新详情页 404

本地没问题，部署后访问 `/lessons/js` 刷新 404。原因是服务器不知道这个路径应该返回 `index.html`。

SPA 部署需要配置：

```text
所有未知路径 -> /index.html
```

这样刷新后先回到 Vue 应用，再由 Router 匹配页面。

## 本章练习

1. 创建首页、课程列表页、课程详情页、404 页。
2. 配置 `/lessons/:id` 动态路由。
3. 从课程列表点击进入详情页。
4. 在详情页读取 `route.params.id`。
5. 给课程列表加 `keyword` 查询参数。
6. 写一个按钮，用 `router.push` 跳转首页。
7. 解释：为什么刷新动态路由可能在部署后 404？

