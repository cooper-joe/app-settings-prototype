import { coerce, resolveValue } from './resolveValue.js'

const toggle = { key: 'allowVisViewAs', type: 'boolean', default: true }

describe('coerce', () => {
    it('turns the strings the server returns into booleans', () => {
        expect(coerce('boolean', 'false')).toBe(false)
        expect(coerce('boolean', 'true')).toBe(true)
        expect(coerce('boolean', false)).toBe(false)
    })

    it('treats empty values as not set', () => {
        expect(coerce('boolean', undefined)).toBeUndefined()
        expect(coerce('boolean', null)).toBeUndefined()
        expect(coerce('boolean', '')).toBeUndefined()
        expect(coerce('boolean', 'maybe')).toBeUndefined()
    })

    it('leaves select values alone', () => {
        expect(coerce('select', 'osmLight')).toBe('osmLight')
    })

    it('turns numeric strings into numbers, for old system settings', () => {
        expect(coerce('number', '30')).toBe(30)
        expect(coerce('number', 30)).toBe(30)
        expect(coerce('number', 'thirty')).toBeUndefined()
        expect(
            resolveValue({ type: 'number', default: 1 }, { legacy: '7' })
        ).toEqual({ value: 7, source: 'legacy' })
        expect(coerce('number', '  ')).toBeUndefined()
        expect(
            resolveValue(
                { type: 'number', default: 1 },
                { stored: '  ', legacy: '7' }
            )
        ).toEqual({ value: 7, source: 'legacy' })
    })
})

describe('resolveValue', () => {
    it('uses the stored value first', () => {
        expect(resolveValue(toggle, { stored: false, legacy: 'true' })).toEqual(
            { value: false, source: 'app' }
        )
    })

    it('falls back to the old system setting', () => {
        expect(resolveValue(toggle, { legacy: 'false' })).toEqual({
            value: false,
            source: 'legacy',
        })
    })

    it('falls back to the default from the description', () => {
        expect(resolveValue(toggle, {})).toEqual({
            value: true,
            source: 'default',
        })
    })
})
