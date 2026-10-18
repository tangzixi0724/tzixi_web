import { mods } from './mods';
import type { Mod } from './types';

/** 全站条目：目前只有模组 */
export const entries: Mod[] = mods;

export { LOADER_LABEL } from './types';
export type { Mod, Loader } from './types';
