export const coerce = (type, value) => {
    if (value === undefined || value === null || value === '') {
        return undefined
    }
    if (type === 'boolean') {
        if (typeof value === 'boolean') {
            return value
        }
        if (value === 'true') {
            return true
        }
        if (value === 'false') {
            return false
        }
        return undefined
    }
    if (type === 'number') {
        if (typeof value === 'number') {
            return value
        }
        if (typeof value === 'string' && value.trim() === '') {
            return undefined
        }
        const parsed = Number(value)
        return typeof value === 'string' && Number.isFinite(parsed)
            ? parsed
            : undefined
    }
    return value
}

export const resolveValue = (setting, { stored, legacy } = {}) => {
    const storedValue = coerce(setting.type, stored)
    if (storedValue !== undefined) {
        return { value: storedValue, source: 'app' }
    }
    const legacyValue = coerce(setting.type, legacy)
    if (legacyValue !== undefined) {
        return { value: legacyValue, source: 'legacy' }
    }
    return { value: setting.default, source: 'default' }
}
