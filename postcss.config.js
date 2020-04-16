const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const sass = require('@csstools/postcss-sass');

module.exports = {
  plugins: [
    sass('./src/App.scss'),
    autoprefixer,
    cssnano({
      preset: 'default',
    })
  ]
}