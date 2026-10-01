import PropTypes from 'prop-types'
import React, { useCallback, useState } from 'react'
import { Control } from './controls/Control.jsx'
import { appPropType } from './controls/controlPropTypes.js'
import styles from './SettingsForm.module.css'
import { validateValue } from './validateValue.js'

const groupBySection = ({ sections, settings }) => {
    const groups = sections.map((section) => ({
        section,
        settings: settings.filter((setting) => setting.section === section.id),
    }))
    const unsectioned = settings.filter((setting) => !setting.section)
    if (unsectioned.length > 0) {
        groups.push({ section: null, settings: unsectioned })
    }
    return groups.filter((group) => group.settings.length > 0)
}

export const SettingsForm = ({
    description,
    values,
    sources,
    onChange,
    disabled,
    app,
}) => {
    const [errors, setErrors] = useState({})

    const handleChange = useCallback(
        (key, value) => {
            const setting = description.settings.find(
                (entry) => entry.key === key
            )
            const problem = setting ? validateValue(setting, value) : null
            setErrors((previous) => ({ ...previous, [key]: problem?.message }))
            if (!problem) {
                onChange(key, value)
            }
        },
        [description, onChange]
    )

    return (
        <div className={styles.form}>
            {groupBySection(description).map(({ section, settings }) => (
                <section
                    key={section?.id ?? 'other'}
                    className={styles.section}
                >
                    {section && (
                        <h3 className={styles.heading}>{section.label}</h3>
                    )}
                    {section?.description && (
                        <p className={styles.description}>
                            {section.description}
                        </p>
                    )}
                    {settings.map((setting) => (
                        <div key={setting.key} className={styles.field}>
                            <Control
                                setting={setting}
                                value={values[setting.key]}
                                source={sources[setting.key]}
                                disabled={disabled}
                                error={errors[setting.key]}
                                app={app}
                                onChange={handleChange}
                            />
                        </div>
                    ))}
                </section>
            ))}
        </div>
    )
}

SettingsForm.propTypes = {
    description: PropTypes.shape({
        sections: PropTypes.array.isRequired,
        settings: PropTypes.array.isRequired,
    }).isRequired,
    sources: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    app: appPropType,
    disabled: PropTypes.bool,
}
