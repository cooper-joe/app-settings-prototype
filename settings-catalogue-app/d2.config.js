/** @type {import('@dhis2/cli-app-scripts').D2Config} */
const config = {
    type: 'app',
    name: 'settings-catalogue',
    title: 'Settings Catalogue',
    description:
        'App settings prototype: every setting type an app can describe in settings.json.',

    customAuthorities: ['SETTINGS_CATALOGUE_ADMIN'],
    additionalNamespaces: [
        {
            namespace: 'settings-catalogue-settings',
            authorities: ['SETTINGS_CATALOGUE_ADMIN'],
            // dhis2-core names a custom app's own authority "M_" plus its
            // name without non-alphanumerics.
            readOnlyAuthorities: ['M_settingscatalogue'],
        },
    ],

    entryPoints: {
        app: './src/App.jsx',
    },
}

module.exports = config
