import { fireEvent, render } from '@testing-library/react'
import React from 'react'
import { AppIcon } from './AppIcon.jsx'

const fallback = (container) =>
    container.querySelector('[data-test="app-icon-fallback"]')

describe('AppIcon', () => {
    it('draws the icon image at the given size', () => {
        const { container } = render(
            <AppIcon iconUrl="https://server/icon.png" size={20} />
        )
        const img = container.querySelector('img')
        expect(img.getAttribute('src')).toBe('https://server/icon.png')
        expect(img.getAttribute('width')).toBe('20')
        expect(img.getAttribute('alt')).toBe('')
        expect(fallback(container)).toBeNull()
    })

    it('draws the generic icon when there is no URL', () => {
        const { container } = render(<AppIcon iconUrl={null} size={20} />)
        expect(container.querySelector('img')).toBeNull()
        expect(fallback(container)).not.toBeNull()
    })

    it('switches to the generic icon when the image fails to load', () => {
        const { container } = render(
            <AppIcon iconUrl="https://server/missing.png" size={32} />
        )
        fireEvent.error(container.querySelector('img'))
        expect(container.querySelector('img')).toBeNull()
        expect(fallback(container)).not.toBeNull()
    })
})
