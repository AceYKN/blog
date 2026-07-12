---
title: '06 Composition API 和组合式函数'
order: 6
---

# 06 Composition API 和组合式函数

Composition API 是 Vue 3 的核心写法之一。它不是为了让代码看起来高级，而是为了把同一件事相关的状态和逻辑放在一起，并让逻辑可以复用。

本章目标：你能看懂 `<script setup>` 中的 Composition API，能写自己的组合式函数，能判断什么时候该抽 `useXxx`，什么时候不该抽。

## 1. Options API 和 Composition API 的区别

早期 Vue 常见 Options API：

```vue
<script>
export default {
  data() {
    return {
      count: 0
    }
  },
  computed: {
    doubleCount() {
      return this.count * 2
    }
  },
  methods: {
    increase() {
      this.count++
    }
  }
}
</script>
```

逻辑按选项分类：

- `data` 放状态。
- `computed` 放计算属性。
- `methods` 放方法。

Composition API：

```vue
<script setup>
import { computed, ref } from 'vue'

const count = ref(0)
const doubleCount = computed(() => count.value * 2)

function increase() {
  count.value++
}
</script>
```

逻辑按功能组织。和计数器有关的状态、计算属性、函数放在一起。

## 2. 为什么 Composition API 适合复杂组件

假设一个组件同时有：

- 搜索逻辑。
- 分页逻辑。
- 表单校验。
- 弹窗状态。
- 请求状态。

Options API 里，搜索相关代码可能分散在 `data`、`computed`、`methods`、`watch`。Composition API 可以把搜索相关内容写在一起，甚至抽成 `useSearch`。

```js
const keyword = ref('')
const filteredItems = computed(...)
watch(keyword, ...)
function clearKeyword() {}
```

这些代码挨在一起，读起来更像“一个功能块”。

## 3. `<script setup>` 中的基本写法

```vue
<script setup>
import { computed, ref } from 'vue'

const count = ref(0)
const doubleCount = computed(() => count.value * 2)

function increase() {
  count.value++
}
</script>

<template>
  <button @click="increase">{{ count }}</button>
  <p>两倍：{{ doubleCount }}</p>
</template>
```

重要规则：

- 脚本中访问 `ref` 要 `.value`。
- 模板中访问 `ref` 不用 `.value`。
- 顶层声明的变量和函数可以直接在模板使用。
- 导入的组件也可以直接在模板使用。

## 4. 组合式函数是什么

组合式函数通常是一个以 `use` 开头的函数，它使用 Vue 的响应式 API，并返回状态和方法。

```js
// useCounter.js
import { computed, ref } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  const doubleCount = computed(() => count.value * 2)

  function increase() {
    count.value++
  }

  function reset() {
    count.value = initialValue
  }

  return {
    count,
    doubleCount,
    increase,
    reset
  }
}
```

组件使用：

```vue
<script setup>
import { useCounter } from '../composables/useCounter'

const { count, doubleCount, increase, reset } = useCounter(5)
</script>

<template>
  <p>{{ count }}</p>
  <p>{{ doubleCount }}</p>
  <button @click="increase">增加</button>
  <button @click="reset">重置</button>
</template>
```

## 5. 为什么组合式函数需要 `export`

`useCounter.js` 是一个单独模块。组件要导入它，就必须从模块中导出。

```js
export function useCounter(initialValue = 0) {
  // ...
}
```

然后组件才能：

```js
import { useCounter } from '../composables/useCounter'
```

如果不写 `export`，这个函数只属于 `useCounter.js` 文件内部，其他文件不能按名字导入。

这和第 1 章讲的模块规则完全一致。

## 6. 每次调用组合式函数都会创建新状态吗

看函数内部状态写在哪里。

如果状态写在函数内部：

```js
export function useCounter() {
  const count = ref(0)

  function increase() {
    count.value++
  }

  return { count, increase }
}
```

每个组件调用 `useCounter()` 都会得到自己的 `count`。

```js
const counterA = useCounter()
const counterB = useCounter()
```

`counterA.count` 和 `counterB.count` 是两份状态。

如果状态写在函数外部：

```js
const count = ref(0)

export function useSharedCounter() {
  function increase() {
    count.value++
  }

  return { count, increase }
}
```

所有调用都会共享同一个 `count`。这有时有用，但要小心，因为它更像全局状态。

## 7. 示例：`useToggle`

```js
import { ref } from 'vue'

export function useToggle(initialValue = false) {
  const value = ref(initialValue)

  function toggle() {
    value.value = !value.value
  }

  function setTrue() {
    value.value = true
  }

  function setFalse() {
    value.value = false
  }

  return {
    value,
    toggle,
    setTrue,
    setFalse
  }
}
```

组件使用：

```js
const modal = useToggle(false)
```

模板：

```vue
<button @click="modal.setTrue">打开</button>
<dialog v-if="modal.value">...</dialog>
```

## 8. 示例：`useLocalStorage`

