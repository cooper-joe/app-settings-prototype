import { DescriptionError, parseDescription } from './parseDescription.js'

const appBaseUrl = (app, serverBaseUrl) =>
    (app.baseUrl || `${serverBaseUrl}/api/apps/${app.key}`).replace(/\/$/, '')

const settingsUrl = (app, serverBaseUrl) =>
    `${appBaseUrl(app, serverBaseUrl)}/settings.json`

const defaultFetch = (...args) => fetch(...args)

export const loadAppSettingsDescription = async (
    app,
    serverBaseUrl,
    fetchImpl = defaultFetch
) => {
    try {
        const response = await fetchImpl(settingsUrl(app, serverBaseUrl), {
            credentials: 'include',
        })
        if (!response.ok) {
            return null
        }
        const description = parseDescription(await response.json())
        return {
            app: {
                key: app.key,
                name: app.displayName || app.name || app.key,
                version: app.version,
                baseUrl: appBaseUrl(app, serverBaseUrl),
            },
            description,
        }
    } catch (error) {
        if (error instanceof DescriptionError) {
            console.warn(`Ignoring settings description of "${app.key}"`, error)
        }
        return null
    }
}

export const discoverAppSettings = async ({
    engine,
    serverBaseUrl,
    fetchImpl = defaultFetch,
}) => {
    const { apps } = await engine.query({ apps: { resource: 'apps' } })
    const found = await Promise.all(
        (apps || []).map((app) =>
            loadAppSettingsDescription(app, serverBaseUrl, fetchImpl)
        )
    )
    return found
        .filter(Boolean)
        .sort((a, b) => a.app.name.localeCompare(b.app.name))
}
