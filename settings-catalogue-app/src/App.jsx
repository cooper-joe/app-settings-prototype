import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    CenteredContent,
    CircularLoader,
    CssVariables,
    DataTable,
    DataTableBody,
    DataTableCell,
    DataTableColumnHeader,
    DataTableHead,
    DataTableRow,
    NoticeBox,
} from '@dhis2/ui'
import React, { useEffect, useState } from 'react'
import styles from './App.module.css'
import { useAppSettings } from './app-settings-lib/index.js'
import { formatValue, loadDisplayNames, sourceLabel } from './currentValues.js'

const AppContent = () => {
    const engine = useDataEngine()
    const { loading, error, description, values, sources } = useAppSettings()
    const [names, setNames] = useState(null)

    useEffect(() => {
        if (!description) {
            return undefined
        }
        let cancelled = false
        loadDisplayNames(engine, description, values)
            .then((result) => !cancelled && setNames(result))
            .catch(() => !cancelled && setNames({}))
        return () => {
            cancelled = true
        }
    }, [engine, description, values])

    if (error) {
        return (
            <NoticeBox error title={i18n.t('Could not load the settings')}>
                {error.message}
            </NoticeBox>
        )
    }
    if (loading || !names) {
        return (
            <CenteredContent>
                <CircularLoader />
            </CenteredContent>
        )
    }

    return (
        <main className={styles.page}>
            <h1 className={styles.title}>{i18n.t('Settings Catalogue')}</h1>
            <p className={styles.intro}>
                {i18n.t(
                    'This app has no features. Its settings.json uses every setting type an app can describe, and this table shows the values it reads back. Change them in System Settings › Apps › Settings Catalogue.'
                )}
            </p>
            <DataTable>
                <DataTableHead>
                    <DataTableRow>
                        <DataTableColumnHeader>
                            {i18n.t('Setting')}
                        </DataTableColumnHeader>
                        <DataTableColumnHeader>
                            {i18n.t('Type')}
                        </DataTableColumnHeader>
                        <DataTableColumnHeader>
                            {i18n.t('Value')}
                        </DataTableColumnHeader>
                        <DataTableColumnHeader>
                            {i18n.t('Source')}
                        </DataTableColumnHeader>
                    </DataTableRow>
                </DataTableHead>
                <DataTableBody>
                    {description.settings.map((setting) => (
                        <DataTableRow key={setting.key}>
                            <DataTableCell>{setting.label}</DataTableCell>
                            <DataTableCell>
                                <code>{setting.type}</code>
                            </DataTableCell>
                            <DataTableCell>
                                {formatValue(
                                    setting,
                                    values[setting.key],
                                    names
                                )}
                            </DataTableCell>
                            <DataTableCell>
                                {sourceLabel(sources[setting.key])}
                            </DataTableCell>
                        </DataTableRow>
                    ))}
                </DataTableBody>
            </DataTable>
        </main>
    )
}

// @dhis2/ui's CSS variables (spacers, colours, theme) aren't defined by the
// App Platform shell, so every var(--…) in the app's styles needs this.
const App = () => (
    <>
        <CssVariables colors spacers theme />
        <AppContent />
    </>
)

export default App