目标：让一个响应式状态自动保存到浏览器 `localStorage`。

```js
import { ref, watch } from 'vue'

function readStorage(key, defaultValue) {
  try {
    const rawValue = localStorage.getItem(key)
    return rawValue ? JSON.parse(rawValue) : defaultValue
  } catch {
    return defaultValue
  }
}

export function useLocalStorage(key, defaultValue) {
  const state = ref(readStorage(key, defaultValue))

  watch(
    state,
    (value) => {
      localStorage.setItem(key, JSON.stringify(value))
    },
    { deep: true }
  )

  return state
}
```

逐步理解：

- `readStorage` 先尝试从浏览器读取已有值。
- 读不到就使用默认值。
- `state` 是响应式状态。
- `watch` 观察 `state`。
- `state` 一变化，就写回 `localStorage`。
- `{ deep: true }` 用来监听数组或对象内部变化。

组件使用：

```js
const todos = useLocalStorage('todos', [])
```

之后你像普通 ref 一样使用：

```js
todos.value.push({ id: 1, title: '学习持久化', done: false })
```

刷新后数据还在。

## 9. 示例：`useFetch`

目标：封装请求的 loading、error、data。

```js
import { ref } from 'vue'

export function useFetch(requester) {
  const data = ref(null)
  const loading = ref(false)
  const error = ref('')

  async function execute(...args) {
    loading.value = true
    error.value = ''

    try {
      data.value = await requester(...args)
    } catch (err) {
      error.value = err instanceof Error ? err.message : '请求失败'
    } finally {
      loading.value = false
    }
  }

  return {
    data,
    loading,
    error,
    execute
  }
}
```

使用：

```js
import { useFetch } from '../composables/useFetch'
import { getMockLessons } from '../data/mockApi'

const { data, loading, error, execute } = useFetch(getMockLessons)

onMounted(() => {
  execute()
})
```

模板：

```vue
<p v-if="loading">加载中...</p>
<p v-else-if="error">{{ error }}</p>
<LessonList v-else :lessons="data" />
```

## 10. 什么时候应该抽组合式函数

适合抽：

- 多个组件使用同样逻辑。
- 逻辑和 UI 没有强绑定。
- 组件太长，其中一组逻辑可以独立命名。
- 你能清楚描述这个函数负责什么。

例子：

- `useCounter`
- `useToggle`
- `useLocalStorage`
- `useFetch`
- `useDebounce`
- `useMousePosition`

不适合抽：

- 只用一次，而且抽出来更难读。
- 需要依赖很多组件内部变量。
- 抽出来只是为了“看起来像高级代码”。

## 11. 组合式函数和普通工具函数区别

普通工具函数：

```js
export function formatMinutes(minutes) {
  return `${minutes} 分钟`
}
```

它不使用 Vue 响应式 API，只是输入一个值，返回一个值。

组合式函数：

```js
export function useCounter() {
  const count = ref(0)
  // ...
}
```

它内部有响应式状态或生命周期，返回给组件使用。

通常：

- `formatXxx`、`calculateXxx` 是普通工具函数。
- `useXxx` 是组合式函数。

## 12. 组合式函数和 Pinia 的区别

组合式函数：

- 复用逻辑。
- 可以每次调用创建独立状态。
- 适合组件级或功能级逻辑。

Pinia：

- 管理全局或跨页面共享状态。
- 多个组件看到同一份 store。
- 适合业务状态，例如登录用户、购物车、任务列表。

例子：

| 状态/逻辑 | 推荐 |
| --- | --- |
| 鼠标位置 | 组合式函数 |
| 弹窗开关 | 组件内或组合式函数 |
| 任务列表跨页面共享 | Pinia |
| 本地存储同步逻辑 | 组合式函数 |
| 当前登录用户 | Pinia |

## 13. 常见错误

### 错误一：解构 reactive 导致响应丢失

```js
const form = reactive({ title: '' })
const { title } = form
```

这样解构出来的 `title` 不是响应式 ref。初学阶段避免这样写。

如果需要解构，使用 `toRefs`，或者直接使用 `form.title`。

### 错误二：忘记返回状态或方法

```js
export function useCounter() {
  const count = ref(0)
}
```

组件拿不到 `count`。需要：

```js
return { count }
```

### 错误三：组合式函数命名不清

`useSomething` 太模糊。更好的命名：

- `useTodoFilter`
- `useLocalStorage`
- `useCourseProgress`

名字应该告诉别人这个函数负责什么。

## 本章练习

1. 写 `useCounter(initialValue)`，返回 `count`、`doubleCount`、`increase`、`reset`。
2. 写 `useToggle(initialValue)`，返回 `value`、`toggle`、`setTrue`、`setFalse`。
3. 写 `useLocalStorage(key, defaultValue)`，保存数组状态。
4. 写一个页面调用两个 `useCounter()`，观察它们是否互相影响。
5. 回答：组合式函数和 Pinia 最大区别是什么？

