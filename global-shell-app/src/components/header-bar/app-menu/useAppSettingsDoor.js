import { useEffect, useState } from 'react'
import { loadAppSettingsDescription } from '../../../app-settings-lib/discoverAppSettings.js'
import { canAdminister } from '../../../app-settings-lib/permissions.js'

const defaultFetch = (...args) => fetch(...args)

/**
 * Whether the header bar should offer "Settings" in the app menu for the open app:
 * - 'loading' while its settings description is being fetched
 * - 'none' when there is no app, no valid description, or the user may not
 *   change the settings
 * - 'available' otherwise
 *
 * Hiding the door is not security: the app's datastore namespace enforces
 * who may save.
 */
export const useAppSettingsDoor = ({
    app,
    serverBaseUrl,
    authorities,
    fetchImpl = defaultFetch,
}) => {
    const key = app?.key
    const baseUrl = app?.baseUrl
    const [loaded, setLoaded] = useState({
        key: undefined,
        description: null,
    })

    useEffect(() => {
        if (!key) {
            return undefined
        }
        let cancelled = false
        loadAppSettingsDescription(
            { key, baseUrl },
            serverBaseUrl,
            fetchImpl
        ).then((found) => {
            if (!cancelled) {
                setLoaded({ key, description: found?.description ?? null })
            }
        })
        return () => {
            cancelled = true
        }
    }, [key, baseUrl, serverBaseUrl, fetchImpl])

    if (!key) {
        return { state: 'none' }
    }
    if (loaded.key !== key) {
        return { state: 'loading' }
    }
    if (
        !loaded.description ||
        !canAdminister(loaded.description, authorities)
    ) {
        return { state: 'none' }
    }
    return { state: 'available' }
}
