import { useDataEngine } from '@dhis2/app-runtime'
import { useCallback, useEffect, useState } from 'react'
import { parseDescription } from './parseDescription.js'
import { readAppSettings } from './storage.js'

const defaultFetch = (...args) => fetch(...args)

// `settings.json` is served next to the app's own index.html, so a relative
// URL finds it.
export const loadOwnDescription = async (fetchImpl = defaultFetch) => {
    const response = await fetchImpl('settings.json')
    if (!response.ok) {
        throw new Error(`Could not load settings.json (${response.status})`)
    }
    return parseDescription(await response.json())
}

// `fetchImpl` is an effect dependency: pass a stable (module-level or
// memoized) function, or omit it, so an inline arrow doesn't refetch in a loop.
export const useAppSettings = ({ fetchImpl } = {}) => {
    const engine = useDataEngine()
    const [state, setState] = useState({ loading: true })
    const [version, setVersion] = useState(0)
    const refresh = useCallback(() => setVersion((current) => current + 1), [])

    useEffect(() => {
        let cancelled = false
        loadOwnDescription(fetchImpl)
            .then(async (description) => ({
                description,
                ...(await readAppSettings(engine, description)),
            }))
            .then((result) => {
                if (!cancelled) {
                    setState({ loading: false, ...result })
                }
            })
            .catch((error) => {
                if (!cancelled) {
                    setState({ loading: false, error })
                }
            })
        return () => {
            cancelled = true
        }
    }, [engine, fetchImpl, version])

    return { ...state, refresh }
}
