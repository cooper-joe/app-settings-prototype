import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import SettingsSidebar from './SettingsSidebar.jsx'

const sections = [
    { key: 'general', label: 'General' },
    { key: 'analytics', label: 'Analytics' },
]
const apps = [
    { key: 'dashboard', name: 'Dashboard', iconUrl: 'https://server/d.png' },
    { key: 'workspace-builder', name: 'Workspace Builder', iconUrl: null },
]

const renderSidebar = (props = {}) =>
    render(
        <SettingsSidebar
            sections={sections}
            apps={apps}
            currentSection="general"
            currentAppKey={null}
            searchFieldLabel="Search settings"
            onChangeSection={() => {}}
            onChangeApp={() => {}}
            onChangeSearchText={() => {}}
            {...props}
        />
    )

const button = (name) => screen.getByRole('button', { name })

describe('SettingsSidebar', () => {
    it('draws the sections and an App settings group with each app', () => {
        const { container } = renderSidebar()
        expect(button('General')).toBeTruthy()
        expect(screen.getByText('App settings')).toBeTruthy()
        expect(button('Dashboard')).toBeTruthy()
        expect(button('Workspace Builder')).toBeTruthy()
        expect(container.querySelector('img').getAttribute('src')).toBe(
            'https://server/d.png'
        )
    })

    it('hides the group when there are no apps', () => {
        renderSidebar({ apps: [] })
        expect(screen.queryByText('App settings')).toBeNull()
    })

    it('marks the current section', () => {
        renderSidebar()
        expect(button('General').getAttribute('aria-current')).toBe('page')
        expect(button('Dashboard').getAttribute('aria-current')).toBeNull()
    })

    it('marks the selected app, and no section, on the apps page', () => {
        renderSidebar({ currentSection: 'apps', currentAppKey: 'workspace-builder' })
        expect(button('Workspace Builder').getAttribute('aria-current')).toBe('page')
        expect(button('Dashboard').getAttribute('aria-current')).toBeNull()
        expect(button('General').getAttribute('aria-current')).toBeNull()
    })

    it('reports clicks on apps and sections', () => {
        const onChangeApp = jest.fn()
        const onChangeSection = jest.fn()
        renderSidebar({ onChangeApp, onChangeSection })
        fireEvent.click(button('Workspace Builder'))
        fireEvent.click(button('Analytics'))
        expect(onChangeApp).toHaveBeenCalledWith('workspace-builder')
        expect(onChangeSection).toHaveBeenCalledWith('analytics')
    })
})
