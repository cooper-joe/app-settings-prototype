import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    MultiSelectField,
    MultiSelectOption,
    SingleSelectField,
    SingleSelectOption,
} from '@dhis2/ui'
import React, { useMemo } from 'react'
import { controlPropTypes } from './controlPropTypes.js'
import { metadataOptions } from './metadataOptions.js'
import { helpTextFor } from './sourceNote.js'

export const MetadataControl = ({
    setting,
    value,
    source,
    disabled,
    error,
    onChange,
}) => {
    // useDataQuery keeps its first query, so the control relies on being
    // remounted if resource changes (fields are keyed by setting key).
    const query = useMemo(
        () => ({
            list: {
                resource: setting.resource,
                params: {
                    fields: 'id,displayName',
                    order: 'displayName:asc',
                    paging: false,
                },
            },
        }),
        [setting.resource]
    )
    const { loading, error: loadError, data } = useDataQuery(query)
    const items = data?.list?.[setting.resource] || []
    const unavailable = loading || loadError
    const options = metadataOptions(items, unavailable ? null : value)
    const validationText =
        error || (loadError ? i18n.t('Could not load the list') : undefined)
    const common = {
        label: setting.label,
        helpText: helpTextFor(setting, source),
        required: setting.required,
        filterable: true,
        loading,
        disabled: disabled || loading,
        error: Boolean(validationText),
        validationText,
    }

    if (setting.multiple) {
        return (
            <MultiSelectField
                {...common}
                selected={unavailable || !Array.isArray(value) ? [] : value}
                onChange={({ selected }) => onChange(setting.key, selected)}
            >
                {options.map((option) => (
                    <MultiSelectOption key={option.value} {...option} />
                ))}
            </MultiSelectField>
        )
    }
    return (
        <SingleSelectField
            {...common}
            clearable={!setting.required}
            selected={unavailable ? '' : value ?? ''}
            onChange={({ selected }) => onChange(setting.key, selected || null)}
        >
            {options.map((option) => (
                <SingleSelectOption key={option.value} {...option} />
            ))}
        </SingleSelectField>
    )
}

MetadataControl.propTypes = controlPropTypes
