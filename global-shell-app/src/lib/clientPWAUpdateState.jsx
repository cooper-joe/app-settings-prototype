import { PWAUpdateOfflineInterface } from '@dhis2/pwa'
import PropTypes from 'prop-types'
import React, {
    useState,
    useCallback,
    createContext,
    useContext,
    useMemo,
} from 'react'

const ClientPWAUpdateStateContext = createContext()
const ClientOfflineInterfaceContext = createContext()

export const ClientPWAProvider = ({ children }) => {
    const [offlineInterface, setOfflineInterface] = useState()
    const [updateAvailable, setUpdateAvailable] = useState(false)
    const [clientsCount, setClientsCount] = useState(null)

    const onConfirmUpdate = useCallback(() => {
        offlineInterface.useNewSW()
    }, [offlineInterface])
    const onCancelUpdate = useCallback(() => {
        setClientsCount(null)
    }, [])

    const confirmReload = useCallback(() => {
        offlineInterface
            .getClientsInfo()
            .then(({ clientsCount }) => {
                if (clientsCount === 1) {
                    // Just one client; go ahead and reload
                    onConfirmUpdate()
                } else {
                    // Multiple clients; warn about data loss before reloading
                    setClientsCount(clientsCount)
                }
            })
            .catch((reason) => {
                // Didn't get clients info
                console.warn(reason)

                // Go ahead with confirmation modal with `0` as clientsCount
                setClientsCount(0)
            })
    }, [offlineInterface, onConfirmUpdate])

    const confirmationRequired = clientsCount !== null
    const clientPWAUpdateState = useMemo(
        () => ({
            updateAvailable,
            confirmReload,
            confirmationRequired,
            clientsCount,
            onConfirmUpdate,
            onCancelUpdate,
        }),
        [
            updateAvailable,
            confirmReload,
            confirmationRequired,
            clientsCount,
            onConfirmUpdate,
            onCancelUpdate,
        ]
    )

    const initClientOfflineInterface = useCallback(({ clientWindow }) => {
        const newOfflineInterface = new PWAUpdateOfflineInterface({
            targetWindow: clientWindow,
        })
        setUpdateAvailable(false)
        // Reset this, if it's keeping a dialog open from a previous reload
        setClientsCount(null)
        setOfflineInterface(newOfflineInterface)
        newOfflineInterface.checkForNewSW({
            onNewSW: () => {
                setUpdateAvailable(true)
            },
        })
    }, [])

    return (
        <ClientPWAUpdateStateContext.Provider value={clientPWAUpdateState}>
            <ClientOfflineInterfaceContext.Provider
                value={initClientOfflineInterface}
            >
                {children}
            </ClientOfflineInterfaceContext.Provider>
        </ClientPWAUpdateStateContext.Provider>
    )
}
ClientPWAProvider.propTypes = { children: PropTypes.node }

export const useClientPWAUpdateState = () =>
    useContext(ClientPWAUpdateStateContext)

/** Returns initClientOfflineInterface() */
export const useClientOfflineInterface = () =>
    useContext(ClientOfflineInterfaceContext)
