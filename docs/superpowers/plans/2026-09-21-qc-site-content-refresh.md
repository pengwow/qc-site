# qc-site 内容校准与信息架构重组 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 按已批准 spec 重写 qc-site 单页全部文案与区块结构，使其与 QuantCell 当前 AI 原生架构（axon-quant 0.14.5 Rust 引擎）完全一致。

**Architecture:** 纯静态站点无构建/测试框架。全量重写 `assets/i18n/translations.json`（新键 en/zh），然后按页面区段串行重写 `index.html`（head→nav/Hero→功能 12 卡→五层架构→快速开始→社区/页脚），最后用 JSON 校验 + i18n 键覆盖脚本 + 禁用词 grep + 本地起站浏览器巡检验收。

**Tech Stack:** HTML5、本地 Tailwind CDN（tailwindcss.min.js）、Lucide、原生 JS（现有 i18n.js/theme.js 不改逻辑）、Python3（仅用于本地静态校验与 http.server）。

**Spec:** `docs/superpowers/specs/2026-09-21-qc-site-content-refresh-design.md`

---

## 前置说明：工作区既有改动

执行前 `git status` 显示 `index.html`、`assets/i18n/translations.json` 已有未提交改动，内容是对**旧文案**的小修补（如把架构卖点从 "Unified Execution" 改回 "StrategyCore Pattern"）。本次是对这两个文件的全量重写，这些旧改动会被自然覆盖，无需保留、无需 stash（历史不受影响）。

执行约定：
- 所有任务在 `/Users/liupeng/workspace/quant/qc-site` 目录下操作。
- Tailwind CDN 靠扫描 HTML 中完整类名字符串生效，**禁止拼接类名**，所有 class 必须完整写出。
- 代码块与终端命令中的技术名词（React、FastAPI、DuckDB 等）不翻译；页面自然文案必须走 `data-i18n` 键。
- 每完成一个 Task 单独 commit；不碰 `docs/` 下文件的既有未提交格式化差异。

## File Structure

| 文件 | 责任 | 本计划动作 |
|---|---|---|
| `index.html` | 单页全部结构与默认英文文案 | 分区全量重写（head/nav/Hero/Features/Architecture/QuickStart/Community/Footer） |
| `assets/i18n/translations.json` | en/zh 扁平键值翻译 | 全量重写为新键集合 |
| `assets/js/i18n.js` 等其余 JS | 语言/主题/交互 | **不改**（语言检测逻辑已满足需求） |

i18n 键命名约定：沿用现有扁平 `"section.key"` 风格；功能卡用语义名（如 `features.agent.title`）。

---

## Task 1: 重写 translations.json + head 防闪烁脚本

**Files:**
- Modify: `assets/i18n/translations.json`（全量替换）
- Modify: `index.html`（仅 `<head>` 内两处小改：favicon 修正、防闪烁脚本）

- [ ] **Step 1: 全量重写 translations.json**

用以下内容完整替换 `assets/i18n/translations.json`（注意：这是后续所有 HTML `data-i18n` 的唯一键源）：

