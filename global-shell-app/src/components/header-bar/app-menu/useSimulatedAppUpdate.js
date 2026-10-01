import { useCallback, useState } from 'react'

// Prototype: pretend this app always has an update waiting, to show where
// "App updates available" belongs. A real one would come from the client
// app's service worker (useClientPWAUpdateState).
export const SIMULATED_UPDATE_APP = 'settings-catalogue'

const storageKey = (appKey) => `prototype.simulatedUpdateApplied.${appKey}`

const wasApplied = (appKey) => {
    try {
        return window.sessionStorage.getItem(storageKey(appKey)) === 'true'
    } catch {
        return false
    }
}

const defaultReload = () => window.location.reload()

/**
 * Whether the app menu should say an update is waiting for the open app.
 * Applying it reloads the page, like a real update, and the notice stays
 * gone until the tab is closed.
 */
export const useSimulatedAppUpdate = (appKey, reload = defaultReload) => {
    const [applied, setApplied] = useState({})

    const updateAvailable =
        appKey === SIMULATED_UPDATE_APP &&
        !applied[appKey] &&
        !wasApplied(appKey)

    const applyUpdate = useCallback(() => {
        try {
            window.sessionStorage.setItem(storageKey(appKey), 'true')
        } catch {
            // Without storage the notice comes back after the reload
        }
        setApplied((current) => ({ ...current, [appKey]: true }))
        reload()
    }, [appKey, reload])

    return { updateAvailable, applyUpdate }
}
