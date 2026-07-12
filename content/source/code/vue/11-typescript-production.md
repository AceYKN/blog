---
title: '11 TypeScript 和生产级代码'
order: 11
---

# 11 TypeScript 和生产级代码

你可以先用 JavaScript 学 Vue，再逐步引入 TypeScript。TypeScript 的价值不是“让代码更复杂”，而是让错误更早暴露，尤其适合多人协作和长期维护的项目。

本章目标：你理解 TypeScript 能解决什么问题，能给 Vue props、emits、ref、API 数据加基础类型，并知道生产级代码应该具备哪些习惯。

## 1. JavaScript 中的问题

JavaScript 很灵活：

```js
function formatMinutes(minutes) {
  return `${minutes} 分钟`
}

formatMinutes(30)
formatMinutes('abc')
```

第二次调用语法上没问题，但业务上可能错了。TypeScript 可以提前提醒：这里应该传数字。

```ts
function formatMinutes(minutes: number) {
  return `${minutes} 分钟`
}

formatMinutes('abc') // 类型错误
```

## 2. 基础类型

```ts
const title: string = 'Vue'
const minutes: number = 45
const done: boolean = false
```

数组：

```ts
const tags: string[] = ['vue', 'router']
const scores: number[] = [80, 90]
```

对象类型：

```ts
type Lesson = {
  id: string
  title: string
  minutes: number
  done: boolean
}
```

使用：

```ts
const lesson: Lesson = {
  id: 'core',
  title: 'Vue 核心语法',
  minutes: 90,
  done: false
}
```

## 3. 可选属性和联合类型

可选属性：

```ts
type User = {
  id: string
  name: string
  avatarUrl?: string
}
```

`avatarUrl?` 表示可能存在，也可能没有。

联合类型：

```ts
type Priority = 'low' | 'normal' | 'high'
```

这样可以限制优先级只能是这三个值。

```ts
const priority: Priority = 'urgent' // 报错
```

## 4. Vue 中给 props 加类型

```vue
<script setup lang="ts">
type Lesson = {
  id: string
  title: string
  minutes: number
  done: boolean
}

defineProps<{
  lesson: Lesson
  completed: boolean
}>()
</script>
```

这样父组件传错类型时，编辑器会提示。

例如 `completed` 应该是布尔值：

```vue
<LessonCard :completed="true" />
```

如果写成：

```vue
<LessonCard completed="true" />
```

这里传的是字符串 `"true"`，TypeScript 和 Vue 工具会更容易发现问题。

## 5. 给 emits 加类型

```ts
const emit = defineEmits<{
  toggle: [id: string]
  remove: [id: string]
}>()
```

调用：

```ts
emit('toggle', props.lesson.id)
```

如果写错事件名：

```ts
emit('toggel', props.lesson.id)
```

会提示错误。

如果参数类型错：

```ts
emit('toggle', 123)
```

也会提示错误。

## 6. 给 ref 加类型

多数时候 TypeScript 能推断：

```ts
const count = ref(0) // Ref<number>
const title = ref('') // Ref<string>
```

需要手动写类型的情况：

```ts
type Lesson = {
  id: string
  title: string
}

const lesson = ref<Lesson | null>(null)
```

为什么要 `Lesson | null`？

因为一开始可能还没请求到课程详情，所以是 `null`。请求成功后才是 `Lesson`。

模板中要处理：

```vue
<p v-if="!lesson">加载中...</p>
<article v-else>
  <h1>{{ lesson.title }}</h1>
</article>
```

## 7. API 数据类型

```ts
type ApiLesson = {
  id: string
  title: string
  completed: boolean
}

async function getLessons(): Promise<ApiLesson[]> {
  const response = await fetch('/api/lessons')

  if (!response.ok) {
    throw new Error('课程加载失败')
  }

  return response.json()
}
```

`Promise<ApiLesson[]>` 表示这个异步函数最终返回课程数组。

注意：TypeScript 只能检查你写的代码，不能保证后端真实返回一定符合类型。后端返回脏数据时，TypeScript 不会自动拦截。真实项目如果需要运行时校验，可以使用 zod 等库。

## 8. 类型放在哪里

小项目可以写在组件里：

```ts
type Lesson = { ... }
```

多个文件共用时，可以放：

```text
src/types/lesson.ts
```

```ts
// src/types/lesson.ts
export type Lesson = {
  id: string
  title: string
  minutes: number
}
```

导入：

```ts
import type { Lesson } from '../types/lesson'
```

`import type` 表示只导入类型，不导入运行时代码。

## 9. 生产级代码习惯

生产级不是指代码很复杂，而是指它能被维护。

好习惯：

- 文件名和组件名清晰。
- 组件职责单一。
- 状态放在合适位置。
- API 请求有错误处理。
- 表单有校验。
- 列表有空状态。
- 关键逻辑有测试。
- 不把所有逻辑塞进一个巨大组件。
- 不依赖“我记得这里不会出错”。

## 10. 目录建议

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

- `components`：可复用组件。
- `views`：页面组件。
- `composables`：组合式函数。
- `stores`：Pinia。
- `services`：请求封装。
- `types`：共享类型。

## 11. 初学者引入 TypeScript 的节奏

不要一开始就被类型吓住。推荐顺序：

1. 先用 JavaScript 学会 Vue 核心。
2. 给数据模型写类型，例如 `Lesson`、`Todo`。
3. 给 props 和 emits 加类型。
4. 给 API 函数返回值加类型。
5. 给复杂组合式函数加类型。

TypeScript 是工具，不是学习 Vue 的前置障碍。

## 12. 常见错误

### 错误一：把类型当运行时变量用

```ts
type Lesson = { title: string }

console.log(Lesson) // 错误，Lesson 是类型，不是值
```

类型只在开发和编译时存在，运行时没有。

### 错误二：过度使用 `any`

```ts
const lesson: any = {}
```

`any` 会关闭类型检查。初学时可以偶尔救急，但不要大量使用。

### 错误三：忽略 null

```ts
const lesson = ref<Lesson | null>(null)

console.log(lesson.value.title) // 可能报错，因为 lesson.value 可能是 null
```

修复：

```ts
if (lesson.value) {
  console.log(lesson.value.title)
}
```

## 本章练习

1. 为 `Lesson` 和 `Todo` 写类型。
2. 把 `LessonCard` 的 props 改成 TypeScript 写法。
3. 为 `toggle` 和 `remove` emits 加类型。
4. 写 `getLessons(): Promise<Lesson[]>`。
5. 回答：TypeScript 能防止哪些错误？不能防止哪些错误？