```json
{
  "en": {
    "nav.features": "Features",
    "nav.architecture": "Architecture",
    "nav.quickstart": "Quick Start",
    "nav.demo": "Live Demo",
    "nav.docs": "Docs",
    "hero.badge": "AI-Native Quantitative Trading System",
    "hero.title1": "Build, Backtest & Deploy",
    "hero.title2": "Quant Strategies with Natural Language",
    "hero.description": "QuantCell is an AI-native quantitative trading system powered by the axon-quant Rust engine, with FastAPI and React/TypeScript. Describe strategies in natural language — AI generates the code, passes safety checks, and completes backtest verification, from idea to live deployment.",
    "hero.getStarted": "Get Started",
    "hero.viewOnGitHub": "View on GitHub",
    "hero.badge.rust.title": "Rust Core Engine",
    "hero.badge.rust.value": "axon-quant 0.14.5",
    "hero.badge.cli.title": "CLI Toolkit",
    "hero.badge.cli.value": "13 Command Groups",
    "features.title": "Everything for AI-Native Quant Trading",
    "features.subtitle": "From natural-language strategy ideas to Rust-powered backtesting and live deployment",
    "features.group.ai": "AI Intelligence",
    "features.group.engine": "Rust Engine & Backtesting",
    "features.group.eco": "Trading & Data Ecosystem",
    "features.group.platform": "Platform Engineering",
    "features.nlgen.title": "Natural-Language Strategy Generation",
    "features.nlgen.description": "Describe a trading idea in plain language and get executable strategy code automatically. Thinking-chain reasoning is explainable and traceable, with built-in code quality and safety checks.",
    "features.agent.title": "AI Agent",
    "features.agent.description": "An AI agent with long-term memory, tool calling, and built-in skills (news analysis, technical analysis) for multi-turn conversations and operation orchestration.",
    "features.indicator.title": "Custom Indicators with AI",
    "features.indicator.description": "Write indicator code in the browser; the LLM diagnoses errors in the code and fixes them automatically.",
    "features.backtest.title": "Event-Driven Backtesting",
    "features.backtest.description": "Powered by the axon-quant Rust core, with K-line, Tick, OrderBook, and Deriv data adapters. Backtests and live trading share identical matching semantics, guarded by conformance contract tests.",
    "features.hpo.title": "Walk-Forward & Hyperparameter Optimization",
    "features.hpo.description": "Rolling-window validation prevents overfitting. Built-in Optuna HPO with TPE sampling and median pruning.",
    "features.rl.title": "Reinforcement Learning",
    "features.rl.description": "Gymnasium trading environments with Stable-Baselines3 (PPO / SAC / DQN), covering the full train → backtest → evaluate → retrain lifecycle.",
    "features.exchange.title": "Unified Exchange Access",
    "features.exchange.description": "Binance (live / paper / archive) and OKX adapters, with WebSocket real-time streaming, automatic reconnection, and persistence.",
    "features.data.title": "DuckDB + Parquet Data Stack",
    "features.data.description": "Columnar storage for efficient reads and writes, plus data quality checks, automatic gap recovery, and archive repair for corrupted files.",
    "features.worker.title": "Worker Live Execution",
    "features.worker.description": "Strategy live loops, paper trading, and engine deployment with full lifecycle management.",
    "features.plugin.title": "Plugin System",
    "features.plugin.description": "Inter-plugin communication through a unified event bus and isolation in a security sandbox. Package and install plugins with one quantcell plugin command.",
    "features.risk.title": "Risk Control & Credential Security",
    "features.risk.description": "Exchange API keys are encrypted at rest and managed via quantcell account, with a risk engine for monitoring and unified JWT authentication.",
    "features.frontend.title": "Modern Frontend & Visualization",
    "features.frontend.description": "React 18 + TypeScript + Vite 7 + Ant Design 6, KLineCharts/ECharts, the Monaco editor, backtest replay, and built-in zh/en i18n.",
    "architecture.title": "System Architecture",
    "architecture.description": "React/TypeScript on the frontend, FastAPI services, and the axon-quant Rust trading core — decoupled through axon_bridge, covering strategy development, backtest validation, and live deployment.",
    "architecture.layers.frontend": "Frontend Layer",
    "architecture.layers.api": "API Layer",
    "architecture.layers.business": "Business Layer",
    "architecture.layers.engine": "Rust Engine Layer",
    "architecture.layers.data": "Data Layer",
    "architecture.points.engine.title": "Rust Core Engine",
    "architecture.points.engine.description": "Identical matching semantics in backtest and live trading; conformance contract tests protect every engine upgrade.",
    "architecture.points.ai.title": "AI-Native Loop",
    "architecture.points.ai.description": "Natural language → code generation → safety checks → backtest verification → deployment.",
    "architecture.points.bridge.title": "axon_bridge Decoupling",
    "architecture.points.bridge.description": "The Python business layer and the Rust engine stay decoupled — one strategy codebase runs in both backtests and live trading.",
    "quickstart.title": "Get Running in Minutes",
    "quickstart.subtitle": "Three steps from clone to your first AI-generated, backtested strategy",
    "quickstart.step1.title": "Install with one command",
    "quickstart.step1.description": "Clone the repo and run the installer. It provisions the uv and bun toolchains plus the frontend and backend environments (--minimal / --full / --extra).",
    "quickstart.step2.title": "Generate and backtest via CLI",
    "quickstart.step2.description": "Turn a natural-language requirement into a strategy, then run an event-driven backtest with a single command.",
    "quickstart.step3.title": "Write strategies in Python",
    "quickstart.step3.description": "Receive bars in on_bar and return a unified axon_quant Action. The same code runs in backtests and live trading.",
    "quickstart.fact.cli": "13 CLI Command Groups",
    "quickstart.fact.toolchain": "uv / bun toolchains",
    "quickstart.fact.swagger": "Swagger /docs",
    "quickstart.fact.pytest": "pytest 9",
    "opensource.title": "Open Source & Community",
    "opensource.description": "QuantCell is open source under Apache 2.0. Explore the code, try the live demo, or reach out directly.",
    "opensource.giteeDesc": "China mirror",
    "opensource.demo": "Live Demo",
    "opensource.demoDesc": "Try now",
    "opensource.email": "Email",
    "opensource.emailDesc": "Contact the author",
    "footer.description": "An AI-native quantitative trading system — making quant trading simpler, faster, and smarter.",
    "footer.product": "Product",
    "footer.resources": "Resources",
    "footer.links.features": "Features",
    "footer.links.architecture": "Architecture",
    "footer.links.quickstart": "Quick Start",
    "footer.links.releases": "Releases",
    "footer.links.docs": "Documentation",
    "footer.links.demo": "Live Demo",
    "footer.links.gitee": "Gitee Mirror",
    "footer.links.issues": "Issues",
    "footer.copyright": "© 2026 QuantCell · Apache License 2.0"
  },
  "zh": {
    "nav.features": "功能特性",
    "nav.architecture": "系统架构",
    "nav.quickstart": "快速开始",
    "nav.demo": "在线 Demo",
    "nav.docs": "文档",
    "hero.badge": "AI 原生量化交易系统",
    "hero.title1": "用自然语言构建、回测和部署",
    "hero.title2": "量化策略",
    "hero.description": "QuantCell 是 AI 原生量化交易系统，以 axon-quant（Rust 核心）为交易引擎，FastAPI + React/TypeScript 为前后端。用自然语言描述策略，AI 自动生成代码、完成安全校验与回测验证，覆盖从想法到实盘部署的全流程。",
    "hero.getStarted": "快速开始",
    "hero.viewOnGitHub": "在 GitHub 上查看",
    "hero.badge.rust.title": "Rust 核心引擎",
    "hero.badge.rust.value": "axon-quant 0.14.5",
    "hero.badge.cli.title": "命令行工具",
    "hero.badge.cli.value": "13 组 CLI 命令",
    "features.title": "AI 原生量化交易的完整能力",
    "features.subtitle": "从自然语言策略想法，到 Rust 引擎回测与实盘部署",
    "features.group.ai": "AI 智能",
    "features.group.engine": "Rust 引擎与回测",
    "features.group.eco": "交易与数据生态",
    "features.group.platform": "平台工程",
    "features.nlgen.title": "自然语言策略生成",
    "features.nlgen.description": "用自然语言描述交易想法，自动生成可执行策略代码；思维链推理可解释、可追溯，并内置代码质量与安全自检。",
    "features.agent.title": "AI 智能体",
    "features.agent.description": "具备长期记忆、工具调用与内置技能（新闻分析、技术分析）的 AI Agent，支持多轮对话与操作编排。",
    "features.indicator.title": "自定义指标 · AI 辅助",
    "features.indicator.description": "在浏览器中编写指标代码，LLM 自动诊断代码中的错误并完成修复。",
    "features.backtest.title": "事件驱动高性能回测",
    "features.backtest.description": "axon-quant Rust 核心驱动，支持 K 线、Tick、OrderBook、Deriv 多数据适配器；回测与实盘采用一致撮合语义，并有 conformance 契约测试守护。",
    "features.hpo.title": "Walk-Forward 与超参优化",
    "features.hpo.description": "滚动窗口验证防止过拟合；内置 Optuna 超参优化，采用 TPE 采样与中位数剪枝。",
    "features.rl.title": "强化学习",
    "features.rl.description": "基于 Gymnasium 量化环境与 Stable-Baselines3（PPO / SAC / DQN），覆盖训练 → 回测 → 评估 → 重训完整生命周期。",
    "features.exchange.title": "多交易所统一接入",
    "features.exchange.description": "Binance（实盘 / 纸面 / 归档）与 OKX 适配器，支持 WebSocket 实时订阅、自动重连与持久化。",
    "features.data.title": "DuckDB + Parquet 数据生态",
    "features.data.description": "列式存储高效读写，配套数据质量检测、缺失自动回补与损坏文件归档修复。",
    "features.worker.title": "Worker 实盘执行",
    "features.worker.description": "策略实盘循环、纸面交易与引擎部署，提供完整的生命周期管理。",
    "features.plugin.title": "插件系统",
    "features.plugin.description": "插件间通过统一事件总线通信，并在安全沙箱中隔离运行；一条 quantcell plugin 命令即可打包安装。",
    "features.risk.title": "风控与凭证安全",
    "features.risk.description": "交易所 API 密钥加密入库，通过 quantcell account 统一管理；配套风险引擎监控与 JWT 统一鉴权。",
    "features.frontend.title": "现代化前端与可视化",
    "features.frontend.description": "React 18 + TypeScript + Vite 7 + Ant Design 6，KLineCharts/ECharts 专业图表、Monaco 编辑器、回测回放与中英 i18n。",
    "architecture.title": "系统架构",
    "architecture.description": "前端 React/TypeScript、服务 FastAPI、交易内核 axon-quant（Rust），通过 axon_bridge 解耦，覆盖策略开发、回测验证到实盘部署的全流程。",
    "architecture.layers.frontend": "前端层",
    "architecture.layers.api": "API 层",
    "architecture.layers.business": "业务层",
    "architecture.layers.engine": "Rust 引擎层",
    "architecture.layers.data": "数据层",
    "architecture.points.engine.title": "Rust 核心引擎",
    "architecture.points.engine.description": "回测与实盘采用一致撮合语义；conformance 契约测试守护每一次引擎升级。",
    "architecture.points.ai.title": "AI 原生闭环",
    "architecture.points.ai.description": "自然语言 → 代码生成 → 安全校验 → 回测验证 → 部署上线。",
    "architecture.points.bridge.title": "axon_bridge 桥接",
    "architecture.points.bridge.description": "Python 业务层与 Rust 引擎解耦，一套策略代码即可回测、也可实盘。",
    "quickstart.title": "三步上手",
    "quickstart.subtitle": "从克隆仓库到完成第一个 AI 生成并回测的策略，只需三步",
    "quickstart.step1.title": "一键安装",
    "quickstart.step1.description": "克隆仓库并运行安装脚本，自动配置 uv、bun 工具链与前后端环境（--minimal / --full / --extra）。",
    "quickstart.step2.title": "CLI 生成策略并回测",
    "quickstart.step2.description": "把自然语言需求变成策略，再用一条命令完成事件驱动回测。",
    "quickstart.step3.title": "用 Python 编写策略",
    "quickstart.step3.description": "在 on_bar 中接收 K 线、返回 axon_quant 统一 Action，同一套代码可回测、可实盘。",
    "quickstart.fact.cli": "13 组 CLI 命令",
    "quickstart.fact.toolchain": "uv / bun 工具链",
    "quickstart.fact.swagger": "Swagger /docs",
    "quickstart.fact.pytest": "pytest 9",
    "opensource.title": "开源与社区",
    "opensource.description": "QuantCell 基于 Apache 2.0 协议开源。查看源码、体验在线 Demo，或直接与作者联系。",
    "opensource.giteeDesc": "国内镜像",
    "opensource.demo": "在线 Demo",
    "opensource.demoDesc": "立即体验",
    "opensource.email": "邮箱",
    "opensource.emailDesc": "联系作者",
    "footer.description": "AI 原生量化交易系统 —— 让量化交易更简单、更高效、更智能。",
    "footer.product": "产品",
    "footer.resources": "资源",
    "footer.links.features": "功能特性",
    "footer.links.architecture": "系统架构",
    "footer.links.quickstart": "快速开始",
    "footer.links.releases": "发布版本",
    "footer.links.docs": "项目文档",
    "footer.links.demo": "在线 Demo",
    "footer.links.gitee": "Gitee 镜像",
    "footer.links.issues": "问题反馈",
    "footer.copyright": "© 2026 QuantCell · Apache License 2.0"
  }
}
```

