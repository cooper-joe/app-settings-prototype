import i18n from '@dhis2/d2-i18n'

const toIds = (value) => {
    if (Array.isArray(value)) {
        return value
    }
    return value ? [value] : []
}

export const metadataOptions = (items, value) => {
    const options = items.map(({ id, displayName }) => ({
        value: id,
        label: displayName,
    }))
    toIds(value)
        .filter((id) => !items.some((item) => item.id === id))
        .forEach((id) =>
            options.push({
                value: id,
                label: i18n.t('{{id}} (not found)', { id }),
            })
        )
    return options
}
