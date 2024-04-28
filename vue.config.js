const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  devServer: {
    proxy: {
      '/api': {
        target: 'http://223.130.130.160:8080'
      },
      '/auth': {
        target: 'http://223.130.130.160:8080'
}
    }
  },
  transpileDependencies: true,
    runtimeCompiler: true,
  pluginOptions: {
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}
  }
})
