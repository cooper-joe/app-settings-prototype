import PropTypes from 'prop-types'
import React from 'react'
import {
    AppMenu,
    helpUrlFor,
    settingsDoorPath,
    useAppSettingsDoor,
    useSimulatedAppUpdate,
} from './app-menu/index.js'
import { useCustomColorContext } from './custom-color-context.jsx'

const findModule = (appKey, modules = []) =>
    modules.find((m) => m.name === appKey || m.name === 'dhis-web-' + appKey)

export const Title = ({
    app,
    instance,
    clientApp,
    appVersion,
    modules,
    authorities,
    serverBaseUrl,
}) => {
    const { hasCustomColor, color } = useCustomColorContext()
    const door = useAppSettingsDoor({
        app: clientApp,
        serverBaseUrl,
        authorities,
    })
    const settingsPath =
        door.state === 'available'
            ? settingsDoorPath({ modules, appKey: clientApp.key })
            : null
    const update = useSimulatedAppUpdate(clientApp?.key)

    // Use text shadow for default conditions or white text
    const shadow =
        !hasCustomColor || color === 'white'
            ? 'text-shadow: 0px 0px 2px rgba(0, 0, 0, 0.5);'
            : ''

    // Without an open app there is no menu, just the plain title
    let instanceText = instance
    if (!clientApp && app) {
        instanceText = `${instance} - ${app}`
    }

    return (
        <div data-test="headerbar-title">
            <span className="instance">{instanceText}</span>
            {clientApp && (
                <>
                    <span className="divider" aria-hidden="true" />
                    <AppMenu
                        appName={app}
                        appVersion={appVersion}
                        appIcon={findModule(clientApp.key, modules)?.icon}
                        about={clientApp.about}
                        helpUrl={helpUrlFor(clientApp.key)}
                        settingsPath={settingsPath}
                        updateAvailable={update.updateAvailable}
                        onApplyUpdate={update.applyUpdate}
                    />
                </>
            )}

            <style jsx>{`
                div {
                    display: flex;
                    align-items: center;
                    align-self: stretch;
                    min-width: 0;
                    font-size: 13px;
                    letter-spacing: 0.01em;
                    ${shadow}
                    white-space: nowrap;
                }
                .instance {
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .divider {
                    flex-shrink: 0;
                    align-self: stretch;
                    width: 1px;
                    margin-inline-start: 10px;
                    background: rgba(32, 32, 32, 0.15);
                }
            `}</style>
        </div>
    )
}
Title.propTypes = {
    app: PropTypes.string,
    appVersion: PropTypes.string,
    authorities: PropTypes.arrayOf(PropTypes.string),
    clientApp: PropTypes.shape({
        key: PropTypes.string.isRequired,
        about: PropTypes.object,
        baseUrl: PropTypes.string,
    }),
    instance: PropTypes.string,
    modules: PropTypes.array,
    serverBaseUrl: PropTypes.string,
}
