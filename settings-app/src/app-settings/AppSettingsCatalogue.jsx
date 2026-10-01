import { useConfig, useDataEngine } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react'
import {
    canAdminister,
    discoverAppSettings,
} from '../app-settings-lib/index.js'
import { appIconUrl } from './appIcon.js'

// The library's loader drops `icons`, so they're read here, next to `me`.
// That way the library needs no change.
const meQuery = { me: { resource: 'me', params: { fields: 'authorities' } } }
const appsQuery = { apps: { resource: 'apps' } }

export const AppSettingsCatalogueContext = createContext({
    loading: true,
    found: [],
    manageable: [],
    authorities: [],
})

const withIcons = (found, apiApps) => {
    const byKey = new Map((apiApps || []).map((app) => [app.key, app]))
    return found.map((entry) => ({
        ...entry,
        app: {
            ...entry.app,
            iconUrl: appIconUrl({
                icons: byKey.get(entry.app.key)?.icons,
                baseUrl: entry.app.baseUrl,
            }),
        },
    }))
}

export const AppSettingsCatalogueProvider = ({ children }) => {
    const engine = useDataEngine()
    const { baseUrl } = useConfig()
    const [state, setState] = useState({ loading: true })

    useEffect(() => {
        let cancelled = false
        Promise.all([
            discoverAppSettings({ engine, serverBaseUrl: baseUrl }),
            engine.query(meQuery),
            // Icons are cosmetic: without them, the fallback icon shows.
            engine.query(appsQuery).catch(() => ({ apps: [] })),
        ])
            .then(([found, { me }, { apps }]) => {
                if (!cancelled) {
                    setState({
                        loading: false,
                        found: withIcons(found, apps),
                        authorities: me.authorities || [],
                    })
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
    }, [engine, baseUrl])

    const value = useMemo(() => {
        const found = state.found || []
        const authorities = state.authorities || []
        return {
            loading: state.loading,
            error: state.error,
            found,
            authorities,
            manageable: found.filter((entry) =>
                canAdminister(entry.description, authorities)
            ),
        }
    }, [state])

    return (
        <AppSettingsCatalogueContext.Provider value={value}>
            {children}
        </AppSettingsCatalogueContext.Provider>
    )
}

AppSettingsCatalogueProvider.propTypes = {
    children: PropTypes.node,
}

export const useAppSettingsCatalogue = () =>
    useContext(AppSettingsCatalogueContext)
