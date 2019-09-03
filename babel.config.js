const isEnvDevelopment = process.env.NODE_ENV === 'development';
const isEnvProduction = process.env.NODE_ENV === 'production';
const isEnvTest = process.env.NODE_ENV === 'test';

const targetModule =
  process.env.BABEL_ENV === 'commonjs'
    ? 'commonjs'
    : process.env.BABEL_ENV === 'esm'
    ? false
    : 'auto';

module.exports = {
  presets: [
    ['@babel/preset-env', { loose: true, modules: targetModule }],
    [
      '@babel/preset-react',
      {
        // Adds component stack to warning messages
        // Adds __self attribute to JSX which React will use for some warnings
        development: isEnvDevelopment || isEnvTest,
        // Will use the native built-in instead of trying to polyfill
        // behavior for any plugins that require one.
        useBuiltIns: true,
      },
    ],
  ],
  plugins: [
    ['@babel/proposal-class-properties', { loose: true }],
    [
      '@babel/plugin-transform-runtime',
      {
        helpers: true,
        useESModules: true,
      },
    ],
    isEnvProduction && ['transform-react-remove-prop-types'],
  ].filter(Boolean),
};
