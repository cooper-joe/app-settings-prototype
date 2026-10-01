import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { CircularLoader, Field, OrganisationUnitTree } from '@dhis2/ui'
import React, { useEffect, useState } from 'react'
import { controlPropTypes } from './controlPropTypes.js'
import styles from './OrgUnitControl.module.css'
import {
    nextSelection,
    parentPaths,
    toIds,
    toValue,
} from './orgUnitSelection.js'
import { helpTextFor } from './sourceNote.js'

const ROOTS_QUERY = {
    me: { resource: 'me', params: { fields: 'organisationUnits[id]' } },
}

const SELECTED_QUERY = {
    units: {
        resource: 'organisationUnits',
        params: ({ ids }) => ({
            filter: `id:in:[${ids.join(',')}]`,
            fields: 'id,path',
            paging: false,
        }),
    },
}

export const OrgUnitControl = ({
    setting,
    value,
    source,
    disabled,
    error,
    onChange,
}) => {
    const engine = useDataEngine()
    const multiple = Boolean(setting.multiple)
    const [state, setState] = useState({ loading: true })

    useEffect(() => {
        let cancelled = false
        const ids = toIds(value)
        Promise.all([
            engine.query(ROOTS_QUERY),
            ids.length > 0
                ? engine.query(SELECTED_QUERY, { variables: { ids } })
                : Promise.resolve({ units: { organisationUnits: [] } }),
        ])
            .then(([{ me }, { units }]) => {
                if (cancelled) {
                    return
                }
                const found = units.organisationUnits
                setState({
                    loading: false,
                    roots: me.organisationUnits.map((unit) => unit.id),
                    paths: found.map((unit) => unit.path),
                    missing: ids.filter(
                        (id) => !found.some((unit) => unit.id === id)
                    ),
                })
            })
            .catch((loadError) => {
                if (!cancelled) {
                    setState({ loading: false, loadError })
                }
            })
        return () => {
            cancelled = true
        }
        // Load once. After that, the tree's own selection is the source of
        // truth, so a saved value coming back doesn't reload the tree.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [engine])

    const handleChange = ({ path, checked }) => {
        const paths = nextSelection({
            multiple,
            current: state.paths,
            path,
            checked,
        })
        setState((previous) => ({ ...previous, paths, missing: [] }))
        onChange(setting.key, toValue({ multiple, paths }))
    }

    const validationText =
        error ||
        (state.loadError
            ? i18n.t('Could not load organisation units')
            : undefined)

    return (
        <Field
            label={setting.label}
            helpText={helpTextFor(setting, source)}
            required={setting.required}
            error={Boolean(validationText)}
            validationText={validationText}
        >
            {state.loading && <CircularLoader small />}
            {state.roots && (
                <div className={styles.tree}>
                    <OrganisationUnitTree
                        roots={state.roots}
                        selected={state.paths}
                        initiallyExpanded={parentPaths(state.paths)}
                        singleSelection={!multiple}
                        disableSelection={disabled}
                        onChange={handleChange}
                    />
                </div>
            )}
            {state.missing?.length > 0 && (
                <p className={styles.missing}>
                    {i18n.t('Not found: {{ids}}', {
                        ids: state.missing.join(', '),
                        nsSeparator: '-:-',
                    })}
                </p>
            )}
        </Field>
    )
}

OrgUnitControl.propTypes = controlPropTypes
