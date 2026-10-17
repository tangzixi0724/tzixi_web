import type { Mod } from './types';
import { releaseUrl } from './site';

/**
 * 模组清单。这是全站唯一的模组数据源。
 *
 * 内容全部来自各 jar 里的 fabric.mod.json / mods.toml 与 lang/zh_cn.json，
 * 不是编的：描述、依赖、作者、版本都以 jar 内元数据为准。
 *
 * 上传流程见 README：把 jar 传到 GitHub Release，tag 用 slug，
 * 文件名和这里的 fileName 一字不差，链接就自动生效。
 */
export const mods: Mod[] = [
  {
    id: 'glb2lt',
    name: 'GLB 转小方块',
    slug: 'glb2lt',
    tagline: '把 glTF / GLB 模型直接变成世界里的真实 LittleTiles 体素方块。',
    icon: 'cube',
    iconImage: '/icons/glb2lt.png',
    loaders: ['forge'],
    gameVersions: ['1.20.1'],
    categories: ['工具', '建筑'],
    version: '1.31.0',
    updatedAt: '2026-10-12',
    summary: [
      '导入 glTF 2.0 模型（.glb / .gltf），转换成一格一格真实的 LittleTiles 体素：每个体素都是一个普通 tile，带着模型原本的颜色，所以转换完可以用 LittleTiles 自己的工具切开、上色、复制、做成蓝图。',
      '在游戏里输入 /glb2lt 查看用法。模型文件从游戏目录下的 glb2lt 文件夹读取。',
    ],
    notes: [
      '必须同时装 LittleTiles（1.6.0 以上）和 CreativeCore（2.12.30 以上），缺一个都起不来。',
      '只支持 Forge，且只支持 1.20 到 1.21 之间的版本（mods.toml 里写的是 [1.20,1.21)）。',
      '转换是实打实的体素，模型三角面多的时候会有可观的方块数量，放之前先想好区域大小。',
    ],
    changelog: [
      {
        version: '1.31.0',
        date: '2026-10-12',
        changes: ['当前发布版本。'],
      },
    ],
    files: [
      {
        fileName: 'glb2lt-1.31.0_1.20.1.jar',
        size: '195 KB',
        url: releaseUrl('glb2lt', 'glb2lt-1.31.0_1.20.1.jar'),
        primary: true,
        gameVersion: '1.20.1',
      },
    ],
  },
  {
    id: 'cinebars',
    name: '电影挡条',
    slug: 'cinematic-bars',
    tagline: '按住一个键，画面上下压出电影黑边。不依赖光影，所有整合包通用。',
    icon: 'prism',
    iconImage: '/icons/cinebars.png',
    loaders: ['fabric'],
    gameVersions: ['26.3', '1.21.10'],
    categories: ['视觉', '客户端'],
    version: '1.0.0',
    updatedAt: '2026-10-16',
    summary: [
      '把 AstraLex 光影里那个「潜行出黑边」的效果单独拎出来做成了模组，所以不需要开任何光影也能用。挡条高度、内侧边缘羽化、展开时长、缓动曲线、触发键全部可调。',
      '默认按住左 Shift 出现。有一条「隐藏 HUD 时仍然显示」的开关，配合 F1 可以录出干净的画面。',
    ],
    notes: [
      '纯客户端模组，服务端不用装，也不会影响服务器判定。',
      '1.21.10 与 26.3 是两个独立的构建，各下各的那个；装错了游戏直接启动不了。',
      '需要 Fabric API。想要图形化设置界面还需要 YACL（Yet Another Config Lib）和 Mod Menu。',
    ],
    changelog: [
      {
        version: '1.0.0',
        date: '2026-10-16',
        changes: [
          '首个版本：挡条高度、边缘羽化、变化时长、10 种缓动曲线、触发键全部可调。',
          '同时提供 1.21.10 与 26.3 两个构建。',
        ],
      },
    ],
    files: [
      {
        fileName: 'cinematic-bars-1.0.0_26.3.jar',
        size: '32 KB',
        url: releaseUrl('cinematic-bars', 'cinematic-bars-1.0.0_26.3.jar'),
        primary: true,
        gameVersion: '26.3',
      },
      {
        fileName: 'cinematic-bars-1.0.0_1.21.10.jar',
        size: '32 KB',
        url: releaseUrl('cinematic-bars', 'cinematic-bars-1.0.0_1.21.10.jar'),
        primary: false,
        gameVersion: '1.21.10',
      },
    ],
  },
  {
    id: 'betterfallingleaves',
    name: '落叶纷飞',
    slug: 'better-falling-leaves',
    tagline: '树叶会掉下来，打着旋儿，被风吹着走，最后落在地上。',
    icon: 'leaf',
    iconImage: '/icons/leaves.png',
    loaders: ['fabric'],
    gameVersions: ['26.3'],
    categories: ['视觉', '氛围', '客户端'],
    version: '1.0.0',
    updatedAt: '2026-10-17',
    summary: [
      '把 BetterFoliage 的落叶粒子效果单独移植到 26.3：叶方块会甩出旋转的叶片，叶片顺着全局风飘，下雨和雷暴时风更大，落地后停在地上。',
      '风力不是随便吹的：可以开启「自然风」，按真实风廓线 u(z) = u10 × (z/10)^α 计算，越高的地方风越大，午后最强、清晨最弱，还在几十秒的尺度上缓慢起伏形成阵风。地表粗糙度从开阔水面 0.12 一路到密集城市 0.30。',
    ],
    notes: [
      '纯客户端模组，服务端不用装。',
      '只支持 26.3，而且是 Fabric；需要 Fabric API 与 Java 25。',
      '樱花和苍白橡树原版就有落叶粒子，默认交给原版处理，不然会叠成两层。',
      '装了 YACL 会多一个游戏内设置界面，不装也能跑，只是只能改配置文件。',
    ],
    changelog: [
      {
        version: '1.0.0',
        date: '2026-10-17',
        changes: [
          'BetterFoliage 落叶效果的独立移植版，首次发布。',
          '加入全局风模型：柔风 / 风暴两档强度、三种风向模式、自然风廓线、阵风起伏。',
          '五个树种的落叶粒子（橡木、白桦、云杉、丛林、樱花）。',
        ],
      },
    ],
    files: [
      {
        fileName: 'better-falling-leaves-1.0.0_26.3.jar',
        size: '61 KB',
        url: releaseUrl('better-falling-leaves', 'better-falling-leaves-1.0.0_26.3.jar'),
        primary: true,
        gameVersion: '26.3',
      },
    ],
  },
];
