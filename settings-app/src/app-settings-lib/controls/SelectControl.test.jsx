import { render, screen } from '@testing-library/react'
import React from 'react'
import { SelectControl } from './SelectControl.jsx'

const setting = {
    key: 'theme',
    type: 'select',
    label: 'Theme',
    options: [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
    ],
}

describe('SelectControl', () => {
    it('shows a stored value that is no longer an option, without throwing', () => {
        expect(() =>
            render(
                <SelectControl
                    setting={setting}
                    value="gone"
                    onChange={() => {}}
                />
            )
        ).not.toThrow()
        expect(screen.getByText('gone (not found)')).toBeTruthy()
    })
})
