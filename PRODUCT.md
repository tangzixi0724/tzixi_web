# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

原文要求使用 Bun 构建，部署目标为 Vercel 免费版（Hobby）。选定方案：Bun 负责依赖安装、开发与构建脚本（`bun install` / `bun run dev` / `bun run build`），应用层为 Vite + React + TypeScript 的纯静态 SPA，`bun run build` 产出 `dist/` 静态目录，Vercel 以零配置静态站点部署，不产生函数调用。

模组 `.jar` 与光影配置包不进入 Git 仓库，托管在 GitHub Releases（`tangzixi0724/tzixi_web`）并通过 `downloadUrl` 字段直链；网站本体只存 JSON 元数据。理由：Vercel Hobby 单次静态上传上限 100MB、每月 Fast Data Transfer 100GB，而 GitHub Releases 存储与下载带宽免费，可保站点永久零成本。

## Users

中文 Minecraft 玩家为主：从视频、群聊或 Modrinth/CurseForge 页面点到这里的玩家，手里已经装好了 Fabric / NeoForge / Forge 整合包，想快速确认「这个模组适不适合我的游戏版本、光影配置能不能直接套用」，然后下载。

第二类是同为模组作者与光影爱好者的人，来看参数是怎么调的。

## Product Purpose

个人作品发布页：把作者自己写的 Minecraft 模组和自己调好的光影配置文件集中展示，让访客在一分钟内看懂每个东西是什么、适配什么版本/加载器、怎么装，然后一键下载。

成功 = 访客不需要问「下哪个、怎么装」，下载链接点下去就是真文件。

## Positioning

一手发布渠道，而不是又一个聚合站：每个条目都标注真实适配的加载器与游戏版本、真实的文件大小与更新日期，下载全部走作者自己的 GitHub Release 直链，没有广告中转页、没有第三方跳转、没有「注册后下载」。

## Operating Context

- 访客熟悉 Minecraft 的版本号语法（`1.21.1`、`1.20.1`）与加载器（Fabric / NeoForge / Forge），并知道模组必须与加载器和游戏版本同时对上。
- 光影配置文件的安装方式是放进 `.minecraft/shaderpacks/` 内的光影包目录，用 Iris 或 OptiFine 载入；作者提供的是「参数配方」，访客多数会照着手动改，少数会直接下整包。
- 下载动作发生在桌面浏览器，但很多访客是从手机上先看一眼再决定要不要开电脑。

## Capabilities and Constraints

已确认功能：浏览模组与光影配置、按加载器与游戏版本筛选、查看详情、点击下载、复制配置参数、安装步骤说明。

约束：
- 全站零成本。Vercel Hobby 仅限非商业个人使用（fair use），不能挂广告、不能接付费下载。
- 仓库与站点必须很小（Hobby 单次静态上传 100MB）；大文件只能在 GitHub Releases。
- 域名 `tzixi.cn`，已持有，绑定到 Vercel。
- 内容语言：中文为主。
- 尚未确定的字段：模组真实清单、光影配置真实参数、作者显示名与头像。

## Brand Commitments

- 仓库 `github.com/tangzixi0724/tzixi_web`，作者 ID `tangzixi0724`，域名 `tzixi.cn`。
- 语气：自己人的口吻，直接说清适配版本和踩过的坑，不写营销话术。

## Evidence on Hand

目前没有任何真实模组文件、光影配置、下载链接、下载量或用户评价。站点首版使用明确标注为示例的占位条目，`src/content/` 是唯一数据源，替换成真实内容即可上线；不得虚构下载量、评分、用户评价或奖项。

## Product Principles

1. 适配信息（加载器 + 游戏版本 + 文件大小）比视觉包装更重要，必须出现在列表层，不能藏在详情里。
2. 下载是一等动作：每个条目在任何视口下都能一步点到真实链接。
3. 内容可替换：所有文案、版本、链接来自一份结构化数据，改数据不改组件。
4. 移动端能读完再决定，桌面端能直接下载。

## Accessibility & Inclusion

未确立特定标准。默认保证键盘可操作、焦点可见、正文对比度达标、`prefers-reduced-motion` 下不播放装饰动画。
