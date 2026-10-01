import { CustomDataProvider } from '@dhis2/app-runtime'
import { render, screen } from '@testing-library/react'
import React from 'react'
import {
    AppSettingsCatalogueProvider,
    useAppSettingsCatalogue,
} from './AppSettingsCatalogue.jsx'

const entry = (key, name, adminAuthority) => ({
    app: { key, name, baseUrl: `https://server/api/apps/${key}` },
    description: { adminAuthority, sections: [], settings: [] },
})

jest.mock('../app-settings-lib/index.js', () => ({
    ...jest.requireActual('../app-settings-lib/index.js'),
    discoverAppSettings: async () => [
        entry('dashboard', 'Dashboard', 'DASHBOARD_ADMIN'),
        entry('workspace-builder', 'Workspace Builder', 'WORKSPACE_BUILDER_ADMIN'),
    ],
}))

const Probe = () => {
    const { loading, found, manageable } = useAppSettingsCatalogue()
    if (loading) {
        return <p>loading</p>
    }
    return (
        <ul>
            {found.map(({ app }) => (
                <li key={app.key}>
                    {app.name}|{String(app.iconUrl)}|
                    {manageable.some((m) => m.app.key === app.key)
                        ? 'manageable'
                        : 'read-only'}
                </li>
            ))}
        </ul>
    )
}

const renderWith = (authorities) =>
    render(
        <CustomDataProvider
            data={{
                me: { authorities },
                apps: [
                    { key: 'dashboard', icons: { 48: 'icon.png' } },
                    { key: 'workspace-builder' },
                ],
            }}
        >
            <AppSettingsCatalogueProvider>
                <Probe />
            </AppSettingsCatalogueProvider>
        </CustomDataProvider>
    )

describe('AppSettingsCatalogueProvider', () => {
    it('adds icon URLs and marks the apps the user can change', async () => {
        renderWith(['WORKSPACE_BUILDER_ADMIN'])
        expect(
            await screen.findByText(
                'Dashboard|https://server/api/apps/dashboard/icon.png|read-only'
            )
        ).toBeTruthy()
        expect(screen.getByText('Workspace Builder|null|manageable')).toBeTruthy()
    })

    it('treats ALL as able to change every app', async () => {
        renderWith(['ALL'])
        expect(
            await screen.findByText(
                'Dashboard|https://server/api/apps/dashboard/icon.png|manageable'
            )
        ).toBeTruthy()
        expect(screen.getByText('Workspace Builder|null|manageable')).toBeTruthy()
    })
})
