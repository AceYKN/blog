---
title: '01 JavaScript 必备基础'
order: 1
---

# 01 JavaScript 必备基础

Vue 不是一门脱离 JavaScript 的新语言。Vue 组件里的 `<script setup>` 本质上就是 JavaScript，只是 Vue 提供了一些特殊函数，例如 `ref`、`computed`、`watch`。所以学 Vue 前，你至少要能看懂变量、数组、对象、函数、模块和异步。

本章不追求讲完 JavaScript 的全部细节，而是讲 Vue 开发每天都会用到的部分，并且尽量回答“为什么要这么写”。

## 1. 变量：给数据起名字

变量就是给一个值起名字，后面可以通过这个名字使用它。

```js
const courseName = "Vue 完整课程";
let progress = 0;

progress = progress + 1;
```

这段代码里：

- `courseName` 保存字符串。
- `progress` 保存数字。
- `progress = progress + 1` 表示取出原来的进度，加 1，再放回去。

### `const` 和 `let` 的区别

`const` 表示这个变量名不能重新指向另一个值：

```js
const title = "Vue";
title = "React"; // 报错
```

`let` 表示这个变量名以后可以重新赋值：

```js
let count = 0;
count = 1;
```

初学时可以记住：

- 不需要重新赋值：用 `const`。
- 需要重新赋值：用 `let`。
- 不用 `var`，因为它的作用域规则更容易制造困惑。

### Vue 里为什么普通变量不够用

普通变量变了，Vue 不知道界面需要更新：

```js
let count = 0;

function increase() {
  count++;
}
```

这只是 JavaScript 变量变化。Vue 要自动更新界面，需要响应式状态：

```js
import { ref } from "vue";

const count = ref(0);

function increase() {
  count.value++;
}
```

先不用急着理解 `ref` 的全部原理，只要记住：

- `ref(0)` 创建了一个响应式盒子。
- 盒子里的真实值在 `.value`。
- Vue 能追踪这个盒子的变化，所以界面会更新。
- 模板中写 `{{ count }}` 时，Vue 会自动帮你取 `.value`。

## 2. 数据类型：页面数据长什么样

常见数据类型：

```js
const title = "任务列表"; // string 字符串
const total = 10; // number 数字
const done = false; // boolean 布尔值
const user = null; // 暂时没有值
const tags = ["Vue", "JavaScript"]; // array 数组
const task = { id: 1, text: "学 ref" }; // object 对象
```

Vue 页面里的绝大多数状态都可以用这些类型表示。

例如一个任务：

```js
const task = {
  id: 1,
  title: "学习 v-for",
  done: false,
  priority: "normal",
};
```

例如一组任务：

```js
const tasks = [
  { id: 1, title: "学习 ref", done: true },
  { id: 2, title: "学习 computed", done: false },
  { id: 3, title: "学习组件通信", done: false },
];
```

做前端时，你要经常问自己：这个界面背后的数据结构是什么？数据结构清晰，界面代码才会清晰。

## 3. 对象：描述一个东西

对象适合描述“一个有多个属性的东西”。

```js
const lesson = {
  id: "core",
  title: "Vue 核心语法",
  minutes: 90,
  completed: false,
};
```

读取属性：

```js
console.log(lesson.title);
console.log(lesson.minutes);
```

修改属性：

```js
lesson.completed = true;
```

在 Vue 模板中显示：

```vue
<template>
  <article>
    <h2>{{ lesson.title }}</h2>
    <p>{{ lesson.minutes }} 分钟</p>
    <p>{{ lesson.completed ? "已完成" : "未完成" }}</p>
  </article>
</template>
```

### 对象的常见误区

误区一：属性名写错。

```js
const lesson = { title: "Vue" };

console.log(lesson.titel); // undefined，因为 title 拼错了
```

误区二：以为对象会自动复制。

```js
const a = { title: "Vue" };
const b = a;

b.title = "JavaScript";

console.log(a.title); // JavaScript
```

对象赋值给另一个变量时，复制的是引用，不是完整复制一个新对象。这在组件 props 和状态修改中很重要。

如果你想创建一个新对象：

```js
const oldTask = { id: 1, title: "学习 Vue", done: false };
const newTask = { ...oldTask, done: true };
```

