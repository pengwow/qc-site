# qc-site 网站内容校准与信息架构重组设计

- 日期：2026-09-21
- 范围：`/Users/liupeng/workspace/quant/qc-site`（纯静态单页站）
- 事实依据：`/Users/liupeng/workspace/quant/QuantCell` 项目当前代码、README、uv.lock、LICENSE、frontend/package.json
- 力度：内容校准 + 信息架构重组，保持现有玻璃态视觉风格，不做视觉框架升级

## 1. 背景与问题

qc-site 是 QuantCell 的项目展示站（单页 HTML + Tailwind CDN 本地版 + 原生 JS + i18n）。
QuantCell 已从"多引擎 Python 量化平台"演进为"AI 原生量化交易系统"，网站内容显著落后，存在事实错误：

1. **定位过时**：网站强调"重构的多引擎（事件驱动 + 向量化）"；实际已全面转向 AI 原生，且向量化回测已废弃，仅保留 axon-quant 事件驱动引擎。
2. **引擎缺失**：只字未提底层 Rust 引擎 `axon-quant`；实际 uv.lock 锁定 0.14.5，是系统核心。
3. **新能力缺失**：AI Agent（记忆/工具/技能）、强化学习（PPO/SAC/DQN）、插件系统、HPO 超参优化、Walk-Forward、13 组 CLI、凭证加密、数据质量检测、一键安装均未展示。
4. **架构图错误**：数据层写 SQLite，实际 DuckDB + Parquet + PyArrow；前端栈缺少 Ant Design 6 / Vite 7 / ECharts / Zustand / Monaco。
5. **代码示例失效**：两处示例使用已不存在的 `from strategy.core import Strategy / StrategyConfig` 旧 API；真实策略 API 为 `from axon_quant import Action, ActionType`，`on_bar` 返回 `Action`。
6. **License 错误**：网站写 MIT，LICENSE 实为 Apache License 2.0。
7. **死链/坏链**：`#docs`、`#getting-started` 无对应锚点；移动端 GitHub 链接含空格损坏（`peng wo w`）；Discord（discord.gg/quantcell）邀请失效；Twitter 账号疑似虚构；Privacy/Terms 无真实页面。
8. **虚构数据**：Hero 浮动卡 "+32.7% 回测收益"、"<10ms 执行速度" 无数据来源。

## 2. 目标与非目标

### 目标

- 网站全部内容与 QuantCell 当前真实状态一致，零过时表述、零虚构数字。
- 按 AI 原生定位重组信息架构，完整覆盖 AI Agent、RL、插件、Rust 引擎、HPO/Walk-Forward 等新能力。
- 所有链接真实可达；中英文双语；首次访问跟随浏览器语言。
- 保持纯静态、0 新依赖、现有蓝紫玻璃态视觉与响应式行为不降级。

### 非目标（明确不做）

- 不升级视觉框架、不更换配色、不引入静态站点构建器。
- 不新增产品截图、新动效、视频。
- 不改变部署方式与目录结构（assets/ 组织不变）。
- 不展示 Stars/下载量/收益等无法核实的营销数字。
- 不改动 QuantCell 主项目任何代码。

## 3. 已确认决策

| 决策点 | 结论 |
|---|---|
| 优化力度 | 内容校准 + 信息架构重组，保持现有视觉 |
| 默认语言 | 浏览器语言自动跟随（现有 i18n.js 已实现：首次跟随 `navigator.language`，之后 localStorage 记忆） |
| 外链策略 | 只保留真实链接：GitHub、Gitee 镜像、在线 Demo、邮箱；移除 Discord/Twitter |
| 功能区结构 | 4 大分组 × 3 卡 = 12 卡 |
| 代码区 | Hero 展示真实 CLI；中段改造为"三步快速开始"（安装 / CLI / Python Action） |
| Hero 浮动徽章 | 右上「Rust 核心引擎 · axon-quant 0.14.5」；左下「13 组 CLI 命令」 |
| 页面编排 | 方案 A 产品叙事漏斗：Hero → 功能分组 → 架构 → 快速开始 → 开源社区 → 页脚 |
| 12 卡增删 | 无需增减，按第 5 节定稿 |

## 4. 页面整体编排

