import { HeaderBar as component } from '../../index.js'

export default { title: 'HeaderBarTesting', component }
export { Default } from './stories/default.jsx'
export { PWAEnabled } from './stories/pwa-enabled.jsx'
export { OnlineStatusMessagingWithPwaEnabled } from './stories/online-status-message.jsx'
export { MeWithAvatar } from './stories/me-with-avatar.jsx'
export { WithSpecialAppNameCharacters } from './stories/with-special-app-name-character.jsx'
export { CustomApplicationTitle } from './stories/custom-application-title.jsx'
export { UserHasAllAuthority } from './stories/user-has-all-authority.jsx'
export { UserHasWebInterpretationAndMessagingAuthority } from './stories/user-has-web-interpretation-and-messaging-authority.jsx'
export { UserHasWebInterpretationAuthority } from './stories/user-has-web-interpretation-authority.jsx'
export { UserHasWebMessagingAuthority } from './stories/user-has-web-messaging-authority.jsx'
export { UserHasNoAuthorities } from './stories/user-has-no-authorities.jsx'
export { ZeroUnreadInterpretations } from './stories/zero-unread-interpretations.jsx'
export { ZeroUnreadMessages } from './stories/zero-unread-messages.jsx'
export {
    WithUpdateAvailableNotification,
    WithUpdateAvailableNotificationNoAppName,
} from './stories/with-update-available-notification.jsx'
export {
    WithUnknownInstanceVersion,
    WithUnknownAppNameAndVersion,
    WithUnknownAppName,
    WithUnknownAppVersion,
} from './stories/with-debug-info-edge-cases.jsx'
