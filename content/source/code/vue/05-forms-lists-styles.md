---
title: '05 列表、表单、样式和用户输入'
order: 5
---

# 05 列表、表单、样式和用户输入

真实应用不是只展示数据，还要让用户输入、修改、筛选、提交。表单和列表是 Vue 项目最常见的业务界面。

本章目标：你能处理用户输入，能写基本校验，能稳定渲染列表，能根据状态切换样式，并能考虑空状态、错误状态和可访问性。

## 1. 列表数据应该有稳定 id

假设任务列表：

```js
const tasks = ref([
  { id: 'task-1', title: '学习 v-for', done: false },
  { id: 'task-2', title: '学习表单', done: true }
])
```

渲染：

```vue
<li v-for="task in tasks" :key="task.id">
  {{ task.title }}
</li>
```

`id` 是每一项的身份。不要把标题当 id，因为标题可能重复或修改。

前端新增时可以生成 id：

```js
const task = {
  id: crypto.randomUUID(),
  title: newTitle,
  done: false
}
```

如果后端返回数据，通常使用后端的 id。

## 2. 不要在模板里写复杂过滤

不推荐：

```vue
<li v-for="task in tasks.filter(task => !task.done)" :key="task.id">
  {{ task.title }}
</li>
```

这能运行，但不好读。模板应该尽量描述结构，不要塞复杂逻辑。

推荐：

```js
const activeTasks = computed(() => {
  return tasks.value.filter((task) => !task.done)
})
```

```vue
<li v-for="task in activeTasks" :key="task.id">
  {{ task.title }}
</li>
```

优点：

- 模板更干净。
- 过滤逻辑有名字。
- 调试时可以单独看 `activeTasks`。

## 3. `v-model` 是什么

输入框的值和响应式状态同步，最常用 `v-model`。

```vue
<script setup>
import { ref } from 'vue'

const title = ref('')
</script>

<template>
  <input v-model="title">
  <p>你输入的是：{{ title }}</p>
</template>
```

用户输入时：

- 输入框内容变化。
- `title` 自动更新。
- `{{ title }}` 自动更新。

如果不用 `v-model`，你要手动写：

```vue
<input :value="title" @input="title = $event.target.value">
```

`v-model` 就是把这种常见模式封装起来。

## 4. 不同表单控件的 `v-model`

文本输入：

```vue
<input v-model="title">
```

多行文本：

```vue
<textarea v-model="description"></textarea>
```

选择框：

```vue
<select v-model="priority">
  <option value="low">低</option>
  <option value="normal">普通</option>
  <option value="high">高</option>
</select>
```

单个复选框：

```vue
<label>
  <input v-model="accepted" type="checkbox">
  我已阅读规则
</label>
```

多个复选框绑定数组：

```vue
<label>
  <input v-model="selectedTags" type="checkbox" value="vue">
  Vue
</label>

<label>
  <input v-model="selectedTags" type="checkbox" value="router">
  Router
</label>
```

```js
const selectedTags = ref([])
```

选中后，数组里会有对应 value。

## 5. 表单修饰符

去掉前后空格：

```vue
<input v-model.trim="title">
```

转换数字：

```vue
<input v-model.number="minutes" type="number">
```

输入框失焦后才同步：

```vue
<input v-model.lazy="title">
```

表单提交阻止刷新：

```vue
<form @submit.prevent="submit">
```

这些修饰符不是必须用，但它们能减少重复代码。

## 6. 基础表单校验

状态：

```js
const title = ref('')
```

错误信息用 `computed`：

```js
const titleError = computed(() => {
  if (!title.value.trim()) {
    return '标题不能为空'
  }

  if (title.value.length > 30) {
    return '标题不能超过 30 个字符'
  }

  return ''
})
```

提交按钮是否可用：

```js
const canSubmit = computed(() => !titleError.value)
```

提交：

```js
function submit() {
  if (!canSubmit.value) {
    return
  }

  tasks.value.unshift({
    id: crypto.randomUUID(),
    title: title.value.trim(),
    done: false
  })

  title.value = ''
}
```

模板：

```vue
<form @submit.prevent="submit">
  <label for="task-title">任务标题</label>
  <input id="task-title" v-model.trim="title">
  <p v-if="titleError" role="alert">{{ titleError }}</p>
  <button :disabled="!canSubmit">新增</button>
</form>
```

## 7. 为什么错误信息用字符串而不是布尔值

你可能想写：

```js
const hasError = computed(() => !title.value.trim())
```

这只能告诉你“有没有错”，不能告诉用户“错在哪里”。

更好的方式是返回错误文本：

```js
const titleError = computed(() => {
  if (!title.value.trim()) return '标题不能为空'
  if (title.value.length > 30) return '标题不能超过 30 个字符'
  return ''
})
```

这样同一个值既能判断是否有错，也能显示错误。

## 8. 列表筛选

状态：

```js
const filter = ref('all')
```

筛选结果：

