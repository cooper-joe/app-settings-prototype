import { useAlert, useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './App.module.css'
import { saveAppSetting } from './app-settings-lib/index.js'
import { LayoutEditor } from './layout/LayoutEditor.jsx'
import { useDraftLayout } from './layout/useDraftLayout.js'

// Workspace Builder's own settings page: the route for apps that can't ship a
// settings plugin. It uses the same editor and the same stored value as the
// plugin in System Settings.
export const EditLayoutPage = ({ settings, isAdmin }) => {
    const engine = useDataEngine()
    const { show } = useAlert(
        ({ message }) => message,
        ({ critical }) => (critical ? { critical: true } : { success: true })
    )
    const [layout, setLayout] = useDraftLayout(settings.values.homeLayout)

    const handleChange = async (next) => {
        setLayout(next)
        try {
            await saveAppSetting(
                engine,
                settings.description,
                'homeLayout',
                next
            )
            show({ message: i18n.t('Layout saved') })
            settings.refresh()
        } catch (error) {
            show({
                message: i18n.t('Could not save the layout: {{message}}', {
                    message: error.message,
                    nsSeparator: '-:-',
                }),
                critical: true,
            })
        }
    }

    return (
        <main className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.title}>
                    {i18n.t('Edit home screen layout')}
                </h1>
                <Button
                    small
                    secondary
                    onClick={() => {
                        window.location.hash = '#/'
                    }}
                >
                    {i18n.t('Back to home')}
                </Button>
            </header>
            <p className={styles.intro}>
                {i18n.t(
                    "This is Workspace Builder's own settings page. System Settings › Apps › Workspace Builder shows the same editor, and both save the same value."
                )}
            </p>
            {isAdmin ? (
                <LayoutEditor layout={layout} onChange={handleChange} />
            ) : (
                <NoticeBox title={i18n.t('You cannot change the layout')}>
                    {i18n.t('This needs the {{authority}} authority.', {
                        authority: settings.description.adminAuthority,
                        nsSeparator: '-:-',
                    })}
                </NoticeBox>
            )}
        </main>
    )
}

EditLayoutPage.propTypes = {
    isAdmin: PropTypes.bool.isRequired,
    settings: PropTypes.shape({
        description: PropTypes.object.isRequired,
        refresh: PropTypes.func.isRequired,
        values: PropTypes.object.isRequired,
    }).isRequired,
}
