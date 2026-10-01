import { canAdminister } from './permissions.js'

const description = { adminAuthority: 'DASHBOARD_SETTINGS_ADMIN' }

describe('canAdminister', () => {
    it('allows superusers', () => {
        expect(canAdminister(description, ['ALL'])).toBe(true)
    })

    it('allows holders of the app admin authority, as an array or a Set', () => {
        expect(canAdminister(description, ['DASHBOARD_SETTINGS_ADMIN'])).toBe(
            true
        )
        expect(
            canAdminister(description, new Set(['DASHBOARD_SETTINGS_ADMIN']))
        ).toBe(true)
    })

    it('refuses everyone else', () => {
        expect(canAdminister(description, ['M_dhis-web-dashboard'])).toBe(false)
        expect(canAdminister(description, undefined)).toBe(false)
    })
})
