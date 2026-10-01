import { act, renderHook } from '@testing-library/react'
import { normaliseLayout } from './layout.js'
import { useDraftLayout } from './useDraftLayout.js'

// Fresh objects each time, like a real value read back from storage: the
// effect must key off content, not object identity.
const A = () => ({ tiles: [{ id: 'visits', size: 'wide' }] })
const B = () => ({ tiles: [{ id: 'stock', size: 'normal' }] })
const C = () => ({ tiles: [{ id: 'reports', size: 'normal' }] })

describe('useDraftLayout', () => {
    it('starts from the normalised value', () => {
        const { result } = renderHook(() => useDraftLayout(A()))
        expect(result.current[0]).toEqual(normaliseLayout(A()))
    })

    it('keeps a newer local change when a stale value comes back', () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDraftLayout(value),
            { initialProps: { value: A() } }
        )

        act(() => {
            result.current[1](B())
        })
        expect(result.current[0]).toEqual(B())

        // The save for the old value A resolves after B was already set
        // locally, and the resulting prop update is a stale echo of A.
        rerender({ value: A() })
        expect(result.current[0]).toEqual(B())
    })

    it('accepts the value once it matches the local change, and applies a later one', () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDraftLayout(value),
            { initialProps: { value: A() } }
        )

        act(() => {
            result.current[1](B())
        })
        rerender({ value: A() }) // stale, ignored
        expect(result.current[0]).toEqual(B())

        rerender({ value: B() }) // now the incoming value matches, so pending clears
        expect(result.current[0]).toEqual(B())

        rerender({ value: C() }) // with pending cleared, a later external value applies
        expect(result.current[0]).toEqual(normaliseLayout(C()))
    })

    it('applies a new external value when there is no local change', () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDraftLayout(value),
            { initialProps: { value: A() } }
        )

        rerender({ value: C() })
        expect(result.current[0]).toEqual(normaliseLayout(C()))
    })
})
