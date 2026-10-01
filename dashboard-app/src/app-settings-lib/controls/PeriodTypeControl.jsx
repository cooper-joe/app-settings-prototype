import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import React from 'react'
import { controlPropTypes } from './controlPropTypes.js'
import { metadataOptions } from './metadataOptions.js'
import { helpTextFor } from './sourceNote.js'

const QUERY = {
    types: { resource: 'periodTypes', params: { fields: 'name' } },
}

export const PeriodTypeControl = ({
    setting,
    value,
    source,
    disabled,
    error,
    onChange,
}) => {
    const { loading, error: loadError, data } = useDataQuery(QUERY)
    const unavailable = loading || loadError
    const items = (data?.types?.periodTypes || []).map(({ name }) => ({
        id: name,
        displayName: name,
    }))
    const options = metadataOptions(items, unavailable ? null : value)
    const validationText =
        error ||
        (loadError ? i18n.t('Could not load the period types') : undefined)
    return (
        <SingleSelectField
            label={setting.label}
            helpText={helpTextFor(setting, source)}
            required={setting.required}
            clearable={!setting.required}
            loading={loading}
            disabled={disabled || loading}
            selected={unavailable ? '' : value ?? ''}
            error={Boolean(validationText)}
            validationText={validationText}
            onChange={({ selected }) => onChange(setting.key, selected || null)}
        >
            {options.map((option) => (
                <SingleSelectOption
                    key={option.value}
                    value={option.value}
                    label={option.label}
                />
            ))}
        </SingleSelectField>
    )
}

PeriodTypeControl.propTypes = controlPropTypes
