import { useEffect, useRef, useState } from 'react';
import { BlockIcon } from './BlockIcon';
import { LOADER_LABEL, type Mod } from '../content/entries';

interface Props {
  visible: Mod[];
  selectedId: string;
  onSelect: (id: string) => void;
  query: string;
  onQuery: (value: string) => void;
}

function metaLine(mod: Mod): string {
  const loaders = mod.loaders.map((loader) => LOADER_LABEL[loader]).join(' / ');
  return `${loaders} · ${mod.version}`;
}

export function InstanceList({ visible, selectedId, onSelect, query, onQuery }: Props) {
  const listRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);

  useEffect(() => {
    const index = visible.findIndex((mod) => mod.id === selectedId);
    if (index >= 0) setFocusedIndex(index);
  }, [selectedId, visible]);

  const move = (delta: number) => {
    if (visible.length === 0) return;
    const next = Math.min(Math.max(focusedIndex + delta, 0), visible.length - 1);
    const mod = visible[next];
    if (!mod) return;
    setFocusedIndex(next);
    onSelect(mod.id);
    const node = listRef.current?.querySelector<HTMLElement>(`[data-index="${next}"]`);
    node?.focus();
  };

  const hasSelection = visible.some((mod) => mod.id === selectedId);

  return (
    <div className="instances">
      <div className="instances__head">
        <label className="search">
          <span className="visually-hidden">搜索模组</span>
          <svg viewBox="0 0 14 14" width="13" height="13" aria-hidden="true" className="search__icon">
            <path
              d="M6 1a5 5 0 013.9 8.1l3 3-1 1-3-3A5 5 0 116 1zm0 1.8a3.2 3.2 0 100 6.4 3.2 3.2 0 000-6.4z"
              fill="currentColor"
            />
          </svg>
          <input
            type="search"
            value={query}
            placeholder="搜名字、版本、加载器"
            onChange={(event) => onQuery(event.target.value)}
          />
          {query && (
            <button
              type="button"
              className="search__clear"
              aria-label="清除搜索"
              onClick={() => onQuery('')}
            >
              ✕
            </button>
          )}
        </label>
      </div>

      <div
        className="instances__list"
        ref={listRef}
        role="tablist"
        aria-label="模组列表"
        aria-orientation="vertical"
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            move(1);
          } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            move(-1);
          }
        }}
      >
        {visible.length === 0 && (
          <div className="instances__empty">
            <p className="instances__empty-title">没有匹配的模组</p>
            <p>
              {query
                ? `「${query}」找不到。换个关键词，或者先把搜索清掉。`
                : '这里还没有公开的模组。'}
            </p>
            {query && (
              <button type="button" className="instances__empty-action" onClick={() => onQuery('')}>
                清空搜索
              </button>
            )}
          </div>
        )}

        {visible.map((mod, index) => {
          const active = mod.id === selectedId;
          return (
            <button
              key={mod.id}
              type="button"
              data-index={index}
              className="instance"
              data-active={active}
              id={`entry-tab-${mod.id}`}
              tabIndex={active || (!hasSelection && index === 0) ? 0 : -1}
              aria-selected={active}
              aria-controls="entry-panel"
              role="tab"
              onClick={() => onSelect(mod.id)}
            >
              <span className="instance__icon">
                <BlockIcon name={mod.icon} image={mod.iconImage} alt="" size={26} />
              </span>
              <span className="instance__text">
                <span className="instance__name">{mod.name}</span>
                <span className="instance__meta">{metaLine(mod)}</span>
              </span>
              <span className="instance__kind">MOD</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
