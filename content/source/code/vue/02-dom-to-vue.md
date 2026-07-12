---
title: '02 DOM 到 Vue 的心智模型'
order: 2
---

# 02 DOM 到 Vue 的心智模型

你略懂 DOM，这是学习 Vue 的好起点。Vue 并不是让你忘掉 HTML、CSS、JavaScript，而是帮你少写那些容易出错的“手动同步 DOM”的代码。

本章核心目标：理解为什么原生 DOM 在复杂交互里会越来越乱，以及 Vue 如何用“状态驱动界面”的方式解决这个问题。

## 1. DOM 是什么

浏览器把 HTML 解析成一棵对象树，这棵树叫 DOM。

HTML：

```html
<main>
  <h1>任务列表</h1>
  <button id="add">新增</button>
</main>
```

浏览器内部会把它变成类似这样的结构：

```text
document
  main
    h1
    button#add
```

JavaScript 可以通过 DOM API 找到元素、读取内容、修改内容、监听事件。

```js
const button = document.querySelector('#add')

button.addEventListener('click', () => {
  console.log('用户点击了新增')
})
```

## 2. 原生 DOM 写计数器

```html
<button id="decrease">-</button>
<span id="count">0</span>
<button id="increase">+</button>

<script>
  let count = 0

  const countEl = document.querySelector('#count')
  const increaseBtn = document.querySelector('#increase')
  const decreaseBtn = document.querySelector('#decrease')

  function render() {
    countEl.textContent = count
  }

  increaseBtn.addEventListener('click', () => {
    count++
    render()
  })

  decreaseBtn.addEventListener('click', () => {
    count--
    render()
  })
</script>
```

逐行理解：

- `let count = 0`：真正的数据。
- `countEl`：页面上显示数字的 DOM 元素。
- `render()`：把数据同步到 DOM。
- 点击按钮后先修改 `count`，再调用 `render()`。

这里有一个关键问题：**你必须记得每次数据变化后手动更新 DOM。**

如果你忘了：

```js
increaseBtn.addEventListener('click', () => {
  count++
  // 忘记 render()
})
```

数据已经变了，但页面没变。用户看到的界面和真实数据不一致。

## 3. 原生 DOM 写列表为什么容易变复杂

假设你有任务数组：

```js
let tasks = [
  { id: 1, title: '学习 JS', done: false },
  { id: 2, title: '学习 DOM', done: true }
]
```

你要渲染列表：

```html
<ul id="task-list"></ul>
```

```js
const listEl = document.querySelector('#task-list')

function renderTasks() {
  listEl.innerHTML = ''

  tasks.forEach((task) => {
    const item = document.createElement('li')
    item.textContent = task.done ? `✅ ${task.title}` : task.title

    const button = document.createElement('button')
    button.textContent = '切换'
    button.addEventListener('click', () => {
      task.done = !task.done
      renderTasks()
    })

    item.appendChild(button)
    listEl.appendChild(item)
  })
}

renderTasks()
```

这段代码能工作，但你要自己处理很多细节：

- 清空旧列表。
- 创建每个 DOM 元素。
- 填入文字。
- 给每个按钮绑定事件。
- 数据变化后重新渲染。
- 删除任务、筛选任务、编辑任务时还要继续扩展。

项目越大，手动 DOM 同步越容易出现问题。

## 4. Vue 怎么写同一个列表

```vue
<script setup>
import { ref } from 'vue'

const tasks = ref([
  { id: 1, title: '学习 JS', done: false },
  { id: 2, title: '学习 DOM', done: true }
])

function toggleTask(id) {
  const task = tasks.value.find((item) => item.id === id)

  if (task) {
    task.done = !task.done
  }
}
</script>

<template>
  <ul>
    <li v-for="task in tasks" :key="task.id">
      <span>{{ task.done ? '✅' : '⬜' }} {{ task.title }}</span>
      <button @click="toggleTask(task.id)">切换</button>
    </li>
  </ul>
</template>
```

这里发生了什么：

- `tasks` 是响应式数据。
- `v-for` 根据数组渲染列表。
- `@click` 绑定点击事件。
- `toggleTask` 只负责改数据。
- 数据变化后，Vue 自动更新 DOM。

你不再手动写：

```js
document.createElement(...)
appendChild(...)
textContent = ...
innerHTML = ...
```

Vue 的价值不是“少写几个字符”，而是让你把注意力从 DOM 操作转回数据和业务逻辑。

## 5. 命令式和声明式

原生 DOM 常见写法是命令式：你一步步命令浏览器怎么做。

```js
const item = document.createElement('li')
item.textContent = task.title
listEl.appendChild(item)
```

Vue 模板是声明式：你描述“数据处于某种状态时，页面应该是什么样”。

```vue
<li v-for="task in tasks" :key="task.id">
  {{ task.title }}
</li>
```

命令式关注“怎么做”，声明式关注“是什么”。

在复杂页面里，声明式更容易维护，因为你能直接看到：

