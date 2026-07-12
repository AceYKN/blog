---
title: '04 组件、Props、事件和插槽'
order: 4
---

# 04 组件、Props、事件和插槽

组件是 Vue 项目最重要的组织方式。你可以把组件理解成“一个有名字、有输入、有输出的界面单元”。

本章目标：你能判断什么时候该拆组件，能正确使用 props 和 emit，能理解插槽为什么存在，能避免子组件乱改父组件数据。

## 1. 为什么需要组件

假设一个页面里有三张课程卡片：

```vue
<article>
  <h2>JavaScript 基础</h2>
  <p>80 分钟</p>
  <button>标记完成</button>
</article>

<article>
  <h2>Vue 核心语法</h2>
  <p>90 分钟</p>
  <button>标记完成</button>
</article>

<article>
  <h2>Pinia 状态管理</h2>
  <p>70 分钟</p>
  <button>标记完成</button>
</article>
```

问题：

- 结构重复。
- 样式重复。
- 按钮逻辑重复。
- 以后改卡片结构要改很多处。

组件化后：

```vue
<LessonCard
  v-for="lesson in lessons"
  :key="lesson.id"
  :lesson="lesson"
  :completed="isCompleted(lesson.id)"
  @toggle="toggleLesson"
/>
```

`LessonCard` 负责显示一张课程卡片。父组件只负责准备数据和处理事件。

## 2. 什么时候应该拆组件

适合拆：

- 一块 UI 重复出现。
- 一块 UI 有清晰含义，例如 `TodoItem`、`SearchBox`、`UserMenu`。
- 一个文件太长，逻辑混在一起。
- 你能清楚说出组件的输入和输出。

不急着拆：

- 只出现一次且很短。
- 拆出去后要传很多零碎 props。
- 组件职责说不清。

判断标准不是“越拆越高级”，而是“拆完后边界更清楚”。

## 3. 父组件向子组件传数据：Props

父组件：

```vue
<LessonCard :lesson="lesson" />
```

子组件：

```vue
<script setup>
defineProps({
  lesson: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <article>
    <h2>{{ lesson.title }}</h2>
    <p>{{ lesson.minutes }} 分钟</p>
  </article>
</template>
```

`defineProps` 声明这个组件需要外部传什么数据。

这就像函数参数：

```js
function LessonCard(lesson) {
  // 使用 lesson
}
```

组件的 props 是组件的输入。

## 4. 为什么 props 应该只读

子组件不应该直接修改 props。

不推荐：

```vue
<script setup>
const props = defineProps({
  lesson: Object
})

function complete() {
  props.lesson.completed = true
}
</script>
```

为什么？

因为数据是父组件传下来的。如果子组件直接改，父组件会很难追踪数据到底是谁改的。

更推荐的模式：

```text
父组件拥有数据
  ↓ props
子组件显示数据
  ↓ emit
父组件收到事件后修改数据
```

这叫单向数据流。

## 5. 子组件通知父组件：emit

子组件不能直接决定父组件的数据怎么改，但可以通知父组件“用户做了什么”。

子组件：

```vue
<script setup>
const props = defineProps({
  lesson: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['toggle'])

function handleClick() {
  emit('toggle', props.lesson.id)
}
</script>

<template>
  <button @click="handleClick">切换完成</button>
</template>
```

父组件：

```vue
<LessonCard
  :lesson="lesson"
  @toggle="toggleLesson"
/>
```

父组件函数：

```js
function toggleLesson(id) {
  const lesson = lessons.value.find((item) => item.id === id)

  if (lesson) {
    lesson.completed = !lesson.completed
  }
}
```

流程：

1. 父组件把 `lesson` 传给子组件。
2. 子组件显示课程。
3. 用户点击子组件按钮。
4. 子组件 `emit('toggle', id)`。
5. 父组件监听 `@toggle`，调用 `toggleLesson`。
6. 父组件修改自己的数据。
7. 数据变化后，新的 props 再传给子组件。

## 6. 事件名怎么设计

事件名应该表达“发生了什么”，不要太模糊。

不清晰：

```js
emit('change')
emit('click')
emit('update')
```

更清晰：

```js
emit('toggle', id)
emit('remove', id)
emit('submit', form)
emit('select', option)
```

组件事件不是 DOM 事件，它是你定义的业务事件。

## 7. 完整例子：TodoItem

子组件 `TodoItem.vue`：

```vue
<script setup>
defineProps({
  todo: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['toggle', 'remove'])
</script>

<template>
  <li>
    <label>
      <input
        type="checkbox"
        :checked="todo.done"
        @change="emit('toggle', todo.id)"
      >
      <span>{{ todo.title }}</span>
    </label>

    <button @click="emit('remove', todo.id)">删除</button>
  </li>
</template>
```

父组件：

```vue
<TodoItem
  v-for="todo in todos"
  :key="todo.id"
  :todo="todo"
  @toggle="toggleTodo"
  @remove="removeTodo"
/>
```

