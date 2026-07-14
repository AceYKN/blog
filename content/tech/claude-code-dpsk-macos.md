---
title: 在 macOS 配置 Claude Code 与 DeepSeek API：从终端到项目目录
description: 用 DeepSeek 的 Anthropic 兼容端点接入 Claude Code；一份可重复执行的 macOS 配置记录。
date: 2026-07-14
updated: 2026-07-14
tags: [Claude Code, macOS, DeepSeek]
draft: false
cover: /og-image.png
---

# 在 macOS 配置 Claude Code 与 DeepSeek API：从终端到项目目录

这篇记录只保留可重复的部分：安装 CLI、把 DeepSeek 的连接信息放进 shell 配置、在一个干净项目里验证。密钥不写进仓库，也不复制进截图。

> DeepSeek 同时提供 OpenAI 与 Anthropic 兼容接口。Claude Code 这里使用的是 Anthropic 兼容端点，而不是 OpenAI 的默认端点。

## 0. 准备

先确认终端和 Git 可用：

```bash
zsh --version
git --version
```

macOS 默认 shell 通常是 zsh，后续配置写进 `~/.zshrc`。如果你使用的是 fish 或 bash，请改到对应的配置文件。

## 1. 安装 Claude Code

先确认 Node.js 版本满足 Claude Code 的要求，再安装 CLI：

```bash
npm install -g @anthropic-ai/claude-code
claude --version
```

能输出版本号后，再进入登录或授权步骤。不要急着在全局环境里放服务密钥；先保证 CLI 本身能正常启动。

## 2. 单独保存 DeepSeek 配置

新建一个只在本机保存的文件，例如 `~/.config/deepseek/claude.env`：

```bash
export ANTHROPIC_BASE_URL="https://api.deepseek.com/anthropic"
export ANTHROPIC_AUTH_TOKEN="sk-请替换为自己的 DeepSeek API Key"
export ANTHROPIC_MODEL="deepseek-v4-pro"
export ANTHROPIC_DEFAULT_OPUS_MODEL="deepseek-v4-pro"
export ANTHROPIC_DEFAULT_SONNET_MODEL="deepseek-v4-pro"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="deepseek-v4-flash"
export CLAUDE_CODE_SUBAGENT_MODEL="deepseek-v4-flash"
export CLAUDE_CODE_EFFORT_LEVEL="max"
```

随后在 `~/.zshrc` 最末尾加入：

```bash
test -f "$HOME/.config/deepseek/claude.env" && source "$HOME/.config/deepseek/claude.env"
```

重新加载配置：

```bash
source ~/.zshrc
```

这里最重要的一点是：**密钥文件不进入 Git**。如果项目里需要环境变量，再建立一个不提交的 `.env.local`，并写好 `.gitignore`。

## 3. 在项目目录验证

选一个没有敏感文件的测试目录：

```bash
mkdir -p ~/Code/claude-sandbox
cd ~/Code/claude-sandbox
git init
claude
```

第一次对话可以只给一个很小的任务，例如：

```text
请先阅读当前目录，告诉我这里有哪些文件；不要修改任何内容。
```

确认它能读取项目结构后，再尝试创建一个最小文件。把“只读确认”和“允许修改”分开，是我觉得最舒服的工作节奏。

## 4. 常见检查点

### 终端里找不到 `claude`

先重开终端；仍然不行时检查安装目录是否在 `PATH`：

```bash
which claude
echo $PATH
```

### 配置没有生效

不要直接把密钥打印到屏幕。只检查变量是否存在：

```bash
test -n "$ANTHROPIC_BASE_URL" && echo "base url is set"
test -n "$ANTHROPIC_AUTH_TOKEN" && echo "token is set"
```

### 项目里有不该读取的内容

把私密文件放进 `.gitignore` 并不等于它不会被本地工具读到。对于密钥、导出的数据库和客户资料，我会把它们放到工作目录之外，或明确在开始前排除。

## 小结

这套配置的核心不是某一条命令，而是边界：CLI、服务配置、项目文件各自独立。以后更换 DeepSeek 模型时，只改本地环境文件，不需要改项目代码，也不会把凭据带进提交记录。

## 参考网站

- [DeepSeek：Claude Code 集成说明](https://api-docs.deepseek.com/guides/agent_integrations/claude_code)
- [DeepSeek：Anthropic API 兼容说明](https://api-docs.deepseek.com/guides/anthropic_api)
- [Claude Code：官方入门文档](https://docs.anthropic.com/en/docs/claude-code/getting-started)
