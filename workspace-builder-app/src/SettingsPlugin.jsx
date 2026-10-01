import { CssVariables } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { LayoutEditor } from './layout/LayoutEditor.jsx'
import { useDraftLayout } from './layout/useDraftLayout.js'

// Drawn by System Settings through <Plugin>. It gets the stored value and
// hands changes back. System Settings does the saving, with the user's own
// rights.
const SettingsPlugin = ({ value, disabled, onChange }) => {
    const [layout, setLayout] = useDraftLayout(value)
    const handleChange = (next) => {
        setLayout(next)
        onChange?.(next)
    }
    return (
        <div style={{ padding: 4 }}>
            {/* The plugin is its own document inside System Settings' iframe,
                so it needs @dhis2/ui's CSS variables too. */}
            <CssVariables colors spacers theme />
            <LayoutEditor
                layout={layout}
                disabled={Boolean(disabled)}
                onChange={handleChange}
            />
        </div>
    )
}

SettingsPlugin.propTypes = {
    disabled: PropTypes.bool,
    value: PropTypes.any,
    onChange: PropTypes.func,
}

export default SettingsPlugin
