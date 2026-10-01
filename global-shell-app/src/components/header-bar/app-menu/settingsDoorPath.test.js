import { settingsDoorPath } from './settingsDoorPath.js'

const modules = [
    { name: 'dhis-web-dashboard', displayName: 'Dashboard' },
    { name: 'dhis-web-settings', displayName: 'System Settings' },
]

describe('settingsDoorPath', () => {
    it("links to the app's tab in System Settings › Apps", () => {
        expect(settingsDoorPath({ modules, appKey: 'dashboard' })).toBe(
            '/settings#/apps?app=dashboard'
        )
    })

    it('finds an installed System Settings named "settings"', () => {
        expect(
            settingsDoorPath({
                modules: [{ name: 'settings' }],
                appKey: 'dashboard',
            })
        ).toBe('/settings#/apps?app=dashboard')
    })

    it('encodes the app key', () => {
        expect(settingsDoorPath({ modules, appKey: 'my app&x' })).toBe(
            '/settings#/apps?app=my%20app%26x'
        )
    })

    it('returns null when System Settings is not installed', () => {
        expect(
            settingsDoorPath({
                modules: [{ name: 'dhis-web-dashboard' }],
                appKey: 'dashboard',
            })
        ).toBeNull()
        expect(settingsDoorPath({ modules: undefined, appKey: 'x' })).toBeNull()
    })

    it('returns null without an app key', () => {
        expect(settingsDoorPath({ modules, appKey: undefined })).toBeNull()
    })
})