- [ ] **Step 2: 校验 JSON 合法性**

Run: `python3 -m json.tool assets/i18n/translations.json > /dev/null && echo OK`
Expected: 输出 `OK`，无异常。

- [ ] **Step 3: 修正 head 中 favicon 坏链并加入防闪烁脚本**

当前 `<head>` 中 alternate icon 指向不存在的 `assets/images/favicon.ico`（实际文件是 `logo.ico`）。将 head 开头 favicon 两行替换为：

```html
  <!-- Favicon - SVG Logo -->
  <link rel="icon" type="image/svg+xml" href="assets/images/logo.svg">
  <link rel="alternate icon" type="image/x-icon" href="assets/images/logo.ico">
```

在 `<title>` 标签之后、Tailwind 脚本之前，插入语言早检测脚本（与现有 `assets/js/i18n.js` 的检测规则保持一致：localStorage 优先，否则 zh* 开头为中文）：

```html
  <!-- 语言早检测：首次绘制前设置 <html lang>，避免中文用户首屏英文闪烁（与 i18n.js 检测规则一致） -->
  <script>
    (function () {
      var saved = localStorage.getItem('lang');
      var lang = saved || ((navigator.language || '').toLowerCase().indexOf('zh') === 0 ? 'zh' : 'en');
      document.documentElement.setAttribute('lang', lang);
    })();
  </script>
```

- [ ] **Step 4: 提交**

```bash
git add assets/i18n/translations.json index.html
git commit -m "feat(i18n): 全量重写中英翻译键并加入语言早检测防闪烁"
```

注意：此提交会同时包含 index.html 中既有的旧未提交改动（被下一轮重写继续覆盖，无影响）。

---

## Task 2: 重写导航栏与 Hero 区

**Files:**
- Modify: `index.html`（`<nav>` 整块 + Hero `<section>` 整块）

- [ ] **Step 1: 替换桌面端导航项**

把桌面导航 `<div class="hidden md:flex items-center gap-8">` 整块替换为（gap 收紧到 6，5 个入口；Demo 补 `/chart`；Docs 改 GitHub README 外链）：

```html
        <div class="hidden md:flex items-center gap-6">
          <a href="#features" class="text-sm font-medium text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors" data-i18n="nav.features">Features</a>
          <a href="#architecture" class="text-sm font-medium text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors" data-i18n="nav.architecture">Architecture</a>
          <a href="#quick-start" class="text-sm font-medium text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors" data-i18n="nav.quickstart">Quick Start</a>
          <a href="https://demo.quantcell.top/chart" target="_blank" rel="noopener" class="text-sm font-medium text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors" data-i18n="nav.demo">Live Demo</a>
          <a href="https://github.com/pengwow/quantcell" target="_blank" rel="noopener" class="text-sm font-medium text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors" data-i18n="nav.docs">Docs</a>
        </div>
```

- [ ] **Step 2: 替换移动端菜单链接并修复坏 GitHub 链接**

把 `#mobileMenu` 内的链接 `<div class="px-4 py-3 space-y-2">` 整块替换为：

```html
      <div class="px-4 py-3 space-y-2">
        <a href="#features" class="block px-3 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors" data-i18n="nav.features">Features</a>
        <a href="#architecture" class="block px-3 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors" data-i18n="nav.architecture">Architecture</a>
        <a href="#quick-start" class="block px-3 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors" data-i18n="nav.quickstart">Quick Start</a>
        <a href="https://demo.quantcell.top/chart" target="_blank" rel="noopener" class="block px-3 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors" data-i18n="nav.demo">Live Demo</a>
        <a href="https://github.com/pengwow/quantcell" target="_blank" rel="noopener" class="block px-3 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors" data-i18n="nav.docs">Docs</a>
        <div class="pt-2 border-t border-slate-200 dark:border-slate-800">
          <a href="https://github.com/pengwow/quantcell" target="_blank" rel="noopener" class="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900">
            <i data-lucide="github" class="w-4 h-4"></i>
            <span>GitHub</span>
          </a>
        </div>
      </div>
```

- [ ] **Step 3: 替换 Hero 左侧文案与 CTA**

把 Hero 中 `data-i18n="hero.badge"` 徽章到 CTA 按钮整段替换为：

```html
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium">
            <i data-lucide="sparkles" class="w-4 h-4"></i>
            <span data-i18n="hero.badge">AI-Native Quantitative Trading System</span>
          </div>

          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight pb-2">
            <span data-i18n="hero.title1">Build, Backtest &amp; Deploy</span>
            <span class="text-gradient block mt-2 pb-1" data-i18n="hero.title2">Quant Strategies with Natural Language</span>
          </h1>

          <p class="text-lg text-slate-600 dark:text-slate-400 max-w-xl" data-i18n="hero.description">
            QuantCell is an AI-native quantitative trading system powered by the axon-quant Rust engine, with FastAPI and React/TypeScript. Describe strategies in natural language — AI generates the code, passes safety checks, and completes backtest verification, from idea to live deployment.
          </p>

          <div class="flex flex-wrap gap-4">
            <a href="#quick-start" class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors glow">
              <i data-lucide="rocket" class="w-5 h-5"></i>
              <span data-i18n="hero.getStarted">Get Started</span>
            </a>
            <a href="https://github.com/pengwow/quantcell" target="_blank" rel="noopener" class="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-300 dark:border-slate-700 font-medium hover:border-primary-500 hover:text-primary-600 dark:hover:border-primary-400 dark:hover:text-primary-400 transition-colors">
              <i data-lucide="github" class="w-5 h-5"></i>
              <span data-i18n="hero.viewOnGitHub">View on GitHub</span>
            </a>
          </div>
```

