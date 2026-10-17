import type { ShaderPreset } from './types';
import { releaseUrl } from './site';

/**
 * 光影参数配置。作者自己调好的参数配方，附可下载的整包配置。
 *
 * 参数表里的 key 写在游戏内的光影设置界面里，value 就是要填的值。
 */
export const shaders: ShaderPreset[] = [
  {
    id: 'noon-clear',
    name: '正午通透',
    slug: 'noon-clear',
    tagline: '保留原版色彩倾向，只把光照层次拉开一档。日常挂机用。',
    base: 'Complementary Reimagined',
    baseVersion: 'r5.3',
    icon: 'prism',
    apis: ['iris', 'optifine'],
    gameVersions: ['1.21.4', '1.21.1'],
    updatedAt: '2026-09-19',
    summary: [
      '从 Complementary Reimagined 的 High 预设出发，主要动了曝光曲线与阴影软硬度：把下午的直射光压暗一点，让洞穴里的层次更明显，同时保留它原本那种偏暖的胶片感。',
      '适合建筑截图和日常生存，白天不会有眩光过曝，夜晚亮度足以看清脚下又不至于像白天。',
    ],
    target: {
      scene: '建筑展示 / 日常生存',
      gpu: 'GTX 1660 或同级以上',
      fps: '1080p 约 90–120 帧',
    },
    params: [
      { key: 'LIGHT_SHADOW_SOFTNESS', value: '1.35', note: '阴影边缘变软，方块投影不会像刀切' },
      { key: 'EXPOSURE_DAY', value: '0.94', note: '白天整体压暗 6%，高光不再发白' },
      { key: 'EXPOSURE_NIGHT', value: '1.18', note: '夜晚提亮，保留洞穴可见度' },
      { key: 'AMBIENT_OCCLUSION', value: 'HIGH', note: '墙角与方块接缝的暗部' },
      { key: 'CLOUD_STYLE', value: 'VOLUMETRIC', note: '体积云，飞行视角不会穿帮' },
      { key: 'WATER_WAVES', value: 'ON', note: '水面法线波动，浅水更通透' },
      { key: 'SHADOW_RESOLUTION', value: '2048', note: '2080 级别以下建议不要拉到 4096' },
      { key: 'COLOR_GRADING', value: 'WARM_FILM', note: '保留原预设的暖调胶片感' },
    ],
    notes: [
      '整包配置是光影包目录里的 `.txt` 参数文件，解压后覆盖同名文件即可，别忘了先备份原文件。',
      '用 Iris 的话，直接在光影设置界面右上角点「导入」选择下载的配置文件更快。',
    ],
    changelog: [
      {
        version: 'r5.3 版',
        date: '2026-09-19',
        changes: [
          '跟着 Complementary 更新到 r5.3，重新校准了曝光曲线。',
          '阴影软化值从 1.1 调到 1.35，配合新版的光照衰减。',
        ],
      },
    ],
    file: {
      fileName: 'noon-clear-r5.3-complementary.zip',
      size: '6 KB',
      url: releaseUrl('noon-clear', 'noon-clear-r5.3-complementary.zip'),
    },
  },
  {
    id: 'cave-depth',
    name: '洞穴纵深',
    slug: 'cave-depth',
    tagline: '为地下挖矿调的：黑得下去，也亮得起来。',
    base: 'Complementary Reimagined',
    baseVersion: 'r5.3',
    icon: 'portal',
    apis: ['iris'],
    gameVersions: ['1.21.4', '1.21.1', '1.20.6'],
    updatedAt: '2026-08-30',
    summary: [
      '把环境光的衰减拉得更狠，让火把与岩浆成为真正的主光源；代价是没插火把的洞穴会伸手不见五指，请配合夜视药水或信标使用。',
      '在深板岩层尤其好看：矿物的自发光度、细碎的扬尘、远处的水流声都更清楚。',
    ],
    target: {
      scene: '洞穴探险 / 录视频',
      gpu: 'RTX 3060 或同级以上',
      fps: '1080p 约 70–100 帧',
    },
    params: [
      { key: 'LIGHT_SHADOW_SOFTNESS', value: '0.85', note: '阴影更硬，火光边缘更分明' },
      { key: 'EXPOSURE_NIGHT', value: '0.86', note: '夜晚压暗，让火把成为主光' },
      { key: 'BLOCKLIGHT_STRENGTH', value: '1.45', note: '方块光源强度，火把照得更远' },
      { key: 'FOG_DENSITY', value: '0.62', note: '洞穴雾更浓，纵深更明显' },
      { key: 'GODRAYS', value: 'ON', note: '竖井与水面开口的光柱' },
      { key: 'SHADOW_RESOLUTION', value: '2048', note: '与正午通透一致，省显存' },
      { key: 'PARTICLE_DUST', value: 'ON', note: '空气中的悬浮尘埃' },
      { key: 'COLOR_GRADING', value: 'COOL_CAVE', note: '冷偏色，强调岩石质感' },
    ],
    notes: [
      '不适合建筑截图：没火光的地方基本全黑，是刻意的。',
      '嫌太黑就把 `EXPOSURE_NIGHT` 调到 1.05，其它别动，否则洞穴雾会跟着变淡。',
    ],
    changelog: [
      {
        version: 'r5.3 版',
        date: '2026-08-30',
        changes: ['方块光强度从 1.2 提到 1.45，配合新的雾密度。', '去掉了一档过曝的夜视叠加。'],
      },
    ],
    file: {
      fileName: 'cave-depth-r5.3-complementary.zip',
      size: '6 KB',
      url: releaseUrl('cave-depth', 'cave-depth-r5.3-complementary.zip'),
    },
  },
  {
    id: 'rainy-day',
    name: '雨天慢镜',
    slug: 'rainy-day',
    tagline: '雨、雾、湿地面反光，专门为阴天氛围调的一组。',
    base: 'BSL Shaders',
    baseVersion: 'v8.2',
    icon: 'leaf',
    apis: ['iris', 'optifine'],
    gameVersions: ['1.21.1', '1.20.6'],
    updatedAt: '2026-07-11',
    summary: [
      '基于 BSL 的雨雾表现加强：雨中镜头会有轻微水痕，地面湿润度随时间累积，雨停后逐渐变干。',
      '晴天的观感会比原预设灰一档，这是为了落差感刻意做的取舍。',
    ],
    target: {
      scene: '氛围截图 / 剧情向录屏',
      gpu: 'GTX 1650 或同级以上',
      fps: '1080p 约 100–130 帧',
    },
    params: [
      { key: 'WET_SURFACE', value: 'ON', note: '雨天方块表面湿润反光' },
      { key: 'RAIN_REFLECTION', value: '0.8', note: '雨滴在地面的反射强度' },
      { key: 'FOG_DENSITY', value: '0.78', note: '远山与雨天雾距' },
      { key: 'EXPOSURE_DAY', value: '0.88', note: '阴天不通透，压低高光' },
      { key: 'CLOUD_STYLE', value: 'VANILLA_PLUS', note: '低空厚云，配合雨天' },
      { key: 'TAA_SHARPNESS', value: '0.4', note: '湿地面反光时减少锯齿抖动' },
    ],
    notes: [
      'BSL 的雨雾参数在 Iris 与 OptiFine 上表现略有差异，截图都来自 Iris。',
      '如果开 TAA 后画面发糊，把 `TAA_SHARPNESS` 调到 0.55。',
    ],
    changelog: [
      {
        version: 'v8.2 版',
        date: '2026-07-11',
        changes: ['湿地面表现重做，雨停后会逐渐变干。', 'TAA 锐度从 0.3 调到 0.4。'],
      },
    ],
    file: {
      fileName: 'rainy-day-v8.2-bsl.zip',
      size: '5 KB',
      url: releaseUrl('rainy-day', 'rainy-day-v8.2-bsl.zip'),
    },
  },
];
