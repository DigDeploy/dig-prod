'use strict'
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const CompressionPlugin = require('compression-webpack-plugin')

const name = process.env.VUE_APP_TITLE || '営業支援システム' // ウェブページタイトル

const port = process.env.port || process.env.npm_config_port || 80 // ポート番号

// vue.config.js 設定説明
// 公式vue.config.js 参考ドキュメント https://cli.vuejs.org/zh/config/#css-loaderoptions
// ここでは一部のみを記載しています。詳細な設定はドキュメントを参照してください
module.exports = {
  // 本番環境と開発環境のURLをデプロイします。
  // デフォルトでは、Vue CLIはアプリケーションがドメインのルートパスにデプロイされると仮定します
  // 例えば、アプリケーションがサブパスにデプロイされる場合は、このオプションでサブパスを指定する必要があります。例えば、アプリケーションがにデプロイされる場合は、baseUrlを/admin/に設定します。
  publicPath: process.env.NODE_ENV === "production" ? "/" : "/",
  // npm run buildまたはyarn buildを実行するときに、ファイル生成のディレクトリ名（baseUrlの本番環境パスと一致させる必要があります）（デフォルトはdist）
  outputDir: 'dist',
  // 生成された静的リソース（js、css、img、fonts）を配置するディレクトリ（プロジェクト打包後、静的リソースはこのフォルダに配置されます）
  assetsDir: 'static',
  // eslint保存チェックを有効にするかどうか。有効な値：ture | false | 'error'
  lintOnSave: process.env.NODE_ENV === 'development',
  // 本番環境のsource mapが不要な場合は、falseに設定すると本番環境のビルドを高速化できます。
  productionSourceMap: false,
  // webpack-dev-server 関連設定
  devServer: {
    host: '0.0.0.0',
    port: port,
    open: true,
    proxy: {
      // 詳細: https://cli.vuejs.org/config/#devserver-proxy
      [process.env.VUE_APP_BASE_API]: {
        //target: `https://eigyoshienservice-bhd2gwdud3c5b8fs.eastasia-01.azurewebsites.net`,
        target: `http://localhost:8080`,
        changeOrigin: true,
        // pathRewrite: {
        //   ['^' + process.env.VUE_APP_BASE_API]: ''
        // }
      }
    },
    disableHostCheck: true
  },
  css: {
    loaderOptions: {
      sass: {
        sassOptions: { outputStyle: "expanded" }
      }
    }
  },
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    plugins: [
      new CompressionPlugin({
        cache: false,                   // ファイルキャッシュを無効にする
        test: /\.(js|css|html)?$/i,     // 圧縮するファイル形式
        filename: '[path].gz[query]',   // 圧縮後のファイル名
        algorithm: 'gzip',              // gzipを使用して圧縮
        minRatio: 0.8                   // 圧縮率が1より小さい場合のみ圧縮
      })
    ],
  },
  chainWebpack(config) {
    config.plugins.delete('preload') // TODO: テストが必要
    config.plugins.delete('prefetch') // TODO: テストが必要

    // svg-sprite-loaderを設定
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
            // `runtime`はruntimeChunk名と一致する必要があります。デフォルトは`runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // 最初に依存するサードパーティのみをパッケージ化
                },
                elementUI: {
                  name: 'chunk-elementUI', // elementUIを単一のパッケージに分割
                  priority: 20, // 重みはlibsやappより大きくする必要があります。そうしないとlibsやappにパッケージ化されます
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // cnpmに適応するため
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // ルールをカスタマイズできます
                  minChunks: 3, // 最小共通数
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          config.optimization.runtimeChunk('single'),
          {
             from: path.resolve(__dirname, './public/robots.txt'), //クローラー防止ファイル
             to: './' //ルートディレクトリに配置
          }
        }
      )
  }
}
