import { render, screen, within } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { AppMenu } from './app-menu.jsx'

const renderMenu = (props) =>
    render(
        <MemoryRouter initialEntries={['/dashboard']}>
            <Routes>
                <Route
                    path="/dashboard"
                    element={
                        <AppMenu
                            appName="Dashboard"
                            appVersion="101.7.1"
                            {...props}
                        />
                    }
                />
                <Route path="/settings" element={<p>System Settings page</p>} />
            </Routes>
        </MemoryRouter>
    )

describe('AppMenu', () => {
    it('shows the app name as a closed menu button', () => {
        renderMenu({ settingsPath: null })
        const button = screen.getByRole('button', { name: 'Dashboard menu' })
        expect(button).toHaveTextContent('Dashboard')
        expect(button).toHaveAttribute('aria-expanded', 'false')
        expect(screen.queryByText('Version 101.7.1')).not.toBeInTheDocument()
    })

    it('always shows the version, and no settings item without a door', async () => {
        const user = userEvent.setup()
        renderMenu({ settingsPath: null })
        await user.click(screen.getByRole('button', { name: 'Dashboard menu' }))
        expect(screen.getByText('Version 101.7.1')).toBeInTheDocument()
        expect(screen.queryByText('Settings')).not.toBeInTheDocument()
    })

    it('opens System Settings from the settings item', async () => {
        const user = userEvent.setup()
        renderMenu({ settingsPath: '/settings#/apps?app=dashboard' })
        await user.click(screen.getByRole('button', { name: 'Dashboard menu' }))
        expect(
            screen.getByRole('button', { name: 'Dashboard menu' })
        ).toHaveAttribute('aria-expanded', 'true')

        const link = screen.getByText('Settings').closest('a[href]')
        expect(link).toHaveAttribute('href', '/settings#/apps?app=dashboard')

        await user.click(screen.getByText('Settings'))
        expect(screen.getByText('System Settings page')).toBeInTheDocument()
    })

    it('links "Help" to the help page, in a new tab', async () => {
        const user = userEvent.setup()
        renderMenu({ helpUrl: 'https://docs.example/dashboards.html' })
        await user.click(screen.getByRole('button', { name: 'Dashboard menu' }))
        const link = screen.getByText('Help').closest('a[href]')
        expect(link).toHaveAttribute(
            'href',
            'https://docs.example/dashboards.html'
        )
        expect(link).toHaveAttribute('target', '_blank')
    })

    it('leaves out "Help" when the app has no help page', async () => {
        const user = userEvent.setup()
        renderMenu({ helpUrl: null })
        await user.click(screen.getByRole('button', { name: 'Dashboard menu' }))
        expect(screen.getByText('About')).toBeInTheDocument()
        expect(screen.queryByText('Help')).not.toBeInTheDocument()
    })

    describe('About', () => {
        const openAbout = async (props) => {
            const user = userEvent.setup()
            renderMenu(props)
            await user.click(
                screen.getByRole('button', { name: 'Dashboard menu' })
            )
            await user.click(screen.getByText('About'))
            return {
                user,
                modal: screen.getByTestId('headerbar-about-app-modal'),
            }
        }

        it('shows what /api/apps says about the app', async () => {
            const { user, modal } = await openAbout({
                about: {
                    description: 'DHIS2 Dashboard app',
                    developer: null,
                    coreApp: true,
                    appHubId: '8a05188c',
                },
            })
            expect(within(modal).getByText('Version 101.7.1')).toBeVisible()
            expect(within(modal).getByText('DHIS2 Dashboard app')).toBeVisible()
            expect(within(modal).getByText('Core app')).toBeVisible()
            expect(
                within(modal).queryByText('Developer')
            ).not.toBeInTheDocument()
            expect(
                within(modal).getByText('View on App Hub').closest('a')
            ).toHaveAttribute('href', 'https://apps.dhis2.org/app/8a05188c')

            await user.click(within(modal).getByText('Close'))
            expect(
                screen.queryByTestId('headerbar-about-app-modal')
            ).not.toBeInTheDocument()
        })

        it('leaves out the App Hub link without an App Hub id', async () => {
            const { modal } = await openAbout({
                about: { coreApp: false, appHubId: null },
            })
            expect(within(modal).getByText('Installed app')).toBeVisible()
            expect(
                within(modal).queryByText('View on App Hub')
            ).not.toBeInTheDocument()
        })

        it('still shows the name and version for an unknown app', async () => {
            const { modal } = await openAbout({ about: null })
            expect(within(modal).getByText('Version 101.7.1')).toBeVisible()
            expect(within(modal).queryByText('Type')).not.toBeInTheDocument()
        })
    })

    it('shows a waiting update on the button and in the menu', async () => {
        const onApplyUpdate = jest.fn()
        const user = userEvent.setup()
        renderMenu({ updateAvailable: true, onApplyUpdate })

        const button = screen.getByRole('button', {
            name: 'Dashboard menu, update available',
        })
        expect(
            screen.getByTestId('headerbar-app-menu-update-dot')
        ).toBeInTheDocument()

        await user.click(button)
        await user.click(
            screen.getByRole('button', {
                name: 'App updates available — Click to reload',
            })
        )
        expect(onApplyUpdate).toHaveBeenCalledTimes(1)
        expect(button).toHaveAttribute('aria-expanded', 'false')
    })

    it('shows no update notice when none is waiting', async () => {
        const user = userEvent.setup()
        renderMenu()
        expect(
            screen.queryByTestId('headerbar-app-menu-update-dot')
        ).not.toBeInTheDocument()
        await user.click(screen.getByRole('button', { name: 'Dashboard menu' }))
        expect(
            screen.queryByText('App updates available — Click to reload')
        ).not.toBeInTheDocument()
    })

    it('says so when the version is unknown', async () => {
        const user = userEvent.setup()
        renderMenu({ appVersion: undefined, settingsPath: null })
        await user.click(screen.getByRole('button', { name: 'Dashboard menu' }))
        expect(
            screen.getByRole('heading', { name: 'Version unknown' })
        ).toBeInTheDocument()
    })
})
