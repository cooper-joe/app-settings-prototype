import { render, screen } from '@testing-library/react'
import React from 'react'
import { appPageUrl, CustomControl } from './CustomControl.jsx'

let mockPluginProps

jest.mock('@dhis2/app-runtime/experimental', () => ({
    Plugin: (props) => {
        mockPluginProps = props
        return null
    },
}))

const app = {
    key: 'workspace-builder',
    name: 'Workspace Builder',
    baseUrl: 'https://server/api/apps/workspace-builder/',
}

const setting = {
    key: 'homeLayout',
    type: 'custom',
    plugin: 'plugin.html',
    appPath: '#/edit-layout',
    label: 'Home screen layout',
}

describe('appPageUrl', () => {
    it("builds the shell URL of the app's own page", () => {
        expect(
            appPageUrl({
                serverBaseUrl: 'https://server/jc/',
                appKey: 'workspace-builder',
                appPath: '#/edit-layout',
            })
        ).toBe('https://server/jc/apps/workspace-builder#/edit-layout')
    })
})

describe('CustomControl', () => {
    beforeEach(() => {
        mockPluginProps = undefined
    })

    it("loads the app's plugin with the value and forwards changes", () => {
        const onChange = jest.fn()
        const value = { tiles: [] }
        render(
            <CustomControl
                setting={setting}
                app={app}
                value={value}
                onChange={onChange}
            />
        )
        expect(mockPluginProps.pluginSource).toBe(
            'https://server/api/apps/workspace-builder/plugin.html'
        )
        expect(mockPluginProps.value).toBe(value)
        expect(mockPluginProps.disabled).toBe(false)
        mockPluginProps.onChange({ tiles: [{ id: 'map', size: 'wide' }] })
        expect(onChange).toHaveBeenCalledWith('homeLayout', {
            tiles: [{ id: 'map', size: 'wide' }],
        })
    })

    it("links to the app's own page when there is an appPath", () => {
        render(
            <CustomControl setting={setting} app={app} onChange={() => {}} />
        )
        const link = screen.getByRole('link', { name: 'Open in Workspace Builder' })
        expect(link.getAttribute('href')).toMatch(
            /\/apps\/workspace-builder#\/edit-layout$/
        )
        expect(link.getAttribute('target')).toBe('_top')
    })

    it('shows only the link when there is no plugin', () => {
        const { plugin, ...linkOnly } = setting // eslint-disable-line no-unused-vars
        render(
            <CustomControl setting={linkOnly} app={app} onChange={() => {}} />
        )
        expect(mockPluginProps).toBeUndefined()
        expect(screen.getByRole('link')).toBeTruthy()
    })

    it('shows no link without an appPath', () => {
        const { appPath, ...pluginOnly } = setting // eslint-disable-line no-unused-vars
        render(
            <CustomControl setting={pluginOnly} app={app} onChange={() => {}} />
        )
        expect(screen.queryByRole('link')).toBeNull()
    })
})
