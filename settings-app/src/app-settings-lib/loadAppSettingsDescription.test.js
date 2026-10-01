import { loadAppSettingsDescription } from './discoverAppSettings.js'

const description = {
    version: 1,
    app: 'dashboard',
    title: 'Dashboard',
    namespace: 'dashboard-settings',
    adminAuthority: 'DASHBOARD_SETTINGS_ADMIN',
    settings: [{ key: 'allowVisViewAs', type: 'boolean', default: true }],
}

const respondWith = (body) =>
    jest.fn(async () => ({ ok: true, json: async () => body }))

describe('loadAppSettingsDescription', () => {
    it("fetches settings.json from the app's baseUrl", async () => {
        const fetchImpl = respondWith(description)
        const found = await loadAppSettingsDescription(
            {
                key: 'dashboard',
                baseUrl: 'https://server/dhis-web-dashboard/',
                version: '101.7.1',
            },
            'https://server',
            fetchImpl
        )
        expect(fetchImpl).toHaveBeenCalledWith(
            'https://server/dhis-web-dashboard/settings.json',
            { credentials: 'include' }
        )
        expect(found.app).toEqual({
            key: 'dashboard',
            name: 'dashboard',
            version: '101.7.1',
            baseUrl: 'https://server/dhis-web-dashboard',
        })
        expect(found.description.namespace).toBe('dashboard-settings')
    })

    it('falls back to /api/apps/<key> without a baseUrl', async () => {
        const fetchImpl = respondWith(description)
        await loadAppSettingsDescription(
            { key: 'dashboard' },
            'https://server',
            fetchImpl
        )
        expect(fetchImpl).toHaveBeenCalledWith(
            'https://server/api/apps/dashboard/settings.json',
            { credentials: 'include' }
        )
    })

    it('returns null when the app has no settings.json', async () => {
        const fetchImpl = jest.fn(async () => ({ ok: false, status: 404 }))
        expect(
            await loadAppSettingsDescription(
                { key: 'maps' },
                'https://server',
                fetchImpl
            )
        ).toBeNull()
    })

    it('returns null when the request fails', async () => {
        const fetchImpl = jest.fn(async () => {
            throw new TypeError('Failed to fetch')
        })
        expect(
            await loadAppSettingsDescription(
                { key: 'maps' },
                'https://server',
                fetchImpl
            )
        ).toBeNull()
    })

    it('returns null and warns when the description is broken', async () => {
        const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
        const found = await loadAppSettingsDescription(
            { key: 'broken' },
            'https://server',
            respondWith({ version: 1 })
        )
        expect(found).toBeNull()
        expect(warn).toHaveBeenCalledTimes(1)
        warn.mockRestore()
    })
})