```
导航（锚点更新 + 修坏链）
Hero（AI 原生定位 + CLI 代码窗 + 2 枚事实徽章）
功能分组（4 组 × 3 卡 = 12 卡）
系统架构（左：五层架构卡片；右：3 个核心卖点）
快速开始（1→2→3 时间线：安装 / CLI / Python Action）
开源社区（GitHub / Gitee / Demo / 邮箱，4 卡）
页脚（真实链接 + Apache 2.0）
```

## 5. 各区块详细内容

### 5.1 导航栏

- 锚点：功能特性 `#features`、系统架构 `#architecture`、快速开始 `#quick-start`（新）；移除死链 `#docs` / `#getting-started`。
- 在线 Demo：外链 `https://demo.quantcell.top/chart`（补全 `/chart`，新窗口打开）。
- 「文档」改为外链指向 GitHub 仓库 README：`https://github.com/pengwow/quantcell#readme`。
- 修复移动端菜单 GitHub 链接（去除 `peng wo w` 中的空格）。

### 5.2 Hero

- 徽章：AI 原生量化交易系统 / AI-Native Quantitative Trading System。
- 主标题：
  - 中：用自然语言构建、回测和部署量化策略
  - 英：Build, Backtest & Deploy Quant Strategies with Natural Language
- 描述要点：以 axon-quant（Rust 核心）为交易引擎，FastAPI + React/TypeScript 为前后端；覆盖策略开发 → 回测验证 → 实盘部署；自然语言描述策略，AI 自动生成代码并完成回测验证。
- CTA：快速开始（锚点 `#quick-start`）+ 在 GitHub 查看（外链）。
- 右侧代码窗（文件名显示 `terminal`）：

```bash
quantcell strategy generate \
  --requirement "双均线金叉买入、死叉卖出" \
  --name dual_ma
```

- 浮动徽章：
  - 右上（zap）：Rust 核心引擎 · axon-quant 0.14.5 / Rust Core · axon-quant 0.14.5
  - 左下（terminal 图标）：13 组 CLI 命令 / 13 CLI Command Groups

### 5.3 功能分组（12 卡，4 组）

每组含组标题与 3 张现有 glass 卡片样式。

**组一：AI 智能 / AI Intelligence**

1. 自然语言策略生成：中文描述交易想法 → 自动生成可执行代码；思维链推理可解释可追溯；代码质量安全自检。
2. AI 智能体（Agent）：长期记忆、工具调用、内置技能（新闻分析 / 技术分析），多轮对话与操作编排。
3. 自定义指标 · AI 辅助：在线编写指标代码，LLM 自动诊断并修复错误（对应 backend/indicators 真实能力）。

**组二：Rust 引擎与回测 / Rust Engine & Backtesting**

4. 事件驱动高性能回测：axon-quant Rust 核心；K 线 / Tick / OrderBook / Deriv 多数据适配器；回测与实盘统一撮合语义，conformance 契约门禁。
5. Walk-Forward 与 HPO 超参优化：滚动窗口验证防过拟合；内置 Optuna HPO，TPE 采样 + 中位数剪枝。
6. 强化学习：Gymnasium 量化环境 + Stable-Baselines3（PPO/SAC/DQN）；训练 → 回测 → 评估 → 重训生命周期。

**组三：交易与数据生态 / Trading & Data Ecosystem**

7. 多交易所统一接入：Binance（实盘/纸面/归档）+ OKX；WebSocket 实时订阅、自动重连与持久化。
8. DuckDB + Parquet 数据生态：列式存储高效读写；数据质量检测、缺失自动回补、损坏归档修复。
9. Worker 实盘执行：策略实盘循环、纸面交易、引擎部署与生命周期管理（替代旧"任务管理"卡）。

**组四：平台工程 / Platform Engineering**

10. 插件系统：事件总线通信 + 安全沙箱隔离；`quantcell plugin` 一键打包安装。
11. 风控与凭证安全：交易所密钥加密入库（`quantcell account`）、风险引擎监控、JWT 统一鉴权。
12. 现代化前端与可视化：React 18 + TS + Vite 7 + Ant Design 6；KLineCharts/ECharts 图表、Monaco 编辑器、回测回放、中英 i18n（合并旧"可视化/策略管理/回放"三卡）。

旧表述（StrategyCore/StrategyAdapter/StrategyRunner、钩子系统、向量化多引擎、任务管理等）全部移除。

### 5.4 系统架构

沿用现有左图右文版式。左侧五层卡片（层间保持向下箭头）：

