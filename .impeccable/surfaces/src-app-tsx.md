---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: []
---

# Surface: tzixi.cn 首页

## Scope

单页站点（`/`）：tzixi 的 Minecraft 模组与光影配置文件展示与下载。访客模式 Experience —— 作品本身领场，界面退后。

## Audience & job

中文 Minecraft 玩家，手里已经装好整合包，要在 60 秒内确认「这个模组适不适合我的版本」并下载。桌面为主，手机先看一眼再决定。第二类读者是同好，来看参数怎么调。

## Success

访客不需要问「下哪个、怎么装」：列表层就能看到加载器 + 游戏版本 + 文件大小，点开条目一步点到真实下载链接。

## Constraints

- 全站零成本：纯静态，无后端、无数据库、无付费依赖。
- 大文件不进仓库，走 GitHub Releases 直链。
- 中文为主，游戏术语保留原文（Fabric、NeoForge、Iris、shaderpack）。
- 键盘可达、焦点可见、尊重 `prefers-reduced-motion`。

## Direction contract

THESIS: 站点就是 Minecraft 启动器里那个实例列表——左边一列实例，右边是选中实例的详情面板。拒绝模组聚合站的卡片墙。

OWN-WORLD: 近黑的石板底色（#080b0c 起，经 #0d1113 / #11171a 抬升到 #1c2428），面板由 1px 刻线切分而非圆角卡片，深度靠明度台阶而不是投影；火把橙 #ff7a2f 是唯一强调色，只出现在两处——下载按钮、以及当前选中的那一行实例（左边框 + 一道向左消散的橙光 + 图标）；焦点环用墨色而不是橙色。状态色是一组低饱和矿物料（荧光绿=配置里的字面量、赭黄=提醒、紫水晶=光影类）。字体：Archivo 可变字重承载全部叙述文字（含标题，宽度轴收到 88–92%），Spline Sans Mono 只出现在真正的读数与配置标识上——版本号、文件大小、日期、参数 key/value、文件名；分类角标和测量值标签是无衬线。没有任何渐变文字、发光边框、玻璃拟态，页面底是纯色而非径向光晕。

STORY: 访客一眼认出这是自己每天开的那个界面，于是知道「这里的东西是能装进游戏的」；扫一眼版本徽章确认适配，点条目看详情，点下载拿到文件。

FIRST VIEWPORT: 一个刚好一屏高的外壳（100dvh）包住三件东西：顶栏（方块游戏图标 + 站名 + 「作品 / 安装 / 关于」+ GitHub）、应用窗口、状态栏。窗口内部两栏：左侧 336px 实例栏，每行一个 16×16 自绘像素图标 + 名称 + 加载器与版本 + 分类角标；右侧详情面板顶部是选中项的大标题、一句话简介与 slug，下面一排五格测量值（游戏版本 / 加载器 / 版本 / 文件大小 / 更新），正文与「下载」侧栏并排。窗口高过视口时由详情面板内部滚动，状态栏始终留在首屏内，显示实例计数和「无中转页」。

FORM: 启动器实例面板（Instance Panel）。

出处逐字记清，避免把两套集合混成一套：

- `concept-seed --scope direction --mode experience` 输出 `ASSIGNED INDEX: 3`，即「在我自己按共鸣度排序的 grounded 候选里构建第 3 位」。第 3 位就是启动器实例面板，`seed:9811f0918e6cec43` 可校验（`concept-seed --check-seed` 返回 SEED KNOWN）。
- `.impeccable/questions/roll.json` 记的是同一颗骰子发出的**六条目录挑战者**（缝纫纸样、中光层深潜、东湖木版、册居反透视、cracktro 队列、teletext 杂志）。它们是挑战者集合，不是指派项，也没有一条被选中。
- 用户在那一轮看到的是四张卡，来源是 GROUNDED 列表的第 3 位（指派）、我自选的备选、一条挑战者（cracktro 的层级队列）、以及退出选项（常见模组站卡片墙）。这四张卡不是 `roll.json` 里的六条世界，两者不能互相引用。
- 本轮用的是 harness 的结构化提问工具而不是决策页，因此没有 `serve-question` 的 payload；四张卡的书面记录在 `.impeccable/questions/round-home.json`，标注为手工记录。
- 用户的选择：启动器实例面板。最终只有 cracktro 的「层级即深度」这条纪律被折算进面板的明度台阶，其余挑战者不采用。

seed:9811f0918e6cec43

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
