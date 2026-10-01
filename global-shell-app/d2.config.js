const config = {
    id: '3491d347-bc0c-4eea-8412-1670607fd3f7',
    type: 'app',
    name: 'global-shell', // This must be exact to be used as the global shell
    title: 'Global Shell',
    minDHIS2Version: '2.42',

    pwa: { enabled: true },
    direction: 'auto',

    entryPoints: {
        app: './src/App.jsx',
    },
}

module.exports = config
