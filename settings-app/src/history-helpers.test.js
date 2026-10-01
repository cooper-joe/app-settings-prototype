import { shouldPushLocation } from './history-helpers.js'

describe('shouldPushLocation', () => {
    it('does not push for a section opened with a query it does not own (the Back-button bug)', () => {
        expect(
            shouldPushLocation({
                category: 'general',
                pathname: '/general',
                search: '',
                location: { pathname: '/general', search: '?app=dashboard' },
            })
        ).toBe(false)
    })

    it('pushes when the pathname differs', () => {
        expect(
            shouldPushLocation({
                category: 'general',
                pathname: '/general',
                search: '',
                location: { pathname: '/apps', search: '?app=dashboard' },
            })
        ).toBe(true)
    })

    it('pushes for the search category when the search differs', () => {
        expect(
            shouldPushLocation({
                category: 'search',
                pathname: '/search',
                search: '?foo',
                location: { pathname: '/search', search: '?bar' },
            })
        ).toBe(true)
    })

    it('does not push for the search category when pathname and search are unchanged', () => {
        expect(
            shouldPushLocation({
                category: 'search',
                pathname: '/search',
                search: '?bar',
                location: { pathname: '/search', search: '?bar' },
            })
        ).toBe(false)
    })

    it('pushes for the apps category when another app is picked', () => {
        expect(
            shouldPushLocation({
                category: 'apps',
                pathname: '/apps',
                search: '?app=workspace-builder',
                location: { pathname: '/apps', search: '?app=dashboard' },
            })
        ).toBe(true)
    })

    it('does not push for the apps category when the app is unchanged', () => {
        expect(
            shouldPushLocation({
                category: 'apps',
                pathname: '/apps',
                search: '?app=dashboard',
                location: { pathname: '/apps', search: '?app=dashboard' },
            })
        ).toBe(false)
    })
})
