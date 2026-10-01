import { validateValue } from './validateValue.js'

const message = (setting, value) => validateValue(setting, value)?.message

describe('validateValue', () => {
    it('accepts empty values unless required', () => {
        const text = { key: 't', type: 'text' }
        expect(validateValue(text, null)).toBeNull()
        expect(validateValue(text, '')).toBeNull()
        expect(message({ ...text, required: true }, '')).toBe(
            'This setting is required'
        )
        expect(
            message({ key: 'm', type: 'multiSelect', required: true }, [])
        ).toBe('This setting is required')
    })

    it('accepts undefined unless required', () => {
        expect(validateValue({ type: 'text' }, undefined)).toBeNull()
        expect(message({ type: 'text', required: true }, undefined)).toBe(
            'This setting is required'
        )
    })

    it('checks required on number and select', () => {
        expect(message({ type: 'number', required: true }, undefined)).toBe(
            'This setting is required'
        )
        expect(message({ type: 'select', required: true }, undefined)).toBe(
            'This setting is required'
        )
    })

    it('treats a whitespace-only string as empty', () => {
        expect(message({ type: 'text', required: true }, '   ')).toBe(
            'This setting is required'
        )
    })

    it('checks booleans', () => {
        expect(validateValue({ type: 'boolean' }, false)).toBeNull()
        expect(message({ type: 'boolean' }, 'yes')).toBe(
            'This value is not valid'
        )
    })

    it('checks select and multiSelect against the options', () => {
        const options = [{ value: 'a' }, { value: 'b' }]
        expect(validateValue({ type: 'select', options }, 'a')).toBeNull()
        expect(message({ type: 'select', options }, 'c')).toBe(
            'Choose one of the options'
        )
        expect(
            validateValue({ type: 'multiSelect', options }, ['a', 'b'])
        ).toBeNull()
        expect(message({ type: 'multiSelect', options }, ['a', 'c'])).toBe(
            'Choose one of the options'
        )
    })

    it('checks text length', () => {
        const setting = { type: 'text', maxLength: 3 }
        expect(validateValue(setting, 'abc')).toBeNull()
        expect(message(setting, 'abcd')).toBe('Use 3 characters or fewer')
        expect(message({ type: 'text' }, 12)).toBe('This value is not valid')
    })

    it('checks a maxLength of 0', () => {
        expect(message({ type: 'text', maxLength: 0 }, 'a')).toBe(
            'Use 0 characters or fewer'
        )
    })

    it('checks numbers', () => {
        const setting = { type: 'number', integer: true, min: 1, max: 365 }
        expect(validateValue(setting, 30)).toBeNull()
        expect(message(setting, Number.NaN)).toBe('Enter a number')
        expect(message(setting, 1.5)).toBe('Enter a whole number')
        expect(message(setting, 0)).toBe('Enter 1 or more')
        expect(message(setting, 366)).toBe('Enter 365 or less')
    })

    it('rejects infinite numbers', () => {
        expect(message({ type: 'number' }, Number.POSITIVE_INFINITY)).toBe(
            'Enter a number'
        )
    })

    it('checks a min of 0', () => {
        const setting = { type: 'number', min: 0 }
        expect(message(setting, -1)).toBe('Enter 0 or more')
        expect(validateValue(setting, 0)).toBeNull()
    })

    it('checks picker IDs', () => {
        expect(validateValue({ type: 'orgUnit' }, 'ImspTQPwCqd')).toBeNull()
        expect(message({ type: 'orgUnit' }, ['ImspTQPwCqd'])).toBe(
            'This value is not valid'
        )
        const multiple = { type: 'metadata', multiple: true }
        expect(validateValue(multiple, ['a', 'b'])).toBeNull()
        expect(message(multiple, 'a')).toBe('This value is not valid')
        expect(message(multiple, ['a', 5])).toBe('This value is not valid')
        expect(validateValue({ type: 'periodType' }, 'Monthly')).toBeNull()
    })

    it('accepts only plain JSON for custom values', () => {
        const custom = { type: 'custom' }
        expect(
            validateValue(custom, { tiles: [{ id: 'a', size: 'wide' }] })
        ).toBeNull()
        expect(message(custom, { at: new Date() })).toBe(
            'This value cannot be saved'
        )
        expect(message(custom, { count: Number.POSITIVE_INFINITY })).toBe(
            'This value cannot be saved'
        )
    })

    it('does not judge types it does not know', () => {
        expect(validateValue({ type: 'schedule' }, { any: 'thing' })).toBeNull()
    })
})