| 层 | 标签内容 | 配色 |
|---|---|---|
| 前端层 | React 18 · TypeScript · Vite 7 · Ant Design 6 · KLineCharts/ECharts · Zustand | primary（沿用） |
| API 层 | FastAPI · RESTful · WebSocket · JWT 鉴权 | accent（沿用） |
| 业务层 | 策略回测 · AI Agent · 强化学习 · 实时交易 · 数据采集 · 插件 | green（沿用） |
| Rust 引擎层（新增，视觉焦点） | axon-quant 0.14.5 · 事件驱动撮合 · 风控 · OMS；附 "Rust" 徽章 | orange 强调 |
| 数据层 | DuckDB · Parquet · PyArrow · SQLAlchemy/Alembic · Binance/OKX | yellow（沿用） |

右侧三个卖点：

1. Rust 核心引擎：回测 ↔ 实盘一致撮合语义，conformance 契约测试门禁守护引擎升级。
2. AI 原生闭环：自然语言 → 代码生成 → 安全校验 → 回测验证 → 部署上线。
3. axon_bridge 桥接：Python 业务层与 Rust 引擎解耦，一套策略代码回测/实盘通用。

### 5.5 快速开始（替换现有 Code Example 区）

标题：三步上手 / Get Running in Minutes。纵向 1→2→3 时间线，每步一个真实代码块：

1. 一键安装：

```bash
git clone https://github.com/pengwow/quantcell.git
cd quantcell
bash install.sh   # 支持 --minimal / --full / --extra，自动配置 uv + bun 工具链
```

2. CLI 生成策略并回测：

```bash
quantcell strategy generate --requirement "双均线金叉买入" --name dual_ma
quantcell backtest run --symbols BTCUSDT --timeframes 1h --initial-capital 100000
```

3. Python 策略（真实 API，极简 DualMA 片段）：

```python
from axon_quant import Action, ActionType

class DualMA:
    def __init__(self, fast=10, slow=30):
        self.fast, self.slow = fast, slow
        self.closes = []

    def on_bar(self, bar: dict) -> Action:
        self.closes.append(bar["close"])
        if len(self.closes) < self.slow:
            return Action(ActionType.Hold, 0.0, 0.0, "dual_ma", 0)
        fast_ma = sum(self.closes[-self.fast:]) / self.fast
        slow_ma = sum(self.closes[-self.slow:]) / self.slow
        if fast_ma > slow_ma:
            return Action(ActionType.Buy, 0.8, 0.1, "dual_ma", 0)
        return Action(ActionType.Hold, 0.0, 0.0, "dual_ma", 0)
```

（与 QuantCell `AGENTS.md` 中 DualMA 示例一致：on_bar 接收 dict、返回 axon_quant 的统一 Action。）

删除旧右侧三张卖点小卡（Intuitive API / Hook / 缓存优化，均为旧架构表述），替换为一行事实标签：
`13 组 CLI 命令 · uv/bun 工具链 · Swagger /docs · pytest 9`

### 5.6 开源社区（4 卡，全部真实）

1. GitHub — https://github.com/pengwow/quantcell （Star & Fork）
2. Gitee 国内镜像 — https://gitee.com/pengwow/quantcell （标注"镜像"）
3. 在线 Demo — https://demo.quantcell.top/chart （立即体验）
4. 邮箱 — mailto:pengwow@hotmail.com

移除 Discord 卡（邀请已失效）。

### 5.7 页脚

- 品牌描述：AI 原生量化交易系统。
- 社交图标仅保留 GitHub + 邮箱；移除 Twitter、Discord。
- Product：功能特性 / 系统架构 / 快速开始 / Releases（`https://github.com/pengwow/quantcell/releases`）。
- Resources：项目文档（GitHub README 锚点）/ 在线 Demo / Gitee 镜像 / Issues（`https://github.com/pengwow/quantcell/issues`）。
- 版权行：© 2026 QuantCell · Apache License 2.0。
- 移除 Privacy Policy / Terms of Service 死链。

## 6. i18n 与防闪烁

