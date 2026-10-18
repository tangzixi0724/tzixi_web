export type Loader = 'fabric' | 'neoforge' | 'forge';

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

export type IconName = 'cube' | 'bolt' | 'gear' | 'book' | 'prism' | 'moon' | 'leaf';

export const LOADER_LABEL: Record<Loader, string> = {
  fabric: 'Fabric',
  neoforge: 'NeoForge',
  forge: 'Forge',
};
