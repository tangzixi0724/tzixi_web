import { BlockIcon } from './BlockIcon';
import { API_LABEL, LOADER_LABEL, type Entry } from '../content/entries';
import { useCopy } from '../lib/useCopy';
import { site } from '../content/site';

interface Props {
  entry: Entry;
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

function CopyIcon() {
  return (
    <svg viewBox="0 0 14 14" width="12" height="12" aria-hidden="true" className="copy-icon">
      <path
        d="M4 1h7v9H9.4V2.6H4V1zm-1 3h6.2v9H3V4zm1.4 1.4v6.2h3.4V5.4H4.4z"
        fill="currentColor"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 14 14" width="12" height="12" aria-hidden="true" className="copy-icon">
      <path d="M5.2 10.6L1.6 7l1.1-1.1 2.5 2.5 6.1-6.1L12.4 3.4z" fill="currentColor" />
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

function ModDetail({ entry }: { entry: Extract<Entry, { kind: 'mod' }> }) {
  const mod = entry.data;
  const primary = mod.files.find((file) => file.primary) ?? mod.files[0];
  const others = mod.files.filter((file) => file !== primary);
  const missing = !primary?.url;

  return (
    <>
      <div className="detail__head">
        <div className="detail__icon" data-kind="mod">
          <BlockIcon name={mod.icon} size={44} />
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
            <p className="rail__label">主文件</p>
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
                    <span className="filelist__name mono">{file.fileName}</span>
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
    </>
  );
}

function ShaderDetail({ entry }: { entry: Extract<Entry, { kind: 'shader' }> }) {
  const shader = entry.data;
  const { copied, copy } = useCopy();
  const paramText = shader.params.map((param) => `${param.key}=${param.value}`).join('\n');

  return (
    <>
      <div className="detail__head">
        <div className="detail__icon" data-kind="shader">
          <BlockIcon name={shader.icon} size={44} />
        </div>
        <div className="detail__title">
          <h2>
            {shader.name}
            <span className="tag tag--kind tag--shader">光影参数</span>
          </h2>
          <p>{shader.tagline}</p>
          <p className="detail__slug mono">{shader.slug}</p>
        </div>
      </div>

      <dl className="metrics">
        <Metric label="基于" value={`${shader.base} ${shader.baseVersion}`} />
        <Metric label="光影 API" value={shader.apis.map((a) => API_LABEL[a]).join(' / ')} />
        <Metric label="游戏版本" value={shader.gameVersions.join(' · ')} />
        <Metric label="显卡档位" value={shader.target.gpu} />
        <Metric label="更新" value={shader.updatedAt} />
      </dl>

      <div className="detail__grid">
        <div className="detail__main">
          <section className="prose-block">
            {shader.summary.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>

          <section className="params">
          <div className="params__head">
            <h3>参数表</h3>
            <span className="params__hint mono">
              {shader.target.scene} · {shader.target.fps}
            </span>
          </div>
          <ul className="params__list">
            {shader.params.map((param) => {
              const key = `${param.key}`;
              const isCopied = copied === key;
              return (
                <li key={param.key} className="param">
                  <button
                    type="button"
                    className="param__row"
                    onClick={() => void copy(`${param.key}=${param.value}`, key)}
                    title={`点击复制 ${param.key}=${param.value}`}
                  >
                    <span className="param__key mono">{param.key}</span>
                    <span className="param__value mono">{isCopied ? '已复制' : param.value}</span>
                    <span className="param__note">{param.note}</span>
                    <span className="param__copy" aria-hidden="true">
                      {isCopied ? <CheckIcon /> : <CopyIcon />}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          </section>

          <section className="notes">
            <h3>套用说明</h3>
            <ul>
              {shader.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </section>

          <Changelog entries={shader.changelog} />
        </div>

        <aside className="rail" aria-label="下载与参数">
          <div className="rail__card">
            <p className="rail__label">配置包</p>
            <p className="rail__file mono">{shader.file?.fileName ?? '—'}</p>
            {shader.file?.url ? (
              <a className="btn btn--primary btn--block" href={shader.file.url} download>
                <DownloadIcon />
                下载 {shader.file.size}
              </a>
            ) : (
              <span className="btn btn--primary btn--block" data-disabled="true" aria-disabled="true">
                尚未上传
              </span>
            )}
            <button
              type="button"
              className="btn btn--ghost btn--block"
              onClick={() => void copy(paramText, 'all')}
            >
              {copied === 'all' ? '已复制全部参数' : '复制全部参数'}
            </button>
          </div>

          <div className="rail__spec">
            <p className="rail__label">适用</p>
            <dl>
              <div>
                <dt>场景</dt>
                <dd>{shader.target.scene}</dd>
              </div>
              <div>
                <dt>显卡</dt>
                <dd>{shader.target.gpu}</dd>
              </div>
              <div>
                <dt>帧数</dt>
                <dd>{shader.target.fps}</dd>
              </div>
              <div>
                <dt>参数</dt>
                <dd>{shader.params.length} 项</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </>
  );
}

export function DetailPanel({ entry }: Props) {
  return (
    <article
      className="detail"
      key={entry.data.id}
      id="entry-panel"
      role="tabpanel"
      aria-labelledby={`entry-tab-${entry.data.id}`}
    >
      {entry.kind === 'mod' ? <ModDetail entry={entry} /> : <ShaderDetail entry={entry} />}
    </article>
  );
}