同时删除 Hero 中被注释掉的 Stats 块（`<!-- Stats --> ... -->` 整段，虚构下载量/星标，不再保留）。

- [ ] **Step 4: 替换 Hero 右侧代码窗为真实 CLI**

把右侧代码窗的 `code-header` + `code-content` 替换为（终端样式，文件名 `terminal`）：

```html
          <div class="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
            <div class="code-block">
            <div class="code-header">
              <div class="code-dot bg-red-500"></div>
              <div class="code-dot bg-yellow-500"></div>
              <div class="code-dot bg-green-500"></div>
              <span class="ml-4 text-sm text-slate-400 font-mono">terminal</span>
            </div>
            <div class="code-content text-slate-300">
              <pre><span class="text-slate-500">$ </span>quantcell strategy generate \
    --requirement <span class="text-green-300">"双均线金叉买入、死叉卖出"</span> \
    --name <span class="text-green-300">dual_ma</span></pre>
            </div>
          </div>
          </div>
```

- [ ] **Step 5: 替换两个浮动徽章为事实徽章**

把两个 `animate-float` 浮动元素整块替换为：

```html
          <div class="absolute -top-4 -right-4 p-4 rounded-xl glass shadow-lg animate-float hidden sm:block">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                <i data-lucide="zap" class="w-5 h-5 text-primary-500"></i>
              </div>
              <div>
                <div class="text-xs text-slate-500 dark:text-slate-400" data-i18n="hero.badge.rust.title">Rust Core Engine</div>
                <div class="text-sm font-bold text-slate-900 dark:text-white" data-i18n="hero.badge.rust.value">axon-quant 0.14.5</div>
              </div>
            </div>
          </div>

          <div class="absolute -bottom-4 -left-4 p-4 rounded-xl glass shadow-lg animate-float hidden sm:block" style="animation-delay: 2s;">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-accent-500/20 flex items-center justify-center">
                <i data-lucide="terminal" class="w-5 h-5 text-accent-500"></i>
              </div>
              <div>
                <div class="text-xs text-slate-500 dark:text-slate-400" data-i18n="hero.badge.cli.title">CLI Toolkit</div>
                <div class="text-sm font-bold text-slate-900 dark:text-white" data-i18n="hero.badge.cli.value">13 Command Groups</div>
              </div>
            </div>
          </div>
```

- [ ] **Step 6: 提交**

```bash
git add index.html
git commit -m "feat(hero): 导航锚点与 Hero 改为 AI 原生定位、真实 CLI 与事实徽章"
```

---

## Task 3: 重写功能区为 4 组 × 3 卡

**Files:**
- Modify: `index.html`（id="features" 的整个 `<section>`）

- [ ] **Step 1: 用 12 卡分组结构整体替换 Features section**

把现有 9 卡 Features `<section id="features" ...>...</section>` 整块替换为：

