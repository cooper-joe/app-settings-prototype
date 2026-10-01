import { render, screen } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import { useDefaultDashboardId } from '../../../components/AppDataProvider/AppDataProvider.jsx'
import { getPreferredDashboardId } from '../../../modules/localStorage.js'
import CacheableViewDashboard from '../CacheableViewDashboard.jsx'

jest.mock('@dhis2/app-runtime', () => ({
    // eslint-disable-next-line react/prop-types
    CacheableSection: ({ children }) => <>{children}</>,
}))

jest.mock('../../../components/AppDataProvider/AppDataProvider.jsx', () => ({
    useCurrentUser: jest.fn(() => ({ id: 'user1', username: 'admin' })),
    useDefaultDashboardId: jest.fn(),
}))

jest.mock('../../../modules/localStorage.js', () => ({
    getPreferredDashboardId: jest.fn(),
}))

jest.mock(
    '../../../components/DashboardsBar/index.js',
    () =>
        function MockDashboardsBar() {
            return null
        }
)

jest.mock(
    '../ViewDashboard.jsx',
    () =>
        // eslint-disable-next-line react/prop-types
        function MockViewDashboard({ requestedId }) {
            return <div data-test="requested">{requestedId}</div>
        }
)

const store = configureMockStore()({
    dashboards: {
        starredOne: { id: 'starredOne', displayName: 'A', starred: true },
        lastOpened: { id: 'lastOpened', displayName: 'B', starred: false },
        instanceDefault: {
            id: 'instanceDefault',
            displayName: 'C',
            starred: false,
        },
    },
    selected: {},
})

const renderAtRoot = () =>
    render(
        <Provider store={store}>
            <CacheableViewDashboard username="admin" match={{ params: {} }} />
        </Provider>
    )

const requestedId = () =>
    screen.getByText((_, element) => element.dataset.test === 'requested')
        .textContent

beforeEach(() => {
    useDefaultDashboardId.mockReturnValue([null, jest.fn()])
    getPreferredDashboardId.mockReturnValue(undefined)
})

describe('CacheableViewDashboard picks the dashboard to open', () => {
    it('opens the dashboard last opened on this device first', () => {
        getPreferredDashboardId.mockReturnValue('lastOpened')
        useDefaultDashboardId.mockReturnValue(['instanceDefault', jest.fn()])
        renderAtRoot()
        expect(requestedId()).toBe('lastOpened')
    })

    it('opens the default dashboard when none was opened before', () => {
        useDefaultDashboardId.mockReturnValue(['instanceDefault', jest.fn()])
        renderAtRoot()
        expect(requestedId()).toBe('instanceDefault')
    })

    it('ignores a default dashboard the user cannot see', () => {
        useDefaultDashboardId.mockReturnValue(['deletedOrHidden', jest.fn()])
        renderAtRoot()
        expect(requestedId()).toBe('starredOne')
    })

    it('falls back to the first starred dashboard', () => {
        renderAtRoot()
        expect(requestedId()).toBe('starredOne')
    })
})
