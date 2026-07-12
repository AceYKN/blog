---
title: '09 异步请求和错误处理'
order: 9
---

# 09 异步请求和错误处理

真实 Vue 项目几乎都会请求后端数据。请求不是立刻完成的，所以你必须处理异步、加载中、失败、空数据、重试等状态。

本章目标：你能用 `fetch` 请求数据，能写 `async/await`，能处理错误，能把请求逻辑拆到合适位置。

## 1. 为什么请求是异步的

当你请求接口：

```js
fetch('/api/lessons')
```

浏览器要通过网络和服务器通信。这个过程可能需要几十毫秒，也可能几秒，还可能失败。

JavaScript 不能停在那里什么都不做，所以请求会返回 Promise：

```js
const promise = fetch('/api/lessons')
```

用 `await` 等结果：

```js
const response = await fetch('/api/lessons')
```

`await` 只能写在 `async` 函数里：

```js
async function loadLessons() {
  const response = await fetch('/api/lessons')
}
```

## 2. 最基础的 fetch

```js
async function loadLessons() {
  const response = await fetch('/api/lessons')
  const lessons = await response.json()
  return lessons
}
```

逐行解释：

- `fetch('/api/lessons')` 发起请求。
- `response` 是响应对象，不是最终数据。
- `response.json()` 把响应体解析成 JavaScript 数据。
- `return lessons` 把数据返回给调用者。

## 3. 为什么要检查 `response.ok`

初学者常写：

```js
const response = await fetch('/api/lessons')
const lessons = await response.json()
```

但如果服务器返回 404 或 500，`fetch` 不一定自动抛错。你应该检查：

```js
async function loadLessons() {
  const response = await fetch('/api/lessons')

  if (!response.ok) {
    throw new Error(`请求失败：${response.status}`)
  }

  return response.json()
}
```

`response.ok` 表示 HTTP 状态码是否在 200 到 299。

## 4. 组件中的请求状态

```vue
<script setup>
import { onMounted, ref } from 'vue'

const lessons = ref([])
const loading = ref(false)
const error = ref('')

async function fetchLessons() {
  loading.value = true
  error.value = ''

  try {
    const response = await fetch('/api/lessons')

    if (!response.ok) {
      throw new Error('课程加载失败')
    }

    lessons.value = await response.json()
  } catch (err) {
    error.value = err instanceof Error ? err.message : '未知错误'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchLessons()
})
</script>
```

模板：

```vue
<template>
  <p v-if="loading">加载中...</p>
  <div v-else-if="error" role="alert">
    <p>{{ error }}</p>
    <button @click="fetchLessons">重试</button>
  </div>
  <p v-else-if="lessons.length === 0">暂无课程</p>
  <ul v-else>
    <li v-for="lesson in lessons" :key="lesson.id">
      {{ lesson.title }}
    </li>
  </ul>
</template>
```

这才是完整请求界面：

- 加载中。
- 失败。
- 空数据。
- 成功。

## 5. `try/catch/finally`

```js
try {
  // 可能失败的代码
} catch (err) {
  // 失败后执行
} finally {
  // 无论成功失败都执行
}
```

在请求里：

- `try`：发请求、解析数据。
- `catch`：保存错误信息。
- `finally`：关闭 loading。

如果只在 `try` 最后关闭 loading：

```js
try {
  loading.value = true
  // 如果这里失败
  loading.value = false
}
```

一旦中途抛错，`loading.value = false` 不会执行，页面可能一直显示加载中。所以用 `finally`。

## 6. onMounted 请求

```js
onMounted(() => {
  fetchLessons()
})
```

`onMounted` 表示组件已经挂载到页面后执行。进入页面加载数据时常用。

但如果请求依赖路由参数，参数变化时也要重新请求：

```js
watch(
  () => route.params.id,
  () => {
    fetchLesson()
  },
  { immediate: true }
)
```

`immediate: true` 表示一开始也执行一次。

## 7. 请求逻辑放在哪里

三种常见位置：

### 放组件里

适合：

- 只有当前页面用。
- 逻辑简单。
- 不需要多个组件共享。

### 放 service 里

```js
// services/lessonService.js
export async function getLessons() {
  const response = await fetch('/api/lessons')

  if (!response.ok) {
    throw new Error('课程加载失败')
  }

  return response.json()
}
```

组件：

```js
lessons.value = await getLessons()
```

适合：

- 多处复用同一个接口。
- 想把 URL、请求头、错误处理集中。

### 放 Pinia action 里

适合：

- 请求结果是全局共享业务状态。
- 多个组件都要使用同一份数据。

例如登录用户、任务列表。

## 8. 模拟 API

学习阶段可以不接真实后端，用 mock API：

```js
export function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export async function getMockLessons(shouldFail = false) {
  await wait(500)

  if (shouldFail) {
    throw new Error('模拟请求失败')
  }

  return [
    { id: 1, title: '响应式基础' },
    { id: 2, title: '组件通信' }
  ]
}
```

这样你可以练习 loading 和 error，而不依赖后端。

## 9. 取消请求 AbortController

搜索框场景：

```text
用户输入 v -> 发请求 1
用户输入 vu -> 发请求 2
用户输入 vue -> 发请求 3
```

如果请求 1 最后才返回，可能覆盖请求 3 的结果。可以取消旧请求：

```js
let controller

async function search(keyword) {
  if (controller) {
    controller.abort()
  }

  controller = new AbortController()

  const response = await fetch(`/api/search?q=${keyword}`, {
    signal: controller.signal
  })

  if (!response.ok) {
    throw new Error('搜索失败')
  }

  return response.json()
}
```

如果组件卸载，也可以取消正在进行的请求，避免无意义更新。

## 10. 防抖 debounce

搜索时不应该每输入一个字都请求，可以等待用户停顿：

```js
let timerId

function debounceSearch(keyword) {
  clearTimeout(timerId)

  timerId = setTimeout(() => {
    search(keyword)
  }, 300)
}
```

意思：

- 每次输入先清除上一个定时器。
- 重新等待 300ms。
- 300ms 内没有新输入，才执行搜索。

真实项目可以使用成熟工具库，但理解原理很重要。

## 11. 错误信息应该给用户看

不要只写：

```js
console.error(err)
```

用户看不到控制台。页面应该显示：

```vue
<div v-if="error" role="alert">
  <p>{{ error }}</p>
  <button @click="fetchLessons">重试</button>
</div>
```

错误信息应该：

- 简短。
- 告诉用户发生了什么。
- 尽量提供下一步，例如重试。

## 12. 常见错误

### 错误一：忘记 `await response.json()`

```js
const data = response.json()
```

这里 `data` 是 Promise，不是数据。应该：

```js
const data = await response.json()
```

### 错误二：没有处理失败状态

只写成功时，一旦接口失败，页面空白或一直 loading。

### 错误三：请求返回空数组时显示错误

空数据不是错误。应该用 empty 状态：

```vue
<p v-else-if="items.length === 0">暂无数据</p>
```

### 错误四：组件卸载后还更新状态

复杂请求场景可能需要取消请求或检查组件是否仍然有效。初学阶段先知道有这个风险即可。

## 本章练习

1. 写 `wait(ms)`。
2. 写 `getMockLessons({ shouldFail, empty })`。
3. 页面进入时请求课程。
4. 显示 loading、error、empty、success。
5. 错误状态提供重试按钮。
6. 搜索框加 debounce。
7. 回答：请求逻辑什么时候放组件，什么时候放 service，什么时候放 Pinia？

