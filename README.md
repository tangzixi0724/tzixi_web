# tzixi.cn

ZIXI 的 Minecraft 模组站。纯静态，没有构建步骤：仓库根目录就是站点根目录，改完文件推上去就是新站。

```
index.html            模组列表（首页）
cinematic-bars.html   电影挡条 · Cinematic Bars
bliss-seasons.html    四季流转 · Bliss Seasons
styles.css            共用纸面/字体/页头页脚/放映室
home.css  home.js     首页列表与封面动画
bliss.css bliss.js    四季页与换季卡片
app.js                电影挡条页的挡条模拟
season-core.js        四季的混色与权重算法（两页共用）
assets/               自托管字体子集、模组图标、桂花装饰
DESIGN.md             视觉方向、事实来源、交互与无障碍取舍
```

本地预览（任意静态服务器都行，不要用 `file://` 之外的路径拼接）：

```
python -m http.server 4173
# 打开 http://127.0.0.1:4173/
```

## 事实从哪来

页面上的每个数值都来自 jar 本身，不是估的：

- `fabric.mod.json`：id、版本、加载器与游戏版本要求、Java 版本、作者、许可证
- 配置类的常量池：每个默认值（挡条 8% / 羽化 22% / 600ms / SMOOTHSTEP；季节 30s / 过渡 2s / 四色）
- `lang/zh_cn.json`：所有设置项的中文名
- 缓动函数与混色逻辑：按反编译出的公式在 `app.js` / `season-core.js` 里逐条复刻，页面上的曲线小图和模拟画面都用同一份代码算

页面里的「模拟画面」是自己画的几何场景，不是录屏；两块场景都在 `figcaption` 里标了「模拟画面」。

## 下载

jar 不在仓库里，走 GitHub Releases：

```
https://github.com/tangzixi0724/tzixi_web/releases/download/<tag>/<文件名>
```

| 模组 | tag | 文件 |
| --- | --- | --- |
| 电影挡条 26.3 | `cinematic-bars` | `cinematic-bars-1.0.0_26.3.jar` |
| 电影挡条 1.21.10 | `cinematic-bars` | `cinematic-bars-1.0.0_1.21.10.jar` |
| 四季流转 26.3 | `bliss-seasons` | `bliss-seasons-1.1.1_26.3.jar`（**还没上传**） |

tag 和文件名都是约定，别在仓库里改名，否则旧链接会断。两个游戏版本的构建互相独立，不能互换。

## 部署

Vercel 直接读仓库根目录（`vercel.json` 里 `framework: null`、`outputDirectory: "."`，没有构建命令），推 `main` 即部署。字体与图片带一年强缓存，`cleanUrls` 让 `/cinematic-bars` 也能直接访问。
