import {
    Button,
    ButtonStrip,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
} from '@dhis2/ui'
import React from 'react'
import i18n from '../locales/index.js'

interface ConfirmUpdateModalProps {
    clientsCount: number
    onCancel: () => void
    onConfirm: () => void
}

export function ConfirmUpdateModal({
    clientsCount,
    onCancel,
    onConfirm,
}: ConfirmUpdateModalProps) {
    return (
        <Modal position="middle">
            <ModalTitle>{i18n.t('Save your data')}</ModalTitle>
            <ModalContent>
                {clientsCount
                    ? i18n.t(
                          "Updating will reload all {{n}} open instances of this app, and any unsaved data will be lost. Save any data you need to, then click 'Reload' when ready.",
                          { n: clientsCount }
                      )
                    : // Fallback if clientsCount is unavailable:
                      i18n.t(
                          "Updating will reload all open instances of this app, and any unsaved data will be lost. Save any data you need to, then click 'Reload' when ready."
                      )}
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button onClick={onCancel}>{i18n.t('Cancel')}</Button>
                    <Button destructive onClick={onConfirm}>
                        {i18n.t('Reload')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}
