import raw from '../public/settings.json'
import {
    parseDescription,
    SUPPORTED_TYPES,
} from './app-settings-lib/parseDescription.js'

describe('Settings Catalogue settings.json', () => {
    const description = parseDescription(raw)

    it('uses every supported type', () => {
        const types = new Set(description.settings.map((s) => s.type))
        SUPPORTED_TYPES.filter((type) => type !== 'custom').forEach((type) =>
            expect(types).toContain(type)
        )
    })

    it('marks only the future setting unsupported', () => {
        expect(
            description.settings
                .filter((setting) => setting.unsupported)
                .map((setting) => setting.key)
        ).toEqual(['quietHours'])
    })
})
