---
title: '03 Vue 核心语法和响应式'
order: 3
---

# 03 Vue 核心语法和响应式

本章开始正式写 Vue。你需要掌握 Vue 单文件组件、响应式状态、模板语法、计算属性、监听器和生命周期。

核心目标：你看到一个 `.vue` 文件时，能知道每个区域负责什么；看到 `ref`、`computed`、`watch` 时，知道为什么用它们。

## 1. 单文件组件是什么

Vue 项目里最常见的文件是 `.vue` 文件，也叫单文件组件，英文是 Single File Component，简称 SFC。

```vue
<script setup>
const title = 'Vue 核心语法'
</script>

<template>
  <h1>{{ title }}</h1>
</template>

<style scoped>
h1 {
  color: #2563eb;
}
</style>
```

三个区域：

- `<script setup>`：写 JavaScript 逻辑，例如状态、函数、导入组件。
- `<template>`：写界面结构，并通过 Vue 指令连接状态。
- `<style scoped>`：写当前组件样式，`scoped` 表示尽量只影响当前组件。

### 为什么要单文件组件

一个组件通常包含三类内容：

- 数据和行为。
- HTML 结构。
- 样式。

把它们放在同一个 `.vue` 文件里，有几个好处：

- 组件的所有内容集中，容易理解。
- 可以直接导入另一个组件。
- 样式可以限制在组件内部。
- 构建工具能检查语法并优化代码。

## 2. `<script setup>` 为什么不用 return

普通 Vue 组件可能这样写：

```js
export default {
  setup() {
    const title = 'Vue'

    return {
      title
    }
  }
}
```

`<script setup>` 是更简洁的写法：

```vue
<script setup>
const title = 'Vue'
</script>

<template>
  <h1>{{ title }}</h1>
</template>
```

在 `<script setup>` 里，顶层声明的变量、函数、导入的组件，都可以直接在模板里使用。

例如：

```vue
<script setup>
import LessonCard from './LessonCard.vue'

const lesson = { title: '组件基础' }

function save() {
  console.log('保存')
}
</script>

<template>
  <LessonCard />
  <button @click="save">{{ lesson.title }}</button>
</template>
```

## 3. 插值表达式 `{{ }}`

插值表达式用于显示文本。

```vue
<p>{{ message }}</p>
<p>{{ count + 1 }}</p>
<p>{{ user.name }}</p>
```

注意：

- 插值会被当成文本显示。
- Vue 会默认转义内容，减少 XSS 风险。
- 不要在插值里写很复杂的逻辑。

不推荐：

```vue
<p>{{ tasks.filter(task => !task.done).map(task => task.title).join(', ') }}</p>
```

推荐用 `computed`：

```js
const activeTaskTitles = computed(() => {
  return tasks.value
    .filter((task) => !task.done)
    .map((task) => task.title)
    .join(', ')
})
```

```vue
<p>{{ activeTaskTitles }}</p>
```

## 4. `ref`：最常用的响应式状态

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)

function increase() {
  count.value++
}
</script>

<template>
  <button @click="increase">增加</button>
  <p>{{ count }}</p>
</template>
```

这里最容易疑惑的是 `.value`。

`ref(0)` 返回的不是数字 0，而是一个响应式对象，大概可以想成：

```js
const count = {
  value: 0
}
```

所以在脚本里要写：

```js
count.value++
```

模板里不用写 `.value`：

```vue
{{ count }}
```

因为 Vue 模板会自动解包 ref。

### 为什么 Vue 不直接让普通变量响应式

普通变量：

```js
let count = 0
```

JavaScript 没有办法让 Vue 自动知道你什么时候执行了 `count++`。`ref` 提供了一个可追踪的容器，Vue 可以知道容器里的值变了。

## 5. `reactive`：响应式对象

`reactive` 适合对象：

```js
import { reactive } from 'vue'