- 语言检测逻辑维持 `assets/js/i18n.js` 现状，不重写：首次访问按 `navigator.language` 判定（zh* → 中文，否则英文），写入 localStorage；用户手动切换后永久记忆选择。
- 新增：`<head>` 内一段约 10 行内联早检测脚本，在首次绘制前读取 localStorage/navigator 语言并设置 `<html lang>`，消除中文用户首屏英文闪烁（FOUC）。无新依赖。
- `assets/i18n/translations.json` 全量重写：
  - 键与新 HTML 的 `data-i18n` 一一对应，保持现有扁平 `"section.key"` 命名风格。
  - en / zh 两份，英文为主语言、中文为对等翻译。
  - 删除全部废弃旧键（向量化 backtesting、hooks、task、strategy management、replay 独立卡等）。

## 7. 逐文件改动清单

仅 2 个文件改动，0 新增依赖，0 新增页面/JS：

| 文件 | 改动内容 |
|---|---|
| `index.html` | 重写 nav / Hero / 12 卡功能区 / 五层架构 / 新增快速开始区 / 社区 4 卡 / 页脚；head 增加防闪烁内联脚本；修移动端 GitHub 坏链；移除 Discord/Twitter/Privacy/Terms；所有代码窗换真实内容 |
| `assets/i18n/translations.json` | 全量替换为与新 HTML 一一对应的中英键值，删除废弃键 |

**不改动**：Tailwind 配置与配色、字体、assets/js 下所有脚本（theme/main/i18n/mobile-menu/smooth-scroll/scroll-animations）、目录结构、部署方式。

## 8. 事实核对基准（2026-09-21 核实）

- 引擎：axon-quant 0.14.5（uv.lock 锁定；pyproject 声明 `>=0.11.1`；网站展示锁定版）
- 后端：Python 3.14、FastAPI 0.136、uv 包管理、Typer CLI 13 组、pytest 9（覆盖率基线 57%）、ruff
- 数据：DuckDB 1.4 + Parquet + PyArrow 22 + SQLAlchemy 2 + Alembic
- AI/RL：OpenAI SDK、Gymnasium 1.3、Stable-Baselines3 2.9（PPO/SAC/DQN）、Optuna 4
- 前端：React 18.3、TypeScript 5.9、Vite 7、Ant Design 6.2、TailwindCSS 4、KLineCharts 10、ECharts 5.5、Zustand 5 + Immer、i18next、Monaco、bun
- License：Apache License 2.0（LICENSE 文件实测）
- 链接：GitHub `pengwow/quantcell`、Gitee `pengwow/quantcell`（真实存在，镜像）、Demo `demo.quantcell.top/chart`、邮箱 pengwow@hotmail.com
- 策略真实 API：`from axon_quant import Action, ActionType`，`on_bar(...) -> Action`
- CLI 13 组：agent / market / news / plugin / rl / web / worker / tests / account / migrate / strategy / backtest / data

## 9. 验收标准

本地 `python3 -m http.server` 起站后逐项检查：

1. 中英切换：切换按钮功能正常，刷新后保持选择；英文/中文无缺失键（无 data-i18n key 裸露）。
2. 自动跟随：清空 localStorage 后，中文浏览器首屏即中文，无英文闪烁。
3. 主题：深/浅色模式下所有新内容（含五层架构橙色卡、代码块）显示正常。
4. 响应式：桌面与移动宽度下 12 卡分组、五层图、快速开始时间线不错位；移动菜单链接全部正确。
5. 锚点：功能特性 / 系统架构 / 快速开始均正确滚动定位。
6. 外链：GitHub、Gitee、Demo、邮箱、Releases、Issues、README 全部可达且地址正确；无 Discord/Twitter 残留。
7. 事实：全文无 MIT、无 SQLite 作为主库、无向量化回测、无 strategy.core 旧 API、无虚构统计数字；版本号与第 8 节一致。
8. 控制台无 JS 报错；Lucide 图标全部渲染。

## 10. 风险与缓解

- **README 与锁文件版本不一致**（README 写 axon-quant 0.11.1，锁文件 0.14.5）：网站以锁文件 0.14.5 为准；后续主项目 README 更新不影响。
- **Gitee 镜像滞后**（最近提交落后 GitHub 约 3 个月）：卡片明确标注"镜像"，避免用户误以为同等时效。
- **i18n 键大面积重命名**：translations.json 与 HTML 同批改，验收时逐语言巡检兜底；不保留旧键避免死键。
- **工作区已有未提交改动**：实现阶段基于当前工作区文件直接编辑；提交时按逻辑拆分，注意与用户既有未提交改动区分。
