module.exports = {
  publicPath: './',
  // outputDir:"dist",
  // assetsDir: 'public',
  productionSourceMap:false, //不生成map文件
  configureWebpack: {
    resolve: {
      // extensitons: [],
      alias: {
        "components": '@/components',
        "content": 'components/content',
        "common": 'components/common',
        "assets": '@/assets',
        "network": '@/network',
        "views": '@/views',
      }
    },
    devServer: {
      disableHostCheck: true,
      // host: '192.168.1.102',
      // port: 8080
    },
  }
}