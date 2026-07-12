---
title: '08 Pinia 状态管理'
order: 8
---

# 08 Pinia 状态管理

Pinia 是 Vue 官方推荐的状态管理库。它解决的问题是：多个组件或多个页面需要共享同一份业务状态时，应该把状态放在哪里、怎么修改、怎么读取。

本章目标：你能创建 store，理解 state/getter/action，知道哪些状态应该放 Pinia，哪些不应该放。

## 1. 为什么需要状态管理

如果一个任务列表只在一个组件里使用，可以放组件内：

```js
const todos = ref([])
```

但如果多个地方都需要同一份数据：

- 首页显示未完成任务数。
- 任务页新增、删除任务。
- 导航栏显示提醒数量。
- 详情页修改任务状态。

如果只靠 props 一层层传，会变得很麻烦：

```text
App -> Layout -> Sidebar -> TodoBadge
App -> TodoPage -> TodoList -> TodoItem
```

Pinia 提供一个共享 store：

```text
多个组件 -> 使用同一个 todoStore
```

## 2. Store 是什么

store 可以理解成某个业务领域的状态中心。

例如任务 store：

- 保存任务数组。
- 提供新增任务方法。
- 提供删除任务方法。
- 提供未完成数量。

课程 store：

- 保存课程完成状态。
- 提供切换完成方法。
- 提供整体学习进度。

## 3. 创建 Pinia

在入口文件安装：

```js
// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

createApp(App).use(createPinia()).mount('#app')
```

没有 `.use(createPinia())`，组件里使用 store 会出问题。

## 4. 创建一个 store

```js
// src/stores/useTodoStore.js
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useTodoStore = defineStore('todos', () => {
  const todos = ref([])

  const remainingCount = computed(() => {
    return todos.value.filter((todo) => !todo.done).length
  })

  function addTodo(title) {
    todos.value.push({
      id: crypto.randomUUID(),
      title,
      done: false
    })
  }

  return {
    todos,
    remainingCount,
    addTodo
  }
})
```

解释：

- `defineStore` 创建 store。
- `'todos'` 是 store id，要保持唯一。
- `todos` 是 state。
- `remainingCount` 是 getter。
- `addTodo` 是 action。
- `return` 里写哪些内容，组件才能用哪些内容。

## 5. 在组件中使用 store

```vue
<script setup>
import { useTodoStore } from '../stores/useTodoStore'

const todoStore = useTodoStore()
</script>

<template>
  <p>未完成：{{ todoStore.remainingCount }}</p>
  <button @click="todoStore.addTodo('学习 Pinia')">新增</button>
</template>
```

`useTodoStore()` 返回 store 实例。你可以像普通对象一样访问：

```js
todoStore.todos
todoStore.remainingCount
todoStore.addTodo(...)
```

## 6. State / Getter / Action

在组合式 store 写法中：

```js
const todos = ref([]) // state

const remainingCount = computed(() => {
  return todos.value.filter((todo) => !todo.done).length
}) // getter

function addTodo(title) {
  // action
}
```

三者职责：

- state：保存数据。
- getter：从 state 推导数据。
- action：修改 state 或执行业务动作。

不要在组件里到处手写复杂修改逻辑。把跨组件共享的业务修改放到 action 中，组件只负责调用。

## 7. 完整任务 store

```js
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useTodoStore = defineStore('todos', () => {
  const todos = ref([])
  const filter = ref('all')

  const completedCount = computed(() => {
    return todos.value.filter((todo) => todo.done).length
  })

  const remainingCount = computed(() => {
    return todos.value.length - completedCount.value
  })

  const filteredTodos = computed(() => {
    if (filter.value === 'active') {
      return todos.value.filter((todo) => !todo.done)
    }

    if (filter.value === 'completed') {
      return todos.value.filter((todo) => todo.done)
    }

    return todos.value
  })

  function addTodo(title) {
    const trimmedTitle = title.trim()

    if (!trimmedTitle) {
      return
    }

    todos.value.unshift({
      id: crypto.randomUUID(),
      title: trimmedTitle,
      done: false
    })
  }

  function toggleTodo(id) {
    todos.value = todos.value.map((todo) => {
      return todo.id === id ? { ...todo, done: !todo.done } : todo
    })
  }

  function removeTodo(id) {
    todos.value = todos.value.filter((todo) => todo.id !== id)
  }

  function setFilter(nextFilter) {
    filter.value = nextFilter
  }

  return {
    todos,
    filter,
    completedCount,
    remainingCount,
    filteredTodos,
    addTodo,
    toggleTodo,
    removeTodo,
    setFilter
  }
})
```

