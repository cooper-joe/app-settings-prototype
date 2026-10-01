import { useConfig } from '@dhis2/app-runtime'
import { Plugin } from '@dhis2/app-runtime/experimental' // eslint-disable-line import/no-unresolved -- resolver here doesn't read package.json "exports"; the subpath exists (build/cjs/experimental.js)
import i18n from '@dhis2/d2-i18n'
import { Field } from '@dhis2/ui'
import React, { useCallback } from 'react'
import { controlPropTypes } from './controlPropTypes.js'
import styles from './CustomControl.module.css'
import { helpTextFor } from './sourceNote.js'

// The global shell serves apps at <server>/apps/<key>, and copies the URL's
// hash onto the app. The link targets the top window, so it leaves System
// Settings' iframe.
export const appPageUrl = ({ serverBaseUrl, appKey, appPath }) => {
    const root = new URL(serverBaseUrl || '/', window.location.href).href
    return `${root.replace(/\/+$/, '')}/apps/${encodeURIComponent(
        appKey
    )}${appPath}`
}

export const CustomControl = ({
    setting,
    value,
    source,
    disabled,
    error,
    onChange,
    app,
}) => {
    const { baseUrl } = useConfig()
    const { key } = setting
    // Plugin compares props by value, so a new function on each render would
    // send the plugin an update each time.
    const handlePluginChange = useCallback(
        (next) => onChange(key, next),
        [onChange, key]
    )

    return (
        <Field
            label={setting.label}
            helpText={helpTextFor(setting, source)}
            error={Boolean(error)}
            validationText={error}
        >
            <div className={styles.custom}>
                {setting.plugin && app?.baseUrl && (
                    <Plugin
                        pluginSource={`${app.baseUrl.replace(/\/+$/, '')}/${
                            setting.plugin
                        }`}
                        value={value}
                        disabled={Boolean(disabled)}
                        onChange={handlePluginChange}
                    />
                )}
                {setting.appPath && app?.key && (
                    <a
                        className={styles.link}
                        href={appPageUrl({
                            serverBaseUrl: baseUrl,
                            appKey: app.key,
                            appPath: setting.appPath,
                        })}
                        target="_top"
                    >
                        {i18n.t('Open in {{app}}', {
                            app: app.name || app.key,
                            nsSeparator: '-:-',
                        })}
                    </a>
                )}
            </div>
        </Field>
    )
}

CustomControl.propTypes = controlPropTypes
