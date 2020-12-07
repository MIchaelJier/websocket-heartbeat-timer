// rollup.config.js
import typescript from 'rollup-plugin-typescript2'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'

export default {
  input: 'lib/websocketHeartbeat.ts',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
    exports: 'auto',
  },
  plugins: [
    resolve(),
    commonjs({
      // All of our own sources will be ES6 modules, so only node_modules need to be resolved with cjs
      include: 'node_modules/**',
    }),
    typescript({
      tsconfig: 'tsconfig.json',
    }),
  ],
}