`...oldTask` 表示把旧对象的属性展开，再用 `done: true` 覆盖旧的 done。

## 4. 数组：描述一组东西

数组适合描述“多个同类东西”。

```js
const lessons = ["JS 基础", "DOM", "Vue"];
```

读取第一项：

```js
console.log(lessons[0]); // JS 基础
```

追加一项：

```js
lessons.push("Router");
```

数组长度：

```js
console.log(lessons.length);
```

### Vue 中最常见的数组方法

`filter`：筛选。

```js
const unfinishedTasks = tasks.filter((task) => !task.done);
```

意思是：遍历 `tasks`，只留下 `done` 为 false 的任务。

`map`：把每一项变成另一种样子。

```js
const titles = tasks.map((task) => task.title);
```

`find`：找到第一个符合条件的项。

```js
const target = tasks.find((task) => task.id === 2);
```

`some`：判断有没有至少一项符合条件。

```js
const hasUnfinished = tasks.some((task) => !task.done);
```

`reduce`：累积统计。

```js
const totalMinutes = lessons.reduce((sum, lesson) => {
  return sum + lesson.minutes;
}, 0);
```

### 为什么数组适合配合 `v-for`

页面上的列表，本质上经常就是数组的可视化。

数据：

```js
const lessons = [
  { id: "js", title: "JS 基础" },
  { id: "dom", title: "DOM 到 Vue" },
];
```

模板：

```vue
<li v-for="lesson in lessons" :key="lesson.id">
  {{ lesson.title }}
</li>
```

这里的关系是：

- 数组有几项，页面就渲染几个 `<li>`。
- 每一项对象的 `title` 显示成列表文字。
- 数组变化后，Vue 自动更新列表。

## 5. 函数：把动作封装起来

函数就是一段可重复执行的代码。

```js
function add(a, b) {
  return a + b;
}

const result = add(2, 3);
console.log(result); // 5
```

这段代码里：

- `add` 是函数名。
- `a` 和 `b` 是参数。
- `return` 是返回结果。
- `add(2, 3)` 是调用函数。

### 普通函数和箭头函数

普通函数：

```js
function toggleTask(id) {
  console.log(id);
}
```

箭头函数：

```js
const toggleTask = (id) => {
  console.log(id);
};
```

数组方法里经常用箭头函数：

```js
const completedTasks = tasks.filter((task) => task.done);
```

你可以读成：“对每个 task，返回它的 done 是否为真。”

### Vue 中函数通常用来处理事件

```vue
<script setup>
import { ref } from "vue";

const count = ref(0);

function increase() {
  count.value++;
}
</script>

<template>
  <button @click="increase">增加</button>
  <p>{{ count }}</p>
</template>
```

点击按钮时，Vue 会调用 `increase`。`increase` 改变 `count.value`，Vue 发现响应式状态变了，于是更新页面。

## 6. 条件判断：根据情况走不同逻辑

```js
if (score >= 90) {
  console.log("优秀");
} else if (score >= 60) {
  console.log("及格");
} else {
  console.log("继续练习");
}
```

Vue 模板中的条件渲染：

```vue
<p v-if="loading">加载中...</p>
<p v-else-if="error">{{ error }}</p>
<p v-else>加载完成</p>
```

这不是三段都显示，而是按顺序判断：

1. 如果 `loading` 为 true，显示加载中。
2. 否则如果 `error` 有值，显示错误。
3. 否则显示加载完成。

## 7. 解构：从对象或模块里取东西

对象解构：

```js
const user = {
  name: "Ada",
  role: "student",
};

const { name, role } = user;
```

等价于：

```js
const name = user.name;
const role = user.role;
```

数组解构：

```js
const colors = ["red", "green"];
const [firstColor, secondColor] = colors;
```

Vue 中经常看到：

```js
import { ref, computed } from "vue";
```

这也是一种“按名字取出”的感觉：从 `vue` 这个包导出的内容里，取出 `ref` 和 `computed`。

## 8. 模块：为什么要导出和导入

这是很多初学者会卡住的地方。我们慢慢讲。

### 8.1 为什么需要模块

如果所有代码都写在一个文件里，文件会越来越长：

```js
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function formatMoney(value) {
  return `¥${value.toFixed(2)}`;
}

function createTask(title) {
  return { id: Date.now(), title, done: false };
}
```

