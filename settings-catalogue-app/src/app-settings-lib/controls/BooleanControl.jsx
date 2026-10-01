import { CheckboxField } from '@dhis2/ui'
import React from 'react'
import { controlPropTypes } from './controlPropTypes.js'
import { helpTextFor } from './sourceNote.js'

export const BooleanControl = ({
    setting,
    value,
    source,
    disabled,
    error,
    onChange,
}) => (
    <CheckboxField
        name={setting.key}
        label={setting.label}
        helpText={helpTextFor(setting, source)}
        checked={Boolean(value)}
        disabled={disabled}
        error={Boolean(error)}
        validationText={error}
        onChange={({ checked }) => onChange(setting.key, checked)}
    />
)

BooleanControl.propTypes = controlPropTypes
