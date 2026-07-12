---
title: '12 性能、可访问性和安全'
order: 12
---

# 12 性能、可访问性和安全

页面能跑只是第一步。真实项目还要考虑速度、可访问性和安全。初学阶段不必追求极限优化，但必须避免明显问题。

本章目标：你能识别常见性能浪费，能写基础可访问表单，能知道 `v-html` 和前端密钥为什么危险。

## 1. 性能优化先从不浪费开始

常见浪费：

- 模板中写复杂计算。
- 列表没有稳定 key。
- 一次性渲染超大列表。
- 首页加载所有页面代码。
- 状态放得太高，导致大范围组件更新。

性能不是一开始就上复杂工具，而是先写清楚、写稳定。

## 2. 用 computed 避免重复计算

不推荐：

```vue
<p>{{ tasks.filter(task => !task.done).length }}</p>
<p>{{ tasks.filter(task => task.done).length }}</p>
```

推荐：

```js
const remainingCount = computed(() => {
  return tasks.value.filter((task) => !task.done).length
})

const completedCount = computed(() => {
  return tasks.value.filter((task) => task.done).length
})
```

模板：

```vue
<p>未完成 {{ remainingCount }}</p>
<p>已完成 {{ completedCount }}</p>
```

`computed` 让逻辑有名字，并且根据依赖缓存结果。

## 3. 大列表不要一次性硬渲染

如果列表只有几十项，普通 `v-for` 没问题。

如果有几千上万项：

- 考虑分页。
- 考虑搜索筛选。
- 考虑虚拟列表库。

不要一开始就把所有数据都塞到页面上。

## 4. 路由懒加载

页面多时：

```js
{
  path: '/settings',
  component: () => import('../views/SettingsView.vue')
}
```

访问时才加载。这样首页不必下载用户暂时不用的页面。

## 5. 图片和资源

常见建议：

- 图片尺寸不要远大于显示尺寸。
- 大图使用压缩格式。
- 列表图片懒加载。
- 不要把无关大资源放进首屏。

Vue 本身不能替你解决所有资源问题，工程上也要注意。

## 6. 可访问性是什么

可访问性是让更多用户能使用你的应用，包括：

- 使用键盘的人。
- 使用屏幕阅读器的人。
- 视力较弱的人。
- 临时受限的人，例如鼠标坏了。

可访问性不是额外功能，而是基础质量。

## 7. 表单必须有 label

不推荐：

```vue
<input placeholder="邮箱">
```

推荐：

```vue
<label for="email">邮箱</label>
<input id="email" v-model="email" type="email">
```

原因：

- 屏幕阅读器能读出输入框含义。
- 点击 label 可以聚焦输入框。
- placeholder 不是稳定标签。

## 8. 按钮就用 button

不推荐：

```vue
<div @click="submit">提交</div>
```

推荐：

```vue
<button type="button" @click="submit">提交</button>
```

`button` 天然支持：

- 键盘操作。
- 焦点。
- 语义。
- disabled 状态。

用 `div` 冒充按钮，需要自己补很多行为，容易漏。

## 9. 错误提示

```vue
<p v-if="error" role="alert">{{ error }}</p>
```

`role="alert"` 告诉辅助技术这里是重要变化。

表单错误应该具体：

不推荐：

```text
输入错误
```

推荐：

```text
标题不能为空
标题不能超过 30 个字符
```

## 10. 焦点样式

不要随便去掉：

```css
button:focus {
  outline: none;
}
```

如果你移除默认焦点样式，必须提供新的明显焦点样式：

```css
button:focus-visible {
  outline: 3px solid rgba(37, 99, 235, 0.35);
  outline-offset: 2px;
}
```

键盘用户需要知道当前焦点在哪里。

## 11. 安全：Vue 默认会转义文本

```vue
<p>{{ userInput }}</p>
```

如果用户输入：

```html
<script>alert('hack')</script>
```

Vue 会把它当文本显示，而不是执行脚本。这是安全的。

## 12. 谨慎使用 `v-html`

危险写法：

```vue
<div v-html="userInput"></div>
```

`v-html` 会把字符串当 HTML 插入页面。如果内容来自用户，可能导致 XSS。

除非你非常确定：

- HTML 来源可信。
- 已经过安全清洗。
- 业务确实需要渲染 HTML。

否则不要用 `v-html`。

## 13. 前端不能保存真正秘密

不要把这些放前端：

- 数据库密码。
- 后端私密 API key。
- 管理员 token。
- 支付平台密钥。

原因：前端代码会被下载到用户浏览器。即使你写在环境变量里，只要打包进前端，用户就可能看到。

Vite 中以 `VITE_` 开头的环境变量会暴露给前端：

```env
VITE_API_BASE_URL=https://api.example.com
```

适合放：

- 公开 API 地址。
- 公开功能开关。
- 公开项目配置。

不适合放秘密。

## 14. 依赖安全

建议：

- 使用维护活跃的库。
- 不随便复制陌生脚本。
- 定期运行依赖审计。
- 遇到安全公告及时升级。

```powershell
npm audit
```

但也不要看到任何 warning 就恐慌。要看是否影响生产、是否可利用、是否有修复版本。

## 15. 常见检查清单

性能：

- 模板里有没有复杂计算？
- 列表有没有稳定 key？
- 是否一次渲染太多数据？
- 页面组件是否可以懒加载？

可访问性：

- 输入框有没有 label？
- 按钮是否用 button？
- 错误是否有明确文本？
- 键盘能否操作主要流程？
- 焦点是否可见？

安全：

- 是否使用了 `v-html`？
- 前端是否暴露了秘密？
- 用户输入是否被直接拼进 HTML？
- 依赖是否来自可信来源？

## 本章练习

1. 把一个模板里的复杂表达式改成 computed。
2. 给任务表单补全 label。
3. 给错误提示加 `role="alert"`。
4. 用键盘 Tab 操作页面，检查焦点是否可见。
5. 解释为什么 `v-html` 危险。
6. 判断哪些环境变量能放前端，哪些不能。

