import { useConfig } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    IconLaunch16,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
} from '@dhis2/ui'
import * as React from 'react'
import NoNetworkIcon from './components/NoNetworkIcon'
import styles from './modal-expired.module.css'

type ExpiredModalProps = {
    dismissModal: () => void
    sessionTimeout: number
}

export const ExpiredModal: React.FC<ExpiredModalProps> = ({
    dismissModal,
    sessionTimeout,
}) => {
    const { baseUrl } = useConfig()

    const sessionTimeoutInMinutes = Math.floor(sessionTimeout / 60)

    const goToLogin = () => {
        window.open(baseUrl, '_blank', 'noopener,noreferrer')
    }
    const dismiss = () => {
        dismissModal()
    }
    return (
        <Modal large>
            <ModalTitle>{i18n.t('You have been logged out')}</ModalTitle>
            <ModalContent>
                <div>
                    {i18n.t(
                        'Your session ended after {{sessionTimeoutInMinutes}} minutes without network activity. Log in again to continue.',
                        { sessionTimeoutInMinutes }
                    )}
                </div>
                <div className={styles.noNetworkConnectionWrapper}>
                    <NoNetworkIcon />
                    <span>
                        {i18n.t(
                            'No network connection? Dismiss to continue working in an offline-capable app.'
                        )}
                    </span>
                </div>
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button onClick={dismiss}>{i18n.t('Dismiss')}</Button>

                    <Button primary onClick={goToLogin} icon={<IconLaunch16 />}>
                        {i18n.t('Log in')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}
