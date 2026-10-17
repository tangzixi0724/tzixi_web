import { useMemo, useState } from 'react';
import { TopBar } from './components/TopBar';
import { InstanceList } from './components/InstanceList';
import { DetailPanel } from './components/DetailPanel';
import { entries, filterEntries, type Entry, type Filter } from './content/entries';
import { site } from './content/site';

const INITIAL = entries[0]?.data.id ?? '';

function matches(entry: Entry, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack =
    entry.kind === 'mod'
      ? [
          entry.data.name,
          entry.data.slug,
          entry.data.tagline,
          entry.data.version,
          ...entry.data.loaders,
          ...entry.data.gameVersions,
          ...entry.data.categories,
        ]
      : [
          entry.data.name,
          entry.data.slug,
          entry.data.tagline,
          entry.data.base,
          ...entry.data.apis,
          ...entry.data.gameVersions,
        ];
  return haystack.some((field) => field.toLowerCase().includes(q));
}

export default function App() {
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(INITIAL);

  const visible = useMemo(() => {
    return filterEntries(filter).filter((entry) => matches(entry, query));
  }, [filter, query]);

  const selected =
    visible.find((entry) => entry.data.id === selectedId) ?? visible[0] ?? null;

  const modCount = entries.filter((entry) => entry.kind === 'mod').length;
  const shaderCount = entries.length - modCount;

  return (
    <div className="page" id="top">
      <h1 className="visually-hidden">tzixi — Minecraft 模组与光影参数</h1>

      <div className="shell">
        <TopBar />

        {site.sampleContent && (
          <p className="sample-note">
            <span className="sample-note__tag mono">示例</span>
            下面的条目是占位内容，用来展示版式；下载链接要等你把文件传到 GitHub Release、
            并在 <code className="mono">src/content/</code> 里填上真实文件名后才会生效。
          </p>
        )}

        <main className="window" id="works" data-empty={selected ? undefined : 'true'} aria-label="作品浏览区">
          <InstanceList
            visible={visible}
            selectedId={selected?.data.id ?? ''}
            onSelect={setSelectedId}
            onFilter={setFilter}
            filter={filter}
            query={query}
            onQuery={setQuery}
          />

          {selected ? (
            <DetailPanel entry={selected} />
          ) : (
            <div className="detail__blank">
              <p className="detail__blank-title">选中一个作品后，这里会显示</p>
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
            {modCount} 个模组 · {shaderCount} 套光影参数
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
                <strong>光影要先有加载器。</strong>Iris 或 OptiFine 二选一装好，再把光影包放进 <code className="mono">shaderpacks/</code>。
              </span>
            </li>
            <li>
              <span>
                <strong>参数是配置。</strong>下载的配置包解开后覆盖光影包里的同名参数文件；只改几项的话，直接点参数表里的行复制粘贴到游戏内设置里。
              </span>
            </li>
          </ol>
        </div>

        <div className="block">
          <h2>关于这些文件</h2>
          <p>
            这个站是纯静态页面，所有模组文件和光影配置都放在 GitHub Release 上，点下载就是直接拿到文件本身，中间没有广告页、没有跳转、也不需要注册。
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
            我是 tzixi，写模组、调光影、偶尔录点东西。这里放的是我自己在用的东西——能放上来的都是我自己服务器里跑着的版本。
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
