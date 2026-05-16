import { existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { normalizeDir } from '../normalize';

type DirChild = {
  name: string;
  path: string;
};

type GetChildrenOptions = {
  recursive?: number | boolean;
  onlyFile?: boolean;
  endWith?: string | RegExp;
  filter?: (file: DirChild) => boolean;
};

export type UseDirOptions = {
  dir: string;
  [key: string]: unknown;
};

export class UseDirRelative<T extends UseDirOptions> {
  protected _dir: string;

  constructor(public readonly options: T) {
    this._dir = options.dir;
  }

  public get dir(): string {
    return this._dir;
  }

  public set dir(value: string) {
    this._dir = value;
  }

  relative = {
    from: (from: string) => {
      const dir = relative(this.dir, from);
      return useDir({ dir });
      // return normalizeDir(relative(this.dir, from));
    },

    to: (to: string) => {
      const dir = relative(to, this.dir);
      return useDir({ dir });
      // return normalizeDir(relative(to, this.dir));
    },
  };
}

export class UseDir<T extends UseDirOptions> extends UseDirRelative<T> {
  join(...paths: string[]) {
    const dir = join(this.dir, ...paths);
    return useDir({ dir });
  }

  resolve(...paths: string[]) {
    const dir = resolve(this.dir, ...paths);
    return useDir({ dir });
  }

  normalize() {
    const dir = normalizeDir(this.dir);
    return useDir({ dir });
  }

  stats(options?: Parameters<typeof statSync>[1]) {
    return statSync(this.dir, options);
  }

  exists() {
    return existsSync(this.dir);
  }

  ensureExists() {
    if (!this.exists()) {
      mkdirSync(this.dir, { recursive: true });
    }
  }

  isDirectory() {
    return this.exists() && this.stats()?.isDirectory();
  }

  isFile() {
    return this.exists() && this.stats()?.isFile();
  }

  isEmpty() {
    if (!this.isDirectory()) return null;
    return readdirSync(this.dir).length === 0;
  }

  getChildren(options: GetChildrenOptions = {}) {
    const { recursive = 1, onlyFile = false, endWith, filter } = options;

    const children: DirChild[] = [];

    const matcher =
      typeof endWith === 'string'
        ? new RegExp(`${escapeRegExp(endWith)}$`)
        : endWith;

    const walk = (parent: string, depth: number) => {
      if (!existsSync(parent)) return;
      if (!statSync(parent).isDirectory()) return;

      const entries = readdirSync(parent).map<DirChild>((name) => ({
        name,
        path: join(parent, name),
      }));

      for (const entry of entries) {
        const stats = statSync(entry.path);
        const isFile = stats.isFile();
        const isDirectory = stats.isDirectory();

        if (onlyFile && !isFile) {
          if (isDirectory && shouldRecurse(depth)) {
            walk(entry.path, depth + 1);
          }
          continue;
        }

        if (matcher && isFile && !matcher.test(entry.path)) {
          continue;
        }

        if (filter && !filter(entry)) {
          continue;
        }

        children.push(entry);

        if (isDirectory && shouldRecurse(depth)) {
          walk(entry.path, depth + 1);
        }
      }
    };

    const shouldRecurse = (depth: number) => {
      if (recursive === true) return true;
      if (recursive === false) return false;
      return depth < recursive;
    };

    walk(this.dir, 0);

    return children;
  }

  remove(options?: Parameters<typeof rmSync>[1]) {
    if (!this.exists()) return;
    rmSync(this.dir, options);
  }

  toString() {
    return this.dir;
  }

  valueOf() {
    return this.dir;
  }
}

export type UseDirInstance<T extends UseDirOptions> = UseDir<T> &
  Omit<T, 'dir'>;

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function useDir<const T extends UseDirOptions>(
  options: T,
): UseDirInstance<T> {
  const dir = new UseDir(options) as UseDirInstance<T>;

  const { dir: _dir, ...rest } = options;
  Object.assign(dir, rest);

  return dir;
}
