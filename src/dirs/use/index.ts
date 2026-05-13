import { UseDir, UseDirOptions } from './engine';

export type UseDirInstance<T extends UseDirOptions> = UseDir<T> &
  Omit<T, 'dir'>;

export function useDir<const T extends UseDirOptions>(
  options: T,
): UseDirInstance<T> {
  const dir = new UseDir(options) as UseDirInstance<T>;

  const { dir: _dir, ...rest } = options;
  Object.assign(dir, rest);

  return dir;
}
