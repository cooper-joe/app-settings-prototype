import { CustomDataProvider } from '@dhis2/app-runtime'
import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { AppSettingsCatalogueContext } from './AppSettingsCatalogue.jsx'
import AppSettingsPage from './AppSettingsPage.jsx'
import { SelectedAppContext } from './SelectedAppContext.js'

const mockReadAppSettings = jest.fn(async () => ({ values: {}, sources: {} }))

jest.mock('../app-settings-lib/index.js', () => ({
    ...jest.requireActual('../app-settings-lib/index.js'),
    readAppSettings: (...args) => mockReadAppSettings(...args),
}))

beforeEach(() => mockReadAppSettings.mockClear())

const entry = (key, name, adminAuthority) => ({
    app: { key, name, version: '1.0.0', iconUrl: null },
    description: {
        app: key,
        namespace: `${key}-settings`,
        adminAuthority,
        sections: [],
        settings: [],
    },
})
const dashboard = entry('dashboard', 'Dashboard', 'DASHBOARD_ADMIN')
const workspaceBuilder = entry('workspace-builder', 'Workspace Builder', 'WORKSPACE_BUILDER_ADMIN')

const catalogue = (overrides = {}) => ({
    loading: false,
    found: [dashboard, workspaceBuilder],
    manageable: [workspaceBuilder],
    authorities: ['WORKSPACE_BUILDER_ADMIN'],
    ...overrides,
})

const renderPage = ({ appKey = null, value = catalogue() } = {}) =>
    render(
        <CustomDataProvider data={{}}>
            <AppSettingsCatalogueContext.Provider value={value}>
                <SelectedAppContext.Provider value={appKey}>
                    <AppSettingsPage />
                </SelectedAppContext.Provider>
            </AppSettingsCatalogueContext.Provider>
        </CustomDataProvider>
    )

// The page no longer names its app (the section title does), so the
// tests check whose values it reads.
const readsValuesOf = async (entry) => {
    await waitFor(() => expect(mockReadAppSettings).toHaveBeenCalled())
    expect(mockReadAppSettings.mock.calls[0][1]).toBe(entry.description)
}

describe('AppSettingsPage', () => {
    it('shows the app named by the key, with no tab bar or header', async () => {
        renderPage({ appKey: 'workspace-builder' })
        await readsValuesOf(workspaceBuilder)
        expect(screen.queryByRole('tab')).toBeNull()
        expect(screen.queryByRole('heading')).toBeNull()
    })

    it('falls back to the first app the user can change', async () => {
        renderPage({ appKey: null })
        await readsValuesOf(workspaceBuilder)
    })

    it('falls back when the key names no app', async () => {
        renderPage({ appKey: 'not-installed' })
        await readsValuesOf(workspaceBuilder)
    })

    it('explains when the user cannot change the linked app', async () => {
        renderPage({ appKey: 'dashboard' })
        expect(
            await screen.findByText('You cannot change these settings')
        ).toBeTruthy()
        expect(screen.getByText(/DASHBOARD_ADMIN/)).toBeTruthy()
        expect(mockReadAppSettings).not.toHaveBeenCalled()
    })

    it('says so when the user can change no apps', async () => {
        renderPage({
            value: catalogue({ manageable: [], authorities: [] }),
        })
        expect(
            await screen.findByText('No app settings you can change')
        ).toBeTruthy()
    })

    it('shows the discovery error', async () => {
        renderPage({
            value: catalogue({ found: [], error: new Error('boom') }),
        })
        expect(
            await screen.findByText('Could not load app settings')
        ).toBeTruthy()
    })
})
