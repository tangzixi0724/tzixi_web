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

OWN-WORLD: 近黑的石板底色（#0b0e10 起，向 #161b1e 抬升），面板由 1px 的暗槽线切分而非圆角卡片；火把橙 #ff7a2f 是唯一强调色，只出现在「启动/下载」和当前选中项上；状态色是一组低饱和的矿物料（荧光绿=已就绪、赭黄=实验性、紫=客户端限定）。字体：Archivo 可变字重做全部界面文字（含标题，宽度轴拉开），Spline Sans Mono 只用于版本号、文件大小、哈希这类测量值。没有任何渐变文字、发光边框或玻璃拟态。

STORY: 访客一眼认出这是自己每天开的那个界面，于是知道「这里的东西是能装进游戏的」；扫一眼版本徽章确认适配，点条目看详情，点下载拿到文件。

FIRST VIEWPORT: 顶栏是等宽的游戏图标 + 站名 + 「模组 / 光影 / 安装说明」三个 tab + GitHub。下面是整屏高的应用窗口：左侧 360px 实例栏，每行一个方块图标（16×16 像素艺术风格的自绘 SVG）、名称、加载器与版本；右侧详情面板顶部是选中项的大标题与一句话简介，下面一排测量值（游戏版本 / 加载器 / 文件大小 / 更新时间），再下面真正的下载按钮。窗口底部一条状态栏显示实例计数和「全部本地托管，无中转页」。

FORM: 启动器实例面板（骰子指派，我梯度排序第 3 位）。seed:9811f0918e6cec43

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
