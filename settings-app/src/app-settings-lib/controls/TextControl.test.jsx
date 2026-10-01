import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { TextControl } from './TextControl.jsx'

const setting = { key: 'banner', type: 'text', label: 'Banner text' }

describe('TextControl', () => {
    it('saves on blur, not while typing', () => {
        const onChange = jest.fn()
        render(<TextControl setting={setting} value="Hi" onChange={onChange} />)
        const input = screen.getByLabelText('Banner text')
        fireEvent.change(input, { target: { value: 'Hello' } })
        expect(onChange).not.toHaveBeenCalled()
        fireEvent.blur(input)
        expect(onChange).toHaveBeenCalledWith('banner', 'Hello')
    })

    it('saves on Enter', () => {
        const onChange = jest.fn()
        render(<TextControl setting={setting} value="Hi" onChange={onChange} />)
        const input = screen.getByLabelText('Banner text')
        fireEvent.change(input, { target: { value: 'Hey' } })
        fireEvent.keyDown(input, { key: 'Enter' })
        expect(onChange).toHaveBeenCalledWith('banner', 'Hey')
    })

    it('turns an empty field into null, meaning "use the default"', () => {
        const onChange = jest.fn()
        render(<TextControl setting={setting} value="Hi" onChange={onChange} />)
        const input = screen.getByLabelText('Banner text')
        fireEvent.change(input, { target: { value: '' } })
        fireEvent.blur(input)
        expect(onChange).toHaveBeenCalledWith('banner', null)
    })

    it('turns a whitespace-only field into null', () => {
        const onChange = jest.fn()
        render(<TextControl setting={setting} value="Hi" onChange={onChange} />)
        const input = screen.getByLabelText('Banner text')
        fireEvent.change(input, { target: { value: '   ' } })
        fireEvent.blur(input)
        expect(onChange).toHaveBeenCalledWith('banner', null)
    })

    it('saves once when Enter then blur happen together', () => {
        const onChange = jest.fn()
        render(<TextControl setting={setting} value="Hi" onChange={onChange} />)
        const input = screen.getByLabelText('Banner text')
        fireEvent.change(input, { target: { value: 'Hey' } })
        fireEvent.keyDown(input, { key: 'Enter' })
        fireEvent.blur(input)
        expect(onChange).toHaveBeenCalledTimes(1)
    })

    it('does not save an unchanged value', () => {
        const onChange = jest.fn()
        render(<TextControl setting={setting} value="Hi" onChange={onChange} />)
        fireEvent.blur(screen.getByLabelText('Banner text'))
        expect(onChange).not.toHaveBeenCalled()
    })

    it('draws a text area when multiline', () => {
        render(
            <TextControl
                setting={{ ...setting, multiline: true }}
                value="Hi"
                onChange={() => {}}
            />
        )
        expect(screen.getByLabelText('Banner text').tagName).toBe('TEXTAREA')
    })

    it('shows the error it is given', () => {
        render(
            <TextControl
                setting={setting}
                value="Hi"
                error="Use 3 characters or fewer"
                onChange={() => {}}
            />
        )
        expect(screen.getByText('Use 3 characters or fewer')).toBeTruthy()
    })
})