- 数据在哪里。
- 页面如何由数据得到。
- 用户操作如何修改数据。

## 6. Vue 的核心循环

Vue 最重要的心智模型：

```text
状态 state
  ↓
模板 template 描述界面
  ↓
页面 UI
  ↓
用户点击、输入、请求返回
  ↓
修改状态 state
  ↓
Vue 自动更新页面
```

这条链路如果想清楚，很多 Vue 问题都会变简单。

例如输入框：

```vue
<script setup>
import { ref } from 'vue'

const name = ref('')
</script>

<template>
  <input v-model="name">
  <p>你好，{{ name }}</p>
</template>
```

用户输入后：

1. 输入框内容变化。
2. `v-model` 更新 `name`。
3. `name` 是响应式状态。
4. Vue 重新渲染 `{{ name }}`。
5. 页面显示新内容。

## 7. Vue 不是完全不能操作 DOM

初学阶段建议：能用状态表达，就不要直接操作 DOM。

不推荐：

```js
document.querySelector('.message').textContent = '保存成功'
```

推荐：

```js
const message = ref('')

function save() {
  message.value = '保存成功'
}
```

```vue
<p class="message">{{ message }}</p>
```

但确实有些场景需要 DOM：

- 页面加载后让输入框自动聚焦。
- 测量元素宽高。
- 集成第三方图表库。
- 操作 canvas。
- 调用浏览器原生 API。

Vue 提供模板引用：

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

这里的 `ref="inputEl"` 是模板引用，不是响应式 `ref()` 本身，但它们配合使用：Vue 会在组件挂载后把真实 DOM 元素放进 `inputEl.value`。

## 8. CDN 示例和工程化项目的区别

你可以用 CDN 直接在 HTML 中使用 Vue：

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
```

这适合入门理解：

- 不需要安装 Node。
- 不需要 Vite。
- 一个 HTML 文件就能运行。

但正式项目通常使用 Vite：

```powershell
npm create vue@latest
```

原因：

- 可以写 `.vue` 单文件组件。
- 可以用 `import/export` 拆文件。
- 可以安装 Router、Pinia、测试工具。
- 可以构建生产产物。
- 开发时有热更新和错误提示。

本课程的 `examples/cdn-basics/index.html` 用来理解概念，`course-app` 用来学习真实项目结构。

## 9. 从 DOM 思维迁移到 Vue 思维

当你想写：

```js
document.querySelector(...)
element.textContent = ...
element.classList.add(...)
```

先停一下，问：

1. 我真正想表达的状态是什么？
2. 这个状态能不能用 `ref` 或 `computed` 表示？
3. 模板能不能根据这个状态显示不同内容或 class？

例如按钮禁用：

原生 DOM 思维：

```js
button.disabled = title.length === 0
```

Vue 思维：

```vue
<button :disabled="title.length === 0">提交</button>
```

例如错误样式：

原生 DOM 思维：

```js
if (hasError) {
  input.classList.add('error')
} else {
  input.classList.remove('error')
}
```

Vue 思维：

```vue
<input :class="{ error: hasError }">
```

## 10. 常见误区

### 误区一：Vue 会自动理解普通变量

```js
let count = 0
```

普通变量变化，Vue 不会自动更新模板。需要：

```js
const count = ref(0)
```

### 误区二：一边用 Vue，一边大量 querySelector

如果你在 Vue 组件里到处写：

```js
document.querySelector(...)
```

往往说明你还没有用状态表达界面。只有真实需要 DOM 本身时才这样做。

### 误区三：以为模板只是 HTML

Vue 模板看起来像 HTML，但它多了指令：

- `v-if`
- `v-for`
- `v-model`
- `:class`
- `@click`

这些指令让模板和响应式状态连接起来。

### 误区四：数据结构不清晰就开始写界面

先想数据：

```js
const tasks = [
  { id: 1, title: '学习 Vue', done: false }
]
```

再想界面如何显示这些数据。不要反过来先堆 HTML，再到处找地方塞逻辑。

## 本章练习

### 练习 1：原生 DOM 任务列表

用原生 DOM 写一个页面：

- 输入框输入任务标题。
- 点击按钮新增任务。
- 列表显示所有任务。
- 点击任务按钮切换完成状态。

要求你必须写一个 `render()` 函数，每次数据变化后调用。

### 练习 2：Vue 任务列表

用 Vue 写同样功能：

- `tasks` 使用 `ref([])`。
- 表单输入使用 `v-model`。
- 列表使用 `v-for`。
- 点击按钮只修改数据，不手动创建 DOM。

### 练习 3：对比总结

回答：

1. 原生 DOM 版本中，数据在哪里？DOM 更新在哪里？
2. Vue 版本中，数据在哪里？DOM 更新是谁做的？
3. 为什么忘记调用 `render()` 会导致界面和数据不同步？
4. Vue 中什么时候仍然需要模板引用拿 DOM？