```html
  <section id="features" class="py-20 lg:py-32">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-3xl sm:text-4xl font-bold mb-4" data-i18n="features.title">Everything for AI-Native Quant Trading</h2>
        <p class="text-lg text-slate-600 dark:text-slate-400" data-i18n="features.subtitle">From natural-language strategy ideas to Rust-powered backtesting and live deployment</p>
      </div>

      <div class="space-y-14">
        <!-- 组一：AI 智能 -->
        <div>
          <h3 class="text-sm font-semibold uppercase tracking-wider text-accent-600 dark:text-accent-400 mb-6 flex items-center gap-2">
            <span class="text-base">🤖</span><span data-i18n="features.group.ai">AI Intelligence</span>
          </h3>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="feature-card p-6 rounded-2xl glass border border-slate-200 dark:border-slate-800">
              <div class="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center mb-4">
                <i data-lucide="sparkles" class="w-6 h-6 text-accent-500"></i>
              </div>
              <h4 class="text-lg font-semibold mb-2" data-i18n="features.nlgen.title">Natural-Language Strategy Generation</h4>
              <p class="text-slate-600 dark:text-slate-400 text-sm" data-i18n="features.nlgen.description">Describe a trading idea in plain language and get executable strategy code automatically. Thinking-chain reasoning is explainable and traceable, with built-in code quality and safety checks.</p>
            </div>
            <div class="feature-card p-6 rounded-2xl glass border border-slate-200 dark:border-slate-800">
              <div class="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4">
                <i data-lucide="bot" class="w-6 h-6 text-violet-500"></i>
              </div>
              <h4 class="text-lg font-semibold mb-2" data-i18n="features.agent.title">AI Agent</h4>
              <p class="text-slate-600 dark:text-slate-400 text-sm" data-i18n="features.agent.description">An AI agent with long-term memory, tool calling, and built-in skills (news analysis, technical analysis) for multi-turn conversations and operation orchestration.</p>
            </div>
            <div class="feature-card p-6 rounded-2xl glass border border-slate-200 dark:border-slate-800">
              <div class="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center mb-4">
                <i data-lucide="calculator" class="w-6 h-6 text-pink-500"></i>
              </div>
              <h4 class="text-lg font-semibold mb-2" data-i18n="features.indicator.title">Custom Indicators with AI</h4>
              <p class="text-slate-600 dark:text-slate-400 text-sm" data-i18n="features.indicator.description">Write indicator code in the browser; the LLM diagnoses errors in the code and fixes them automatically.</p>
            </div>
          </div>
        </div>

        <!-- 组二：Rust 引擎与回测 -->
        <div>
          <h3 class="text-sm font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400 mb-6 flex items-center gap-2">
            <span class="text-base">⚡</span><span data-i18n="features.group.engine">Rust Engine &amp; Backtesting</span>
          </h3>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="feature-card p-6 rounded-2xl glass border border-slate-200 dark:border-slate-800">
              <div class="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mb-4">
                <i data-lucide="history" class="w-6 h-6 text-primary-500"></i>
              </div>
              <h4 class="text-lg font-semibold mb-2" data-i18n="features.backtest.title">Event-Driven Backtesting</h4>
              <p class="text-slate-600 dark:text-slate-400 text-sm" data-i18n="features.backtest.description">Powered by the axon-quant Rust core, with K-line, Tick, OrderBook, and Deriv data adapters. Backtests and live trading share identical matching semantics, guarded by conformance contract tests.</p>
            </div>
            <div class="feature-card p-6 rounded-2xl glass border border-slate-200 dark:border-slate-800">
              <div class="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4">
                <i data-lucide="sliders-horizontal" class="w-6 h-6 text-cyan-500"></i>
              </div>
              <h4 class="text-lg font-semibold mb-2" data-i18n="features.hpo.title">Walk-Forward &amp; Hyperparameter Optimization</h4>
              <p class="text-slate-600 dark:text-slate-400 text-sm" data-i18n="features.hpo.description">Rolling-window validation prevents overfitting. Built-in Optuna HPO with TPE sampling and median pruning.</p>
            </div>
            <div class="feature-card p-6 rounded-2xl glass border border-slate-200 dark:border-slate-800">
              <div class="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4">
                <i data-lucide="network" class="w-6 h-6 text-indigo-500"></i>
              </div>
              <h4 class="text-lg font-semibold mb-2" data-i18n="features.rl.title">Reinforcement Learning</h4>
              <p class="text-slate-600 dark:text-slate-400 text-sm" data-i18n="features.rl.description">Gymnasium trading environments with Stable-Baselines3 (PPO / SAC / DQN), covering the full train → backtest → evaluate → retrain lifecycle.</p>
            </div>
          </div>
        </div>

        <!-- 组三：交易与数据生态 -->
        <div>
          <h3 class="text-sm font-semibold uppercase tracking-wider text-green-600 dark:text-green-400 mb-6 flex items-center gap-2">
            <span class="text-base">🌐</span><span data-i18n="features.group.eco">Trading &amp; Data Ecosystem</span>
          </h3>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="feature-card p-6 rounded-2xl glass border border-slate-200 dark:border-slate-800">
              <div class="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                <i data-lucide="globe" class="w-6 h-6 text-blue-500"></i>
              </div>
              <h4 class="text-lg font-semibold mb-2" data-i18n="features.exchange.title">Unified Exchange Access</h4>
              <p class="text-slate-600 dark:text-slate-400 text-sm" data-i18n="features.exchange.description">Binance (live / paper / archive) and OKX adapters, with WebSocket real-time streaming, automatic reconnection, and persistence.</p>
            </div>
            <div class="feature-card p-6 rounded-2xl glass border border-slate-200 dark:border-slate-800">
              <div class="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
                <i data-lucide="database" class="w-6 h-6 text-green-500"></i>
              </div>
              <h4 class="text-lg font-semibold mb-2" data-i18n="features.data.title">DuckDB + Parquet Data Stack</h4>
              <p class="text-slate-600 dark:text-slate-400 text-sm" data-i18n="features.data.description">Columnar storage for efficient reads and writes, plus data quality checks, automatic gap recovery, and archive repair for corrupted files.</p>
            </div>
            <div class="feature-card p-6 rounded-2xl glass border border-slate-200 dark:border-slate-800">
              <div class="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <i data-lucide="activity" class="w-6 h-6 text-emerald-500"></i>
              </div>
              <h4 class="text-lg font-semibold mb-2" data-i18n="features.worker.title">Worker Live Execution</h4>
              <p class="text-slate-600 dark:text-slate-400 text-sm" data-i18n="features.worker.description">Strategy live loops, paper trading, and engine deployment with full lifecycle management.</p>
            </div>
          </div>
        </div>

        <!-- 组四：平台工程 -->
        <div>
          <h3 class="text-sm font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-6 flex items-center gap-2">
            <span class="text-base">🛡️</span><span data-i18n="features.group.platform">Platform Engineering</span>
          </h3>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="feature-card p-6 rounded-2xl glass border border-slate-200 dark:border-slate-800">
              <div class="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                <i data-lucide="puzzle" class="w-6 h-6 text-amber-500"></i>
              </div>
              <h4 class="text-lg font-semibold mb-2" data-i18n="features.plugin.title">Plugin System</h4>
              <p class="text-slate-600 dark:text-slate-400 text-sm" data-i18n="features.plugin.description">Inter-plugin communication through a unified event bus and isolation in a security sandbox. Package and install plugins with one quantcell plugin command.</p>
            </div>
            <div class="feature-card p-6 rounded-2xl glass border border-slate-200 dark:border-slate-800">
              <div class="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
                <i data-lucide="shield-check" class="w-6 h-6 text-red-500"></i>
              </div>
              <h4 class="text-lg font-semibold mb-2" data-i18n="features.risk.title">Risk Control &amp; Credential Security</h4>
              <p class="text-slate-600 dark:text-slate-400 text-sm" data-i18n="features.risk.description">Exchange API keys are encrypted at rest and managed via quantcell account, with a risk engine for monitoring and unified JWT authentication.</p>
            </div>
            <div class="feature-card p-6 rounded-2xl glass border border-slate-200 dark:border-slate-800">
              <div class="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center mb-4">
                <i data-lucide="monitor-smartphone" class="w-6 h-6 text-sky-500"></i>
              </div>
              <h4 class="text-lg font-semibold mb-2" data-i18n="features.frontend.title">Modern Frontend &amp; Visualization</h4>
              <p class="text-slate-600 dark:text-slate-400 text-sm" data-i18n="features.frontend.description">React 18 + TypeScript + Vite 7 + Ant Design 6, KLineCharts/ECharts, the Monaco editor, backtest replay, and built-in zh/en i18n.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
```

- [ ] **Step 2: 提交**

```bash
git add index.html
git commit -m "feat(features): 功能区重组为 AI/引擎/生态/平台 4 组 12 卡"
```

---

## Task 4: 重写系统架构区为五层

**Files:**
- Modify: `index.html`（id="architecture" 的整个 `<section>`）

- [ ] **Step 1: 整体替换 Architecture section**

把现有四层架构 section 整块替换为（新增橙色 Rust 引擎层，更新各层 chips 与右侧三卖点）：