```js
const filteredTasks = computed(() => {
  if (filter.value === 'active') {
    return tasks.value.filter((task) => !task.done)
  }

  if (filter.value === 'completed') {
    return tasks.value.filter((task) => task.done)
  }

  return tasks.value
})
```

模板：

```vue
<button @click="filter = 'all'">全部</button>
<button @click="filter = 'active'">未完成</button>
<button @click="filter = 'completed'">已完成</button>

<ul>
  <li v-for="task in filteredTasks" :key="task.id">
    {{ task.title }}
  </li>
</ul>
```

这里的 `filter` 是页面局部状态。如果只是当前组件使用，不需要放 Pinia。

## 9. 动态 class

根据状态切换样式：

```vue
<li :class="{ done: task.done, urgent: task.priority === 'high' }">
  {{ task.title }}
</li>
```

CSS：

```css
.done {
  color: #64748b;
  text-decoration: line-through;
}

.urgent {
  border-left: 4px solid #dc2626;
}
```

数组写法：

```vue
<button :class="['button', variant, { loading }]">
  保存
</button>
```

对象适合开关类名，数组适合组合多个类名。

## 10. 动态 style

动态 style 适合少量数值样式：

```vue
<div class="progress-fill" :style="{ width: progress + '%' }"></div>
```

不建议把大量样式都写到 `:style` 里。复杂样式优先用 class。

## 11. 空状态、加载和错误

任何真实列表都不应该只写成功状态。

```vue
<p v-if="loading">加载中...</p>
<p v-else-if="error" role="alert">{{ error }}</p>
<p v-else-if="filteredTasks.length === 0">暂无任务</p>
<ul v-else>
  <li v-for="task in filteredTasks" :key="task.id">
    {{ task.title }}
  </li>
</ul>
```

四种状态：

- loading：正在加载。
- error：加载失败。
- empty：加载成功但没有数据。
- success：有数据。

初学者经常只写 success，真实项目必须补全其他状态。

## 12. 表单可访问性

不要只用 placeholder 当标签。

不推荐：

```vue
<input placeholder="任务标题">
```

推荐：

```vue
<label for="task-title">任务标题</label>
<input id="task-title" v-model="title" placeholder="例如：学习组件通信">
```

原因：

- placeholder 输入后会消失。
- 屏幕阅读器更需要 label。
- 点击 label 可以聚焦对应输入框。

错误提示：

```vue
<p v-if="titleError" role="alert">{{ titleError }}</p>
```

`role="alert"` 能帮助辅助技术知道这里出现了重要反馈。

## 13. 完整任务表单例子

```vue
<script setup>
import { computed, ref } from 'vue'

const title = ref('')
const priority = ref('normal')
const filter = ref('all')
const tasks = ref([])

const titleError = computed(() => {
  if (!title.value.trim()) return '标题不能为空'
  if (title.value.length > 30) return '标题不能超过 30 个字符'
  return ''
})

const canSubmit = computed(() => !titleError.value)

const filteredTasks = computed(() => {
  if (filter.value === 'active') return tasks.value.filter((task) => !task.done)
  if (filter.value === 'completed') return tasks.value.filter((task) => task.done)
  return tasks.value
})

function addTask() {
  if (!canSubmit.value) return

  tasks.value.unshift({
    id: crypto.randomUUID(),
    title: title.value.trim(),
    priority: priority.value,
    done: false
  })

  title.value = ''
  priority.value = 'normal'
}

function toggleTask(id) {
  const task = tasks.value.find((item) => item.id === id)

  if (task) {
    task.done = !task.done
  }
}
</script>

<template>
  <form @submit.prevent="addTask">
    <label for="title">任务标题</label>
    <input id="title" v-model.trim="title">
    <p v-if="titleError" role="alert">{{ titleError }}</p>

    <label for="priority">优先级</label>
    <select id="priority" v-model="priority">
      <option value="low">低</option>
      <option value="normal">普通</option>
      <option value="high">高</option>
    </select>

    <button :disabled="!canSubmit">新增任务</button>
  </form>

  <button @click="filter = 'all'">全部</button>
  <button @click="filter = 'active'">未完成</button>
  <button @click="filter = 'completed'">已完成</button>

  <p v-if="filteredTasks.length === 0">暂无任务</p>

  <ul v-else>
    <li
      v-for="task in filteredTasks"
      :key="task.id"
      :class="{ done: task.done, urgent: task.priority === 'high' }"
    >
      <label>
        <input type="checkbox" :checked="task.done" @change="toggleTask(task.id)">
        {{ task.title }}
      </label>
    </li>
  </ul>
</template>
```

## 本章练习

1. 写一个任务创建表单。
2. 标题不能为空，不能超过 30 字。
3. 增加优先级选择。
4. 用 `computed` 渲染“全部 / 未完成 / 已完成”三种列表。
5. 给已完成任务加删除线样式。
6. 给高优先级任务加醒目边框。
7. 给输入框补全 `label` 和错误提示。
8. 回答：哪些状态应该留在当前组件内？为什么？

