import i18n from '@dhis2/d2-i18n'

const toIds = (value) => {
    if (Array.isArray(value)) {
        return value
    }
    return value ? [value] : []
}

const pickerResource = (setting) => {
    if (setting.type === 'orgUnit') {
        return 'organisationUnits'
    }
    return setting.type === 'metadata' ? setting.resource : null
}

export const loadDisplayNames = async (engine, description, values) => {
    const idsByResource = {}
    description.settings.forEach((setting) => {
        const resource = pickerResource(setting)
        if (resource) {
            idsByResource[resource] = [
                ...(idsByResource[resource] || []),
                ...toIds(values[setting.key]),
            ]
        }
    })
    const names = {}
    await Promise.all(
        Object.entries(idsByResource)
            .filter(([, ids]) => ids.length > 0)
            .map(async ([resource, ids]) => {
                const { list } = await engine.query({
                    list: {
                        resource,
                        params: {
                            filter: `id:in:[${[...new Set(ids)].join(',')}]`,
                            fields: 'id,displayName',
                            paging: false,
                        },
                    },
                })
                list[resource].forEach(({ id, displayName }) => {
                    names[id] = displayName
                })
            })
    )
    return names
}

export const formatValue = (setting, value, names = {}) => {
    if (
        value === undefined ||
        value === null ||
        (Array.isArray(value) && value.length === 0)
    ) {
        return i18n.t('(none)')
    }
    const optionLabel = (entry) =>
        setting.options?.find((option) => option.value === entry)?.label ??
        String(entry)
    const name = (id) => names[id] ?? i18n.t('{{id}} (not found)', { id })
    switch (setting.type) {
        case 'boolean':
            return value ? i18n.t('On') : i18n.t('Off')
        case 'select':
            return optionLabel(value)
        case 'multiSelect':
            return value.map(optionLabel).join(', ')
        case 'orgUnit':
        case 'metadata':
            return toIds(value).map(name).join(', ')
        case 'custom':
            return JSON.stringify(value)
        default:
            return String(value)
    }
}

export const sourceLabel = (source) =>
    ({
        app: i18n.t('Saved in System Settings'),
        legacy: i18n.t('Old system setting'),
        default: i18n.t('Default'),
    }[source] ?? source)
