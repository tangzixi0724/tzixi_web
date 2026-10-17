---
name: tzixi.cn
description: 个人 Minecraft 模组与光影参数的展示站，界面即启动器的实例面板
colors:
  void: "#080b0c"
  shell: "#0d1113"
  panel: "#11171a"
  raise: "#161d21"
  hover: "#1c2428"
  ink: "#eef3f1"
  ink-soft: "#bcc7c3"
  ink-dim: "#96a29e"
  ink-faint: "#828f8b"
  torch: "#ff7a2f"
  emerald: "#6fd08c"
  amber: "#d9a441"
  amethyst: "#a98bdc"
typography:
  display:
    fontFamily: "Archivo, Noto Sans SC, system-ui, sans-serif"
    fontSize: "clamp(28px, 3.2vw, 38px)"
    fontWeight: 660
    lineHeight: 1.15
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Archivo, Noto Sans SC, system-ui, sans-serif"
    fontSize: "14.8px"
    fontWeight: 400
    lineHeight: 1.72
    letterSpacing: "normal"
  label:
    fontFamily: "Spline Sans Mono, ui-monospace, monospace"
    fontSize: "10.5px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.08em"
rounded:
  none: "0"
  hair: "2px"
  control: "3px"
spacing:
  xs: "6px"
  sm: "10px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.torch}"
    textColor: "#1a0f07"
    rounded: "{rounded.control}"
    padding: "0 18px"
    height: "42px"
  button-primary-hover:
    backgroundColor: "#ff8b48"
    textColor: "#1a0f07"
  button-ghost:
    backgroundColor: "{colors.shell}"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.control}"
    padding: "0 18px"
    height: "42px"
  instance-row:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink-soft}"
    padding: "10px 14px"
    width: "100%"
---

# Design System: tzixi.cn

## Overview

**Creative North Star: "启动器面板"（The Launcher Panel）**

站点不是"关于模组的网页"，而是启动器里那个实例列表本身。左边一列实例，右边是选中实例的详情，窗口底部一条状态栏报数。访客认出这个界面，就同时理解了这里的文件是可以装进游戏的，以及它们各自适配什么版本。

密度是这套系统的性格：信息先于留白，但每一层都靠位置和刻线区分，不靠阴影和卡片。整个界面只有一种强调色，且只出现在两处——当前选中的那一行，和真正的下载按钮。

**Key Characteristics:**
- 近黑石板底，四级明度抬升，全部靠 1px 刻线分隔
- 火把橙是唯一强调色，占比极低
- 界面文字用 Archivo 可变字体，测量值用等宽字体
- 零投影、零圆角卡片、零渐变文字

## Colors

一套冷调石板灰，配一个暖橙强调，其余颜色都是"矿物料"状态色。

