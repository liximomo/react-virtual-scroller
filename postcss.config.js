const path = require('path');
// const autoprefixer = require('autoprefixer');
const cssnext = require('postcss-cssnext');
const url = require("postcss-url")

module.exports = {
  plugins: [
    cssnext({
      browsers: [
        '>1%',
        'last 4 versions',
        'Firefox ESR',
        'not ie < 9', // React doesn't support IE8 anyway
      ],
      features: {
        autoprefixer: {
          flexbox: 'no-2009',
        }
      }
    }),
    url({
      url: 'copy',
      // base path to search assets from
      basePath: path.resolve(__dirname, 'src/assets'),
      // dir to copy assets
      assetsPath: 'assets',
      // using hash names for assets (generates from asset content)
      useHash: true
    })
  ],
};
