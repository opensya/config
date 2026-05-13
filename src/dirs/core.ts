import { join, relative, resolve } from 'node:path';
import { OpensyaConfigOutput } from '../types';
import { useDir } from './use';
import { normalizeDirs } from './normalize';
import { getServerStructures } from './server';

export function getDirs(
  config: OpensyaConfigOutput,
  mainConfig?: OpensyaConfigOutput,
) {
  const _config = mainConfig ?? config;

  const cwd = config.cwd;

  const rootName = config.rootDir;
  const serverName = config.serverDir ?? 'server';
  const outputName = _config.output;

  const rootAbsolute = resolve(cwd, rootName);
  const outputAbsolute = resolve(_config.cwd, outputName);
  const distAbsolute = resolve(_config.cwd, 'dist');

  const root = useDir({
    dir: rootAbsolute,
    server: getServerStructures(join(rootAbsolute, serverName)),
  });

  const output = useDir({
    dir: outputAbsolute,

    server: getServerStructures(join(outputAbsolute, rootName, serverName), {
      types: useDir({
        dir: join(outputAbsolute, rootName, serverName, 'types'),
      }),

      mainjs: useDir({
        dir: join(outputAbsolute, rootName, serverName, 'main.js'),
      }),
    }),
  });

  const dist = useDir({
    dir: distAbsolute,
    server: getServerStructures(join(distAbsolute, serverName)),
  });

  const dirs = useDir({
    dir: cwd,
    root,
    output,
    dist,
  });

  dirs.output.server.remove;

  return normalizeDirs(dirs);
}
