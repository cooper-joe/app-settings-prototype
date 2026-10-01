import i18n from '@dhis2/d2-i18n'
import { useContext } from 'react'
import { useAppSettingsCatalogue } from './AppSettingsCatalogue.jsx'
import { pickApp } from './pickApp.js'
import { SelectedAppContext } from './SelectedAppContext.js'

// The page title on System Settings › Apps: "<App> settings" for the app
// on screen, or "App settings" while loading or when there's no app.
export const AppSettingsTitle = () => {
    const catalogue = useAppSettingsCatalogue()
    const selected = pickApp(catalogue, useContext(SelectedAppContext))
    if (!selected) {
        return i18n.t('App settings')
    }
    return i18n.t('{{app}} settings', {
        app: selected.app.name,
        nsSeparator: '-:-',
    })
}
