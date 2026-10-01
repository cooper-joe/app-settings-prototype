import {
    DescriptionError,
    METADATA_RESOURCES,
    parseDescription,
    SUPPORTED_TYPES,
} from './parseDescription.js'

const valid = {
    version: 1,
    app: 'dashboard',
    title: 'Dashboard',
    namespace: 'dashboard-settings',
    adminAuthority: 'DASHBOARD_SETTINGS_ADMIN',
    sections: [{ id: 'itemMenu', label: 'Dashboard item menu' }],
    settings: [
        {
            key: 'allowVisViewAs',
            section: 'itemMenu',
            type: 'boolean',
            default: true,
            label: 'Allow users to switch dashboard items view type',
        },
    ],
}

describe('parseDescription', () => {
    it('accepts a valid description', () => {
        const parsed = parseDescription(valid)
        expect(parsed.app).toBe('dashboard')
        expect(parsed.settings[0].unsupported).toBe(false)
    })

    it('rejects an unknown version', () => {
        expect(() => parseDescription({ ...valid, version: 2 })).toThrow(
            DescriptionError
        )
    })

    it('rejects a missing namespace', () => {
        const { namespace, ...rest } = valid // eslint-disable-line no-unused-vars
        expect(() => parseDescription(rest)).toThrow('Missing "namespace"')
    })

    it('rejects duplicate keys', () => {
        const settings = [valid.settings[0], valid.settings[0]]
        expect(() => parseDescription({ ...valid, settings })).toThrow(
            'Duplicate setting key "allowVisViewAs"'
        )
    })

    it('rejects a setting pointing at an unknown section', () => {
        const settings = [{ ...valid.settings[0], section: 'nope' }]
        expect(() => parseDescription({ ...valid, settings })).toThrow(
            'Unknown section "nope"'
        )
    })

    it('rejects a select without options', () => {
        const settings = [{ key: 'x', type: 'select', default: 'a' }]
        expect(() => parseDescription({ ...valid, settings })).toThrow(
            'Select setting "x" needs options'
        )
    })

    it('keeps settings with an unknown type but marks them unsupported', () => {
        const settings = [
            ...valid.settings,
            { key: 'basemap', type: 'basemap', default: 'osmLight' },
        ]
        const parsed = parseDescription({ ...valid, settings })
        expect(parsed.settings[1].unsupported).toBe(true)
    })

    const withSettings = (settings) => ({ ...valid, settings })

    it('supports the step 3 types', () => {
        expect(SUPPORTED_TYPES).toEqual([
            'boolean',
            'select',
            'multiSelect',
            'text',
            'number',
            'orgUnit',
            'metadata',
            'periodType',
            'custom',
        ])
        expect(METADATA_RESOURCES).toContain('userGroups')
        expect(METADATA_RESOURCES).toContain('dashboards')
    })

    it('rejects a multiSelect without options', () => {
        expect(() =>
            parseDescription(withSettings([{ key: 'm', type: 'multiSelect' }]))
        ).toThrow('Select setting "m" needs options')
    })

    it('rejects a number whose min is above its max', () => {
        expect(() =>
            parseDescription(
                withSettings([{ key: 'n', type: 'number', min: 5, max: 1 }])
            )
        ).toThrow('Number setting "n" has min above max')
    })

    it('rejects a metadata resource outside the allowlist', () => {
        expect(() =>
            parseDescription(
                withSettings([
                    { key: 'u', type: 'metadata', resource: 'users' },
                ])
            )
        ).toThrow('Metadata setting "u" uses an unsupported resource "users"')
    })

    it('needs a plugin or an appPath for a custom setting', () => {
        expect(() =>
            parseDescription(withSettings([{ key: 'c', type: 'custom' }]))
        ).toThrow('Custom setting "c" needs a plugin or an appPath')
    })

    it.each([
        'https://evil.example/x.html',
        '../other-app/plugin.html',
        '/plugin.html',
        '%2e%2e/other/plugin.html',
        '..\\other\\plugin.html',
        './plugin.html',
        '.\t./other/plugin.html',
        'plugin.html?x=1',
    ])('rejects the plugin path %s', (plugin) => {
        expect(() =>
            parseDescription(
                withSettings([{ key: 'c', type: 'custom', plugin }])
            )
        ).toThrow('Custom setting "c" has an invalid plugin path')
    })

    it('accepts a plugin path in a subfolder', () => {
        const parsed = parseDescription(
            withSettings([
                {
                    key: 'c',
                    type: 'custom',
                    plugin: 'settings/plugin.html',
                    default: null,
                },
            ])
        )
        expect(parsed.settings[0].unsupported).toBe(false)
    })

    it('needs an appPath that starts with #', () => {
        expect(() =>
            parseDescription(
                withSettings([
                    { key: 'c', type: 'custom', appPath: '/edit-layout' },
                ])
            )
        ).toThrow('Custom setting "c" needs an appPath starting with "#"')
    })

    it('rejects a default that fails validation', () => {
        expect(() =>
            parseDescription(
                withSettings([
                    { key: 'n', type: 'number', max: 10, default: 11 },
                ])
            )
        ).toThrow('Default for "n" is not valid: Enter 10 or less')
    })

    it('accepts a custom setting with a plugin and an appPath', () => {
        const parsed = parseDescription(
            withSettings([
                {
                    key: 'homeLayout',
                    type: 'custom',
                    plugin: 'plugin.html',
                    appPath: '#/edit-layout',
                    default: { tiles: [] },
                },
            ])
        )
        expect(parsed.settings[0].unsupported).toBe(false)
    })

    it('needs a default for a required setting', () => {
        expect(() =>
            parseDescription(
                withSettings([{ key: 'b', type: 'text', required: true }])
            )
        ).toThrow('Required setting "b" needs a default')
    })

    it('needs a default for a required setting with an empty default', () => {
        expect(() =>
            parseDescription(
                withSettings([
                    { key: 'b', type: 'text', required: true, default: '' },
                ])
            )
        ).toThrow('Required setting "b" needs a default')
    })

    it('keeps a required setting of an unknown type as unsupported, without checking its default', () => {
        const parsed = parseDescription(
            withSettings([{ key: 'q', type: 'schedule', required: true }])
        )
        expect(parsed.settings[0].unsupported).toBe(true)
    })
})
