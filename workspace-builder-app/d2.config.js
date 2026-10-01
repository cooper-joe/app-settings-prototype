/** @type {import('@dhis2/cli-app-scripts').D2Config} */
const config = {
    type: 'app',
    name: 'workspace-builder',
    title: 'Workspace Builder',
    description:
        'App settings prototype: an app whose setting needs a custom control.',

    customAuthorities: ['WORKSPACE_BUILDER_SETTINGS_ADMIN'],
    additionalNamespaces: [
        {
            namespace: 'workspace-builder-settings',
            authorities: ['WORKSPACE_BUILDER_SETTINGS_ADMIN'],
            // dhis2-core names a custom app's own authority "M_" plus its
            // name without non-alphanumerics.
            readOnlyAuthorities: ['M_workspacebuilder'],
        },
    ],

    // Workspace Builder has no dashboard plugin, so its only plugin entry point can
    // be its settings control. A real app like Maps would need named plugin
    // entry points in App Platform.
    entryPoints: {
        app: './src/App.jsx',
        plugin: './src/SettingsPlugin.jsx',
    },
}

module.exports = config
