import { useDataQuery } from '@dhis2/app-runtime'
import * as React from 'react'
import { ExpirationCountdownModal } from './modal-countdown'
import { ExpiredModal } from './modal-expired'
import { useCheckCookie } from './use-check-cookie'

const query = {
    user: {
        resource: 'me',
        params: {
            fields: ['name'],
        },
    },
}

type SessionHandlerProps = {
    sessionTimeoutInSeconds: number
}

export const SessionHandler: React.FC<SessionHandlerProps> = ({
    sessionTimeoutInSeconds,
}) => {
    const { showWarning, time, forceExpire, expired, reset } = useCheckCookie(
        sessionTimeoutInSeconds
    )
    const [feedbackManuallyDismissed, setFeedbackManuallyDismissed] =
        React.useState(false)

    const {
        refetch: extendSession,
        loading,
        error: errorExtending,
    } = useDataQuery(query, {
        lazy: true,
    })

    const onExtendSession = async () => {
        await extendSession()
        if (!errorExtending) {
            reset()
        }
    }

    const dismissModal = async () => {
        setFeedbackManuallyDismissed(true)
        reset()
    }

    React.useEffect(() => {
        if (errorExtending?.details?.httpStatusCode == 401) {
            forceExpire()
        }
    }, [errorExtending, forceExpire])

    if (!expired && showWarning) {
        return (
            <ExpirationCountdownModal
                countDown={time!}
                onExtendSession={onExtendSession}
                loading={loading}
                sessionTimeout={sessionTimeoutInSeconds}
            />
        )
    }

    // ToDo: unsure - once dismissed, we don't show it again?
    if (expired && !feedbackManuallyDismissed) {
        return (
            <ExpiredModal
                sessionTimeout={sessionTimeoutInSeconds}
                dismissModal={dismissModal}
            />
        )
    }
    return null
}
