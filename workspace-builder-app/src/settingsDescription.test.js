import raw from '../public/settings.json'
import { parseDescription } from './app-settings-lib/parseDescription.js'
import { DEFAULT_LAYOUT, normaliseLayout } from './layout/layout.js'

describe('Workspace Builder settings.json', () => {
    const [homeLayout] = parseDescription(raw).settings

    it('describes one custom setting with a plugin and an app page', () => {
        expect(homeLayout).toMatchObject({
            key: 'homeLayout',
            type: 'custom',
            plugin: 'plugin.html',
            appPath: '#/edit-layout',
            unsupported: false,
        })
    })

    it("uses the app's default layout", () => {
        expect(homeLayout.default).toEqual(DEFAULT_LAYOUT)
        expect(normaliseLayout(homeLayout.default)).toEqual(DEFAULT_LAYOUT)
    })
})
