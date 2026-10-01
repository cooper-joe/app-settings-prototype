import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { LayoutEditor } from './LayoutEditor.jsx'

const layout = {
    tiles: [
        { id: 'visits', size: 'wide' },
        { id: 'stock', size: 'normal' },
    ],
}

describe('LayoutEditor', () => {
    it('switches a tile size', () => {
        const onChange = jest.fn()
        render(<LayoutEditor layout={layout} onChange={onChange} />)
        fireEvent.click(
            screen.getByRole('button', { name: 'Make Stock alerts wide' })
        )
        expect(onChange).toHaveBeenCalledWith({
            tiles: [
                { id: 'visits', size: 'wide' },
                { id: 'stock', size: 'wide' },
            ],
        })
    })

    it('hides a tile', () => {
        const onChange = jest.fn()
        render(<LayoutEditor layout={layout} onChange={onChange} />)
        fireEvent.click(screen.getByRole('button', { name: 'Hide Stock alerts' }))
        expect(onChange).toHaveBeenCalledWith({
            tiles: [{ id: 'visits', size: 'wide' }],
        })
    })

    it('shows a hidden tile at the end', () => {
        const onChange = jest.fn()
        render(<LayoutEditor layout={layout} onChange={onChange} />)
        fireEvent.click(screen.getByRole('button', { name: 'Show Weather' }))
        expect(onChange).toHaveBeenCalledWith({
            tiles: [...layout.tiles, { id: 'weather', size: 'normal' }],
        })
    })

    it('gives every tile a keyboard-reachable drag handle', () => {
        render(<LayoutEditor layout={layout} onChange={() => {}} />)
        expect(
            screen.getByRole('button', { name: 'Move Stock alerts' })
        ).toBeTruthy()
    })

    it('is read-only when disabled', () => {
        render(<LayoutEditor layout={layout} onChange={() => {}} disabled />)
        expect(screen.getByText('Stock alerts')).toBeTruthy()
        expect(screen.queryByRole('button')).toBeNull()
    })
})
