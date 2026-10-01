import { spacers } from '@dhis2/ui-constants'
import { Layer } from '@dhis2-ui/layer'
import { Popper } from '@dhis2-ui/popper'
import { UserAvatar } from '@dhis2-ui/user-avatar'
import PropTypes from 'prop-types'
import React, { useCallback, useRef, useState } from 'react'
import i18n from '../../locales/index.js'
import { DebugInfoModal } from './debug-info/debug-info-modal.jsx'
import { ProfileMenu } from './profile-menu/index.js'
import { useCustomColorContext } from './custom-color-context.jsx'

const Profile = ({ name, avatarId, helpUrl, username }) => {
    const [showProfileMenu, setShowProfileMenu] = useState(false)
    const [showDebugInfoModal, setShowDebugInfoModal] = useState(false)

    const containerRef = useRef(null)
    const hideProfileMenu = useCallback(() => setShowProfileMenu(false), [])
    const toggleProfileMenu = useCallback(
        () => setShowProfileMenu((show) => !show),
        []
    )

    const customColor = useCustomColorContext()

    const hoverStyle = customColor?.bgColor
        ? 'opacity: 0.8;'
        : 'background: #104f7e;'

    return (
        <div
            ref={containerRef}
            data-test="headerbar-profile"
            className="headerbar-profile"
        >
            <button
                className="headerbar-profile-btn"
                onClick={toggleProfileMenu}
                title={i18n.t('Profile menu')}
                aria-label={i18n.t('Profile menu')}
            >
                <UserAvatar
                    avatarId={avatarId}
                    name={name}
                    dataTest="headerbar-profile-icon"
                    small
                />
            </button>

            {showProfileMenu && (
                <Layer onBackdropClick={hideProfileMenu}>
                    <Popper reference={containerRef} placement="bottom-end">
                        <ProfileMenu
                            avatarId={avatarId}
                            name={name}
                            username={username}
                            helpUrl={helpUrl}
                            hideProfileMenu={hideProfileMenu}
                            showDebugInfoModal={() => {
                                setShowDebugInfoModal(true)
                            }}
                        />
                    </Popper>
                </Layer>
            )}
            {showDebugInfoModal && (
                <DebugInfoModal
                    onClose={() => {
                        setShowDebugInfoModal(false)
                    }}
                />
            )}

            <style jsx>{`
                .headerbar-profile {
                    position: relative;
                    height: 100%;
                }

                .headerbar-profile-btn {
                    background: transparent;
                    padding: ${spacers.dp8};
                    border: 0;
                    cursor: pointer;
                }
                .headerbar-profile-btn:focus {
                    outline: 2px solid white;
                    outline-offset: -2px;
                }
                .headerbar-profile-btn:focus:not(:focus-visible) {
                    outline: none;
                }
                .headerbar-profile-btn:hover {
                    ${hoverStyle}
                }
                .headerbar-profile-btn:active {
                    ${hoverStyle}
                }
            `}</style>
        </div>
    )
}

Profile.propTypes = {
    name: PropTypes.string.isRequired,
    avatarId: PropTypes.string,
    helpUrl: PropTypes.string,
    username: PropTypes.string,
}

export default Profile
