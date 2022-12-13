/*
 *   Copyright (c) 2021 Eric Fillipe
 *   All rights reserved.

 *   Permission is hereby granted, free of charge, to any person obtaining a copy
 *   of this software and associated documentation files (the "Software"), to deal
 *   in the Software without restriction, including without limitation the rights
 *   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *   copies of the Software, and to permit persons to whom the Software is
 *   furnished to do so, subject to the following conditions:
 
 *   The above copyright notice and this permission notice shall be included in all
 *   copies or substantial portions of the Software.
 
 *   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *   SOFTWARE.
 */
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';

const externalLibs = ['react', 'react-dom','rakunFlow','rakun'];

const extensions = ['.ts', '.tsx']
const defaultNodeResolveConfig = {
  extensions
};
const nodeResolvePlugin = nodeResolve(defaultNodeResolveConfig);


const commonPlugins = [
  babel({
    runtimeHelpers: true,
    exclude: 'node_modules/**',
    extensions
  }),
  {
    resolveId: source => {
      if (source === 'Rakun') {
        return { id: 'rakun', external: true };
      }
      if (source === 'RakunFlow') {
        return { id: 'rakunFlow', external: true };
      }
      if (source === 'React') {
        return { id: 'react', external: true };
      }
      if (source === 'ReactDOM') {
        return { id: 'react-dom', external: true };
      }
      if (source === 'ReactNative') {
        return { id: 'react-native', external: true };
      }
      if (source === 'ReactNative') {
        return { id: 'react-native', external: true };
      }
      return null;
    },
  },
  nodeResolvePlugin,
  commonjs(),
];

const developmentPlugins = [
  ...commonPlugins,
  replace({
    preventAssignment: true,
    'process.env.NODE_ENV': JSON.stringify('development'),
  }),
];

const productionPlugins = [
  ...commonPlugins,
  replace({
    preventAssignment: true,
    'process.env.NODE_ENV': JSON.stringify('production'),
  }),
  terser({ mangle: false }),
];


const inputFile = 'src/index.ts';

export default [
  // CommonJS
  {
    input: inputFile,
    output: {
      file: `cjs/react-rakun.js`,
      format: 'cjs',
      exports: 'named',
    },
    external: externalLibs,
    plugins: commonPlugins,
  },

  // ES
  {
    input: inputFile,
    output: {
      file: `es/react-rakun.js`,
      format: 'es',
      exports: 'named',
    },
    external: externalLibs,
    plugins: commonPlugins,
  },

  // React Native
  {
    input: inputFile,
    output: {
      file: `native/react-rakun.js`,
      format: 'es',
      exports: 'named',
    },
    external: [...externalLibs, 'react-native'],
    plugins: commonPlugins.map(plugin => {
      // Replace the default nodeResolve plugin
      if (plugin === nodeResolvePlugin) {
        return nodeResolve({
          ...defaultNodeResolveConfig,
          extensions: ['.native.ts', '.ts', '.native.tsx', '.tsx'],
        });
      }

      return plugin;
    }),
  },

  // ES for Browsers
  {
    input: inputFile,
    output: {
      file: `es/react-rakun.mjs`,
      format: 'es',
      exports: 'named',
    },
    external: externalLibs,
    plugins: productionPlugins,
  },

  // UMD Development
  {
    input: inputFile,
    output: {
      file: `umd/react-rakun.js`,
      format: 'umd',
      name: 'ReactRakun',
      exports: 'named',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        'rakun': 'Rakun',
        'react-rakun': 'ReactRakun',
        'rakunFlow': 'RakunFlow'
      },
    },
    external: externalLibs,
    plugins: developmentPlugins,
  },

  // UMD Production
  {
    input: inputFile,
    output: {
      file: `umd/react-rakun.min.js`,
      format: 'umd',
      name: 'ReactRakun',
      exports: 'named',
      globals: {
        'react': 'React',
        'react-dom': 'ReactDOM',

        'rakun': 'Rakun',
        'react-rakun': 'ReactRakun',
        'rakunFlow': 'RakunFlow'
      },
    },
    external: externalLibs,
    plugins: productionPlugins,
  },
]