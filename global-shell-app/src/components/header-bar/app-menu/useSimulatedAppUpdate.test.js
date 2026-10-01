import { act, renderHook } from '@testing-library/react'
import {
    SIMULATED_UPDATE_APP,
    useSimulatedAppUpdate,
} from './useSimulatedAppUpdate.js'

describe('useSimulatedAppUpdate', () => {
    afterEach(() => window.sessionStorage.clear())

    it('offers an update only for the simulated app', () => {
        const { result: other } = renderHook(() =>
            useSimulatedAppUpdate('dashboard', jest.fn())
        )
        expect(other.current.updateAvailable).toBe(false)

        const { result } = renderHook(() =>
            useSimulatedAppUpdate(SIMULATED_UPDATE_APP, jest.fn())
        )
        expect(result.current.updateAvailable).toBe(true)
    })

    it('reloads when applied, and stays applied for the session', () => {
        const reload = jest.fn()
        const { result } = renderHook(() =>
            useSimulatedAppUpdate(SIMULATED_UPDATE_APP, reload)
        )
        act(() => result.current.applyUpdate())
        expect(reload).toHaveBeenCalledTimes(1)
        expect(result.current.updateAvailable).toBe(false)

        const { result: afterReload } = renderHook(() =>
            useSimulatedAppUpdate(SIMULATED_UPDATE_APP, reload)
        )
        expect(afterReload.current.updateAvailable).toBe(false)
    })
})