父组件逻辑：

```js
function toggleTodo(id) {
  todos.value = todos.value.map((todo) => {
    return todo.id === id ? { ...todo, done: !todo.done } : todo
  })
}

function removeTodo(id) {
  todos.value = todos.value.filter((todo) => todo.id !== id)
}
```

注意：子组件只负责“告诉父组件用户点击了哪个任务”，真正修改数组的是父组件。

## 8. 插槽：让父组件决定子组件内部内容

有些组件不应该关心具体内容，只负责外壳。

例如 `BasePanel.vue`：

```vue
<template>
  <section class="panel">
    <slot />
  </section>
</template>
```

使用：

```vue
<BasePanel>
  <h2>学习进度</h2>
  <p>你已经完成 3 章。</p>
</BasePanel>
```

渲染时，`<slot />` 会被父组件传进来的内容替换。

这就像：

```text
BasePanel 提供盒子
父组件提供盒子里面放什么
```

## 9. 具名插槽

如果一个组件有多个可填区域，用具名插槽。

```vue
<!-- CourseCard.vue -->
<template>
  <article class="card">
    <header>
      <slot name="title" />
    </header>

    <main>
      <slot />
    </main>

    <footer>
      <slot name="actions" />
    </footer>
  </article>
</template>
```

使用：

```vue
<CourseCard>
  <template #title>
    <h2>Vue Router</h2>
  </template>

  <p>学习页面跳转和动态路由。</p>

  <template #actions>
    <button>开始学习</button>
  </template>
</CourseCard>
```

`#title` 是 `v-slot:title` 的简写。

## 10. 组件 `v-model`

普通输入框：

```vue
<input v-model="keyword">
```

如果你自己写一个搜索框组件，也希望这样用：

```vue
<SearchBox v-model="keyword" />
```

可以在子组件中使用 `defineModel`：

```vue
<!-- SearchBox.vue -->
<script setup>
const model = defineModel()
</script>

<template>
  <input v-model="model" placeholder="搜索课程">
</template>
```

父组件：

```vue
<SearchBox v-model="keyword" />
```

含义：

- 父组件的 `keyword` 传给子组件。
- 子组件输入变化时，通知父组件更新 `keyword`。

本质上仍然是 props + emit，只是 Vue 提供了简洁语法。

## 11. Provide / Inject

如果数据要跨很多层组件传递，层层 props 会很麻烦。

```text
App
  Layout
    Sidebar
      UserMenu
```

如果 `App` 里的主题要给 `UserMenu` 用，可以：

```js
// 上层组件
import { provide } from 'vue'

provide('theme', 'dark')
```

```js
// 下层组件
import { inject } from 'vue'

const theme = inject('theme')
```

但不要滥用。普通业务共享状态通常更适合 Pinia。

Provide/Inject 更常用于：

- 主题。
- 表单上下文。
- UI 组件库内部。
- 深层组件共享少量上下文。

## 12. 组件通信选择表

| 场景 | 推荐方式 |
| --- | --- |
| 父组件给子组件展示数据 | props |
| 子组件告诉父组件用户操作 | emit |
| 父组件决定子组件内部某块内容 | slot |
| 表单组件双向绑定 | 组件 v-model |
| 跨很多层传少量上下文 | provide/inject |
| 多页面共享业务状态 | Pinia |

## 13. 常见错误

### 错误一：子组件直接改 props

现象：数据流混乱，父组件难以追踪。

修复：子组件 emit，父组件修改。

### 错误二：父组件传错 prop 名

父组件：

```vue
<LessonCard :course="lesson" />
```

子组件：

```js
defineProps({
  lesson: Object
})
```

子组件要的是 `lesson`，父组件传的是 `course`，所以 `lesson` 为空。

修复：

```vue
<LessonCard :lesson="lesson" />
```

### 错误三：emit 名和监听名不一致

子组件：

```js
emit('remove')
```

父组件：

```vue
<TodoItem @delete="removeTodo" />
```

父组件监听的是 `delete`，子组件发的是 `remove`，不会触发。

修复：

```vue
<TodoItem @remove="removeTodo" />
```

### 错误四：为了拆而拆

如果一个组件需要 15 个 props 才能工作，可能说明它边界不清。可以考虑：

- 是否拆得太细。
- 是否应该把相关数据组合成对象。
- 是否应该让某些逻辑留在父组件。

## 本章练习

1. 写一个 `LessonCard` 组件，props 接收 `lesson` 和 `completed`。
2. `LessonCard` 点击按钮后 emit `toggle`，参数是课程 id。
3. 父组件维护 `completedLessonIds`，收到事件后修改数组。
4. 写一个 `BasePanel`，通过默认插槽显示内容。
5. 写一个 `SearchBox`，支持 `v-model`。
6. 回答：为什么子组件不应该直接改 props？

