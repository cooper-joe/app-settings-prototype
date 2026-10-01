import { discoverAppSettings } from './discoverAppSettings.js'

const dashboardDescription = {
    version: 1,
    app: 'dashboard',
    title: 'Dashboard',
    namespace: 'dashboard-settings',
    adminAuthority: 'DASHBOARD_SETTINGS_ADMIN',
    settings: [{ key: 'allowVisViewAs', type: 'boolean', default: true }],
}

const engine = {
    query: jest.fn(async () => ({
        apps: [
            {
                key: 'maps',
                displayName: 'Maps',
                version: '101.0.0',
                baseUrl: 'https://server/api/apps/maps',
            },
            { key: 'dashboard', name: 'Dashboard', version: '101.7.1' },
            { key: 'broken', name: 'Broken', baseUrl: 'https://server/broken' },
        ],
    })),
}

const fetchImpl = jest.fn(async (url) => {
    if (url === 'https://server/api/apps/dashboard/settings.json') {
        return { ok: true, json: async () => dashboardDescription }
    }
    if (url === 'https://server/broken/settings.json') {
        return { ok: true, json: async () => ({ version: 1 }) }
    }
    return { ok: false, status: 404 }
})

describe('discoverAppSettings', () => {
    it('returns only apps that ship a valid description', async () => {
        const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
        const found = await discoverAppSettings({
            engine,
            serverBaseUrl: 'https://server',
            fetchImpl,
        })
        expect(found).toHaveLength(1)
        expect(found[0].app).toEqual({
            key: 'dashboard',
            name: 'Dashboard',
            version: '101.7.1',
            baseUrl: 'https://server/api/apps/dashboard',
        })
        expect(found[0].description.namespace).toBe('dashboard-settings')
        expect(fetchImpl).toHaveBeenCalledWith(
            'https://server/api/apps/maps/settings.json',
            { credentials: 'include' }
        )
        expect(warn).toHaveBeenCalledTimes(1)
        warn.mockRestore()
    })
})
