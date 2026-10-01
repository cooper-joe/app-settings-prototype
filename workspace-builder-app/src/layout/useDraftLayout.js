import { useEffect, useRef, useState } from 'react'
import { normaliseLayout } from './layout.js'

// Shows a change straight away, before the save comes back, so a dropped tile
// doesn't jump back while the value is being saved.
//
// pendingRef remembers the JSON of the last layout set locally. Two quick
// local changes, A then B, can have A's save resolve after B was already set:
// the resulting prop update is a stale echo of A, not a newer value, and
// applying it would make a tile jump back. So while a local change is
// pending, an incoming value is only accepted once it matches what was set
// locally; anything else is ignored as stale. Once it matches, the pending
// marker clears and later external values are applied normally again.
// The state update itself bails out when the content hasn't changed, so a
// fresh-but-equal value (a caller that doesn't memoise its own object) can't
// re-trigger the effect and loop.
export const useDraftLayout = (value) => {
    const [layout, setLayoutState] = useState(() => normaliseLayout(value))
    const pendingRef = useRef(null)

    const setLayout = (next) => {
        setLayoutState(next)
        pendingRef.current = JSON.stringify(next)
    }

    useEffect(() => {
        const incoming = normaliseLayout(value)
        if (
            pendingRef.current !== null &&
            JSON.stringify(incoming) !== pendingRef.current
        ) {
            return
        }
        pendingRef.current = null
        setLayoutState((previous) =>
            JSON.stringify(previous) === JSON.stringify(incoming)
                ? previous
                : incoming
        )
    }, [value])

    return [layout, setLayout]
}