### Primary
- **火把橙 Torch** (#ff7a2f)：只出现在当前选中的实例行（左边框 + 背景渐隐）、主下载按钮、以及链接的可点击提示。全站任何一屏里它的面积都小于 3%。

### Neutral
- **虚空 Void** (#080b0c)：页面最外层底色，以及参数表、搜索框这类"凹陷"表面。
- **外壳 Shell** (#0d1113)：应用窗口本体与列表行背景。
- **面板 Panel** (#11171a)：左栏顶部渐变起点、下载侧栏卡片、方块图标底。
- **抬起 Raise** (#161d21)：悬停行、分段控件的选中态。
- **悬停 Hover** (#1c2428)：导航项与按钮的悬停背景。
- **正文 Ink** (#eef3f1)：标题与关键数值。
- **次级 Ink Soft** (#bcc7c3)：正文段落、列表行名称。
- **三级 Ink Dim** (#96a29e)：说明文字、未选中项。
- **四级 Ink Faint** (#828f8b)：标签、测量值的键名、页脚。

### Tertiary
- **荧光绿 Emerald** (#6fd08c)：光影参数表里的参数名（key），表示"这是会被写进配置文件的字面量"。
- **赭黄 Amber** (#d9a441)：注意事项前的方块标点、示例内容提示条。
- **紫水晶 Amethyst** (#a98bdc)：光影类条目的图标色，与模组的青灰形成类别区分。

### Named Rules
**唯一强调色规则（The One Torch Rule）。** 火把橙只允许出现在"当前选中"与"可执行下载"两种语义上。它一旦被用于装饰，整套界面的选中逻辑就失效了。

**刻线而非容器规则（The Score-Line Rule）。** 分隔用 1px 半透明线（`rgba(233,240,238,0.09)`），不用投影、不用卡片边框堆叠。深度靠明度台阶表达，不靠阴影。

## Typography

**Display Font:** Archivo（可变字重，宽度轴收到 88–92%）
**Body Font:** Archivo + Noto Sans SC（自托管，按 unicode-range 切成 101 片按需加载）
**Label/Mono Font:** Spline Sans Mono

**Character:** Archivo 带一点工程制图的机械感，收紧宽度轴后标题有压缩感但不夸张；等宽字体只承担测量值，让版本号、文件大小、参数值在视觉上自动成为"读数"。

### Hierarchy
- **Display** (660, clamp(28px, 3.2vw, 38px), 1.15, -0.035em)：详情面板的作品名，唯一的大字。
- **Headline** (620, clamp(20px, 2vw, 24px), 1.15, 88% stretch)：页面下方说明区的分节标题。
- **Title** (570, 14.5px, 1.4)：列表行里的作品名。
- **Body** (400, 14.8px, 1.72)：正文段落，最大宽度 68ch。
- **Label** (400, 10.5px, 0.08em, 等宽)：测量值的键名，全大写。

### Named Rules
**读数规则（The Reading Rule）。** 任何表示"数值"的东西——版本号、文件大小、日期、参数 key/value——必须用等宽字体。任何表示"叙述"的东西必须用 Archivo。这条线不许模糊。

## Layout

应用窗口是整套布局的核心：左栏固定 336px，右栏自适应，整块从顶部导航下 28px 开始，最小高度随视口变化（`clamp(520px, 100dvh - 128px, 900px)`），内容超过时窗口随内容增高，左栏以 `position: sticky` 跟随。

下移到 1080px：左栏收到 280px，详情内的"正文 + 下载侧栏"双栏折成单栏，下载卡片用 `order: -1` 提到正文之前——窄屏的访客最需要先拿到按钮。

下移到 860px：窗口变成上下两段，左栏退化为一条可横向滑动的实例条带（每项宽 `min(72vw, 240px)`，滚动吸附），选中项用底部 2px 橙线标记而不是左边框。

间距节奏：组件内 6–12px，组件间 20–28px，分节 40–64px，页脚前 48–88px。

## Elevation & Depth

**没有投影，也不打算有。** 深度完全由明度台阶承担：void → shell → panel → raise → hover 五级。唯一的"浮雕"是应用窗口顶部那道 1px 橙到透明的渐变高光，用来暗示启动器窗体的斜面。

需要让某块区域"凹下去"（参数表、搜索框、分段控件外框）时，用比周围更暗的 void 底色 + 1px 刻线，而不是内阴影。

## Shapes

圆角几乎为零：控件 3px、次级元素 2px、方块图标与标签 0。形状语言全部来自矩形与 1px 描边，和方块世界的正交感一致。图标是 16×16 的自绘像素网格（`BlockIcon`），每个像素对齐到 1 单位，用 crispEdges 渲染。

## Components

### Buttons
- **Shape:** 3px 圆角，最小高度 42px，内边距 0 18px。
- **Primary:** 火把橙底 + 深棕字（#1a0f07），字重 620；带一个 14×14 的下载箭头图标。
- **Hover / Focus:** 悬停时背景提亮到 #ff8b48；按下时 `translateY(1px)`；焦点环是 2px 火把橙外扩 2px。
- **Ghost:** 透明底 + `--line-strong` 描边，悬停时底色变为面板色、文字提亮。
- **Disabled:** 改成 1px 虚线描边 + 四级灰，`cursor: not-allowed`，用于"文件尚未上传"。

### Chips
- **Style:** 分类角标（MOD / SHADER）用 9.5px 等宽字体 + 1px 描边，0 圆角；作品类型标签（模组 / 光影参数）用 10px 无衬线 + 当前色描边。
- **State:** 光影类标签用紫水晶色，模组类用火把橙。

### Cards / Containers
- **Corner Style:** 0–3px。
- **Background:** 下载侧栏用 Panel 色，参数表用 Void 色。
- **Border:** 1px `--line`，不用投影。
- **Internal Padding:** 16px。

### Inputs / Fields
- **Style:** Void 底色 + 1px 刻线，左侧放大镜图标，高 32px。
- **Focus:** 边框转为 `--torch-dim`，不发光、不加外环。

### Navigation
- **Style:** 顶部 56px 高，等宽风格的品牌标记 + 三个文字链接 + GitHub 外链按钮。悬停只改文字色与背景，不加下划线。

### 实例行（签名组件）
列表里的一行实例：34px 方块图标 + 名称/加载器·版本两行 + 右侧 MOD/SHADER 角标。选中时左边框变成 2px 火把橙，背景是一道向左消散的橙光（`linear-gradient(90deg, rgba(255,122,47,0.12), transparent 92%)`），图标与名称同时提亮。方向键可以上下切换，切换后焦点跟着走。

### 参数行（签名组件）
光影参数表的一行：等宽参数名（荧光绿）在左、值（火把橙）在右、说明居中换行占满下沿。整行是一个按钮，点一下复制 `KEY=VALUE`，右侧图标从"复制"变成"对勾"，1.8 秒后复位。

## Do's and Don'ts

### Do:
- **Do** 保持火把橙只用于"当前选中"和"下载"两种语义。
- **Do** 用 1px 刻线和明度台阶表达层次，需要分隔时就画一条线。
- **Do** 让所有测量值走等宽字体并启用 `tabular-nums`。
- **Do** 在窄屏把下载按钮提正文之前。
- **Do** 用自绘的 16×16 像素图标，而不是图标字体或 emoji。

### Don't:
- **Don't** 给卡片加圆角、投影或发光边框。
- **Don't** 用渐变文字做强调，强调只靠字重和字号。
- **Don't** 在标题上方加 eyebrow / kicker 小标签。
- **Don't** 用霓虹青、紫色渐变这类"科技风"默认色，强调色只有火把橙一个。
- **Don't** 为了好看把版本号、加载器这些适配信息从列表层挪进详情或折叠区。
