const DOCS =
    'https://docs.dhis2.org/en/use/user-guides/dhis-core-version-master'

// Prototype: the shell knows a few apps' help pages. In the real design an
// app would declare its help link in d2.config.js, and it would travel in
// the app manifest.
const HELP_URLS = {
    dashboard: `${DOCS}/analysing-data/dashboards.html`,
    settings: `${DOCS}/configuring-the-system/system-settings.html`,
}

export const helpUrlFor = (appKey) => HELP_URLS[appKey] ?? null

export const appHubUrl = (appHubId) =>
    appHubId ? `https://apps.dhis2.org/app/${appHubId}` : null

/**
 * The parts of an app's /api/apps entry that "About" shows. The server
 * rewrites manifest.webapp from the same record, so the manifest has
 * nothing more; the build time (manifest_generated_at) doesn't survive.
 */
export const aboutFromApiApp = (app) =>
    app
        ? {
              description: app.description || null,
              developer: app.developer?.name || app.developer?.company || null,
              coreApp: Boolean(app.core_app),
              appHubId: app.app_hub_id || null,
          }
        : null
