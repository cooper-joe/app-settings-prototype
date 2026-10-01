import { render, screen } from '@testing-library/react'
import React from 'react'
import { AppSettingsCatalogueContext } from './AppSettingsCatalogue.jsx'
import { AppSettingsTitle } from './AppSettingsTitle.jsx'
import { SelectedAppContext } from './SelectedAppContext.js'

const workspaceBuilder = { app: { key: 'workspace-builder', name: 'Workspace Builder' } }
const dashboard = { app: { key: 'dashboard', name: 'Dashboard' } }

const renderTitle = (value, appKey = null) =>
    render(
        <AppSettingsCatalogueContext.Provider value={value}>
            <SelectedAppContext.Provider value={appKey}>
                <AppSettingsTitle />
            </SelectedAppContext.Provider>
        </AppSettingsCatalogueContext.Provider>
    )

describe('AppSettingsTitle', () => {
    it('names the app on screen', () => {
        renderTitle(
            { found: [dashboard, workspaceBuilder], manageable: [workspaceBuilder] },
            'dashboard'
        )
        expect(screen.getByText('Dashboard settings')).toBeTruthy()
    })

    it('names the fallback app when the URL names none', () => {
        renderTitle({ found: [dashboard, workspaceBuilder], manageable: [workspaceBuilder] })
        expect(screen.getByText('Workspace Builder settings')).toBeTruthy()
    })

    it('says App settings when there is no app', () => {
        renderTitle({ loading: true })
        expect(screen.getByText('App settings')).toBeTruthy()
    })
})
