import { resolveValue } from './resolveValue.js'

const isNotFound = (error) => error?.details?.httpStatusCode === 404

const readStoredValues = async (engine, { namespace, settings }) => {
    let existingKeys = []
    try {
        const { keys } = await engine.query({
            keys: { resource: `dataStore/${namespace}` },
        })
        existingKeys = keys
    } catch (error) {
        if (!isNotFound(error)) {
            throw error
        }
    }

    const stored = {}
    await Promise.all(
        settings
            .filter((setting) => existingKeys.includes(setting.key))
            .map(async (setting) => {
                const { entry } = await engine.query({
                    entry: {
                        resource: `dataStore/${namespace}/${setting.key}`,
                    },
                })
                stored[setting.key] = entry?.value
            })
    )
    return stored
}

const readLegacyValues = async (engine, { settings }) => {
    const keys = settings
        .map((setting) => setting.legacySystemSetting)
        .filter(Boolean)
    if (keys.length === 0) {
        return {}
    }
    try {
        const { systemSettings } = await engine.query({
            systemSettings: {
                resource: 'systemSettings',
                params: { key: keys },
            },
        })
        return systemSettings || {}
    } catch (error) {
        console.warn('Could not read legacy system settings', error)
        return {}
    }
}

export const readAppSettings = async (engine, description) => {
    const [stored, legacy] = await Promise.all([
        readStoredValues(engine, description),
        readLegacyValues(engine, description),
    ])
    const values = {}
    const sources = {}
    description.settings.forEach((setting) => {
        const resolved = resolveValue(setting, {
            stored: stored[setting.key],
            legacy: setting.legacySystemSetting
                ? legacy[setting.legacySystemSetting]
                : undefined,
        })
        values[setting.key] = resolved.value
        sources[setting.key] = resolved.source
    })
    return { values, sources }
}

// eslint-disable-next-line max-params -- signature fixed by the plan's test spec
export const saveAppSetting = async (engine, { namespace }, key, value) => {
    const data = { value }
    try {
        await engine.mutate({
            resource: `dataStore/${namespace}`,
            id: key,
            type: 'update',
            data,
        })
    } catch (error) {
        if (!isNotFound(error)) {
            throw error
        }
        await engine.mutate({
            resource: `dataStore/${namespace}/${key}`,
            type: 'create',
            data,
        })
    }
}