一开始没问题，但项目变大后会出现几个问题：

- 文件太长，找代码困难。
- 工具函数、组件、请求逻辑混在一起。
- 不知道哪些函数是给外部用的，哪些只是当前文件内部用的。
- 多个页面都想用同一个函数，只能复制粘贴。

模块的作用就是：**把代码拆成多个文件，并明确哪些内容可以给别的文件使用。**

例如：

```text
src/
  math.js
  format.js
  main.js
```

`math.js` 放数学函数，`format.js` 放格式化函数，`main.js` 使用它们。

### 8.2 每个模块都有自己的作用域

假设有一个文件 `math.js`：

```js
// math.js
function add(a, b) {
  return a + b;
}
```

再有一个文件 `main.js`：

```js
// main.js
console.log(add(1, 2));
```

这通常不能工作，因为 `add` 只存在于 `math.js` 这个文件内部。`main.js` 不会自动知道 `math.js` 里有什么。

模块的默认规则是：**一个文件里的变量和函数，不会自动暴露给另一个文件。**

这很好，因为它避免了名字互相污染。

例如两个文件里都可以有自己的 `count`：

```js
// a.js
const count = 1;
```

```js
// b.js
const count = 100;
```

它们互不影响。

### 8.3 `export` 是什么意思

`export` 的意思是：**我允许别的模块导入这个东西。**

```js
// math.js
export function add(a, b) {
  return a + b;
}
```

这句话做了两件事：

1. 在 `math.js` 里声明一个函数 `add`。
2. 把 `add` 标记为“可以被别的文件导入”。

然后 `main.js` 才能写：

```js
// main.js
import { add } from "./math.js";

console.log(add(1, 2)); // 3
```

### 8.4 不写 `export` 能不能 `import`

不能按这种方式导入。

```js
// math.js
function add(a, b) {
  return a + b;
}
```

```js
// main.js
import { add } from "./math.js";
```

这会报错，意思大概是：`math.js` 没有导出名为 `add` 的内容。

为什么？因为模块系统只允许你导入对方明确导出的内容。它不会偷偷把对方文件里的所有变量都拿出来。

这是一种保护：

- 文件内部的临时变量不会暴露。
- 外部文件只能使用公开 API。
- 改内部实现时，不容易影响外部。

### 8.5 `export` 会不会影响原来的 `math.js`

会有影响，但不是“改变函数功能”的影响。

```js
export function add(a, b) {
  return a + b;
}
```

对 `math.js` 自己来说，`add` 仍然可以正常使用：

```js
// math.js
export function add(a, b) {
  return a + b;
}

const result = add(1, 2);
console.log(result);
```

`export` 不会改变 `add` 的计算逻辑。它只是多加了一个身份：这个函数可以被别的模块导入。

你可以把它想成：

```text
没有 export：这是当前文件自己的函数。
有 export：这是当前文件自己的函数，同时也公开给外部使用。
```

### 8.6 `import` 之后怎么调用

导入后，就像使用当前文件里的普通函数一样调用。

```js
import { add } from "./math.js";

const total = add(10, 20);
console.log(total);
```

如果导入的是变量：

```js
// config.js
export const appName = "Vue Tutorial";
```

```js
// main.js
import { appName } from "./config.js";

console.log(appName);
```

如果导入的是对象：

```js
// user.js
export const user = {
  name: "Ada",
  role: "student",
};
```

```js
// main.js
import { user } from "./user.js";

console.log(user.name);
```

如果导入的是 Vue 组件：

```vue
<script setup>
import LessonCard from "./components/LessonCard.vue";
</script>

<template>
  <LessonCard />
</template>
```

在 `<script setup>` 中，导入的组件可以直接在模板中使用。

### 8.7 命名导出：一个文件导出多个东西

```js
// math.js
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

export const PI = 3.14159;
```

导入：

```js
import { add, subtract, PI } from "./math.js";

console.log(add(3, 2));
console.log(subtract(3, 2));
console.log(PI);
```

命名导出必须使用花括号，并且名字要对应。

```js
import { add } from "./math.js";
```

这里的 `{ add }` 不是对象字面量，而是“我要导入名为 add 的导出”。

### 8.8 导入时可以改名

