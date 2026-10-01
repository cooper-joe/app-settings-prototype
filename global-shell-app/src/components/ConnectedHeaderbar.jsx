import { usePWAUpdateState } from '@dhis2/pwa'
import PropTypes from 'prop-types'
import React, { useMemo, useEffect } from 'react'
import { useParams } from 'react-router'
import { useClientPWAUpdateState } from '../lib/clientPWAUpdateState.jsx'
import { ConfirmUpdateModal } from './ConfirmUpdateModal.tsx'
import getContrastingColor from './get-contrasting-color.js'
import { aboutFromApiApp } from './header-bar/app-menu/appInfo.js'
import { CustomColorProvider } from './header-bar/custom-color-context.jsx'
import { HeaderBar } from './header-bar/index.js'

const getAppDisplayName = (appName, modules) => {
    // todo: check this out if core apps get a different naming scheme
    return modules.find(
        (m) => m.name === appName || m.name === 'dhis-web-' + appName
    )?.displayName
}

// Currently, not all core apps are included in the api/apps response:
// need to check /api/apps and /dhis-web-apps/apps-bundle.json
const getAppVersion = (appName, apps, bundledApps) => {
    const parsedAppName = appName.replace('dhis-web-', '')
    // First
    return (
        apps.find((a) => a.key === parsedAppName)?.version ||
        bundledApps.find((ba) => ba.name === parsedAppName)?.version
    )
}

// todo:
// type PWAUpdateState = {
//     updateAvailable: boolean
//     confirmReload: () => void
//     confirmationRequired: boolean
//     clientsCount: number | null
//     onConfirmUpdate: () => void
//     onCancelUpdate: () => void
// }

/**
 * Copied from ConnectedHeaderBar in app adapter:
 * Check for SW updates or a first activation, displaying an update notification
 * message in the HeaderBar profile menu. Does this both for this app itself,
 * and for the client app.
 *
 * When an update is applied, if there are multiple tabs of this app open,
 * there's anadditional warning step because all clients of the service worker
 * will reload when there's an update, which may cause data loss.
 */
export function ConnectedHeaderBar({ appsInfoQuery }) {
    const params = useParams()
    const clientPWAUpdateState = useClientPWAUpdateState()
    const selfPWAUpdateState = usePWAUpdateState()

    const appName = useMemo(() => {
        if (!params.appName || !appsInfoQuery.data) {
            return
        }
        if (appsInfoQuery.data) {
            return getAppDisplayName(
                params.appName,
                appsInfoQuery.data.appMenu.modules
            )
        }
        return params.appName
    }, [appsInfoQuery.data, params.appName])

    // Set new displayname to page title when it updates
    useEffect(() => {
        if (appName) {
            document.title = `${appName} | DHIS2`
        }
    }, [appName])

    const appVersion = useMemo(() => {
        if (!params.appName || !appsInfoQuery.data) {
            return
        }

        // In v43, the structure of the response changed from `[...apps]`
        // to `{ buildDate, apps: [...apps] }`
        const bundledApps =
            appsInfoQuery.data.bundledApps?.apps ??
            appsInfoQuery.data.bundledApps

        return getAppVersion(
            params.appName,
            appsInfoQuery.data.apps,
            bundledApps
        )
    }, [appsInfoQuery.data, params.appName])

    // Which app is open, for the app-name menu: its settings door and
    // "About". Apps that are not in /api/apps get no baseUrl (the loader then
    // falls back to /api/apps/<key>) and nothing more to say about them.
    const clientApp = useMemo(() => {
        if (!params.appName || !appsInfoQuery.data) {
            return
        }
        const key = params.appName.replace('dhis-web-', '')
        const installed = appsInfoQuery.data.apps?.find((a) => a.key === key)
        return {
            key,
            baseUrl: installed?.baseUrl,
            about: aboutFromApiApp(installed),
        }
    }, [appsInfoQuery.data, params.appName])

    // For now, the header bar can only show one "Update available" badge, so
    // choose the right values based on which update(s) is/are available:
    // By default, use client's PWA update state. If there's an update available for
    // the global shell, though, the self PWA update state takes precedent
    const {
        updateAvailable,
        confirmReload,
        confirmationRequired,
        clientsCount,
        onConfirmUpdate,
        onCancelUpdate,
    } = selfPWAUpdateState.updateAvailable
        ? selfPWAUpdateState
        : clientPWAUpdateState

    const bgColor =
        appsInfoQuery?.data?.systemSettings.keyCustomColor || '#165c92'

    const color = useMemo(() => getContrastingColor(bgColor), [bgColor])

    const colorProviderProps = bgColor ? { bgColor, color } : {}

    return (
        <CustomColorProvider {...colorProviderProps}>
            <HeaderBar
                className={'global-shell-header'}
                // `undefined` defaults to app title in header bar component,
                // i.e. "Global Shell" -- use ' ' instead (and not '')
                appName={appName || ' '}
                appVersion={appVersion}
                clientApp={clientApp}
                updateAvailable={updateAvailable}
                onApplyAvailableUpdate={confirmReload}
            />
            {confirmationRequired ? (
                <ConfirmUpdateModal
                    clientsCount={clientsCount}
                    onConfirm={onConfirmUpdate}
                    onCancel={onCancelUpdate}
                />
            ) : null}
        </CustomColorProvider>
    )
}
ConnectedHeaderBar.propTypes = { appsInfoQuery: PropTypes.object }
