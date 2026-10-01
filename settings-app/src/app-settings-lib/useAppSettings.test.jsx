import { CustomDataProvider } from '@dhis2/app-runtime'
import { act, renderHook, waitFor } from '@testing-library/react'
import React from 'react'
import { useAppSettings } from './useAppSettings.js'

const description = {
    version: 1,
    app: 'workspace-builder',
    title: 'Workspace Builder',
    namespace: 'workspace-builder-settings',
    adminAuthority: 'WORKSPACE_BUILDER_SETTINGS_ADMIN',
    settings: [
        {
            key: 'homeLayout',
            type: 'custom',
            appPath: '#/edit-layout',
            default: { tiles: [] },
        },
    ],
}

const stored = { tiles: [{ id: 'weather', size: 'wide' }] }

const wrapper = ({ children }) => (
    <CustomDataProvider
        data={{
            'dataStore/workspace-builder-settings': ['homeLayout'],
            'dataStore/workspace-builder-settings/homeLayout': { value: stored },
        }}
    >
        {children}
    </CustomDataProvider>
)

describe('useAppSettings', () => {
    it("reads the app's own description and values", async () => {
        const fetchImpl = jest.fn(async () => ({
            ok: true,
            json: async () => description,
        }))
        const { result } = renderHook(() => useAppSettings({ fetchImpl }), {
            wrapper,
        })
        expect(result.current.loading).toBe(true)
        await waitFor(() => expect(result.current.loading).toBe(false))
        expect(fetchImpl).toHaveBeenCalledWith('settings.json')
        expect(result.current.description.namespace).toBe('workspace-builder-settings')
        expect(result.current.values.homeLayout).toEqual(stored)
        expect(result.current.sources.homeLayout).toBe('app')

        await act(async () => result.current.refresh())
        await waitFor(() => expect(fetchImpl).toHaveBeenCalledTimes(2))
    })

    it('reports a missing settings.json', async () => {
        const fetchImpl = jest.fn(async () => ({ ok: false, status: 404 }))
        const { result } = renderHook(() => useAppSettings({ fetchImpl }), {
            wrapper,
        })
        await waitFor(() => expect(result.current.loading).toBe(false))
        expect(result.current.error.message).toBe(
            'Could not load settings.json (404)'
        )
    })
})
