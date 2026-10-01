const SETTINGS_MODULE_NAMES = ['dhis-web-settings', 'settings']

/**
 * Returns the shell path that opens System Settings › Apps on the given
 * app's tab, e.g. '/settings#/apps?app=dashboard', or null when there is
 * no System Settings to link to.
 */
export const settingsDoorPath = ({ modules, appKey }) => {
    if (!appKey) {
        return null
    }
    const settingsModule = (modules || []).find((module) =>
        SETTINGS_MODULE_NAMES.includes(module.name)
    )
    if (!settingsModule) {
        return null
    }
    const settingsPath = settingsModule.name.replace('dhis-web-', '')
    return `/${settingsPath}#/apps?app=${encodeURIComponent(appKey)}`
}
