import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import SettingsPlugin from './SettingsPlugin.jsx'

describe('SettingsPlugin', () => {
    it('edits the value System Settings sends, and reports changes', () => {
        const onChange = jest.fn()
        render(
            <SettingsPlugin
                value={{ tiles: [{ id: 'map', size: 'normal' }] }}
                onChange={onChange}
            />
        )
        fireEvent.click(
            screen.getByRole('button', { name: 'Make Team map wide' })
        )
        expect(onChange).toHaveBeenCalledWith({
            tiles: [{ id: 'map', size: 'wide' }],
        })
        // The change shows straight away, before the value comes back.
        expect(
            screen.getByRole('button', { name: 'Make Team map normal' })
        ).toBeTruthy()
    })

    it('copes with a broken value', () => {
        render(<SettingsPlugin value="nonsense" onChange={() => {}} />)
        expect(screen.getByText("Today's visits")).toBeTruthy()
    })

    it('is read-only for users who cannot change it', () => {
        render(<SettingsPlugin value={undefined} disabled />)
        expect(screen.queryByRole('button')).toBeNull()
    })
})
