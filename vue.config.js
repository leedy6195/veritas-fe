const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080'
      },
      '/auth': {
        target: 'http://localhost:8080'
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
