import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import calculateSkew from './helpers/calculate-skew'
import getSessionCookie from './helpers/get-session-cookie'

const CHECK_INTERVAL = 1 * 1000 // ms countdown every second
const MIN_WARNING_THRESHOLD = 20
const MAX_WARNING_THRESHOLD = 5 * 60
export const useCheckCookie = (sessionTimeoutInSeconds: number) => {
    const [time, setTime] = useState<number>()
    const warningThresholdInSeconds = useMemo(() => {
        let threshold = Math.round(sessionTimeoutInSeconds * 0.1)
        threshold = Math.min(
            Math.max(threshold, MIN_WARNING_THRESHOLD),
            MAX_WARNING_THRESHOLD
        )
        return threshold
    }, [sessionTimeoutInSeconds])

    const [expired, setExpired] = useState(false)

    // This is used to correct the skew when the time is misconfigured on the client
    const calculatedSkew = useRef<number>(0)
    const sessionExpiryTimeValue = useRef<number | undefined>(undefined)

    const reset = useCallback(() => {
        const { serverTime, sessionExpiryTime } = getSessionCookie() ?? {}

        if (serverTime && sessionExpiryTime) {
            const nowDate = Date.now() - calculatedSkew.current

            const remainingSeconds = Math.round(
                (sessionExpiryTime - nowDate) / 1000
            )

            setTime(remainingSeconds)
            setExpired(false)
        }
    }, [])

    const forceExpire = () => {
        setTime(0)
        setExpired(true)
    }

    useEffect(() => {
        const { serverTime } = getSessionCookie() ?? {}
        if (serverTime) {
            calculatedSkew.current = calculateSkew(serverTime)
        }
        reset()
    }, [reset, warningThresholdInSeconds])

    useEffect(() => {
        if (!time) {
            return
        }

        const focusListener = () => {
            const sessionExpiryTime = getSessionCookie()?.sessionExpiryTime
            if (
                sessionExpiryTime &&
                sessionExpiryTimeValue.current != sessionExpiryTime
            ) {
                setExpired(false)
                reset()
                sessionExpiryTimeValue.current = sessionExpiryTime
            }
        }
        window.addEventListener('focus', focusListener, false)

        const interval = setInterval(() => {
            const sessionExpiryTime = getSessionCookie()?.sessionExpiryTime

            if (time === 1) {
                setExpired(true)
                clearInterval(interval)
                return
            }

            // in effect, an update to the cookie - regardless of the value of the time out - is an indication to reset the timer
            // the timer resets and counts to the session timeout value (no need to cater for skew)
            if (sessionExpiryTimeValue.current != sessionExpiryTime) {
                reset()
                sessionExpiryTimeValue.current = sessionExpiryTime
            } else if (time > 0) {
                setTime(time - 1)
                return
            }
        }, CHECK_INTERVAL)

        return () => {
            clearInterval(interval)
            window.removeEventListener('focus', focusListener, false)
        }
    }, [reset, time])

    return {
        time,
        expired,
        forceExpire,
        showWarning: time && time < warningThresholdInSeconds,
        reset,
    }
}
