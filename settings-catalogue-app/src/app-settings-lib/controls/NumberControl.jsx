import { InputField } from '@dhis2/ui'
import React, { useEffect, useRef, useState } from 'react'
import { controlPropTypes } from './controlPropTypes.js'
import { helpTextFor } from './sourceNote.js'

const toDraft = (value) =>
    value === null || value === undefined ? '' : String(value)

const bound = (limit) => (typeof limit === 'number' ? String(limit) : undefined)

export const NumberControl = ({
    setting,
    value,
    source,
    disabled,
    error,
    onChange,
}) => {
    const [draft, setDraft] = useState(toDraft(value))
    const lastCommitted = useRef(undefined)

    useEffect(() => {
        setDraft(toDraft(value))
        lastCommitted.current = undefined
    }, [value])

    const commit = (event) => {
        if (event?.target?.validity?.badInput) {
            onChange(setting.key, Number.NaN)
            return
        }
        const next = draft.trim() === '' ? null : Number(draft)
        if (next === lastCommitted.current && !error) {
            return
        }
        if (next !== (value ?? null) || error) {
            lastCommitted.current = next
            onChange(setting.key, next)
        }
    }

    return (
        <InputField
            type="number"
            name={setting.key}
            label={setting.label}
            helpText={helpTextFor(setting, source)}
            required={setting.required}
            min={bound(setting.min)}
            max={bound(setting.max)}
            step={setting.integer ? '1' : 'any'}
            value={draft}
            disabled={disabled}
            error={Boolean(error)}
            validationText={error}
            onChange={({ value: next }) => setDraft(next)}
            onBlur={(_, event) => commit(event)}
            onKeyDown={(_, event) => {
                if (event.key === 'Enter') {
                    commit(event)
                }
            }}
        />
    )
}

NumberControl.propTypes = controlPropTypes
