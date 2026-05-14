import { RequiredKey } from '@opensya/share';
import fs from 'fs';

export type InputConfig<T> = T & {
  $test?: T;
  $development?: T;
  $production?: T;
  $env?: Record<string, T>;
};

export interface OpensyaConfig {
  /** @default 'core'' */ template?: 'core' | 'module';

  /** @default '' */ rootDir?: string;

  /** @default 'server' */ serverDir?: string;

  /** @default '.opensya' */ output?: string;

  /** @default '.env */ envFile?: string;

  i18n?: {
    /** @default 'en' */
    defaultLocale?: string;
  };

  modules?: string[];

  client?: boolean | unknown;
}

export interface OpensyaConfigOutput
  extends RequiredKey<OpensyaConfig, 'rootDir' | 'output' | 'serverDir'> {
  cwd: string;
  idx: string;
}

export type LoadConfigFn = (
  cwd?: string | undefined,
) => Promise<OpensyaConfigOutput>;

export type DefineOpensyaConfig = (
  config: InputConfig<OpensyaConfig> | (() => InputConfig<OpensyaConfig>),
) => InputConfig<OpensyaConfig>;

declare global {
  var _config: OpensyaConfigOutput;
  var _kernelConfig: OpensyaConfigOutput & { iskernel: true };
  var defineOpensyaConfig: DefineOpensyaConfig;
}
