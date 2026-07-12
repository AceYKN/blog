---
title: '10 测试、调试和质量保障'
order: 10
---

# 10 测试、调试和质量保障

测试不是为了追求形式，而是为了让你修改代码时知道有没有把旧功能弄坏。调试也不是靠猜，而是有步骤地定位问题。

本章目标：你能读懂常见报错，能用 Vue DevTools 和控制台观察状态，能用 Vitest 测试组合式函数和组件事件。

## 1. 先学会读报错

报错一般包含几类信息：

```text
ReferenceError: count is not defined
    at Counter.vue:12:5
```

你要看：

- 错误类型：`ReferenceError`。
- 错误内容：`count is not defined`。
- 文件和行号：`Counter.vue:12:5`。

这句话意思是：第 12 行用了一个不存在的变量 `count`。

常见错误：

```text
Cannot read properties of undefined
```

意思是你在 `undefined` 上读属性，例如：

```js
user.name
```

但 `user` 是 `undefined`。

修复思路：

- 检查数据是否还没加载。
- 给初始值。
- 用条件渲染。

```vue
<p v-if="user">{{ user.name }}</p>
```

## 2. 调试的基本流程

遇到问题不要马上乱改。按步骤：

1. **复现问题**：能稳定触发吗？
2. **缩小范围**：是页面没进入、数据没来、事件没触发，还是渲染条件错？
3. **观察状态**：用 Vue DevTools 看组件 state、props、Pinia。
4. **检查事件**：按钮点击函数有没有执行？
5. **检查数据变化**：状态有没有真的改变？
6. **检查模板条件**：`v-if`、`v-for`、`key` 有没有写错？
7. **修复后验证**：重新跑同样操作。

调试不是“试试这个、试试那个”，而是不断缩小问题范围。

## 3. Vue DevTools 能看什么

推荐安装 Vue 官方 DevTools 浏览器扩展。

它能看：

- 组件树。
- 当前组件 props。
- 当前组件 state。
- computed 值。
- Pinia store。
- 事件。

例如子组件没有显示数据，先看：

- 父组件是否传了 prop？
- 子组件 props 面板里有没有收到？
- prop 名是否拼错？

这比到处 `console.log` 更清楚。

## 4. 什么是测试

测试就是用代码验证另一个代码的行为。

例如你写了 `useCounter`：

```js
export function useCounter(initialValue = 0) {
  const count = ref(initialValue)

  function increase() {
    count.value++
  }

  return { count, increase }
}
```

测试：

```js
import { describe, expect, it } from 'vitest'
import { useCounter } from '../composables/useCounter'

describe('useCounter', () => {
  it('increases count', () => {
    const counter = useCounter(1)

    counter.increase()

    expect(counter.count.value).toBe(2)
  })
})
```

这段测试表达的需求是：从 1 开始，调用 increase 后应该变成 2。

## 5. Vitest 基础

常见结构：

```js
describe('一组测试', () => {
  it('描述一个行为', () => {
    expect(实际结果).toBe(期望结果)
  })
})
```

例如：

```js
it('adds two numbers', () => {
  expect(1 + 2).toBe(3)
})
```

常见断言：

```js
expect(value).toBe(1)              // 基本值相等
expect(object).toEqual({ a: 1 })   // 对象或数组内容相等
expect(text).toContain('Vue')      // 包含文本
expect(fn).toThrow()               // 函数会抛错
```

## 6. 测试组合式函数

组合式函数通常没有 DOM，最适合初学者练测试。

```js
import { describe, expect, it } from 'vitest'
import { useCounter } from '../composables/useCounter'

describe('useCounter', () => {
  it('starts from initial value', () => {
    const counter = useCounter(5)

    expect(counter.count.value).toBe(5)
  })

  it('increases by one', () => {
    const counter = useCounter(0)

    counter.increase()

    expect(counter.count.value).toBe(1)
  })

  it('resets to initial value', () => {
    const counter = useCounter(3)

    counter.increase()
    counter.reset()

    expect(counter.count.value).toBe(3)
  })
})
```

注意：测试里访问 ref 仍然要 `.value`。

## 7. 组件测试

组件测试需要把组件挂载起来。

```js
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import TodoItem from '../components/TodoItem.vue'

describe('TodoItem', () => {
  it('renders title', () => {
    const wrapper = mount(TodoItem, {
      props: {
        todo: {
          id: '1',
          title: '学习组件测试',
          done: false
        }
      }
    })

    expect(wrapper.text()).toContain('学习组件测试')
  })
})
```

`mount` 会创建组件实例。`wrapper` 是测试工具提供的包装对象，可以读取文本、查找按钮、触发事件。

## 8. 测试 emit

子组件点击后应该发事件：

```js
it('emits toggle event', async () => {
  const wrapper = mount(TodoItem, {
    props: {
      todo: {
        id: '1',
        title: '学习测试',
        done: false
      }
    }
  })

  await wrapper.get('[data-test="toggle"]').trigger('click')

  expect(wrapper.emitted('toggle')).toBeTruthy()
  expect(wrapper.emitted('toggle')[0]).toEqual(['1'])
})
```

模板中建议给测试钩子：

```vue
<button data-test="toggle" @click="emit('toggle', todo.id)">
  切换
</button>
```

为什么不用 class？

- class 主要服务样式，可能会改。
- `data-test` 明确表示给测试使用。

## 9. 测试应该关注什么

好测试关注行为，不关注实现细节。

推荐测试：

- 给定 props，组件显示正确文本。
- 用户点击按钮，组件 emit 正确事件。
- 组合式函数调用方法后状态改变。
- store action 修改状态。

不推荐过度测试：

- 某个内部变量名字。
- 某个 class 的存在，除非它代表重要状态。
- 完全重复 Vue 自己已经保证的行为。

## 10. 测试命名

好的测试名像需求：

```js
it('emits remove event with todo id when remove button is clicked', () => {})
```

不好的测试名：

```js
it('test 1', () => {})
```

读测试的人应该不看实现也知道这条测试验证什么。

## 11. 常见 Vue 调试场景

### 页面空白

检查：

- 控制台是否有报错。
- 根组件是否挂载。
- Router 是否有匹配页面。
- `v-if` 条件是否一直为 false。
- 请求是否一直 loading。

### 点击按钮没反应

检查：

- 按钮是否真的可点击，是否 disabled。
- `@click` 函数名是否拼错。
- 函数里是否改了响应式状态。
- 子组件是否 emit。
- 父组件监听事件名是否一致。

### 列表状态错位

检查：

- `v-for` 是否有稳定 `key`。
- 是否用 index 当 key。
- 是否对数组做了增删排序。

### 表单提交刷新页面

检查：

```vue
<form @submit.prevent="submit">
```

是否忘记 `.prevent`。

## 12. 质量保障清单

提交前至少运行：

```powershell
npm run test
npm run build
```

如果有 lint：

```powershell
npm run lint
```

如果改了 UI，最好浏览器实际点一遍：

- 首页是否能打开。
- 关键按钮是否有反应。
- 表单错误是否显示。
- 移动端是否明显错位。

## 本章练习

1. 为 `useCounter` 写 3 个测试：初始值、增加、重置。
2. 为 `TodoItem` 写测试：能显示标题。
3. 为 `TodoItem` 写测试：点击切换按钮 emit `toggle`。
4. 故意把事件名改错，确认测试失败。
5. 修复事件名，确认测试通过。
6. 写一份你自己的调试清单。