如果名字冲突，或者你想让名字更清楚，可以用 `as`。

```js
import { add as addNumbers } from "./math.js";

console.log(addNumbers(1, 2));
```

这表示：从 `math.js` 导入 `add`，但在当前文件叫 `addNumbers`。

### 8.9 统一导出写法

有时你会看到这种写法：

```js
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

export { add, subtract };
```

它和下面这种效果一样：

```js
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}
```

区别只是风格：

- 写在声明前：看到函数时就知道它被导出。
- 统一写在末尾：文件底部集中列出公开内容。

### 8.10 默认导出 `export default`

一个模块可以有一个默认导出。

```js
// math.js
export default function add(a, b) {
  return a + b;
}
```

导入时不需要花括号：

```js
import add from "./math.js";

console.log(add(1, 2));
```

默认导出的特点：

- 一个文件最多只能有一个默认导出。
- 导入时名字可以自己取。

例如：

```js
import whateverName from "./math.js";

console.log(whateverName(1, 2));
```

因为默认导出没有强制使用原名。

### 8.11 命名导出和默认导出的区别

命名导出：

```js
// math.js
export function add(a, b) {
  return a + b;
}
```

```js
// main.js
import { add } from "./math.js";
```

特点：

- 导入时需要花括号。
- 名字必须和导出名一致，除非用 `as`。
- 一个文件可以有多个命名导出。

默认导出：

```js
// LessonCard.vue
export default {
  // 组件配置
};
```

```js
import LessonCard from "./LessonCard.vue";
```

特点：

- 导入时不用花括号。
- 名字可以自己取。
- 一个文件只能有一个默认导出。

Vue 单文件组件在构建后本质上会提供默认导出，所以你常看到：

```js
import App from "./App.vue";
import LessonCard from "./components/LessonCard.vue";
```

### 8.12 导入路径为什么要写 `./`

```js
import { add } from "./math.js";
```

`./math.js` 的意思是：从当前文件所在目录找 `math.js`。

常见路径：

```js
import { add } from "./math.js"; // 当前目录
import { add } from "../math.js"; // 上一级目录
import App from "./App.vue"; // 当前目录里的 App.vue
import { ref } from "vue"; // 从 node_modules 包导入
```

有 `./` 或 `../`：相对路径，找你项目里的文件。

没有 `./` 或 `../`：

```js
import { ref } from "vue";
```

这通常表示从安装的包里导入。`vue` 会在 `node_modules` 中找到。

### 8.13 模块会在什么时候执行

当一个模块第一次被导入时，它会执行一次。

```js
// log.js
console.log("log.js 执行了");

export const message = "hello";
```

```js
// main.js
import { message } from "./log.js";

console.log(message);
```

运行 `main.js` 时，`log.js` 会先执行，所以会打印：

```text
log.js 执行了
hello
```

这说明模块不只是“拿函数”，导入时也会执行模块顶层代码。

所以不要在模块顶层写太多副作用代码，例如随便发请求、改 DOM。更好的方式是导出函数，由需要的地方调用。

### 8.14 导入的是“活的绑定”

命名导入不是简单复制一份值，它和原模块的导出绑定有关。初学阶段不必深挖规范，但要知道：模块系统比普通对象拷贝更严格。

例如：

```js
// counter.js
export let count = 0;

export function increase() {
  count++;
}
```

```js
// main.js
import { count, increase } from "./counter.js";

console.log(count); // 0
increase();
console.log(count); // 1
```

但导入的变量不能在导入方直接重新赋值：

```js
import { count } from "./counter.js";

count = 10; // 报错
```

如果要修改，应该通过导出方提供的函数修改。

### 8.15 Vue 项目中模块怎么用

Vue 项目里到处都是模块：

导入 Vue API：

```js
import { ref, computed } from "vue";
```

导入组件：

```js
import TodoItem from "../components/TodoItem.vue";
```

导入组合式函数：

```js
import { useCounter } from "../composables/useCounter";
```

导入 Pinia store：

```js
import { useTodoStore } from "../stores/useTodoStore";
```

导入本地数据：

```js
import { lessons } from "../data/lessons";
```

你可以把 `src/` 看成很多模块拼起来的应用。

### 8.16 常见模块错误

错误一：忘记导出。

