import { useDataEngine } from '@dhis2/app-runtime'
import { useCallback } from 'react'
import { useFetchSupersetBaseUrl } from '../../api/supersetGateway.js'
import { parseDescription } from '../../app-settings-lib/parseDescription.js'
import { readAppSettings } from '../../app-settings-lib/storage.js'
import { useAsyncCallbackState } from './useAsyncCallbackState.js'

// `settings.json` is a static file in `public/`, served alongside the built
// app (and readable by other apps at `.../api/apps/dashboard/settings.json`,
// the same way `discoverAppSettings.js` reads it). It's fetched at runtime
// rather than statically imported: the App Platform build copies `src/`
// into a nested `D2App` directory, so a relative import reaching outside
// `src` into `public/` resolves correctly in Jest but not in the Vite build.
let appSettingsDescriptionPromise
export const getAppSettingsDescription = () => {
    if (!appSettingsDescriptionPromise) {
        appSettingsDescriptionPromise = fetch('settings.json')
            .then((response) => response.json())
            .then(parseDescription)
    }
    return appSettingsDescriptionPromise
}

const SYSTEM_SETTINGS_WITH_DEFAULTS = {
    keyDashboardContextMenuItemOpenInRelevantApp: true,
    keyDashboardContextMenuItemShowInterpretationsAndDetails: true,
    keyDashboardContextMenuItemSwitchViewType: true,
    keyDashboardContextMenuItemViewFullscreen: true,
    keyGatherAnalyticalObjectStatisticsInDashboardViews: false,
    startModuleEnableLightweight: false,
    keyEmbeddedDashboardsEnabled: undefined,
    keyHideBiMonthlyPeriods: undefined,
    keyHideBiWeeklyPeriods: undefined,
    keyHideDailyPeriods: undefined,
    keyHideMonthlyPeriods: undefined,
    keyHideWeeklyPeriods: undefined,
}
const SYSTEM_SETTINGS_KEYS = Object.keys(SYSTEM_SETTINGS_WITH_DEFAULTS)

// Exported so tests can assert `public/settings.json`'s `legacySystemSetting`
// values stay in sync with the keys this table actually remaps (see
// `__tests__/settingsDescription.spec.js`).
export const SYSTEM_SETTINGS_REMAPPINGS = {
    keyDashboardContextMenuItemOpenInRelevantApp: 'allowVisOpenInApp',
    keyDashboardContextMenuItemShowInterpretationsAndDetails:
        'allowVisShowInterpretations',
    keyDashboardContextMenuItemSwitchViewType: 'allowVisViewAs',
    keyDashboardContextMenuItemViewFullscreen: 'allowVisFullscreen',
    keyHideBiMonthlyPeriods: 'hideBiMonthlyPeriods',
    keyHideDailyPeriods: 'hideDailyPeriods',
    keyHideMonthlyPeriods: 'hideMonthlyPeriods',
    keyHideWeeklyPeriods: 'hideWeeklyPeriods',
    keyHideBiWeeklyPeriods: 'hideBiWeeklyPeriods',
    keyEmbeddedDashboardsEnabled: 'embeddedDashboardsEnabled',
}

const transformSystemSettings = (fetchedSettings) =>
    SYSTEM_SETTINGS_KEYS.reduce((cleanedSettings, key) => {
        const remappedKey = SYSTEM_SETTINGS_REMAPPINGS[key] ?? key
        const value = fetchedSettings[key] ?? SYSTEM_SETTINGS_WITH_DEFAULTS[key]
        cleanedSettings[remappedKey] = value
        return cleanedSettings
    }, {})

const systemSettingsQuery = {
    resource: 'systemSettings',
    // This currently does nothing but will help once DHIS2-19606 is done
    params: { key: SYSTEM_SETTINGS_KEYS },
}

export function useSystemSettingsQuery() {
    const engine = useDataEngine()
    const fetchSupersetBaseUrl = useFetchSupersetBaseUrl()
    /* The app could still work if the system settings can't be
     * fetched, because there is default for everything */
    const fetchSystemSettings = useCallback(async () => {
        const systemSettings = await engine
            .query({ systemSettings: systemSettingsQuery })
            .then(({ systemSettings }) => systemSettings)
            .catch(() => ({}))
            .then(transformSystemSettings)

        try {
            const appSettingsDescription = await getAppSettingsDescription()
            const { values } = await readAppSettings(
                engine,
                appSettingsDescription
            )
            Object.assign(systemSettings, values)
        } catch (error) {
            console.warn(
                'Could not read Dashboard app settings; using system settings',
                error
            )
        }

        if (systemSettings.embeddedDashboardsEnabled) {
            try {
                const { supersetBaseUrl, capability } =
                    await fetchSupersetBaseUrl()
                systemSettings.supersetBaseUrl = supersetBaseUrl
                systemSettings.supersetGatewayCapability = capability
            } catch {
                systemSettings.supersetBaseUrl = null
                systemSettings.supersetGatewayCapability = null
            }
        }
        return systemSettings
    }, [engine, fetchSupersetBaseUrl])

    return useAsyncCallbackState(fetchSystemSettings)
}
