import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import React from 'react'
import { controlPropTypes } from './controlPropTypes.js'

export const UnsupportedControl = ({ setting }) => (
    <NoticeBox warning title={setting.label}>
        {i18n.t('This setting needs a newer version of System Settings.')}
    </NoticeBox>
)

UnsupportedControl.propTypes = controlPropTypes