```js
// math.js
function add(a, b) {
  return a + b;
}
```

```js
import { add } from "./math.js"; // 报错：没有导出 add
```

修复：

```js
export function add(a, b) {
  return a + b;
}
```

错误二：命名导出却不用花括号。

```js
// math.js
export function add(a, b) {
  return a + b;
}
```

```js
import add from "./math.js"; // 错误，add 不是默认导出
```

修复：

```js
import { add } from "./math.js";
```

错误三：默认导出却用了花括号。

```js
// math.js
export default function add(a, b) {
  return a + b;
}
```

```js
import { add } from "./math.js"; // 错误
```

修复：

```js
import add from "./math.js";
```

错误四：路径写错。

```js
import { add } from "math.js"; // 这会被当成包名
```

修复：

```js
import { add } from "./math.js";
```

错误五：大小写不一致。

```js
import LessonCard from "./components/lessonCard.vue";
```

如果文件实际叫 `LessonCard.vue`，在某些系统或部署环境会失败。建议文件名和导入路径大小写完全一致。

## 9. 异步：等待未来的结果

浏览器请求接口、读取文件、等待定时器，都不是立刻得到结果。JavaScript 用 Promise 和 `async/await` 处理异步。

最小例子：

```js
function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function run() {
  console.log("开始");
  await wait(1000);
  console.log("1 秒后");
}
```

`await` 的意思是：等 Promise 完成后，再继续往下执行。

### 请求数据

```js
async function loadUser() {
  const response = await fetch("/api/user");
  const user = await response.json();
  return user;
}
```

真实项目不能只写成功路径，还要写失败和加载状态：

```js
import { ref } from "vue";

const loading = ref(false);
const error = ref("");
const data = ref(null);

async function loadData() {
  loading.value = true;
  error.value = "";

  try {
    const response = await fetch("/api/items");

    if (!response.ok) {
      throw new Error(`请求失败：${response.status}`);
    }

    data.value = await response.json();
  } catch (err) {
    error.value = err instanceof Error ? err.message : "未知错误";
  } finally {
    loading.value = false;
  }
}
```

你要记住三件事：

- `try` 里放可能失败的代码。
- `catch` 里处理失败。
- `finally` 里放无论成功失败都要执行的代码，比如关闭 loading。

## 10. 学 Vue 前必须形成的观念

页面开发的核心不是“把 HTML 写出来”，而是这条链路：

```text
数据 -> 根据数据渲染界面 -> 用户操作 -> 修改数据 -> 界面更新
```

Vue 做的事情就是让这条链路更稳定：

- 你声明数据。
- 你写模板描述界面。
- 你写函数响应用户操作。
- Vue 负责把状态变化同步到 DOM。

如果你能一直围绕“数据是什么、数据在哪里变、界面如何从数据得到”思考，Vue 会越来越清晰。

## 本章练习

### 练习 1：课程数组

创建下面数组：

```js
const lessons = [
  { id: 1, title: "JS 基础", minutes: 40, done: false },
  { id: 2, title: "DOM", minutes: 35, done: true },
  { id: 3, title: "Vue 响应式", minutes: 50, done: false },
];
```

要求：

1. 用 `filter` 找出未完成课程。
2. 用 `reduce` 统计总时长。
3. 写 `toggleDone(id)` 切换课程完成状态。
4. 写 `addLesson(title, minutes)` 新增课程。

### 练习 2：模块导入导出

创建两个文件：

```text
math.js
main.js
```

在 `math.js` 中导出：

- `add`
- `subtract`
- `PI`

在 `main.js` 中导入并调用它们。

然后故意做下面实验：

1. 去掉 `export`，看看 `import` 报什么错。
2. 把 `import { add }` 改成 `import add`，看看报什么错。
3. 把路径 `./math.js` 改成 `math.js`，看看报什么错。

这些错误都很有价值，因为它们能帮你理解模块系统。

### 练习 3：用自己的话回答

请写出下面问题的答案：

1. `export` 是干嘛的？
2. 不加 `export` 能不能被别的文件按名字导入？
3. `export` 会不会改变原函数自己的功能？
4. 命名导出为什么导入时要加 `{}`？
5. `import { ref } from 'vue'` 和 `import App from './App.vue'` 的区别是什么？
