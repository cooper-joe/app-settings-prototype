import { aboutFromApiApp, appHubUrl, helpUrlFor } from './appInfo.js'

describe('appHubUrl and helpUrlFor', () => {
    it('link to the App Hub only with an id', () => {
        expect(appHubUrl('abc')).toBe('https://apps.dhis2.org/app/abc')
        expect(appHubUrl(null)).toBeNull()
    })

    it('know help pages only for some apps', () => {
        expect(helpUrlFor('dashboard')).toMatch(/dashboards\.html$/)
        expect(helpUrlFor('workspace-builder')).toBeNull()
    })
})

describe('aboutFromApiApp', () => {
    it('reads the parts About shows', () => {
        expect(
            aboutFromApiApp({
                key: 'dashboard',
                description: 'DHIS2 Dashboard app',
                core_app: true,
                app_hub_id: '8a05188c',
                developer: { company: 'DHIS2' },
            })
        ).toEqual({
            description: 'DHIS2 Dashboard app',
            developer: 'DHIS2',
            coreApp: true,
            appHubId: '8a05188c',
        })
    })

    it('fills gaps with null, and is null without an app', () => {
        expect(aboutFromApiApp({ key: 'workspace-builder' })).toEqual({
            description: null,
            developer: null,
            coreApp: false,
            appHubId: null,
        })
        expect(aboutFromApiApp(undefined)).toBeNull()
    })
})
