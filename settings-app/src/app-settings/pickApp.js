/**
 * Which app System Settings › Apps shows. A link may name any app with a
 * description, so it can explain "You cannot change these settings".
 * Without a usable key, it's the first app the user can change.
 */
export const pickApp = ({ found = [], manageable = [] }, appKey) =>
    found.find((entry) => entry.app.key === appKey) || manageable[0] || null
