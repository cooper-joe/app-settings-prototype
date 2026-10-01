import { readAppSettings, saveAppSetting } from './storage.js'

const description = {
    namespace: 'dashboard-settings',
    settings: [
        {
            key: 'allowVisViewAs',
            type: 'boolean',
            default: true,
            legacySystemSetting: 'keyDashboardContextMenuItemSwitchViewType',
        },
        {
            key: 'allowVisFullscreen',
            type: 'boolean',
            default: true,
            legacySystemSetting: 'keyDashboardContextMenuItemViewFullscreen',
        },
    ],
}

const notFound = () =>
    Object.assign(new Error('Not found'), { details: { httpStatusCode: 404 } })

const makeEngine = ({ keys, entries = {}, systemSettings = {} } = {}) => ({
    query: jest.fn(async (query) => {
        const [name, { resource }] = Object.entries(query)[0]
        if (resource === 'systemSettings') {
            return { [name]: systemSettings }
        }
        if (resource === 'dataStore/dashboard-settings') {
            if (!keys) {
                throw notFound()
            }
            return { [name]: keys }
        }
        const key = resource.split('/').pop()
        return { [name]: entries[key] }
    }),
    mutate: jest.fn(async (mutation) => {
        if (mutation.type === 'update' && !(keys || []).includes(mutation.id)) {
            throw notFound()
        }
        return {}
    }),
})

describe('readAppSettings', () => {
    it('uses defaults when the namespace does not exist yet', async () => {
        const result = await readAppSettings(makeEngine(), description)
        expect(result.values).toEqual({
            allowVisViewAs: true,
            allowVisFullscreen: true,
        })
        expect(result.sources.allowVisViewAs).toBe('default')
    })

    it('uses the old system setting when nothing is stored', async () => {
        const engine = makeEngine({
            systemSettings: {
                keyDashboardContextMenuItemSwitchViewType: false,
            },
        })
        const result = await readAppSettings(engine, description)
        expect(result.values.allowVisViewAs).toBe(false)
        expect(result.sources.allowVisViewAs).toBe('legacy')
    })

    it('prefers stored values and only fetches keys that exist', async () => {
        const engine = makeEngine({
            keys: ['allowVisViewAs'],
            entries: { allowVisViewAs: { value: false } },
            systemSettings: { keyDashboardContextMenuItemSwitchViewType: true },
        })
        const result = await readAppSettings(engine, description)
        expect(result.values.allowVisViewAs).toBe(false)
        expect(result.sources.allowVisViewAs).toBe('app')
        const resources = engine.query.mock.calls.map(
            ([query]) => Object.values(query)[0].resource
        )
        expect(resources).not.toContain(
            'dataStore/dashboard-settings/allowVisFullscreen'
        )
    })
})

describe('saveAppSetting', () => {
    it('updates an existing key', async () => {
        const engine = makeEngine({ keys: ['allowVisViewAs'] })
        await saveAppSetting(engine, description, 'allowVisViewAs', false)
        expect(engine.mutate).toHaveBeenCalledTimes(1)
        expect(engine.mutate).toHaveBeenCalledWith({
            resource: 'dataStore/dashboard-settings',
            id: 'allowVisViewAs',
            type: 'update',
            data: { value: false },
        })
    })

    it('creates the key when it does not exist yet', async () => {
        const engine = makeEngine({ keys: [] })
        await saveAppSetting(engine, description, 'allowVisViewAs', false)
        expect(engine.mutate).toHaveBeenLastCalledWith({
            resource: 'dataStore/dashboard-settings/allowVisViewAs',
            type: 'create',
            data: { value: false },
        })
    })
})
