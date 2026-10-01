import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import React from 'react'
import { controlPropTypes } from './controlPropTypes.js'
import { metadataOptions } from './metadataOptions.js'
import { helpTextFor } from './sourceNote.js'

export const SelectControl = ({
    setting,
    value,
    source,
    disabled,
    error,
    onChange,
}) => {
    const options = metadataOptions(
        setting.options.map(({ value: id, label: displayName }) => ({
            id,
            displayName,
        })),
        value
    )
    return (
        <SingleSelectField
            label={setting.label}
            helpText={helpTextFor(setting, source)}
            required={setting.required}
            clearable={!setting.required}
            selected={value ?? ''}
            disabled={disabled}
            error={Boolean(error)}
            validationText={error}
            onChange={({ selected }) => onChange(setting.key, selected || null)}
        >
            {options.map((option) => (
                <SingleSelectOption key={option.value} {...option} />
            ))}
        </SingleSelectField>
    )
}

SelectControl.propTypes = controlPropTypes
