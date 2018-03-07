import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify';
import pkg from './package.json';

const input = 'src/index.js';

const onwarn = function(warning) {
  // Skip certain warnings

  // should intercept ... but doesn't in some rollup versions
  if ( warning.code === 'THIS_IS_UNDEFINED' ) { return; }

  // console.warn everything else
  console.log('\x1b[33m(!) %s\x1b[0m', warning.message || warning);
};

const plugins = [
  replace({ 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) }),
  resolve(), // so Rollup can resolve node_modules
  babel({
    exclude: ['node_modules/**'],
    plugins: ["external-helpers"]
  }),
  commonjs(), // so Rollup can convert commonjs to an ES module
];


// browser-friendly UMD build
const umd = {
  input,
  output: {
    file: pkg.browser,
    format: 'umd',
    name: 'VirtualScroller',
  },
  onwarn,
  plugins
};

if (process.env.NODE_ENV === 'development') {
  // nothing current
} else if (process.env.NODE_ENV === 'production') {
  const prodPlugins = [
    uglify({
      compress: {
        warnings: false,
        // Disabled because of an issue with Uglify breaking seemingly valid code:
        // https://github.com/facebookincubator/create-react-app/issues/2376
        // Pending further investigation:
        // https://github.com/mishoo/UglifyJS2/issues/2011
        comparisons: false,
      },
      output: {
        comments: false,
        // Turned on because emoji and regex is not minified properly using default
        // https://github.com/facebookincubator/create-react-app/issues/2488
        ascii_only: true,
      },
    })
  ]
  umd.output.file = umd.output.file.replace(/js$/, 'min.js');
  umd.plugins = umd.plugins.concat(prodPlugins);
}

export default umd;
