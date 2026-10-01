import { appIconUrl } from './appIcon.js'

describe('appIconUrl', () => {
    const baseUrl = 'https://server/api/apps/dashboard'

    it('resolves a relative icon against the app base URL', () => {
        expect(appIconUrl({ icons: { 48: 'icon.png' }, baseUrl })).toBe(
            'https://server/api/apps/dashboard/icon.png'
        )
    })

    it('does not double the slash when the base URL ends in one', () => {
        expect(
            appIconUrl({ icons: { 48: 'icon.png' }, baseUrl: `${baseUrl}/` })
        ).toBe('https://server/api/apps/dashboard/icon.png')
    })

    it('prefers 48, then 128, then 16', () => {
        expect(
            appIconUrl({ icons: { 16: 's.png', 128: 'l.png' }, baseUrl })
        ).toBe(`${baseUrl}/l.png`)
        expect(appIconUrl({ icons: { 16: 's.png' }, baseUrl })).toBe(
            `${baseUrl}/s.png`
        )
    })

    it('keeps absolute paths and URLs as they are', () => {
        expect(appIconUrl({ icons: { 48: '/x/icon.png' }, baseUrl })).toBe(
            '/x/icon.png'
        )
        expect(
            appIconUrl({ icons: { 48: 'https://cdn/icon.png' }, baseUrl })
        ).toBe('https://cdn/icon.png')
    })

    it('returns null when there is no icon', () => {
        expect(appIconUrl({ icons: undefined, baseUrl })).toBeNull()
        expect(appIconUrl({ icons: {}, baseUrl })).toBeNull()
    })
})
