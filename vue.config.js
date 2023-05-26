

module.exports = {
    lintOnSave: false,
    runtimeCompiler: true,
    devServer: {
        port: 80,
    },

    chainWebpack: config => config.plugins.delete('named-chunks'),

    transpileDependencies: [
      'vuetify'
    ]
}