const form = reactive({
  title: '',
  minutes: 30,
  priority: 'normal'
})
```

使用时不需要 `.value`：

```js
form.title = '学习 ref'
form.minutes = 45
```

模板：

```vue
<input v-model="form.title">
<input v-model.number="form.minutes" type="number">
```

### `ref` 和 `reactive` 怎么选

初学建议：

- 单个值：用 `ref`，例如 `count`、`loading`、`keyword`。
- 数组：也可以用 `ref([])`，因为替换数组很方便。
- 表单对象：可以用 `reactive({ ... })`。

例如：

```js
const tasks = ref([])
const form = reactive({
  title: '',
  priority: 'normal'
})
```

## 6. 属性绑定 `v-bind`

HTML 属性如果需要使用变量，就用 `v-bind`，简写是 `:`。

```vue
<img :src="avatarUrl" :alt="user.name">
<button :disabled="loading">保存</button>
<a :href="link">查看详情</a>
```

如果不加 `:`，就是普通字符串。

```vue
<button disabled="loading">保存</button>
```

这里的 `disabled="loading"` 不是读取变量 `loading`，而是一个普通 HTML 属性，结果按钮可能一直禁用。

所以你要问：这个属性值是固定文字，还是来自变量？

- 固定文字：不用 `:`
- 来自变量或表达式：用 `:`

## 7. 事件绑定 `v-on`

事件绑定用 `v-on`，简写是 `@`。

```vue
<button @click="increase">增加</button>
<input @input="handleInput">
<form @submit.prevent="submit">...</form>
```

`@click="increase"` 表示点击时调用 `increase` 函数。

如果需要传参数：

```vue
<button @click="toggleTask(task.id)">切换</button>
```

如果需要事件对象：

```vue
<input @input="handleInput">
```

```js
function handleInput(event) {
  console.log(event.target.value)
}
```

### 事件修饰符

```vue
<form @submit.prevent="submit">
```

`.prevent` 表示阻止浏览器默认行为。表单默认提交会刷新页面，Vue 单页应用里通常不希望这样。

```vue
<button @click.stop="openMenu">打开</button>
```

`.stop` 表示阻止事件继续冒泡。

## 8. 条件渲染 `v-if`

```vue
<p v-if="loading">加载中...</p>
<p v-else-if="error">{{ error }}</p>
<p v-else>加载完成</p>
```

`v-if` 会真正创建或销毁元素。

如果只是频繁显示隐藏，可以用 `v-show`：

```vue
<aside v-show="sidebarOpen">侧边栏</aside>
```

区别：

- `v-if`：条件不满足时，元素不在 DOM 中。
- `v-show`：元素还在 DOM 中，只是用 CSS 隐藏。

初学时默认用 `v-if`，遇到频繁切换且不希望销毁状态时再考虑 `v-show`。

## 9. 列表渲染 `v-for`

```vue
<article v-for="lesson in lessons" :key="lesson.id">
  <h2>{{ lesson.title }}</h2>
  <p>{{ lesson.minutes }} 分钟</p>
</article>
```

读法：

- 对 `lessons` 数组里的每个 `lesson`。
- 渲染一个 `article`。
- 用 `lesson.id` 作为身份标识。

### 为什么必须写 `key`

`key` 告诉 Vue：列表里的每一项是谁。

如果没有稳定 key，或者用数组下标当 key，当列表增删排序时，Vue 可能复用错 DOM，导致输入框内容、勾选状态等错位。

推荐：

```vue
<li v-for="task in tasks" :key="task.id">
  {{ task.title }}
</li>
```

不推荐：

```vue
<li v-for="(task, index) in tasks" :key="index">
  {{ task.title }}
</li>
```

只有当列表永远不会增删、排序、过滤时，index 才勉强可用。

## 10. `computed`：从已有状态推导新值

当一个值可以由其他状态计算出来，不要手动存第二份，用 `computed`。

```js
const tasks = ref([
  { id: 1, title: '学习 ref', done: true },
  { id: 2, title: '学习 computed', done: false }
])

