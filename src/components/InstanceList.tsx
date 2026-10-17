import { useEffect, useRef, useState } from 'react';
import { BlockIcon } from './BlockIcon';
import { API_LABEL, LOADER_LABEL, type Entry } from '../content/entries';

interface Props {
  visible: Entry[];
  selectedId: string;
  onSelect: (id: string) => void;
  filter: 'all' | 'mod' | 'shader';
  onFilter: (filter: 'all' | 'mod' | 'shader') => void;
  query: string;
  onQuery: (value: string) => void;
}

const FILTERS: { id: Props['filter']; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'mod', label: '模组' },
  { id: 'shader', label: '光影' },
];

function metaLine(entry: Entry): string {
  if (entry.kind === 'mod') {
    const loaders = entry.data.loaders.map((loader) => LOADER_LABEL[loader]).join(' / ');
    return `${loaders} · ${entry.data.version}`;
  }
  const apis = entry.data.apis.map((api) => API_LABEL[api]).join(' / ');
  return `${apis} · ${entry.data.base}`;
}

export function InstanceList({
  visible,
  selectedId,
  onSelect,
  filter,
  onFilter,
  query,
  onQuery,
}: Props) {
  const listRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);

  useEffect(() => {
    const index = visible.findIndex((entry) => entry.data.id === selectedId);
    if (index >= 0) setFocusedIndex(index);
  }, [selectedId, visible]);


  const move = (delta: number) => {
    if (visible.length === 0) return;
    const next = Math.min(Math.max(focusedIndex + delta, 0), visible.length - 1);
    const entry = visible[next];
    if (!entry) return;
    setFocusedIndex(next);
    onSelect(entry.data.id);
    const node = listRef.current?.querySelector<HTMLElement>(`[data-index="${next}"]`);
    node?.focus();
  };

  const hasSelection = visible.some((entry) => entry.data.id === selectedId);

  return (
    <div className="instances">
      <div className="instances__head">
        <div className="segmented" role="group" aria-label="按类型筛选">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={filter === item.id}
              className="segmented__btn"
              data-active={filter === item.id}
              onClick={() => onFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <label className="search">
          <span className="visually-hidden">搜索作品</span>
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
        aria-label="作品列表"
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
            <p className="instances__empty-title">没有匹配的作品</p>
            <p>
              {query
                ? `「${query}」在${filter === 'mod' ? '模组' : filter === 'shader' ? '光影' : '全部作品'}里都找不到。换个关键词，或者先把搜索清掉。`
                : '这个分类下还没有公开的条目。切到「全部」看看其它内容。'}
            </p>
            {query && (
              <button type="button" className="instances__empty-action" onClick={() => onQuery('')}>
                清空搜索
              </button>
            )}
          </div>
        )}

        {visible.map((entry, index) => {
          const active = entry.data.id === selectedId;
          const item = entry.data;
          return (
            <button
              key={item.id}
              type="button"
              data-index={index}
              className="instance"
              data-active={active}
              id={`entry-tab-${item.id}`}
              tabIndex={active || (!hasSelection && index === 0) ? 0 : -1}
              aria-selected={active}
              aria-controls="entry-panel"
              role="tab"
              onClick={() => onSelect(item.id)}
            >
              <span className="instance__icon" data-kind={entry.kind}>
                <BlockIcon
                  name={item.icon}
                  image={item.iconImage}
                  alt=""
                  size={26}
                />
              </span>
              <span className="instance__text">
                <span className="instance__name">{item.name}</span>
                <span className="instance__meta">{metaLine(entry)}</span>
              </span>
              <span className="instance__kind" data-kind={entry.kind}>
                {entry.kind === 'mod' ? 'MOD' : 'SHADER'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
