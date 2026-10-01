import { useConfig } from '@dhis2/app-runtime'
import { useHeaderBarContext } from '../header-bar-context.jsx'

export const useDebugInfo = () => {
    const { appVersion: globalShellVersion, systemInfo } = useConfig()
    const { clientAppName, clientAppVersion } = useHeaderBarContext()

    return {
        app_name: clientAppName || null,
        // Unlike global shell version, which comes from config, app version
        // comes from the API and is expected to be a string
        app_version: clientAppVersion || null,
        global_shell_version: globalShellVersion?.full || null,
        dhis2_version: systemInfo?.version || null,
        dhis2_revision: systemInfo?.revision || null,
    }
}

export const useFormattedDebugInfo = () =>
    JSON.stringify(useDebugInfo(), undefined, 2)
