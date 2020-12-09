// rollup.config.js
import typescript from 'rollup-plugin-typescript2'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

export default {
  input: 'lib/index.ts',
  output: [
    {
      name: 'websocketHeartbeat',
      file: 'dist/wsHeartbeat.min.js',
      format: 'iife', // umd cjs es iife
      exports: 'auto',
      plugins: [
        terser({
          compress: {
            ecma: 2015,
            pure_getters: true,
          },
        }),
      ],
    },
    {
      name: 'websocketHeartbeat',
      file: 'dist/wsHeartbeat.cjs.js',
      format: 'cjs',
    },
    {
      name: 'websocketHeartbeat',
      file: 'dist/wsHeartbeat.esm.js',
      format: 'esm',
    },
    {
      name: 'websocketHeartbeat',
      file: 'dist/wsHeartbeat.umd.js',
      format: 'umd',
    },
  ],
  plugins: [
    resolve(),
    commonjs({
      include: 'node_modules/**',
    }),
    typescript({
      tsconfig: 'tsconfig.json',
    }),
  ],
}
