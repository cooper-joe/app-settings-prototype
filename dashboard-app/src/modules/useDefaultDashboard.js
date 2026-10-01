import { useDataEngine } from '@dhis2/app-runtime'
import { useCallback, useEffect, useState } from 'react'
import { canAdminister } from '../app-settings-lib/permissions.js'
import { saveAppSetting } from '../app-settings-lib/storage.js'
import { validateValue } from '../app-settings-lib/validateValue.js'
import {
    useCurrentUser,
    useDefaultDashboardId,
} from '../components/AppDataProvider/AppDataProvider.jsx'
import { getAppSettingsDescription } from '../components/AppDataProvider/useSystemSettingsQuery.js'

const SETTING_KEY = 'defaultDashboard'

// The same app setting that System Settings › Apps › Dashboard shows, so
// both places read and save one value.
export const useDefaultDashboard = () => {
    const engine = useDataEngine()
    const { authorities } = useCurrentUser()
    const [defaultDashboardId, setDefaultDashboardId] = useDefaultDashboardId()
    const [description, setDescription] = useState(null)

    useEffect(() => {
        let cancelled = false
        getAppSettingsDescription()
            .then((loaded) => !cancelled && setDescription(loaded))
            .catch(() => {})
        return () => {
            cancelled = true
        }
    }, [])

    const setting = description?.settings.find(({ key }) => key === SETTING_KEY)
    const canChange = Boolean(
        setting && canAdminister(description, authorities)
    )

    const saveDefaultDashboard = useCallback(
        async (dashboardId) => {
            const invalid = validateValue(setting, dashboardId)
            if (invalid) {
                throw new Error(invalid.message)
            }
            await saveAppSetting(engine, description, SETTING_KEY, dashboardId)
            setDefaultDashboardId(dashboardId)
        },
        [engine, description, setting, setDefaultDashboardId]
    )

    return { defaultDashboardId, canChange, saveDefaultDashboard }
}
