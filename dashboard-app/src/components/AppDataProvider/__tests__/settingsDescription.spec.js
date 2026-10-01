import description from '../../../../public/settings.json'
import { parseDescription } from '../../../app-settings-lib/parseDescription.js'
import { SYSTEM_SETTINGS_REMAPPINGS } from '../useSystemSettingsQuery.js'

const ITEM_MENU_KEYS = [
    'allowVisViewAs',
    'allowVisOpenInApp',
    'allowVisShowInterpretations',
    'allowVisFullscreen',
]

describe('Dashboard settings description', () => {
    const itemMenuSettings = (parsed) =>
        parsed.settings.filter((setting) => setting.section === 'itemMenu')

    it('is valid and covers the four item-menu toggles', () => {
        const parsed = parseDescription(description)
        expect(itemMenuSettings(parsed).map((setting) => setting.key)).toEqual(
            ITEM_MENU_KEYS
        )
        itemMenuSettings(parsed).forEach((setting) => {
            expect(setting.unsupported).toBe(false)
            expect(setting.default).toBe(true)
        })
    })

    it('points every setting at a legacySystemSetting that useSystemSettingsQuery actually remaps to the same key', () => {
        // This guards against the two files silently drifting apart: if
        // someone renames/typos a legacy system-settings key in only one of
        // `public/settings.json` or the `SYSTEM_SETTINGS_REMAPPINGS` table in
        // `useSystemSettingsQuery.js`, the corresponding toggle would stop
        // reading its legacy value and silently fall back to its default,
        // with no other test catching it.
        const parsed = parseDescription(description)
        itemMenuSettings(parsed).forEach((setting) => {
            expect(setting.legacySystemSetting).toEqual(expect.any(String))
            expect(
                SYSTEM_SETTINGS_REMAPPINGS[setting.legacySystemSetting]
            ).toBe(setting.key)
        })
    })

    it('has a default dashboard setting that picks one dashboard', () => {
        const parsed = parseDescription(description)
        const setting = parsed.settings.find(
            ({ key }) => key === 'defaultDashboard'
        )
        expect(setting).toMatchObject({
            type: 'metadata',
            resource: 'dashboards',
            default: null,
            unsupported: false,
        })
        expect(setting.multiple).toBeFalsy()
    })
})
