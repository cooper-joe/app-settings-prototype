import { InputField, TextAreaField } from '@dhis2/ui'
import React, { useEffect, useRef, useState } from 'react'
import { controlPropTypes } from './controlPropTypes.js'
import { helpTextFor } from './sourceNote.js'

export const TextControl = ({
    setting,
    value,
    source,
    disabled,
    error,
    onChange,
}) => {
    const [draft, setDraft] = useState(value ?? '')
    const lastCommitted = useRef(undefined)

    useEffect(() => {
        setDraft(value ?? '')
        lastCommitted.current = undefined
    }, [value])

    const commit = () => {
        const next = draft.trim() === '' ? null : draft
        if (next === lastCommitted.current && !error) {
            return
        }
        if (next !== (value ?? null) || error) {
            lastCommitted.current = next
            onChange(setting.key, next)
        }
    }

    const field = {
        name: setting.key,
        label: setting.label,
        helpText: helpTextFor(setting, source),
        required: setting.required,
        value: draft,
        disabled,
        error: Boolean(error),
        validationText: error,
        onChange: ({ value: next }) => setDraft(next),
        onBlur: () => commit(),
    }

    if (setting.multiline) {
        return <TextAreaField {...field} rows={4} />
    }
    return (
        <InputField
            {...field}
            onKeyDown={(_, event) => {
                if (event.key === 'Enter') {
                    commit()
                }
            }}
        />
    )
}

TextControl.propTypes = controlPropTypes
