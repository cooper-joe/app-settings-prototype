import { render, screen } from '@testing-library/react'
import React from 'react'
import { MultiSelectControl } from './MultiSelectControl.jsx'

const setting = {
    key: 'days',
    type: 'multiSelect',
    label: 'Days',
    options: [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
    ],
}

describe('MultiSelectControl', () => {
    it('renders the labels of the selected options', () => {
        render(
            <MultiSelectControl
                setting={setting}
                value={['a']}
                onChange={() => {}}
            />
        )
        expect(screen.getByText('A')).toBeTruthy()
    })
})
