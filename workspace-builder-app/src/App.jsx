import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    CenteredContent,
    CircularLoader,
    CssVariables,
    NoticeBox,
} from '@dhis2/ui'
import React from 'react'
import { canAdminister, useAppSettings } from './app-settings-lib/index.js'
import { EditLayoutPage } from './EditLayoutPage.jsx'
import { HomeScreen } from './HomeScreen.jsx'
import { normaliseLayout } from './layout/layout.js'
import { useHashRoute } from './useHashRoute.js'

const ME_QUERY = { me: { resource: 'me', params: { fields: 'authorities' } } }

const AppContent = () => {
    const hash = useHashRoute()
    const settings = useAppSettings()
    const { data: meData, error: meError } = useDataQuery(ME_QUERY)

    const error = settings.error || meError
    if (error) {
        return (
            <NoticeBox error title={i18n.t('Could not load Workspace Builder')}>
                {error.message}
            </NoticeBox>
        )
    }
    if (settings.loading || !meData) {
        return (
            <CenteredContent>
                <CircularLoader />
            </CenteredContent>
        )
    }

    const isAdmin = canAdminister(settings.description, meData.me.authorities)
    if (hash.startsWith('#/edit-layout')) {
        return <EditLayoutPage settings={settings} isAdmin={isAdmin} />
    }
    return (
        <HomeScreen
            layout={normaliseLayout(settings.values.homeLayout)}
            isAdmin={isAdmin}
        />
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
