import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
} from '@dhis2/ui'
import * as React from 'react'
import formatCountdown from './helpers/format-countdown'
import styles from './session-handler.module.css'

type ExpirationCountdownModalProps = {
    countDown: number
    loading: boolean
    onExtendSession: () => void
    sessionTimeout: number
}

export const ExpirationCountdownModal: React.FC<
    ExpirationCountdownModalProps
> = ({ countDown, onExtendSession, loading, sessionTimeout }) => {
    const sessionTimeoutInMinutes = Math.floor(sessionTimeout / 60)

    const { minutes, seconds } = formatCountdown(countDown)

    return (
        <Modal>
            <ModalTitle>{i18n.t('Session ending')}</ModalTitle>
            {/* ToDO: maybe makes sense to format the countDown in minutes / seconds? */}
            <ModalContent>
                {i18n.t(
                    'For security, you will be logged out after {{sessionTimeoutInMinutes}} minutes without any network activity.',
                    { sessionTimeoutInMinutes }
                )}

                <div className={styles.timer}>{`${minutes}:${seconds}`}</div>
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    {/* can this get into undesired state when offline - i.e. can't extend but want to dismiss */}
                    <Button primary onClick={onExtendSession} loading={loading}>
                        {i18n.t('Stay logged in')}
                    </Button>
                    {/* <Button>Dismiss</Button> */}
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}
