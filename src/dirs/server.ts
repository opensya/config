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

    models: useDir({
      name: 'models',
      dir: join(dir, 'models'),
    }),

    services: useDir({
      name: 'services',
      dir: join(dir, 'services'),
    }),

    controllers: useDir({
      name: 'controllers',
      dir: join(dir, 'controllers'),
    }),

    locales: useDir({
      name: 'locales',
      dir: join(dir, 'locales'),
    }),

    database: useDir({
      name: 'database',
      dir: join(dir, 'database'),

      plugins: useDir({
        name: 'plugins',
        dir: join(dir, 'database', 'plugins'),
      }),
    }),
  });
}
