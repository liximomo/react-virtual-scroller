import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const isProd = process.env.NODE_ENV === 'production';

const input = 'src/index.js';

const onwarn = function(warning) {
  // Skip certain warnings

  // should intercept ... but doesn't in some rollup versions
  if (warning.code === 'THIS_IS_UNDEFINED') {
    return;
  }

  // console.warn everything else
  console.log('\x1b[33m(!) %s\x1b[0m', warning.message || warning);
};

const plugins = [
  replace({ 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) }),
  resolve(), // so Rollup can resolve node_modules
  babel({
    runtimeHelpers: true,
  }),
  commonjs(), // so Rollup can convert commonjs to an ES module
  isProd && terser(),
].filter(Boolean);

export default [
  {
    input,
    output: {
      file: pkg.browser,
      format: 'umd',
      name: 'VirtualScroller',
      exports: 'named' /** Disable warning for default imports */,
      globals: {
        react: 'React',
        'react-dom': 'reactDom',
      },
    },
    external: ['react', 'react-dom'],
    onwarn,
    plugins,
  },
  {
    input,
    output: {
      file: pkg.browser.replace(/js$/, 'min.js'),
      format: 'umd',
      name: 'VirtualScroller',
      exports: 'named' /** Disable warning for default imports */,
      globals: {
        react: 'React',
        'react-dom': 'reactDom',
      },
    },
    external: ['react', 'react-dom'],
    onwarn,
    plugins,
  },
];
