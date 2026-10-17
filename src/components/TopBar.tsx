import { site } from '../content/site';

export function TopBar() {
  return (
    <header className="topbar">
      <a className="brand" href="#top" aria-label={`${site.name} 首页`}>
        <span className="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 12 12" width="14" height="14" shapeRendering="crispEdges">
            <path d="M0 0h5v5H0zM7 0h5v5H7zM0 7h5v5H0zM7 7h5v5H7z" />
          </svg>
        </span>
        <span className="brand-name">{site.name}</span>
        <span className="brand-tld">.cn</span>
      </a>

      <nav className="nav" aria-label="主导航">
        <a href="#works">作品</a>
        <a href="#install">安装</a>
        <a href="#about">关于</a>
      </nav>

      <a
        className="nav-repo"
        href={site.githubUrl}
        target="_blank"
        rel="noreferrer noopener"
      >
        <span>GitHub</span>
        <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true">
          <path
            d="M3 2h7v7H8.6V4.4L2.6 10.4 1.6 9.4l6-6H3z"
            fill="currentColor"
          />
        </svg>
      </a>
    </header>
  );
}
