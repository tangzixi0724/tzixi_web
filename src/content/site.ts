/**
 * 站点元信息：改这里就能改全站的身份信息。
 * 域名、仓库、作者，都只在这一处出现。
 */
export const site = {
  name: 'tzixi',
  domain: 'tzixi.cn',
  url: 'https://tzixi.cn',
  githubUser: 'tangzixi0724',
  githubRepo: 'tangzixi0724/tzixi_web',
  githubUrl: 'https://github.com/tangzixi0724/tzixi_web',
  host: 'Vercel · 静态托管',
  /**
   * 示例内容开关。为 true 时站点顶部会出现一条说明，告诉访客这些条目是示例，
   * 因为示例里的 Release 链接并不指向真实文件。换成你自己的内容后改成 false。
   */
  sampleContent: true,
} as const;

/**
 * GitHub Release 资产直链。
 *
 * 约定：每个作品对应一个 Release，tag 就是它的 slug（见 src/content/mods.ts 里的
 * releaseTag）。这样同一个作品的多个版本可以一直往这个 Release 里加文件，
 * 文件名带版本号，链接永久有效、也不会被 CDN 缓存成旧文件。
 *
 * 例：https://github.com/tangzixi0724/tzixi_web/releases/download/aurelia-lanterns/aurelia-lanterns-1.4.2.jar
 */
export function releaseUrl(tag: string, fileName: string): string {
  return `https://github.com/${site.githubRepo}/releases/download/${tag}/${encodeURIComponent(fileName)}`;
}

/** 尚未上传文件时用空字符串，界面会渲染成不可用状态而不是死链 */
export const NOT_UPLOADED = '';
