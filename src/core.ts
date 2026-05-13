import { join } from 'node:path';
import _ from 'lodash';
import {
  DefineOpensyaConfig,
  InputConfig,
  LoadConfigFn,
  OpensyaConfig,
  OpensyaConfigOutput,
} from './types';
import { existsSync } from 'node:fs';
import { randomUUID } from 'node:crypto';

export const defineOpensyaConfig: DefineOpensyaConfig = (input) => {
  if (typeof input === 'function') return input();
  return input;
};

export const loadConfig: LoadConfigFn = async function (cwd) {
  cwd ??= process.cwd();
  const config: OpensyaConfigOutput = {
    rootDir: '',
    cwd,
    output: '.opensya',
    serverDir: 'server',
    idx: randomUUID(),
  };

  const configFilePath = wichConfigFileLoad(cwd);
  if (!configFilePath) return config;

  const { default: content } = await import(configFilePath);
  const defineConfig:
    | (() => InputConfig<OpensyaConfig>)
    | InputConfig<OpensyaConfig> = content.default ?? content;

  let raw: InputConfig<OpensyaConfig>;

  if (typeof defineConfig === 'function') raw = defineConfig();
  else raw = defineConfig;

  const _config = mergeConfig(raw);
  _.merge(config, _config);

  return config;
};

export function mergeConfig(config: InputConfig<OpensyaConfig>) {
  const isDev = process.env.NODE_ENV !== 'production';

  if ((config as any).default) {
    config = (config as any).default;
  }

  if (isDev) config = _.merge(config, config.$development);
  else config = _.merge(config, config.$production);

  return config as OpensyaConfig;
}

function wichConfigFileLoad(cwd: string) {
  const exts = ['ts', 'js'];
  let configFilePath;

  for (const ext of exts) {
    const _path = join(cwd, `opensya.config.${ext}`);

    if (existsSync(_path)) {
      configFilePath = _path;
      break;
    }
  }

  return configFilePath;
}
