---
title: '14 毕业项目：课程任务管理器'
order: 14
---

# 14 毕业项目：课程任务管理器

毕业项目的目标是把前面所有知识串起来。你要做一个“课程任务管理器”：能展示课程、记录完成进度、创建学习任务、筛选任务、保存数据、模拟请求、写测试并构建。

本章不是只列功能，而是教你怎么从需求拆到组件、状态、路由和测试。

## 1. 项目目标

最终应用应该包含：

- 首页：学习统计和下一步建议。
- 课程页：课程列表、搜索、阶段筛选。
- 课程详情页：课程说明、完成状态。
- 任务页：新增任务、完成任务、删除任务、筛选任务。
- 异步页：模拟加载课程，显示 loading/error/empty/success。
- 设置或说明页：展示项目说明。

你可以参考 `D:\vue-tutorial\course-app`，但建议自己从空白项目重新做一次。

## 2. 需求拆解

### 课程功能

数据：

```js
const lessons = [
  {
    id: 'js',
    phase: '基础',
    title: 'JavaScript 必备基础',
    minutes: 80,
    summary: '变量、类型、函数、模块和异步。'
  }
]
```

功能：

- 显示课程列表。
- 搜索标题。
- 按阶段筛选。
- 标记完成。
- 查看详情。

### 任务功能

数据：

```js
const todos = [
  {
    id: 'todo-1',
    title: '完成组件通信练习',
    course: '组件',
    done: false
  }
]
```

功能：

- 新增任务。
- 切换完成。
- 删除任务。
- 全部/未完成/已完成筛选。
- 统计未完成数量。

## 3. 路由设计

推荐：

```text
/                 首页
/lessons          课程列表
/lessons/:id      课程详情
/todos            任务管理
/async            异步请求演示
/about            项目说明
```

路由职责：

- URL 表示当前页面。
- `:id` 表示详情页参数。
- 搜索和筛选可以用查询参数，也可以先用组件状态，进阶时再同步到 URL。

## 4. 组件拆分

建议组件：

```text
AppHeader
LessonCard
LessonList
LessonFilter
TodoForm
TodoItem
TodoStats
EmptyState
BaseButton
BasePanel
```

每个组件要回答：

- 它负责显示什么？
- 它需要哪些 props？
- 它会 emit 哪些事件？

例如 `TodoItem`：

```text
职责：显示单条任务，提供完成和删除操作。
props：todo。
emits：toggle(id)、remove(id)。
```

例如 `TodoForm`：

```text
职责：收集任务标题和所属阶段。
props：可选的阶段列表。
emits：submit(payload)。
内部状态：输入框文字、错误信息。
```

## 5. 状态设计

组件内状态：

- 任务表单输入框文字。
- 当前弹窗开关。
- 当前页面局部筛选，如果不需要共享。

Pinia 状态：

```text
useCourseStore
  completedLessonIds
  progressPercent
  toggleLesson(id)
  isCompleted(id)

useTodoStore
  todos
  filter
  filteredTodos
  remainingCount
  addTodo(payload)
  toggleTodo(id)
  removeTodo(id)
```

组合式函数：

```text
useLocalStorage
useFetch
useCounter
```

不要把所有状态都塞进一个 store。按业务领域拆。

## 6. 开发顺序

### 第一步：静态页面

先写 HTML 结构和样式，不要急着做交互。

目标：

- 能看到首页布局。
- 能看到课程卡片。
- 能看到任务表单和任务列表。

### 第二步：局部交互

先在页面组件里用 `ref` 实现：

- 新增任务。
- 删除任务。
- 切换完成。
- 筛选任务。

这一步不要急着 Pinia。先确认数据和交互正确。

### 第三步：拆组件

把重复 UI 拆出去：

- `TodoItem`。
- `TodoForm`。
- `LessonCard`。

拆完后检查 props 和 emit 是否清晰。

### 第四步：迁移到 Pinia

当多个页面都需要任务或课程进度时，再迁移到 store。

### 第五步：加 Router

配置页面，处理详情参数和 404。

### 第六步：加持久化

用 `useLocalStorage` 保存：

- 任务列表。
- 课程完成 id。

### 第七步：加异步请求

用 mock API 模拟课程加载：

- loading。
- error。
- empty。
- success。
- retry。

### 第八步：写测试

至少测试：

- 一个组合式函数，例如 `useCounter`。
- 一个组件事件，例如 `TodoItem` emit。
- 一个 store action，例如 `addTodo` 或 `toggleTodo`。

### 第九步：构建验证

运行：

```powershell
npm run test
npm run build
```

再在浏览器里手动验证关键流程。

## 7. 验收标准

你完成后应该能做到：

- 不看答案解释 props 和 emit 的数据流。
- 说清楚哪些状态放组件内，哪些放 Pinia。
- 解释 Router 和 Pinia 的边界。
- 请求失败时页面有错误和重试。
- 刷新页面后任务和进度保留。
- 测试能证明核心逻辑。
- 构建成功。

## 8. 常见项目陷阱

### 陷阱一：一开始就写 store

如果你还没想清楚功能，过早写 store 会把简单问题复杂化。先用局部状态跑通。

### 陷阱二：组件拆得太碎

拆组件不是目标。清晰边界才是目标。

### 陷阱三：只写成功状态

请求页必须有 loading、error、empty、success。

### 陷阱四：没有测试就大改

没有测试时，改一个地方很容易弄坏另一个地方。至少给核心逻辑补测试。

### 陷阱五：不会复述

如果你只能复制代码，却说不清为什么这样写，说明还没掌握。完成项目后必须能复述设计。

## 9. 最终复盘问题

写完项目后回答：

1. 你的路由有哪些？每个页面负责什么？
2. 你的组件有哪些？每个组件的 props 和 emits 是什么？
3. 哪些状态在组件内？为什么？
4. 哪些状态在 Pinia？为什么？
5. 哪些逻辑抽成了组合式函数？
6. 请求失败时用户看到什么？
7. 你的测试验证了哪些行为？
8. `npm run build` 生成了什么？
9. 如果要加登录功能，你会新增哪个 store？
10. 如果任务来自真实后端，你会把 API 逻辑放哪里？

## 本章练习

按 `D:\vue-tutorial\projects\todo-workshop\README.md` 的阶段完成项目。完成后，把上面的复盘问题写进你自己的项目 README。

