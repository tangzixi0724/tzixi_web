import { useRef } from 'react';
import { BlockIcon } from './BlockIcon';
import { ScrollRail } from './ScrollRail';
import { LOADER_LABEL, type Mod } from '../content/entries';
import { site } from '../content/site';

interface Props {
  mod: Mod;
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function ExternalIcon() {
  return (
    <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true" className="btn-icon">
      <path d="M3 2h7v7H8.6V4.4L2.6 10.4 1.6 9.4l6-6H3z" fill="currentColor" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 14 14" width="14" height="14" aria-hidden="true" className="btn-icon">
      <path d="M6.2 1h1.6v6.1l2.2-2.2 1.1 1.1L7 10.1 2.9 6l1.1-1.1 2.2 2.2V1zM2 11h10v1.6H2z" fill="currentColor" />
    </svg>
  );
}

function Changelog({ entries }: { entries: { version: string; date: string; changes: string[] }[] }) {
  if (entries.length === 0) return null;
  return (
    <section className="changelog">
      <h3>更新记录</h3>
      <ol>
        {entries.map((item) => (
          <li key={item.version}>
            <div className="changelog__head">
              <span className="changelog__version mono">{item.version}</span>
              <span className="changelog__date mono">{item.date}</span>
            </div>
            <ul>
              {item.changes.map((change) => (
                <li key={change}>{change}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function DetailPanel({ mod }: Props) {
  const scrollerRef = useRef<HTMLElement>(null);
  const primary = mod.files.find((file) => file.primary) ?? mod.files[0];
  const others = mod.files.filter((file) => file !== primary);
  const missing = !primary?.url;

  return (
    <div className="detail-pane">
      <article
        ref={scrollerRef}
        className="detail"
        key={mod.id}
        id="entry-panel"
        role="tabpanel"
        aria-labelledby={`entry-tab-${mod.id}`}
      >
        <div className="detail__head">
          <div className="detail__icon">
            <BlockIcon name={mod.icon} image={mod.iconImage} alt={`${mod.name} 的图标`} size={44} />
          </div>
          <div className="detail__title">
            <h2>
              {mod.name}
              <span className="tag tag--kind">模组</span>
            </h2>
            <p>{mod.tagline}</p>
            <p className="detail__slug mono">{mod.slug}</p>
          </div>
        </div>

        <dl className="metrics">
          <Metric label="游戏版本" value={mod.gameVersions.join(' · ')} />
          <Metric label="加载器" value={mod.loaders.map((l) => LOADER_LABEL[l]).join(' / ')} />
          <Metric label="版本" value={mod.version} />
          <Metric label="文件大小" value={primary?.size ?? '—'} />
          <Metric label="更新" value={mod.updatedAt} />
        </dl>

        <div className="detail__grid">
          <div className="detail__main">
            <section className="prose-block">
              {mod.summary.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>

            <section className="notes">
              <h3>装之前先看</h3>
              <ul>
                {mod.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </section>

            <Changelog entries={mod.changelog} />
          </div>

          <aside className="rail" aria-label="下载">
            <div className="rail__card">
              <p className="rail__label">
                主文件
                {primary?.gameVersion && (
                  <span className="rail__for mono">Minecraft {primary.gameVersion}</span>
                )}
              </p>
              <p className="rail__file mono">{primary?.fileName ?? '—'}</p>
              {missing ? (
                <span className="btn btn--primary btn--block" data-disabled="true" aria-disabled="true">
                  文件尚未上传
                </span>
              ) : (
                <a className="btn btn--primary btn--block" href={primary.url} download>
                  <DownloadIcon />
                  下载 {primary.size}
                </a>
              )}
              <a
                className="rail__link"
                href={`${site.githubUrl}/releases/tag/${mod.slug}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                全部版本与更新日志
                <ExternalIcon />
              </a>
            </div>

            {others.length > 0 && (
              <div className="filelist">
                <p className="rail__label">其它构建</p>
                <ul>
                  {others.map((file) => (
                    <li key={file.fileName}>
                      <span className="filelist__text">
                        {file.gameVersion && (
                          <span className="filelist__ver mono">MC {file.gameVersion}</span>
                        )}
                        <span className="filelist__name mono">{file.fileName}</span>
                      </span>
                      <span className="filelist__size mono">{file.size}</span>
                      {file.url ? (
                        <a href={file.url} download className="filelist__get">
                          下载
                        </a>
                      ) : (
                        <span className="filelist__get" data-disabled="true">
                          未上传
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </article>
      <ScrollRail targetRef={scrollerRef} />
    </div>
  );
}
