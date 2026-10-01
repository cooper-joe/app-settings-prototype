import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { NumberControl } from './NumberControl.jsx'

const setting = {
    key: 'days',
    type: 'number',
    integer: true,
    min: 1,
    max: 365,
    label: 'Keep drafts for (days)',
}

describe('NumberControl', () => {
    it('saves a number on blur', () => {
        const onChange = jest.fn()
        render(
            <NumberControl setting={setting} value={30} onChange={onChange} />
        )
        const input = screen.getByLabelText('Keep drafts for (days)')
        fireEvent.change(input, { target: { value: '45' } })
        expect(onChange).not.toHaveBeenCalled()
        fireEvent.blur(input)
        expect(onChange).toHaveBeenCalledWith('days', 45)
    })

    it('turns an empty field into null', () => {
        const onChange = jest.fn()
        render(
            <NumberControl setting={setting} value={30} onChange={onChange} />
        )
        const input = screen.getByLabelText('Keep drafts for (days)')
        fireEvent.change(input, { target: { value: '' } })
        fireEvent.blur(input)
        expect(onChange).toHaveBeenCalledWith('days', null)
    })

    it('reports unreadable input as NaN instead of empty', () => {
        const onChange = jest.fn()
        render(
            <NumberControl setting={setting} value={30} onChange={onChange} />
        )
        const input = screen.getByLabelText('Keep drafts for (days)')
        fireEvent.change(input, { target: { value: '1e' } })
        Object.defineProperty(input, 'validity', {
            value: { badInput: true },
            configurable: true,
        })
        fireEvent.blur(input)
        expect(onChange).toHaveBeenCalledWith('days', expect.any(Number))
        expect(Number.isNaN(onChange.mock.calls[0][1])).toBe(true)
    })

    it('saves once when Enter then blur happen together', () => {
        const onChange = jest.fn()
        render(
            <NumberControl setting={setting} value={30} onChange={onChange} />
        )
        const input = screen.getByLabelText('Keep drafts for (days)')
        fireEvent.change(input, { target: { value: '45' } })
        fireEvent.keyDown(input, { key: 'Enter' })
        fireEvent.blur(input)
        expect(onChange).toHaveBeenCalledTimes(1)
    })
})
