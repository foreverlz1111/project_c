module.exports = {
  presets: ['@vue/app'],
  ignore: ['sdk/**', '../dist/tim-js-sdk'],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ]
  ]
}
