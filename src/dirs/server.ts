import { join } from 'node:path';
import { useDir } from './use';

export function getServerStructures(
  dir: string,
): ReturnType<typeof createServerStructures>;

export function getServerStructures<const T extends Record<string, unknown>>(
  dir: string,
  extendsWith: T,
): ReturnType<typeof createServerStructures> & T;

export function getServerStructures<const T extends Record<string, unknown>>(
  dir: string,
  extendsWith?: T,
) {
  const base = createServerStructures(dir);

  if (!extendsWith) return base;

  return Object.assign(base, extendsWith);
}

function createServerStructures(dir: string) {
  return useDir({
    dir,

    services: useDir({
      dir: join(dir, 'services'),
    }),

    controllers: useDir({
      dir: join(dir, 'controllers'),
    }),

    locales: useDir({
      dir: join(dir, 'locales'),
    }),

    guards: useDir({
      dir: join(dir, 'guards'),
    }),

    database: useDir({
      dir: join(dir, 'database'),

      plugins: useDir({
        name: 'plugins',
        dir: join(dir, 'database', 'plugins'),
      }),

      models: useDir({
        dir: join(dir, 'database', 'models'),
      }),
    }),

    /** @deprecated user database.models */
    models: useDir({
      dir: join(dir, 'models'),
    }),
  });
}
