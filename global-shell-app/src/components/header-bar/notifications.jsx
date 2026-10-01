import PropTypes from 'prop-types'
import React from 'react'
import i18n from '../../locales/index.js'
import { NotificationIcon } from './notification-icon.jsx'

const hasAuthority = (userAuthorities, authId) =>
    Array.isArray(userAuthorities) &&
    userAuthorities.some(
        (userAuthId) => userAuthId === 'ALL' || userAuthId === authId
    )

export const Notifications = ({
    interpretations,
    messages,
    userAuthorities,
}) => {
    return (
        <div data-test="headerbar-notifications">
            {hasAuthority(userAuthorities, 'M_dhis-web-interpretation') && (
                <NotificationIcon
                    count={interpretations}
                    path={'/interpretation'}
                    kind="message"
                    dataTestId="headerbar-interpretations"
                    title={i18n.t('Interpretations')}
                    aria-label={i18n.t('Interpretations')}
                />
            )}

            {hasAuthority(userAuthorities, 'M_dhis-web-messaging') && (
                <NotificationIcon
                    message="email"
                    count={messages}
                    path={'/messaging'}
                    kind="interpretation"
                    dataTestId="headerbar-messages"
                    title={i18n.t('Messages')}
                    aria-label={i18n.t('Messages')}
                />
            )}

            <style jsx>{`
                div {
                    user-select: none;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    height: 100%;
                }
            `}</style>
        </div>
    )
}

Notifications.propTypes = {
    interpretations: PropTypes.number,
    messages: PropTypes.number,
    userAuthorities: PropTypes.arrayOf(PropTypes.string),
}