```html
  <section id="architecture" class="py-20 lg:py-32 bg-slate-100 dark:bg-slate-900/50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <!-- 架构图：五层 -->
        <div class="order-2 lg:order-1">
          <div class="rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div class="p-6 space-y-3">
              <div class="p-4 rounded-xl bg-primary-500/10 border border-primary-500/20">
                <div class="flex items-center gap-3 mb-3">
                  <i data-lucide="layout" class="w-5 h-5 text-primary-500"></i>
                  <span class="font-semibold text-primary-700 dark:text-primary-300" data-i18n="architecture.layers.frontend">Frontend Layer</span>
                </div>
                <div class="flex flex-wrap gap-2">
                  <span class="px-2 py-1 rounded bg-white dark:bg-slate-800 text-xs">React 18</span>
                  <span class="px-2 py-1 rounded bg-white dark:bg-slate-800 text-xs">TypeScript</span>
                  <span class="px-2 py-1 rounded bg-white dark:bg-slate-800 text-xs">Vite 7</span>
                  <span class="px-2 py-1 rounded bg-white dark:bg-slate-800 text-xs">Ant Design 6</span>
                  <span class="px-2 py-1 rounded bg-white dark:bg-slate-800 text-xs">KLineCharts / ECharts</span>
                  <span class="px-2 py-1 rounded bg-white dark:bg-slate-800 text-xs">Zustand</span>
                </div>
              </div>

              <div class="flex justify-center">
                <i data-lucide="arrow-down" class="w-5 h-5 text-slate-400"></i>
              </div>

              <div class="p-4 rounded-xl bg-accent-500/10 border border-accent-500/20">
                <div class="flex items-center gap-3 mb-3">
                  <i data-lucide="server" class="w-5 h-5 text-accent-500"></i>
                  <span class="font-semibold text-accent-700 dark:text-accent-300" data-i18n="architecture.layers.api">API Layer</span>
                </div>
                <div class="flex flex-wrap gap-2">
                  <span class="px-2 py-1 rounded bg-white dark:bg-slate-800 text-xs">FastAPI</span>
                  <span class="px-2 py-1 rounded bg-white dark:bg-slate-800 text-xs">RESTful</span>
                  <span class="px-2 py-1 rounded bg-white dark:bg-slate-800 text-xs">WebSocket</span>
                  <span class="px-2 py-1 rounded bg-white dark:bg-slate-800 text-xs">JWT</span>
                </div>
              </div>

              <div class="flex justify-center">
                <i data-lucide="arrow-down" class="w-5 h-5 text-slate-400"></i>
              </div>

              <div class="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                <div class="flex items-center gap-3 mb-3">
                  <i data-lucide="cpu" class="w-5 h-5 text-green-500"></i>
                  <span class="font-semibold text-green-700 dark:text-green-300" data-i18n="architecture.layers.business">Business Layer</span>
                </div>
                <div class="flex flex-wrap gap-2">
                  <span class="px-2 py-1 rounded bg-white dark:bg-slate-800 text-xs">Strategy &amp; Backtest</span>
                  <span class="px-2 py-1 rounded bg-white dark:bg-slate-800 text-xs">AI Agent</span>
                  <span class="px-2 py-1 rounded bg-white dark:bg-slate-800 text-xs">Reinforcement Learning</span>
                  <span class="px-2 py-1 rounded bg-white dark:bg-slate-800 text-xs">Realtime Trading</span>
                  <span class="px-2 py-1 rounded bg-white dark:bg-slate-800 text-xs">Data Collector</span>
                  <span class="px-2 py-1 rounded bg-white dark:bg-slate-800 text-xs">Plugins</span>
                </div>
              </div>

              <div class="flex justify-center">
                <i data-lucide="arrow-down" class="w-5 h-5 text-slate-400"></i>
              </div>

              <div class="p-4 rounded-xl bg-orange-500/10 border-2 border-orange-500/40 relative">
                <span class="absolute top-3 right-3 px-2 py-0.5 rounded bg-orange-500 text-white text-[10px] font-bold tracking-wide">Rust</span>
                <div class="flex items-center gap-3 mb-3">
                  <i data-lucide="cog" class="w-5 h-5 text-orange-500"></i>
                  <span class="font-semibold text-orange-700 dark:text-orange-300" data-i18n="architecture.layers.engine">Rust Engine Layer</span>
                </div>
                <div class="flex flex-wrap gap-2">
                  <span class="px-2 py-1 rounded bg-white dark:bg-slate-800 text-xs font-mono">axon-quant 0.14.5</span>
                  <span class="px-2 py-1 rounded bg-white dark:bg-slate-800 text-xs">Event-Driven Matching</span>
                  <span class="px-2 py-1 rounded bg-white dark:bg-slate-800 text-xs">Risk Engine</span>
                  <span class="px-2 py-1 rounded bg-white dark:bg-slate-800 text-xs">OMS</span>
                </div>
              </div>

              <div class="flex justify-center">
                <i data-lucide="arrow-down" class="w-5 h-5 text-slate-400"></i>
              </div>

              <div class="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                <div class="flex items-center gap-3 mb-3">
                  <i data-lucide="database" class="w-5 h-5 text-yellow-500"></i>
                  <span class="font-semibold text-yellow-700 dark:text-yellow-300" data-i18n="architecture.layers.data">Data Layer</span>
                </div>
                <div class="flex flex-wrap gap-2">
                  <span class="px-2 py-1 rounded bg-white dark:bg-slate-800 text-xs">DuckDB</span>
                  <span class="px-2 py-1 rounded bg-white dark:bg-slate-800 text-xs">Parquet</span>
                  <span class="px-2 py-1 rounded bg-white dark:bg-slate-800 text-xs">PyArrow</span>
                  <span class="px-2 py-1 rounded bg-white dark:bg-slate-800 text-xs">SQLAlchemy / Alembic</span>
                  <span class="px-2 py-1 rounded bg-white dark:bg-slate-800 text-xs">Binance / OKX</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 架构说明 -->
        <div class="order-1 lg:order-2 space-y-6">
          <h2 class="text-3xl sm:text-4xl font-bold" data-i18n="architecture.title">System Architecture</h2>
          <p class="text-lg text-slate-600 dark:text-slate-400" data-i18n="architecture.description">React/TypeScript on the frontend, FastAPI services, and the axon-quant Rust trading core — decoupled through axon_bridge, covering strategy development, backtest validation, and live deployment.</p>

          <div class="space-y-4">
            <div class="flex gap-4">
              <div class="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                <i data-lucide="check" class="w-4 h-4 text-orange-500"></i>
              </div>
              <div>
                <h4 class="font-semibold mb-1" data-i18n="architecture.points.engine.title">Rust Core Engine</h4>
                <p class="text-sm text-slate-600 dark:text-slate-400" data-i18n="architecture.points.engine.description">Identical matching semantics in backtest and live trading; conformance contract tests protect every engine upgrade.</p>
              </div>
            </div>
            <div class="flex gap-4">
              <div class="w-8 h-8 rounded-lg bg-accent-500/10 flex items-center justify-center flex-shrink-0">
                <i data-lucide="check" class="w-4 h-4 text-accent-500"></i>
              </div>
              <div>
                <h4 class="font-semibold mb-1" data-i18n="architecture.points.ai.title">AI-Native Loop</h4>
                <p class="text-sm text-slate-600 dark:text-slate-400" data-i18n="architecture.points.ai.description">Natural language → code generation → safety checks → backtest verification → deployment.</p>
              </div>
            </div>
            <div class="flex gap-4">
              <div class="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                <i data-lucide="check" class="w-4 h-4 text-primary-500"></i>
              </div>
              <div>
                <h4 class="font-semibold mb-1" data-i18n="architecture.points.bridge.title">axon_bridge Decoupling</h4>
                <p class="text-sm text-slate-600 dark:text-slate-400" data-i18n="architecture.points.bridge.description">The Python business layer and the Rust engine stay decoupled — one strategy codebase runs in both backtests and live trading.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
```

- [ ] **Step 2: 提交**

```bash
git add index.html
git commit -m "feat(architecture): 架构图更新为含 axon-quant Rust 引擎层的五层结构"
```

---

## Task 5: 用快速开始区替换旧 Code Example 区

**Files:**
- Modify: `index.html`（删除旧 Code Example `<section>`，替换为 id="quick-start" 新区）

- [ ] **Step 1: 整体替换**

把旧的 "Simple Yet Powerful" Code Example `<section class="py-20 lg:py-32">`（含旧 strategy.core 代码窗与三张卖点卡）整块替换为：

