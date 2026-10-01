import { MultiSelectField, MultiSelectOption } from '@dhis2/ui'
import React from 'react'
import { controlPropTypes } from './controlPropTypes.js'
import { metadataOptions } from './metadataOptions.js'
import { helpTextFor } from './sourceNote.js'

export const MultiSelectControl = ({
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
        <MultiSelectField
            label={setting.label}
            helpText={helpTextFor(setting, source)}
            required={setting.required}
            selected={Array.isArray(value) ? value : []}
            disabled={disabled}
            error={Boolean(error)}
            validationText={error}
            onChange={({ selected }) => onChange(setting.key, selected)}
        >
            {options.map((option) => (
                <MultiSelectOption key={option.value} {...option} />
            ))}
        </MultiSelectField>
    )
}

MultiSelectControl.propTypes = controlPropTypes
