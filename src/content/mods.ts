import type { Mod } from './types';
import { releaseUrl, NOT_UPLOADED } from './site';

/**
 * 模组清单。这是全站唯一的模组数据源。
 *
 * 新增一个模组 = 往数组里加一个对象。
 * 上传流程见 README：把 jar 传到 GitHub Release，tag 用 latest，
 * 文件名和这里的 fileName 一致，链接就自动生效。
 */
export const mods: Mod[] = [
  {
    id: 'aurelia',
    name: '晨曦灯笼',
    slug: 'aurelia-lanterns',
    tagline: '给洞穴一套会呼吸的光源层级，而不是再塞一根火把。',
    icon: 'lantern',
    loaders: ['fabric', 'neoforge'],
    gameVersions: ['1.21.4', '1.21.1', '1.20.6'],
    categories: ['装饰', '光照'],
    version: '1.4.2',
    updatedAt: '2026-09-28',
    summary: [
      '晨曦灯笼加了一整套可调档位的挂灯：黄铜、琉璃、苔石三种材质，每种都有三档亮度与两种光色。',
      '方块本身用原版光照引擎，不注入自定义光追，所以低配机器也能开。挂灯可以被红石调光，也可以被雨水熄灭再用打火石点回来。',
    ],
    notes: [
      '需要 Fabric API 或 NeoForge 自带的 API，其余依赖零。',
      '与 Sodium、Iris 的着色器光照兼容；与旧版 OptiFine 的内置光影会有轻微光斑，属于已知问题。',
      '服务端也要装，否则客户端只看到方块没有动态亮度。',
    ],
    changelog: [
      {
        version: '1.4.2',
        date: '2026-09-28',
        changes: [
          '修复红石调光在区块重新加载后回到满亮度的问题。',
          '琉璃灯罩的渲染不再吞掉相邻方块的光照等级。',
          '1.21.4 与 1.21.1 合并为同一份构建。',
        ],
      },
      {
        version: '1.4.0',
        date: '2026-08-02',
        changes: ['新增苔石材质的三档亮度挂灯。', '打火石点亮加入声音反馈。'],
      },
    ],
    files: [
      {
        fileName: 'aurelia-lanterns-1.4.2_1.21.4-fabric.jar',
        size: '412 KB',
        url: releaseUrl('aurelia-lanterns', 'aurelia-lanterns-1.4.2_1.21.4-fabric.jar'),
        primary: true,
      },
      {
        fileName: 'aurelia-lanterns-1.4.2_1.21.1-neoforge.jar',
        size: '418 KB',
        url: NOT_UPLOADED,
        primary: false,
      },
    ],
  },
  {
    id: 'strata',
    name: '地层测绘',
    slug: 'strata-survey',
    tagline: '把整条矿脉的走向画出来，而不是让你一层层往下挖。',
    icon: 'cube',
    loaders: ['fabric'],
    gameVersions: ['1.21.4', '1.21.1'],
    categories: ['工具', '信息'],
    version: '0.9.1',
    updatedAt: '2026-08-14',
    summary: [
      '手持测绘镜扫描一块矿石，周围 24 格内同种矿脉会被半透明描边标出，并在小地图边缘给出方向指示。',
      '结果按区块缓存，重复扫描同一片区域几乎不耗性能；数据只存在客户端，服务器察觉不到。',
    ],
    notes: [
      '实验性版本：多人服务器里如果开了反作弊，描边可能被判为异常客户端，上服前先问服主。',
      '需要 Fabric API 与 Cloth Config（用于调描边颜色）。',
    ],
    changelog: [
      {
        version: '0.9.1',
        date: '2026-08-14',
        changes: ['区块缓存改为弱引用，长时间游玩不再堆积内存。', '描边颜色可以在 Cloth Config 里调透明度了。'],
      },
      {
        version: '0.9.0',
        date: '2026-07-20',
        changes: ['第一个公开版本：矿脉描边与方向指示。'],
      },
    ],
    files: [
      {
        fileName: 'strata-survey-0.9.1_1.21.4-fabric.jar',
        size: '1.2 MB',
        url: releaseUrl('strata-survey', 'strata-survey-0.9.1_1.21.4-fabric.jar'),
        primary: true,
      },
    ],
  },
  {
    id: 'quiet-hours',
    name: '静默时刻',
    slug: 'quiet-hours',
    tagline: '让整片区域安静下来：自定义的钟声、风声与雨声。',
    icon: 'moon',
    loaders: ['fabric', 'neoforge', 'forge'],
    gameVersions: ['1.21.1', '1.20.1'],
    categories: ['音频', '氛围'],
    version: '2.0.0',
    updatedAt: '2026-06-02',
    summary: [
      '按生物群系与时间叠加环境音层，白天与夜晚有各自的底噪，暴风雨会盖掉一切。',
      '所有音源都是可替换的资源包格式，想换成自己的采样直接丢进 `assets/quiet_hours/sounds`。',
    ],
    notes: [
      '三个加载器共用一套资源与逻辑，jar 分开打包。',
      '1.20.1 的 Forge 版本是长期维护分支，不会再跟进新特性。',
    ],
    changelog: [
      {
        version: '2.0.0',
        date: '2026-06-02',
        changes: [
          '音源全部改为资源包格式，可以直接替换成自己的采样。',
          '暴风雨会覆盖其它环境音层，不再打架。',
          'Forge 1.20.1 转入长期维护，只修 bug。',
        ],
      },
      {
        version: '1.6.3',
        date: '2026-03-11',
        changes: ['修复进入下界后风声不停止的问题。'],
      },
    ],
    files: [
      {
        fileName: 'quiet-hours-2.0.0_1.21.1-fabric.jar',
        size: '3.8 MB',
        url: releaseUrl('quiet-hours', 'quiet-hours-2.0.0_1.21.1-fabric.jar'),
        primary: true,
      },
      {
        fileName: 'quiet-hours-2.0.0_1.20.1-forge.jar',
        size: '3.8 MB',
        url: releaseUrl('quiet-hours', 'quiet-hours-2.0.0_1.20.1-forge.jar'),
        primary: false,
      },
    ],
  },
  {
    id: 'ledger',
    name: '备忘石板',
    slug: 'ledger-slate',
    tagline: '写在游戏里的项目管理：任务、坐标、待办，全在一个方块的界面里。',
    icon: 'book',
    loaders: ['fabric', 'neoforge'],
    gameVersions: ['1.21.4', '1.21.1'],
    categories: ['工具', '多人'],
    version: '1.1.0',
    updatedAt: '2026-10-06',
    summary: [
      '备忘石板是一个可放置的方块，右键打开分栏界面：任务清单、坐标书签、材料清单。',
      '放在服务器上时内容存在世界存档里，所有人共享同一块石板；放在单人存档里就是单纯的笔记。',
    ],
    notes: [
      '内容随区块保存，石板被破坏时会掉落一份写满的副本，不会丢数据。',
      '与地图模组同屏使用时界面可能重叠，已在设置里留了「紧凑模式」开关。',
    ],
    changelog: [
      {
        version: '1.1.0',
        date: '2026-10-06',
        changes: [
          '新增「紧凑模式」，与地图模组同屏时不再互相遮挡。',
          '石板被破坏时掉落写满的副本，内容不会丢。',
        ],
      },
      {
        version: '1.0.0',
        date: '2026-09-01',
        changes: ['第一个正式版：任务清单、坐标书签、材料清单。'],
      },
    ],
    files: [
      {
        fileName: 'ledger-slate-1.1.0_1.21.4-fabric.jar',
        size: '694 KB',
        url: releaseUrl('ledger-slate', 'ledger-slate-1.1.0_1.21.4-fabric.jar'),
        primary: true,
      },
      {
        fileName: 'ledger-slate-1.1.0_1.21.4-neoforge.jar',
        size: '701 KB',
        url: NOT_UPLOADED,
        primary: false,
      },
    ],
  },
];