```html
  <section id="quick-start" class="py-20 lg:py-32">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-3xl sm:text-4xl font-bold mb-4" data-i18n="quickstart.title">Get Running in Minutes</h2>
        <p class="text-lg text-slate-600 dark:text-slate-400" data-i18n="quickstart.subtitle">Three steps from clone to your first AI-generated, backtested strategy</p>
      </div>

      <div class="max-w-3xl mx-auto space-y-6">
        <!-- Step 1 -->
        <div class="p-6 rounded-2xl glass border border-slate-200 dark:border-slate-800">
          <div class="flex items-center gap-3 mb-2">
            <span class="w-8 h-8 rounded-full bg-primary-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">1</span>
            <h3 class="text-lg font-semibold" data-i18n="quickstart.step1.title">Install with one command</h3>
          </div>
          <p class="text-sm text-slate-600 dark:text-slate-400 mb-4 ml-11" data-i18n="quickstart.step1.description">Clone the repo and run the installer. It provisions the uv and bun toolchains plus the frontend and backend environments (--minimal / --full / --extra).</p>
          <div class="code-block ml-11">
            <div class="code-content">
              <pre>git clone https://github.com/pengwow/quantcell.git
cd quantcell
bash install.sh   <span class="text-slate-500"># --minimal / --full / --extra，自动配置 uv + bun</span></pre>
            </div>
          </div>
        </div>

        <!-- Step 2 -->
        <div class="p-6 rounded-2xl glass border border-slate-200 dark:border-slate-800">
          <div class="flex items-center gap-3 mb-2">
            <span class="w-8 h-8 rounded-full bg-primary-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">2</span>
            <h3 class="text-lg font-semibold" data-i18n="quickstart.step2.title">Generate and backtest via CLI</h3>
          </div>
          <p class="text-sm text-slate-600 dark:text-slate-400 mb-4 ml-11" data-i18n="quickstart.step2.description">Turn a natural-language requirement into a strategy, then run an event-driven backtest with a single command.</p>
          <div class="code-block ml-11">
            <div class="code-content">
              <pre>quantcell strategy generate --requirement <span class="text-green-300">"双均线金叉买入"</span> --name dual_ma
quantcell backtest run --symbols BTCUSDT --timeframes 1h --initial-capital 100000</pre>
            </div>
          </div>
        </div>

        <!-- Step 3 -->
        <div class="p-6 rounded-2xl glass border border-slate-200 dark:border-slate-800">
          <div class="flex items-center gap-3 mb-2">
            <span class="w-8 h-8 rounded-full bg-primary-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">3</span>
            <h3 class="text-lg font-semibold" data-i18n="quickstart.step3.title">Write strategies in Python</h3>
          </div>
          <p class="text-sm text-slate-600 dark:text-slate-400 mb-4 ml-11" data-i18n="quickstart.step3.description">Receive bars in on_bar and return a unified axon_quant Action. The same code runs in backtests and live trading.</p>
          <div class="code-block ml-11">
            <div class="code-content">
<pre><span class="text-purple-400">from</span> axon_quant <span class="text-purple-400">import</span> Action, ActionType

<span class="text-purple-400">class</span> <span class="text-yellow-300">DualMA</span>:
    <span class="text-purple-400">def</span> <span class="text-blue-400">__init__</span>(<span class="text-orange-300">self</span>, fast=<span class="text-green-300">10</span>, slow=<span class="text-green-300">30</span>):
        <span class="text-orange-300">self</span>.fast, <span class="text-orange-300">self</span>.slow = fast, slow
        <span class="text-orange-300">self</span>.closes = []

    <span class="text-purple-400">def</span> <span class="text-blue-400">on_bar</span>(<span class="text-orange-300">self</span>, bar: dict) -> Action:
        <span class="text-orange-300">self</span>.closes.append(bar[<span class="text-green-300">"close"</span>])
        <span class="text-purple-400">if</span> len(<span class="text-orange-300">self</span>.closes) &lt; <span class="text-orange-300">self</span>.slow:
            <span class="text-purple-400">return</span> Action(ActionType.Hold, <span class="text-green-300">0.0</span>, <span class="text-green-300">0.0</span>, <span class="text-green-300">"dual_ma"</span>, <span class="text-green-300">0</span>)
        fast_ma = sum(<span class="text-orange-300">self</span>.closes[-<span class="text-orange-300">self</span>.fast:]) / <span class="text-orange-300">self</span>.fast
        slow_ma = sum(<span class="text-orange-300">self</span>.closes[-<span class="text-orange-300">self</span>.slow:]) / <span class="text-orange-300">self</span>.slow
        <span class="text-purple-400">if</span> fast_ma > slow_ma:
            <span class="text-purple-400">return</span> Action(ActionType.Buy, <span class="text-green-300">0.8</span>, <span class="text-green-300">0.1</span>, <span class="text-green-300">"dual_ma"</span>, <span class="text-green-300">0</span>)
        <span class="text-purple-400">return</span> Action(ActionType.Hold, <span class="text-green-300">0.0</span>, <span class="text-green-300">0.0</span>, <span class="text-green-300">"dual_ma"</span>, <span class="text-green-300">0</span>)</pre>
            </div>
          </div>
        </div>

        <!-- 事实标签 -->
        <div class="flex flex-wrap justify-center gap-3 pt-2">
          <span class="px-3 py-1.5 rounded-full glass border border-slate-200 dark:border-slate-800 text-xs font-medium" data-i18n="quickstart.fact.cli">13 CLI Command Groups</span>
          <span class="px-3 py-1.5 rounded-full glass border border-slate-200 dark:border-slate-800 text-xs font-medium" data-i18n="quickstart.fact.toolchain">uv / bun toolchains</span>
          <span class="px-3 py-1.5 rounded-full glass border border-slate-200 dark:border-slate-800 text-xs font-medium" data-i18n="quickstart.fact.swagger">Swagger /docs</span>
          <span class="px-3 py-1.5 rounded-full glass border border-slate-200 dark:border-slate-800 text-xs font-medium" data-i18n="quickstart.fact.pytest">pytest 9</span>
        </div>
      </div>
    </div>
  </section>
```

- [ ] **Step 2: 提交**

```bash
git add index.html
git commit -m "feat(quickstart): 旧代码示例区替换为三步快速开始（安装/CLI/Action）"
```

---

## Task 6: 重写开源社区区与页脚

**Files:**
- Modify: `index.html`（Open Source `<section>` + `<footer>`）

- [ ] **Step 1: 替换社区区 4 卡**

把 Open Source section 中四张卡（GitHub/Gitee/Documentation/Discord）的 grid 整块替换为（GitHub、Gitee 镜像、在线 Demo、邮箱）：

```html
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <a href="https://github.com/pengwow/quantcell" target="_blank" rel="noopener" class="group p-6 rounded-2xl glass border border-slate-200 dark:border-slate-800 hover:border-primary-500 dark:hover:border-primary-400 transition-all">
          <div class="w-12 h-12 rounded-xl bg-slate-900 dark:bg-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <i data-lucide="github" class="w-6 h-6 text-white dark:text-slate-900"></i>
          </div>
          <h3 class="font-semibold mb-1">GitHub</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400">Star &amp; Fork</p>
        </a>

        <a href="https://gitee.com/pengwow/quantcell" target="_blank" rel="noopener" class="group p-6 rounded-2xl glass border border-slate-200 dark:border-slate-800 hover:border-primary-500 dark:hover:border-primary-400 transition-all">
          <div class="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span class="text-white font-bold text-lg">G</span>
          </div>
          <h3 class="font-semibold mb-1">Gitee</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400" data-i18n="opensource.giteeDesc">China mirror</p>
        </a>

        <a href="https://demo.quantcell.top/chart" target="_blank" rel="noopener" class="group p-6 rounded-2xl glass border border-slate-200 dark:border-slate-800 hover:border-primary-500 dark:hover:border-primary-400 transition-all">
          <div class="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <i data-lucide="play" class="w-6 h-6 text-primary-500"></i>
          </div>
          <h3 class="font-semibold mb-1" data-i18n="opensource.demo">Live Demo</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400" data-i18n="opensource.demoDesc">Try now</p>
        </a>

        <a href="mailto:pengwow@hotmail.com" class="group p-6 rounded-2xl glass border border-slate-200 dark:border-slate-800 hover:border-primary-500 dark:hover:border-primary-400 transition-all">
          <div class="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <i data-lucide="mail" class="w-6 h-6 text-accent-500"></i>
          </div>
          <h3 class="font-semibold mb-1" data-i18n="opensource.email">Email</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400" data-i18n="opensource.emailDesc">Contact the author</p>
        </a>
      </div>
```

