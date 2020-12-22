// rollup.config.js
import typescript from 'rollup-plugin-typescript2'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import babel from '@rollup/plugin-babel'
// import workerLoader from 'rollup-plugin-web-worker-loader'

const extensions = ['.js', '.jsx', '.ts', '.tsx']

const plugins = [
  terser({
    compress: {
      ecma: 2015,
      pure_getters: true,
    },
  }),
]

export default {
  input: 'lib/index.ts',
  output: [
    {
      name: 'websocketHeartbeat',
      file: 'dist/wsHeartbeat.min.js',
      format: 'iife', // umd cjs es iife
      exports: 'auto',
      // sourcemap: true,
      // plugins,
    },
    {
      name: 'websocketHeartbeat',
      file: 'dist/wsHeartbeat.cjs.js',
      format: 'cjs',
      plugins,
    },
    {
      name: 'websocketHeartbeat',
      file: 'dist/wsHeartbeat.esm.js',
      format: 'esm',
      // plugins,
    },
    {
      name: 'websocketHeartbeat',
      file: 'dist/wsHeartbeat.umd.js',
      format: 'umd',
      plugins,
    },
  ],
  plugins: [
    resolve(),
    commonjs({
      include: 'node_modules/**',
    }),
    // workerLoader(),
    typescript({
      tsconfig: 'tsconfig.json',
    }),
    babel({
      exclude: 'node_modules/**',
      extensions,
    }),
  ],
}
