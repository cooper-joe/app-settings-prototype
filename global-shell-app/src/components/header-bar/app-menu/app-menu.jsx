import { colors, elevations, spacers } from '@dhis2/ui-constants'
import {
    IconChevronDown16,
    IconInfo16,
    IconQuestion16,
    IconSettings16,
} from '@dhis2/ui-icons'
import { Layer } from '@dhis2-ui/layer'
import { MenuDivider, MenuItem, MenuSectionHeader } from '@dhis2-ui/menu'
import { Popper } from '@dhis2-ui/popper'
import PropTypes from 'prop-types'
import React, { useCallback, useRef, useState } from 'react'
import { Link } from 'react-router'
import i18n from '../../../locales/index.js'
import { UpdateNotification } from '../profile-menu/update-notification.jsx'
import { linkClassName, linkStyles } from '../react-router-link-styles.jsx'
import { AboutAppModal } from './about-app-modal.jsx'

/**
 * The app part of the header bar title, as a menu: always the app's version
 * and "About", plus "Help" when the app has a help page, "Settings" when the
 * app has settings the user can change, and a notice when an update of the
 * app is waiting.
 */
export const AppMenu = ({
    appName,
    appVersion,
    appIcon,
    about,
    helpUrl,
    settingsPath,
    updateAvailable = false,
    onApplyUpdate,
}) => {
    const [open, setOpen] = useState(false)
    const [aboutOpen, setAboutOpen] = useState(false)
    const buttonRef = useRef(null)
    const hide = useCallback(() => setOpen(false), [])
    const toggle = useCallback(() => setOpen((isOpen) => !isOpen), [])
    const showAbout = useCallback(() => {
        setOpen(false)
        setAboutOpen(true)
    }, [])

    return (
        <>
            <button
                ref={buttonRef}
                className="app-menu-btn"
                data-test="headerbar-app-menu"
                onClick={toggle}
                aria-haspopup="menu"
                aria-expanded={open ? 'true' : 'false'}
                aria-label={
                    updateAvailable
                        ? i18n.t('{{appName}} menu, update available', {
                              appName,
                          })
                        : i18n.t('{{appName}} menu', { appName })
                }
            >
                {appName}
                {updateAvailable && (
                    <span
                        aria-hidden="true"
                        className="app-menu-update-dot"
                        data-test="headerbar-app-menu-update-dot"
                    />
                )}
                <span aria-hidden="true" className="app-menu-caret">
                    <IconChevronDown16 />
                </span>
            </button>

            {open && (
                <Layer onBackdropClick={hide}>
                    <Popper reference={buttonRef} placement="bottom-start">
                        <div
                            className="app-menu"
                            data-test="headerbar-app-menu-list"
                        >
                            <ul>
                                <MenuSectionHeader
                                    dense
                                    hideDivider
                                    label={
                                        appVersion
                                            ? i18n.t('Version {{version}}', {
                                                  version: appVersion,
                                              })
                                            : i18n.t('Version unknown')
                                    }
                                />
                                <MenuDivider dense />
                                <MenuItem
                                    dense
                                    label={i18n.t('About')}
                                    value="about"
                                    icon={<IconInfo16 color={colors.grey600} />}
                                    onClick={showAbout}
                                />
                                {helpUrl && (
                                    <MenuItem
                                        dense
                                        label={i18n.t('Help')}
                                        value="help"
                                        href={helpUrl}
                                        target="_blank"
                                        icon={
                                            <IconQuestion16
                                                color={colors.grey600}
                                            />
                                        }
                                    />
                                )}
                                {settingsPath && (
                                    <>
                                        <MenuDivider dense />
                                        <Link
                                            to={settingsPath}
                                            className={linkClassName}
                                            onClick={hide}
                                        >
                                            <MenuItem
                                                dense
                                                label={i18n.t('Settings')}
                                                value="app-settings"
                                                icon={
                                                    <IconSettings16
                                                        color={colors.grey600}
                                                    />
                                                }
                                            />
                                        </Link>
                                    </>
                                )}
                            </ul>
                            <UpdateNotification
                                hideProfileMenu={hide}
                                updateAvailable={updateAvailable}
                                onApplyAvailableUpdate={onApplyUpdate}
                            />
                        </div>
                    </Popper>
                </Layer>
            )}

            {aboutOpen && (
                <AboutAppModal
                    about={about}
                    appName={appName}
                    appVersion={appVersion}
                    appIcon={appIcon}
                    onClose={() => setAboutOpen(false)}
                />
            )}

            {linkStyles}
            <style jsx>{`
                .app-menu-btn {
                    display: flex;
                    align-items: center;
                    align-self: stretch;
                    background: transparent;
                    border: 0;
                    border-radius: 3px;
                    color: inherit;
                    font: inherit;
                    letter-spacing: inherit;
                    text-shadow: inherit;
                    padding: 0 ${spacers.dp8} 0 10px;
                    cursor: pointer;
                }
                .app-menu-btn:hover,
                .app-menu-btn:active {
                    background: rgba(0, 0, 0, 0.12);
                }
                .app-menu-btn:focus {
                    outline: 2px solid white;
                    outline-offset: -2px;
                }
                .app-menu-btn:focus:not(:focus-visible) {
                    outline: none;
                }
                .app-menu-update-dot {
                    width: 7px;
                    height: 7px;
                    flex-shrink: 0;
                    margin-inline-start: 7px;
                    border-radius: 50%;
                    background-color: ${colors.blue600};
                    box-shadow: 0 0 0 1.5px ${colors.white};
                }
                .app-menu-caret {
                    display: flex;
                    opacity: 0.75;
                    margin-inline-start: ${spacers.dp4};
                }
                .app-menu-btn:hover .app-menu-caret {
                    opacity: 1;
                }
                .app-menu {
                    min-width: 240px;
                    background: ${colors.white};
                    box-shadow: ${elevations.e300};
                    border-radius: 3px;
                    border: 1px solid ${colors.grey300};
                    text-shadow: none;
                    overflow: hidden;
                }
                ul {
                    padding: 0;
                    margin: 0;
                }
                a,
                a:hover,
                a:focus,
                a:active,
                a:visited {
                    text-decoration: none;
                    display: block;
                }
            `}</style>
        </>
    )
}

AppMenu.propTypes = {
    appName: PropTypes.string.isRequired,
    about: PropTypes.object,
    appIcon: PropTypes.string,
    appVersion: PropTypes.string,
    helpUrl: PropTypes.string,
    settingsPath: PropTypes.string,
    updateAvailable: PropTypes.bool,
    onApplyUpdate: PropTypes.func,
}
