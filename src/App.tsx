import { useMemo, useState } from 'react';
import { TopBar } from './components/TopBar';
import { InstanceList } from './components/InstanceList';
import { DetailPanel } from './components/DetailPanel';
import { entries, type Mod } from './content/entries';
import { site } from './content/site';

const INITIAL = entries[0]?.id ?? '';

function matches(mod: Mod, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    mod.name,
    mod.slug,
    mod.tagline,
    mod.version,
    ...mod.loaders,
    ...mod.gameVersions,
    ...mod.categories,
  ];
  return haystack.some((field) => field.toLowerCase().includes(q));
}

export default function App() {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(INITIAL);

  const visible = useMemo(() => entries.filter((mod) => matches(mod, query)), [query]);

  const selected = visible.find((mod) => mod.id === selectedId) ?? visible[0] ?? null;

  return (
    <div className="page" id="top">
      <h1 className="visually-hidden">tzixi — Minecraft 模组</h1>

      <div className="shell">
        <TopBar />

        {site.sampleContent && (
          <p className="sample-note">
            <span className="sample-note__tag mono">示例</span>
            下面的条目是占位内容，用来展示版式；下载链接要等你把文件传到 GitHub Release、
            并在 <code className="mono">src/content/</code> 里填上真实文件名后才会生效。
          </p>
        )}

        <main className="window" id="works" data-empty={selected ? undefined : 'true'} aria-label="模组浏览区">
          <InstanceList
            visible={visible}
            selectedId={selected?.id ?? ''}
            onSelect={setSelectedId}
            query={query}
            onQuery={setQuery}
          />

          {selected ? (
            <DetailPanel mod={selected} />
          ) : (
            <div className="detail__blank">
              <p className="detail__blank-title">选中一个模组后，这里会显示</p>
              <dl>
                <div>
                  <dt>五个测量值</dt>
                  <dd>游戏版本、加载器、版本号、文件大小、更新时间</dd>
                </div>
                <div>
                  <dt>下载卡片</dt>
                  <dd>主文件名、文件大小，和直接指向 GitHub Release 的按钮</dd>
                </div>
                <div>
                  <dt>安装须知与更新记录</dt>
                  <dd>装之前的注意事项，以及每个版本改了什么</dd>
                </div>
              </dl>
            </div>
          )}
        </main>

        <div className="statusbar">
          <span>
            <span className="statusbar__dot" aria-hidden="true" />
            {entries.length} 个模组
          </span>
          <span className="statusbar__right">
            <span>{site.host}</span>
            <span>无中转页</span>
          </span>
        </div>
      </div>

      <section className="below" id="install">
        <div className="block">
          <h2>怎么装进去</h2>
          <ol className="steps">
            <li>
              <span>
                <strong>先对上版本。</strong>模组页顶部的「游戏版本」和「加载器」必须和你游戏里的完全一致，差一个小版本号就不会被识别。
              </span>
            </li>
            <li>
              <span>
                <strong>放进 mods 文件夹。</strong>下载的 jar 直接丢进 <code className="mono">.minecraft/mods/</code>，不要解压。
              </span>
            </li>
            <li>
              <span>
                <strong>再装依赖。</strong>每个模组页面的「装之前先看」里写清了它依赖哪些库，缺一个都起不来。
              </span>
            </li>
            <li>
              <span>
                <strong>启动器里选对实例。</strong>Forge 和 Fabric 的实例不能混用，装之前确认启动器里选的是对应加载器的那个版本。
              </span>
            </li>
          </ol>
        </div>

        <div className="block">
          <h2>关于这些文件</h2>
          <p>
            这个站是纯静态页面，所有模组文件都放在 GitHub Release 上，点下载就是直接拿到文件本身，中间没有广告页、没有跳转、也不需要注册。
          </p>
          <p>
            遇到装不上或者想报 bug，去 GitHub 开个 issue 最快；版本号、加载器和报错日志贴全，我看到就会回。
          </p>
        </div>
      </section>

      <section className="below" id="about">
        <div className="block">
          <h2>关于</h2>
          <p>
            我是 tzixi，写模组，偶尔录点东西。这里放的是我自己在用的东西——能放上来的都是我自己服务器里跑着的版本。
          </p>
          <p>
            网站本身用 Bun 和 Vite 构建，托管在 Vercel 的免费额度上；文件放在 GitHub Release。之所以这么搭，是因为它一分钱不花，而且下载速度由 GitHub 的 CDN 决定，比我自己挂机器稳。
          </p>
        </div>

        <div className="block">
          <h2>联系</h2>
          <dl className="facts">
            <div>
              <dt>GitHub</dt>
              <dd>
                <a href={`https://github.com/${site.githubUser}`} target="_blank" rel="noreferrer noopener">
                  @{site.githubUser}
                </a>
              </dd>
            </div>
            <div>
              <dt>仓库</dt>
              <dd>
                <a href={site.githubUrl} target="_blank" rel="noreferrer noopener">
                  {site.githubRepo}
                </a>
              </dd>
            </div>
            <div>
              <dt>站点</dt>
              <dd className="mono">{site.domain}</dd>
            </div>
          </dl>
        </div>
      </section>

      <footer className="footer">
        <span>© {new Date().getFullYear()} tzixi</span>
        <span className="mono">Minecraft 是 Mojang Studios 的商标，本站与其无关联。</span>
        <span className="footer__spacer mono">{site.domain}</span>
      </footer>
    </div>
  );
}
