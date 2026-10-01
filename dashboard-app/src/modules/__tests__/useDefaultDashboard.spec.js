import { useDataEngine } from '@dhis2/app-runtime'
import { renderHook, act } from '@testing-library/react-hooks'
import description from '../../../public/settings.json'
import { parseDescription } from '../../app-settings-lib/parseDescription.js'
import {
    useCurrentUser,
    useDefaultDashboardId,
} from '../../components/AppDataProvider/AppDataProvider.jsx'
import { useDefaultDashboard } from '../useDefaultDashboard.js'

jest.mock('@dhis2/app-runtime', () => ({
    useDataEngine: jest.fn(),
}))

jest.mock('../../components/AppDataProvider/AppDataProvider.jsx', () => ({
    useCurrentUser: jest.fn(),
    useDefaultDashboardId: jest.fn(),
}))

jest.mock('../../components/AppDataProvider/useSystemSettingsQuery.js', () => ({
    getAppSettingsDescription: () =>
        Promise.resolve(
            jest
                .requireActual('../../app-settings-lib/parseDescription.js')
                .parseDescription(
                    jest.requireActual('../../../public/settings.json')
                )
        ),
}))

const setDefaultDashboardId = jest.fn()
const mutate = jest.fn(() => Promise.resolve({}))

beforeEach(() => {
    jest.clearAllMocks()
    useDataEngine.mockReturnValue({ mutate })
    useDefaultDashboardId.mockReturnValue([null, setDefaultDashboardId])
})

describe('useDefaultDashboard', () => {
    it('lets holders of the admin authority change the default', async () => {
        useCurrentUser.mockReturnValue({
            authorities: [parseDescription(description).adminAuthority],
        })
        const { result, waitFor } = renderHook(() => useDefaultDashboard())
        await waitFor(() => result.current.canChange)

        await act(() => result.current.saveDefaultDashboard('abc123'))

        expect(mutate).toHaveBeenCalledWith(
            expect.objectContaining({
                resource: 'dataStore/dashboard-settings',
                id: 'defaultDashboard',
                data: { value: 'abc123' },
            })
        )
        expect(setDefaultDashboardId).toHaveBeenCalledWith('abc123')
    })

    it('does not offer the change to other users', async () => {
        useCurrentUser.mockReturnValue({ authorities: ['M_dashboard'] })
        const { result, waitForNextUpdate } = renderHook(() =>
            useDefaultDashboard()
        )
        await waitForNextUpdate()
        expect(result.current.canChange).toBe(false)
    })
})
