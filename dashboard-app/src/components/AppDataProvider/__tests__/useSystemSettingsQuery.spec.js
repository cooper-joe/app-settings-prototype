import { useDataEngine } from '@dhis2/app-runtime'
import { renderHook } from '@testing-library/react-hooks'
import { useSystemSettingsQuery } from '../useSystemSettingsQuery.js'

jest.mock('@dhis2/app-runtime', () => ({
    useDataEngine: jest.fn(),
}))

jest.mock('@dhis2/app-service-config', () => ({
    useConfig: jest.fn(() => ({ baseUrl: 'https://play.dhis2.org' })),
}))

const VALID_DESCRIPTION = {
    version: 1,
    app: 'dashboard',
    title: 'Dashboard',
    namespace: 'dashboard-settings',
    adminAuthority: 'DASHBOARD_SETTINGS_ADMIN',
    sections: [],
    settings: [
        {
            key: 'allowVisViewAs',
            type: 'boolean',
            default: true,
            legacySystemSetting: 'keyDashboardContextMenuItemSwitchViewType',
        },
    ],
}

const mockFetchResolved = (description) => {
    global.fetch = jest.fn().mockResolvedValue({
        json: () => Promise.resolve(description),
    })
}

const buildEngineQuery = ({
    initialSystemSettings = {},
    storedKeys = [],
    legacySystemSettings = {},
} = {}) =>
    jest.fn(async (query) => {
        if (query.systemSettings) {
            const keys = query.systemSettings.params.key
            // The initial, direct systemSettings query in fetchSystemSettings
            // asks for all `SYSTEM_SETTINGS_KEYS` (more than one key); the
            // legacy-value lookup inside `readAppSettings` only asks for the
            // handful of `legacySystemSetting`s in the description.
            if (keys.length > 1) {
                return { systemSettings: initialSystemSettings }
            }
            return { systemSettings: legacySystemSettings }
        }
        if (query.keys) {
            return { keys: storedKeys }
        }
        throw new Error(`Unexpected query: ${JSON.stringify(query)}`)
    })

beforeEach(() => {
    jest.clearAllMocks()
})

// NOTE: `useSystemSettingsQuery.js` caches the fetched `settings.json`
// description in a module-scoped promise, by design, so it's only ever
// fetched once for the lifetime of the app. That means the very first test
// below to exercise the hook is what "primes" that cache for the rest of
// this file: it's the one responsible for asserting the fetch-once/caching
// behavior, and every test after it reuses the same already-resolved
// description (which is fine, since they don't depend on re-fetching it).
describe('useSystemSettingsQuery', () => {
    it('merges the resolved app-settings values into systemSettings, fetching settings.json only once', async () => {
        mockFetchResolved(VALID_DESCRIPTION)
        const engineQuery = buildEngineQuery({
            // The plain legacy system setting says `true`...
            initialSystemSettings: {
                keyDashboardContextMenuItemSwitchViewType: true,
            },
            // ...but the app-settings resolution (via the same legacy key,
            // since nothing is stored yet) says `false`, so the final,
            // merged value should be `false` if the merge is wired up.
            legacySystemSettings: {
                keyDashboardContextMenuItemSwitchViewType: false,
            },
        })
        useDataEngine.mockReturnValue({ query: engineQuery })

        const { result, rerender, waitFor } = renderHook(() =>
            useSystemSettingsQuery()
        )

        await waitFor(() => !!result.current.data)

        expect(result.current.error).toBeUndefined()
        expect(result.current.data.allowVisViewAs).toBe(false)

        const fetchCallsAfterFirstRun = global.fetch.mock.calls.length
        expect(fetchCallsAfterFirstRun).toBeGreaterThan(0)

        // Re-running the hook's callback should not fetch settings.json again.
        rerender()
        await waitFor(() => !!result.current.data)
        expect(global.fetch.mock.calls.length).toBe(fetchCallsAfterFirstRun)
    })

    it('falls back to the existing systemSettings and warns when reading app settings fails', async () => {
        const warnSpy = jest.spyOn(console, 'warn').mockImplementation()
        const engineQuery = jest.fn(async (query) => {
            if (query.systemSettings) {
                const keys = query.systemSettings.params.key
                if (keys.length > 1) {
                    // The initial systemSettings query still succeeds...
                    return {
                        systemSettings: {
                            keyDashboardContextMenuItemSwitchViewType: true,
                        },
                    }
                }
                // ...but the legacy-value lookup used while resolving app
                // settings fails.
                throw new Error('dataStore unreachable')
            }
            // The dataStore lookup for stored app-settings values also fails.
            throw new Error('dataStore unreachable')
        })
        useDataEngine.mockReturnValue({ query: engineQuery })

        const { result, waitFor } = renderHook(() => useSystemSettingsQuery())

        await waitFor(() => !!result.current.data)

        // The merge failed, but the overall call still resolves successfully
        // and falls back to the plain systemSettings value.
        expect(result.current.error).toBeUndefined()
        expect(result.current.data.allowVisViewAs).toBe(true)
        expect(warnSpy).toHaveBeenCalledWith(
            expect.stringContaining('Could not read Dashboard app settings'),
            expect.any(Error)
        )

        warnSpy.mockRestore()
    })
})
