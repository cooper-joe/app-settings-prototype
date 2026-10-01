import Cookies from 'js-cookie'

const SESSION_EXPIRY_COOKIE_NAME = 'SESSION_EXPIRE'

/**
 * This reads the cookie, splits and returns the information saved in it (serverTime and sessionTimeout)
 * 
 * The cookie format is server_time=%s&expiry_time=%s
 * Both server-time and session-expiry are in seconds and need to be converted to milliseconds for use for JS Date

 * @returns {sessionTimeout: number, serverTime: number}
 */
type GetSessionCookieFn = () => {
    serverTime?: number
    sessionExpiryTime?: number
} | null

const getSessionCookie: GetSessionCookieFn = () => {
    const cookieValue = Cookies.get(SESSION_EXPIRY_COOKIE_NAME) 
    if (!cookieValue) {
        return null
    }

    const params = new URLSearchParams(cookieValue)

    const serverTime = Number(params.get('server_time')) * 1000
    const sessionExpiryTime = Number(params.get('expiry_time')) * 1000

    if (isNaN(serverTime) || isNaN(sessionExpiryTime)) {
        return null
    }

    return {
        sessionExpiryTime,
        serverTime,
    }
}

export default getSessionCookie
