import { defineConfig } from '@rslib/core';

export default defineConfig({
  lib: [
    {
      format: 'esm',
      syntax: 'es2020',
      dts: true,
      autoExternal: {
        dependencies: true,
        peerDependencies: true,
        optionalDependencies: true,
        devDependencies: true,
      },
    },
    {
      format: 'cjs',
      syntax: 'es2020',
      dts: true,
      autoExternal: {
        dependencies: true,
        peerDependencies: true,
        optionalDependencies: true,
        devDependencies: true,
      },
    },
  ],

  output: {
    externals: {
      '@babel/core': '@babel/core',
      '@babel/parser': '@babel/parser',
      '@babel/traverse': '@babel/traverse',
      '@babel/types': '@babel/types',
      'node:module': 'node:module',
      module: 'module',
      fs: 'fs',
      path: 'path',
    },
  },
});