## 8. Store 不应该放什么

不要把所有状态都放到 Pinia。

不适合放：

- 输入框里正在输入、但只在当前组件用的文字。
- 某个弹窗是否打开。
- 某个按钮是否 hover。
- 单个组件内部的临时 tab。
- 只用于局部 UI 的 loading。

适合放：

- 当前登录用户。
- 跨页面共享的任务列表。
- 购物车。
- 课程完成进度。
- 用户设置。

判断问题：

```text
这个状态是否被多个远离的组件使用？
刷新或切换页面后是否还需要？
它是否代表业务数据，而不是单个 UI 的临时状态？
```

如果答案多为“是”，可以考虑 Pinia。

## 9. Store 拆分

不要把整个应用塞进一个 store。

推荐按业务领域拆：

```text
useUserStore       登录用户、权限
useCourseStore     课程、进度
useTodoStore       任务
useSettingsStore   用户设置
```

不推荐：

```text
useAppStore        什么都放
```

一个 store 太大后，会变得和一个巨大组件一样难维护。

## 10. Pinia 和 localStorage

Pinia 默认是内存状态，刷新页面会丢失。如果要保留，可以配合 `localStorage`。

```js
const saved = localStorage.getItem('todos')
const todos = ref(saved ? JSON.parse(saved) : [])

watch(
  todos,
  (value) => {
    localStorage.setItem('todos', JSON.stringify(value))
  },
  { deep: true }
)
```

这段代码做了两件事：

1. 初始化时从 localStorage 读取。
2. todos 变化时写回 localStorage。

本课程的 `course-app` 把这段逻辑抽成了 `useLocalStorage` 组合式函数。

## 11. Store 中可以请求数据吗

可以。

```js
const todos = ref([])
const loading = ref(false)
const error = ref('')

async function loadTodos() {
  loading.value = true
  error.value = ''

  try {
    const response = await fetch('/api/todos')

    if (!response.ok) {
      throw new Error('任务加载失败')
    }

    todos.value = await response.json()
  } catch (err) {
    error.value = err instanceof Error ? err.message : '加载失败'
  } finally {
    loading.value = false
  }
}
```

但复杂项目通常会把请求函数拆到 `services/`：

```js
// services/todoService.js
export async function getTodos() {
  const response = await fetch('/api/todos')
  return response.json()
}
```

store 调用 service：

```js
todos.value = await getTodos()
```

这样 store 专注业务状态，service 专注请求细节。

## 12. Pinia 常见错误

### 错误一：忘记注册 Pinia

如果没有：

```js
app.use(createPinia())
```

store 无法正常工作。

### 错误二：把局部表单状态放进 store

例如新增任务输入框：

```js
const title = ref('')
```

如果只在 `TodoForm` 使用，放组件内即可。提交后调用 store 的 `addTodo(title)`。

### 错误三：直接在很多组件里修改同一份数组

如果多个组件都写：

```js
todoStore.todos.push(...)
```

逻辑会散落。更好的方式是：

```js
todoStore.addTodo(...)
```

这样修改规则集中在 action。

### 错误四：store 名和文件名混乱

建议：

```text
stores/useTodoStore.js
export const useTodoStore = defineStore('todos', ...)
```

保持命名一致，方便查找。

## 本章练习

1. 创建 `useTodoStore`。
2. 实现 `todos`、`filter`。
3. 实现 `addTodo`、`toggleTodo`、`removeTodo`。
4. 实现 `remainingCount`、`completedCount`、`filteredTodos`。
5. 在组件中使用 store 渲染任务列表。
6. 判断下面状态是否应该放 Pinia，并说明理由：
   - 登录用户。
   - 新增任务输入框文字。
   - 购物车商品。
   - 弹窗是否打开。
   - 课程完成进度。

