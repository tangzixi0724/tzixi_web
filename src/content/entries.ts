import { mods } from './mods';
import { shaders } from './shaders';
import type { Mod, ShaderPreset } from './types';

export type Entry =
  | { kind: 'mod'; data: Mod }
  | { kind: 'shader'; data: ShaderPreset };

/** 全站实例列表：模组在前，光影在后 */
export const entries: Entry[] = [
  ...mods.map((data): Entry => ({ kind: 'mod', data })),
  ...shaders.map((data): Entry => ({ kind: 'shader', data })),
];

export type Filter = 'all' | 'mod' | 'shader';

export function filterEntries(filter: Filter): Entry[] {
  if (filter === 'all') return entries;
  return entries.filter((entry) => entry.kind === filter);
}

/** 一个条目的可下载主文件（模组取 primary，光影取整包参数） */
export function primaryDownload(entry: Entry): { url: string; label: string; size: string } | null {
  if (entry.kind === 'mod') {
    const file =
      entry.data.files.find((candidate) => candidate.primary && candidate.url) ??
      entry.data.files.find((candidate) => candidate.url);
    if (!file) return null;
    return { url: file.url, label: file.fileName, size: file.size };
  }
  return null;
}

export { LOADER_LABEL, API_LABEL } from './types';
export type { Mod, ShaderPreset, Loader, ShaderApi } from './types';
