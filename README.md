# tzixi.cn

tzixi 的 Minecraft 模组与光影配置展示站。纯静态，零成本：Bun 管依赖和构建，Vite 出静态产物，Vercel 免费版托管，大文件走 GitHub Releases。

```
bun install
bun run dev        # 本地开发 http://localhost:5173
bun run build      # 产出 dist/
bun run preview    # 预览构建结果
```

## 改内容，只动 `src/content/`

| 想改什么 | 改哪个文件 |
| --- | --- |
| 站名、域名、GitHub 仓库 | `src/content/site.ts` |
| 模组清单 | `src/content/mods.ts` |
| 光影参数清单 | `src/content/shaders.ts` |
| 字段类型（加新字段时） | `src/content/types.ts` |

页面、样式、交互都不用碰，改完数据 `bun run build` 就是新站。

## 加一个模组（从上传到网站上能下）

### 1. 建 Release

1. 打开 `https://github.com/tangzixi0724/tzixi_web/releases/new`
2. **Tag** 填模组的 slug，比如 `aurelia-lanterns`（这个 tag 一辈子只用建一次，之后所有版本都往同一个 Release 里传）
3. 标题写模组名
4. 把 `.jar` 拖进附件区

> GitHub 单个 Release 附件上限 2 GB，下载流量不计量、不收费。这就是它比把文件塞进 Vercel 强的地方：Vercel 免费版整个部署只有 100 MB 上传额度，而且下载流量要吃每月 100 GB。

### 2. 拿到文件名

附件的文件名必须和 `src/content/mods.ts` 里 `fileName` 一模一样，包括大小写。链接是靠 tag + 文件名拼出来的：

```
https://github.com/tangzixi0724/tzixi_web/releases/download/<tag>/<fileName>
```

站里的 `releaseUrl('aurelia-lanterns', 'aurelia-lanterns-1.4.2_1.21.4-fabric.jar')` 生成的就是这个。

### 3. 在 `mods.ts` 里加一条

```ts
{
  id: 'my-mod',                    // 站内唯一，不改
  name: '我的模组',
  slug: 'my-mod-build',            // 第二行小字显示的英文名
  tagline: '一句话说清它解决什么问题。',
  icon: 'cube',                    // portal | lantern | cube | bolt | gear | book | prism | moon | leaf
  loaders: ['fabric'],
  gameVersions: ['1.21.4'],
  categories: ['工具'],
  version: '1.0.0',
  updatedAt: '2026-10-17',
  summary: ['第一段：它是什么。', '第二段：怎么用、有什么取舍。'],
  notes: ['装之前必须知道的事。'],
  changelog: [{ version: '1.0.0', date: '2026-10-17', changes: ['第一个版本。'] }],
  files: [
    { fileName: 'my-mod-1.0.0.jar', size: '320 KB', url: releaseUrl('my-mod-build', 'my-mod-1.0.0.jar'), primary: true },
  ],
},
```

### 4. 还没打算上传的文件

`url` 填 `NOT_UPLOADED`（从 `site.ts` 导入）。界面上这个文件会显示成「未上传」的不可点击状态，不会变成死链。**别填假链接**。

## 加一套光影参数

光影是「参数配方」，不是模组：

1. 把一个 Release 建在 tag `你的预设 slug` 上，把整包配置（zip）传上去
2. 在 `shaders.ts` 里加一条，`params` 数组填要展示的 key/value，`file` 填 zip 的下载信息
3. 访客可以整包下载，也可以在参数表里点任意一行单独复制

## 部署到 Vercel（一次性配置，之后每次 push 自动更新）

1. `github.com/new` 建空仓库 `tzixi_web`（已存在就跳过），把本项目推上去：

   ```bash
   git init
   git add .
   git commit -m "init"
   git branch -M main
   git remote add origin https://github.com/tangzixi0724/tzixi_web.git
   git push -u origin main
   ```

2. 打开 [vercel.com/new](https://vercel.com/new)，用 GitHub 登录，Import 这个仓库。
3. 框架会被 `vercel.json` 自动识别（Vite），构建命令 `bun run build`，输出目录 `dist`。什么都不用改，点 Deploy。
4. 绑域名：项目 → Settings → Domains → 输入 `tzixi.cn`。然后去域名注册商改两条 DNS：

   | 类型 | 主机记录 | 值 |
   | --- | --- | --- |
   | A | `@` | `76.76.21.21` |
   | CNAME | `www` | `cname.vercel-dns.com` |

   > Vercel 面板上显示的值优先——它偶尔会变，以面板为准。DNS 生效一般几分钟，证书自动签发。

5. 完成。之后 `git push` 就会自动部署，PR 还会有预览链接。

## 为什么这套组合是零成本的

| 环节 | 用的是什么 | 免费额度 |
| --- | --- | --- |
| 构建与托管 | Vercel Hobby | 静态文件不限次访问，每月 100 GB 出站流量、100 万次请求 |
| 源码 | GitHub 公开仓库 | 免费 |
| 模组 / 光影文件 | GitHub Releases | 单文件 2 GB，下载不限量、不计费 |
| 字体 | 自托管进仓库（`public/fonts/`） | 无第三方请求 |
| 域名 | 你自己已有的 `tzixi.cn` | 只有域名本身的续费 |

唯一的硬约束：**Vercel 免费版只能用于非商业的个人项目**（[fair use](https://vercel.com/docs/limits/fair-use-guidelines)）。挂广告、卖下载、接赞助商就算商业用途，会被要求升级。纯作品展示完全没问题。

## 什么时候需要换方案

- **单次部署超过 100 MB**：现在不会，因为 jar 全在 Release，仓库只有代码。但如果哪天要往 `public/` 塞大图，注意这个上限。
- **月出站流量超过 100 GB**：按一个模组 500 KB 算，100 GB ≈ 20 万次下载/月。真到这个量，把 `dist` 换成 Cloudflare Pages（无限流量）只需要改一次部署配置，代码不用动。
- **需要评论、下载计数、后台**：那就要后端了。下一步最省事的做法是 Vercel + Supabase 的免费额度，或者干脆把统计交给 GitHub Release 自带的下载计数。

## 目录

```
src/
  content/        数据层（改内容只改这里）
  components/     顶栏、实例列表、详情面板、像素图标
  styles/         分层 CSS：变量 → 布局 → 列表 → 详情 → 响应式
  App.tsx         状态与页面拼装
  lib/useCopy.ts  复制交互
public/
  fonts/          自托管的 Archivo + Spline Sans Mono + Noto Sans SC 切片
  og.png          社交分享图（scripts/og.mjs 生成）
scripts/
  fetch-cjk-font.py  重新拉取中文字体切片（一般不用跑）
  og/                share 图的 HTML 模板
  og.mjs             重新生成 share 图
  screenshots.mjs    本地预览起好后，批量截图（需要 Chrome，路径可用 CHROME_PATH 覆盖）
  check.mjs          交互与溢出回归检查（键盘切换、复制、空态、六种视口）
```
