export type Loader = 'fabric' | 'neoforge' | 'forge';
export type ShaderApi = 'iris' | 'optifine';

export interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
}

export interface DownloadFile {
  /** 文件在 GitHub Release 里的原始文件名 */
  fileName: string;
  size: string;
  /** 直链。留空表示还没上传，界面会给出对应状态 */
  url: string;
  /** 主文件 / 兼容文件 */
  primary: boolean;
  /**
   * 这个构建对应的游戏版本。一个模组支持多个游戏版本时必填，
   * 否则访客只能靠文件名里的数字猜自己该下哪个。
   */
  gameVersion?: string;
}

export interface Mod {
  id: string;
  name: string;
  /** 英文副名，列表里用等宽字体显示 */
  slug: string;
  tagline: string;
  /** 自绘像素图标的兜底 */
  icon: IconName;
  /** jar 里自带的真实图标（public/icons/*），有就优先用 */
  iconImage?: string;
  loaders: Loader[];
  gameVersions: string[];
  categories: string[];
  version: string;
  updatedAt: string;
  summary: string[];
  notes: string[];
  /** 最近几次更新的记录，最新的在最上面 */
  changelog: ChangelogEntry[];
  files: DownloadFile[];
}

export interface ShaderParam {
  key: string;
  value: string;
  note: string;
}

export interface ShaderPreset {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  /** 基于哪个光影包 */
  base: string;
  baseVersion: string;
  icon: IconName;
  iconImage?: string;
  apis: ShaderApi[];
  gameVersions: string[];
  updatedAt: string;
  summary: string[];
  /** 适用场景与显卡档位 */
  target: { scene: string; gpu: string; fps: string };
  params: ShaderParam[];
  notes: string[];
  changelog: ChangelogEntry[];
  /** 整包参数文件（zip 或 txt），放 GitHub Release */
  file: { fileName: string; size: string; url: string } | null;
}

export type IconName =
  | 'portal'
  | 'lantern'
  | 'cube'
  | 'bolt'
  | 'gear'
  | 'book'
  | 'prism'
  | 'moon'
  | 'leaf';

export const LOADER_LABEL: Record<Loader, string> = {
  fabric: 'Fabric',
  neoforge: 'NeoForge',
  forge: 'Forge',
};

export const API_LABEL: Record<ShaderApi, string> = {
  iris: 'Iris',
  optifine: 'OptiFine',
};
