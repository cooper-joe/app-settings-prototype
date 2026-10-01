import { renderHook, waitFor } from '@testing-library/react'
import { useAppSettingsDoor } from './useAppSettingsDoor.js'

const description = {
    version: 1,
    app: 'dashboard',
    title: 'Dashboard',
    namespace: 'dashboard-settings',
    adminAuthority: 'DASHBOARD_SETTINGS_ADMIN',
    settings: [{ key: 'allowVisViewAs', type: 'boolean', default: true }],
}

const dashboard = {
    key: 'dashboard',
    baseUrl: 'https://server/dhis-web-dashboard',
}
const maps = { key: 'maps', baseUrl: 'https://server/dhis-web-maps' }

const makeFetch = () =>
    jest.fn(async (url) => {
        if (url === 'https://server/dhis-web-dashboard/settings.json') {
            return { ok: true, json: async () => description }
        }
        if (url === 'https://server/dhis-web-broken/settings.json') {
            return { ok: true, json: async () => ({ version: 1 }) }
        }
        return { ok: false, status: 404 }
    })

const renderDoor = (props) =>
    renderHook((current) => useAppSettingsDoor(current), {
        initialProps: { serverBaseUrl: 'https://server', ...props },
    })

describe('useAppSettingsDoor', () => {
    it('is loading, then available, for a superuser', async () => {
        const fetchImpl = makeFetch()
        const { result } = renderDoor({
            app: dashboard,
            authorities: ['ALL'],
            fetchImpl,
        })
        expect(result.current).toEqual({ state: 'loading' })
        await waitFor(() =>
            expect(result.current).toEqual({ state: 'available' })
        )
    })

    it("is available for holders of the app's admin authority", async () => {
        const { result } = renderDoor({
            app: dashboard,
            authorities: ['DASHBOARD_SETTINGS_ADMIN'],
            fetchImpl: makeFetch(),
        })
        await waitFor(() =>
            expect(result.current).toEqual({ state: 'available' })
        )
    })

    it('is none for users without the authority', async () => {
        const { result } = renderDoor({
            app: dashboard,
            authorities: ['M_dhis-web-dashboard'],
            fetchImpl: makeFetch(),
        })
        await waitFor(() => expect(result.current).toEqual({ state: 'none' }))
    })

    it('is none for apps without settings.json', async () => {
        const { result } = renderDoor({
            app: maps,
            authorities: ['ALL'],
            fetchImpl: makeFetch(),
        })
        await waitFor(() => expect(result.current).toEqual({ state: 'none' }))
    })

    it('is none for a broken description', async () => {
        const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
        const { result } = renderDoor({
            app: { key: 'broken', baseUrl: 'https://server/dhis-web-broken' },
            authorities: ['ALL'],
            fetchImpl: makeFetch(),
        })
        await waitFor(() => expect(result.current).toEqual({ state: 'none' }))
        warn.mockRestore()
    })

    it('is none, without fetching, when no app is open', () => {
        const fetchImpl = makeFetch()
        const { result } = renderDoor({
            app: undefined,
            authorities: ['ALL'],
            fetchImpl,
        })
        expect(result.current).toEqual({ state: 'none' })
        expect(fetchImpl).not.toHaveBeenCalled()
    })

    it('fetches again only when the app changes', async () => {
        const fetchImpl = makeFetch()
        const { result, rerender } = renderDoor({
            app: dashboard,
            authorities: ['ALL'],
            fetchImpl,
        })
        await waitFor(() =>
            expect(result.current).toEqual({ state: 'available' })
        )

        // A new, equal app object and a new authorities array: no refetch
        rerender({
            serverBaseUrl: 'https://server',
            app: { ...dashboard },
            authorities: ['ALL'],
            fetchImpl,
        })
        expect(fetchImpl).toHaveBeenCalledTimes(1)

        rerender({
            serverBaseUrl: 'https://server',
            app: maps,
            authorities: ['ALL'],
            fetchImpl,
        })
        expect(result.current).toEqual({ state: 'loading' })
        await waitFor(() => expect(result.current).toEqual({ state: 'none' }))
        expect(fetchImpl).toHaveBeenCalledTimes(2)
    })
})