同时把该 section 的被注释 GitHub Stats 块整段删除（虚构数字）。

- [ ] **Step 2: 替换页脚链接列与社交图标**

把 footer 品牌区社交图标三个（github/twitter/discord）替换为两个：

```html
          <div class="flex gap-4">
            <a href="https://github.com/pengwow/quantcell" target="_blank" rel="noopener" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              <i data-lucide="github" class="w-5 h-5"></i>
            </a>
            <a href="mailto:pengwow@hotmail.com" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              <i data-lucide="mail" class="w-5 h-5"></i>
            </a>
          </div>
```

把 Product 链接 `<ul>` 替换为：

```html
          <ul class="space-y-2 text-sm">
            <li><a href="#features" class="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors" data-i18n="footer.links.features">Features</a></li>
            <li><a href="#architecture" class="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors" data-i18n="footer.links.architecture">Architecture</a></li>
            <li><a href="#quick-start" class="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors" data-i18n="footer.links.quickstart">Quick Start</a></li>
            <li><a href="https://github.com/pengwow/quantcell/releases" target="_blank" rel="noopener" class="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors" data-i18n="footer.links.releases">Releases</a></li>
          </ul>
```

把 Resources 链接 `<ul>` 替换为：

```html
          <ul class="space-y-2 text-sm">
            <li><a href="https://github.com/pengwow/quantcell" target="_blank" rel="noopener" class="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors" data-i18n="footer.links.docs">Documentation</a></li>
            <li><a href="https://demo.quantcell.top/chart" target="_blank" rel="noopener" class="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors" data-i18n="footer.links.demo">Live Demo</a></li>
            <li><a href="https://gitee.com/pengwow/quantcell" target="_blank" rel="noopener" class="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors" data-i18n="footer.links.gitee">Gitee Mirror</a></li>
            <li><a href="https://github.com/pengwow/quantcell/issues" target="_blank" rel="noopener" class="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors" data-i18n="footer.links.issues">Issues</a></li>
          </ul>
```

- [ ] **Step 3: 替换版权行，删除 Privacy/Terms**

把底部 `<div class="pt-8 border-t ...">` 整块替换为（单栏版权，移除无真实页面的法律链接）：

```html
      <div class="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-sm text-slate-500 dark:text-slate-400" data-i18n="footer.copyright">© 2026 QuantCell · Apache License 2.0</p>
      </div>
```

- [ ] **Step 4: 提交**

```bash
git add index.html
git commit -m "feat(footer): 社区与页脚只保留真实链接并修正为 Apache 2.0"
```

---

## Task 7: 自动化静态校验

**Files:** 无文件改动（仅校验）

- [ ] **Step 1: 校验 JSON 合法**

Run:
```bash
python3 -m json.tool assets/i18n/translations.json > /dev/null && echo "JSON OK"
```
Expected: `JSON OK`

- [ ] **Step 2: 校验 i18n 键全覆盖（HTML 键 ⇄ en/zh 双向比对）**

Run:
```bash
python3 - <<'PY'
import json, re, pathlib, sys
root = pathlib.Path(".")
html = (root / "index.html").read_text(encoding="utf-8")
trans = json.loads((root / "assets/i18n/translations.json").read_text(encoding="utf-8"))
keys = set(re.findall(r'data-i18n="([^"]+)"', html))
errors = []
for lang in ("en", "zh"):
    have = set(trans.get(lang, {}))
    missing = keys - have
    unused = have - keys
    if missing:
        errors.append(f"{lang} missing keys: {sorted(missing)}")
    if unused:
        errors.append(f"{lang} unused keys: {sorted(unused)}")
if errors:
    print("\n".join(errors))
    sys.exit(1)
print(f"I18N OK: {len(keys)} keys, en/zh both fully covered")
PY
```
Expected: `I18N OK: NN keys, en/zh both fully covered`（键数约 80，以实际为准；无 missing/unused）。

- [ ] **Step 3: 校验过时事实零残留**

Run:
```bash
for term in "MIT" "SQLite" "strategy.core" "StrategyCore" "discord" "twitter" "message-circle" "peng wo w" "32.7" "vectorized" "向量化" "#docs" "#getting-started" "favicon.ico"; do
  if grep -in -- "$term" index.html assets/i18n/translations.json >/dev/null 2>&1; then
    echo "FORBIDDEN FOUND: $term"; grep -in -- "$term" index.html assets/i18n/translations.json; exit 1
  fi
done
echo "FACT CHECK OK"
```
Expected: `FACT CHECK OK`
（注：`message-circle` 是旧 Discord/社区图标名；新图标使用 mail/play 等。）

- [ ] **Step 4: 校验锚点目标存在**

Run:
```bash
for anchor in features architecture quick-start; do
  grep -q "id=\"$anchor\"" index.html && echo "anchor ok: #$anchor" || { echo "MISSING ANCHOR: $anchor"; exit 1; }
done
```
Expected: 三行 `anchor ok`。

---

## Task 8: 本地起站浏览器巡检与最终提交确认

**Files:** 无文件改动（人工验收）

- [ ] **Step 1: 启动本地静态服务**

Run（后台或新终端）：
```bash
python3 -m http.server 8013
```
浏览器打开 `http://localhost:8013`。

- [ ] **Step 2: 按 spec 第 9 节逐项巡检**

1. 首屏语言：清空 localStorage 刷新，中文浏览器直接显示中文，无英文闪烁；英文浏览器显示英文。
2. 语言切换：点「中文/English」切换后刷新，选择被记住；逐屏检查无裸露的 data-i18n key、无未翻译英文残留在中文态（代码/技术名除外）。
3. 主题切换：浅/深色下检查五层架构橙色 Rust 卡、代码块、浮动徽章、12 卡均正常。
4. 响应式：DevTools 切 375px 宽，移动菜单可展开且 5 个导航项 + GitHub 按钮链接正确；12 卡、五层图、三步时间线不错位、横向无溢出。
5. 锚点：导航与页脚的功能特性/系统架构/快速开始点击平滑滚动到对应区块。
6. 外链：GitHub（导航、Hero、社区、页脚）、Gitee、Demo（`/chart`）、邮箱（mailto）、Releases、Issues 均指向正确地址并新窗口打开。
7. 图标：所有 Lucide 图标正常渲染（特别确认新增 bot/puzzle/network/shield-check/monitor-smartphone/terminal/mail/sliders-horizontal/calculator/activity）；控制台无报错、无 404（含 logo.ico）。

- [ ] **Step 3: 停止本地服务并确认提交历史**

Run:
```bash
git log --oneline -6
```
Expected: 依次看到 Task 2–6 的 5 个内容提交 + Task 1 的 i18n 提交（共 6 个），每个提交只含 index.html / translations.json。

巡检中发现的任何问题：定位到对应 Task 的代码块修正后，重跑 Task 7 全部校验，再回到本任务复检，直至 8 项全部通过。
