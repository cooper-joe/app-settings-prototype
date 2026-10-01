import React from 'react'
import { BooleanControl } from './BooleanControl.jsx'
import { controlPropTypes } from './controlPropTypes.js'
import { CustomControl } from './CustomControl.jsx'
import { MetadataControl } from './MetadataControl.jsx'
import { MultiSelectControl } from './MultiSelectControl.jsx'
import { NumberControl } from './NumberControl.jsx'
import { OrgUnitControl } from './OrgUnitControl.jsx'
import { PeriodTypeControl } from './PeriodTypeControl.jsx'
import { SelectControl } from './SelectControl.jsx'
import { TextControl } from './TextControl.jsx'
import { UnsupportedControl } from './UnsupportedControl.jsx'

const CONTROLS = {
    boolean: BooleanControl,
    select: SelectControl,
    multiSelect: MultiSelectControl,
    text: TextControl,
    number: NumberControl,
    metadata: MetadataControl,
    periodType: PeriodTypeControl,
    orgUnit: OrgUnitControl,
    custom: CustomControl,
}

export const Control = (props) => {
    const { setting } = props
    const Component =
        (!setting.unsupported &&
            (Object.hasOwn(CONTROLS, setting.type)
                ? CONTROLS[setting.type]
                : undefined)) ||
        UnsupportedControl
    return <Component {...props} />
}

Control.propTypes = controlPropTypes
