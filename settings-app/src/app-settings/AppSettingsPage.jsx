import { useAlert, useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { CenteredContent, CircularLoader, NoticeBox } from '@dhis2/ui'
import React, {
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react'
import {
    canAdminister,
    readAppSettings,
    resolveValue,
    saveAppSetting,
    SettingsForm,
} from '../app-settings-lib/index.js'
import { useAppSettingsCatalogue } from './AppSettingsCatalogue.jsx'
import styles from './AppSettingsPage.module.css'
import { pickApp } from './pickApp.js'
import { SelectedAppContext } from './SelectedAppContext.js'

const Loading = () => (
    <CenteredContent>
        <CircularLoader />
    </CenteredContent>
)

// Stable identities: useAlert returns a new `show` whenever these two
// callbacks change identity, and an inline arrow would do that on every
// render, which in turn would give handleChange (and the Plugin prop it
// feeds) a new identity every render too.
const alertMessage = ({ message }) => message
const alertOptions = ({ critical }) =>
    critical ? { critical: true } : { success: true }

const AppSettingsPage = () => {
    const engine = useDataEngine()
    const { show: showAlert } = useAlert(alertMessage, alertOptions)
    const catalogue = useAppSettingsCatalogue()
    const appKey = useContext(SelectedAppContext)
    const [appSettings, setAppSettings] = useState(null)

    const selected = pickApp(catalogue, appKey)
    const allowed =
        selected && canAdminister(selected.description, catalogue.authorities)

    // Tracks which app is on screen so a save that resolves after the user
    // has picked another app doesn't land on the wrong app (or on a null state).
    const currentAppKeyRef = useRef(selected?.app.key)
    currentAppKeyRef.current = selected?.app.key

    useEffect(() => {
        if (!selected || !allowed) {
            return undefined
        }
        let cancelled = false
        // Tag the result with its app, so a switch never draws one app's
        // form with another app's values, not even for one render.
        const appKey = selected.app.key
        readAppSettings(engine, selected.description)
            .then(
                (result) => !cancelled && setAppSettings({ appKey, ...result })
            )
            .catch((error) => !cancelled && setAppSettings({ appKey, error }))
        return () => {
            cancelled = true
        }
    }, [engine, selected, allowed])

    const handleChange = useCallback(
        async (key, value) => {
            const selectedKey = selected.app.key
            try {
                await saveAppSetting(engine, selected.description, key, value)
                const setting = selected.description.settings.find(
                    (entry) => entry.key === key
                )
                // Saving null means "use the default", so resolve it the same
                // way a fresh read would, instead of marking it as saved.
                const resolved = resolveValue(setting, { stored: value })
                setAppSettings((previous) => {
                    if (
                        !previous?.values ||
                        currentAppKeyRef.current !== selectedKey
                    ) {
                        return previous
                    }
                    return {
                        ...previous,
                        values: { ...previous.values, [key]: resolved.value },
                        sources: {
                            ...previous.sources,
                            [key]: resolved.source,
                        },
                    }
                })
                showAlert({ message: i18n.t('Setting saved') })
            } catch (error) {
                showAlert({
                    message: i18n.t('Could not save the setting: {{message}}', {
                        message: error.message,
                        nsSeparator: '-:-',
                    }),
                    critical: true,
                })
            }
        },
        [engine, selected, showAlert]
    )

    if (catalogue.loading) {
        return <Loading />
    }
    if (catalogue.error) {
        return (
            <NoticeBox error title={i18n.t('Could not load app settings')}>
                {catalogue.error.message}
            </NoticeBox>
        )
    }
    if (!selected) {
        return (
            <NoticeBox title={i18n.t('No app settings you can change')}>
                {i18n.t(
                    "Apps appear here when they ship a settings description and you have the app's admin authority."
                )}
            </NoticeBox>
        )
    }

    const shown = appSettings?.appKey === selected.app.key ? appSettings : null

    return (
        <div className={styles.page}>
            {!allowed && (
                <NoticeBox title={i18n.t('You cannot change these settings')}>
                    {i18n.t('This needs the {{authority}} authority.', {
                        authority: selected.description.adminAuthority,
                        nsSeparator: '-:-',
                    })}
                </NoticeBox>
            )}
            {allowed && !shown && <Loading />}
            {allowed && shown?.error && (
                <NoticeBox error title={i18n.t('Could not load the values')}>
                    {shown.error.message}
                </NoticeBox>
            )}
            {allowed && shown?.values && (
                <SettingsForm
                    key={selected.app.key}
                    app={selected.app}
                    description={selected.description}
                    values={shown.values}
                    sources={shown.sources}
                    onChange={handleChange}
                />
            )}
        </div>
    )
}

export default AppSettingsPage
