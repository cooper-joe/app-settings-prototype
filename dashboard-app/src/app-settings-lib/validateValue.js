import i18n from '@dhis2/d2-i18n'

export const isEmpty = (value) =>
    value === undefined ||
    value === null ||
    (typeof value === 'string' && value.trim() === '') ||
    (Array.isArray(value) && value.length === 0)

const isId = (value) => typeof value === 'string' && value !== ''

const isJson = (value) => {
    if (
        value === null ||
        typeof value === 'string' ||
        typeof value === 'boolean'
    ) {
        return true
    }
    if (typeof value === 'number') {
        return Number.isFinite(value)
    }
    if (Array.isArray(value)) {
        return value.every(isJson)
    }
    if (
        typeof value === 'object' &&
        Object.getPrototypeOf(value) === Object.prototype
    ) {
        return Object.values(value).every(isJson)
    }
    return false
}

const invalid = () => ({ message: i18n.t('This value is not valid') })
const notAnOption = () => ({ message: i18n.t('Choose one of the options') })

const validateNumber = (setting, value) => {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
        return { message: i18n.t('Enter a number') }
    }
    if (setting.integer && !Number.isInteger(value)) {
        return { message: i18n.t('Enter a whole number') }
    }
    if (typeof setting.min === 'number' && value < setting.min) {
        return {
            message: i18n.t('Enter {{min}} or more', { min: setting.min }),
        }
    }
    if (typeof setting.max === 'number' && value > setting.max) {
        return {
            message: i18n.t('Enter {{max}} or less', { max: setting.max }),
        }
    }
    return null
}

export const validateValue = (setting, value) => {
    if (isEmpty(value)) {
        return setting.required
            ? { message: i18n.t('This setting is required') }
            : null
    }
    const options = (setting.options || []).map((option) => option.value)
    switch (setting.type) {
        case 'boolean':
            return typeof value === 'boolean' ? null : invalid()
        case 'select':
            return options.includes(value) ? null : notAnOption()
        case 'multiSelect':
            return Array.isArray(value) &&
                value.every((entry) => options.includes(entry))
                ? null
                : notAnOption()
        case 'text':
            if (typeof value !== 'string') {
                return invalid()
            }
            if (
                typeof setting.maxLength === 'number' &&
                value.length > setting.maxLength
            ) {
                return {
                    message: i18n.t('Use {{max}} characters or fewer', {
                        max: setting.maxLength,
                    }),
                }
            }
            return null
        case 'number':
            return validateNumber(setting, value)
        case 'orgUnit':
        case 'metadata':
            if (setting.multiple) {
                return Array.isArray(value) && value.every(isId)
                    ? null
                    : invalid()
            }
            return isId(value) ? null : invalid()
        case 'periodType':
            return isId(value) ? null : invalid()
        case 'custom':
            return isJson(value)
                ? null
                : { message: i18n.t('This value cannot be saved') }
        default:
            return null
    }
}