const completedCount = computed(() => {
  return tasks.value.filter((task) => task.done).length
})
```

模板：

```vue
<p>已完成 {{ completedCount }} 个</p>
```

### 为什么不用普通函数

普通函数也能算：

```js
function completedCount() {
  return tasks.value.filter((task) => task.done).length
}
```

但 `computed` 有缓存。只要依赖的 `tasks` 没变，Vue 可以复用上次结果。更重要的是，`computed` 表达了语义：这是一个“由状态推导出的值”。

### 不要重复存可推导状态

不推荐：

```js
const tasks = ref([])
const completedCount = ref(0)
```

每次任务变化你都要记得更新 `completedCount`，容易不同步。

推荐：

```js
const completedCount = computed(() => {
  return tasks.value.filter((task) => task.done).length
})
```

## 11. `watch`：状态变化后做一件事

`watch` 用来观察一个响应式状态，当它变化后执行副作用。

```js
watch(keyword, (newValue, oldValue) => {
  console.log('旧值：', oldValue)
  console.log('新值：', newValue)
})
```

常见副作用：

- 发送请求。
- 写入 `localStorage`。
- 修改网页标题。
- 调用第三方库。
- 打日志。

### `computed` 和 `watch` 的区别

`computed`：我要得到一个新值。

```js
const filteredTasks = computed(() => {
  return tasks.value.filter((task) => task.title.includes(keyword.value))
})
```

`watch`：某个值变了，我要执行动作。

```js
watch(keyword, (value) => {
  localStorage.setItem('keyword', value)
})
```

如果你只是为了显示一个结果，优先用 `computed`。如果你要“做一件事”，才用 `watch`。

## 12. 生命周期

组件从创建到销毁，有不同阶段。最常用的是 `onMounted`。

```js
import { onMounted } from 'vue'

onMounted(() => {
  console.log('组件已经出现在页面上')
})
```

常见用途：

- 页面进入后请求数据。
- DOM 出现后聚焦输入框。
- 初始化第三方库。

清理副作用用 `onUnmounted`：

```js
import { onMounted, onUnmounted } from 'vue'

let timerId

onMounted(() => {
  timerId = setInterval(() => {
    console.log('tick')
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timerId)
})
```

如果不清理定时器，组件离开后定时器还会继续跑。

## 13. 模板引用

当你真的需要 DOM 元素：

```vue
<script setup>
import { onMounted, ref } from 'vue'

const inputEl = ref(null)

onMounted(() => {
  inputEl.value.focus()
})
</script>

<template>
  <input ref="inputEl">
</template>
```

注意：

- 初始时 `inputEl.value` 是 `null`。
- 组件挂载后才会变成真实 DOM。
- 所以通常在 `onMounted` 里使用。

## 14. 本章完整小例子

```vue
<script setup>
import { computed, ref, watch } from 'vue'

const keyword = ref('')
const tasks = ref([
  { id: 1, title: '学习 ref', done: true },
  { id: 2, title: '学习 computed', done: false },
  { id: 3, title: '学习 watch', done: false }
])

const filteredTasks = computed(() => {
  return tasks.value.filter((task) => {
    return task.title.includes(keyword.value)
  })
})

const remainingCount = computed(() => {
  return tasks.value.filter((task) => !task.done).length
})

watch(keyword, (value) => {
  console.log('搜索词变化：', value)
})

function toggleTask(id) {
  const task = tasks.value.find((item) => item.id === id)

  if (task) {
    task.done = !task.done
  }
}
</script>

<template>
  <input v-model.trim="keyword" placeholder="搜索任务">

  <p>剩余 {{ remainingCount }} 个任务</p>

  <p v-if="filteredTasks.length === 0">没有匹配任务</p>

  <ul v-else>
    <li v-for="task in filteredTasks" :key="task.id">
      <label>
        <input type="checkbox" :checked="task.done" @change="toggleTask(task.id)">
        {{ task.title }}
      </label>
    </li>
  </ul>
</template>
```

这个例子包含：

- `ref` 保存状态。
- `computed` 推导筛选列表和剩余数量。
- `watch` 观察搜索词变化。
- `v-model` 处理输入。
- `v-if` 处理空状态。
- `v-for` 渲染列表。
- `@change` 处理事件。

## 本章练习

1. 创建一个 `lessons` 数组，包含课程标题、时长、完成状态。
2. 用 `v-for` 渲染课程列表，`key` 使用课程 id。
3. 点击按钮切换完成状态。
4. 用 `computed` 统计完成数量和总时长。
5. 加一个搜索框，用 `computed` 筛选课程。
6. 用 `watch` 把搜索词保存到 `localStorage`。
7. 用模板引用让页面加载后自动聚焦搜索框。

