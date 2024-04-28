const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  devServer: {
    proxy: {
      '/api': {
        target: 'https://veritas-s.app'
      },
      '/auth': {
        target: 'https://veritas-s.app'
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
