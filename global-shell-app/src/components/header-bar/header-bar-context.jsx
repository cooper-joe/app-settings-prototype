import PropTypes from 'prop-types'
import React, { createContext, useContext, useMemo } from 'react'

const headerBarContext = createContext({
    updateAvailable: false,
    onApplyAvailableUpdate: () => {},
})

export const HeaderBarContextProvider = ({
    updateAvailable,
    onApplyAvailableUpdate,
    clientAppName,
    clientAppVersion,
    children,
}) => {
    const contextValue = useMemo(
        () => ({
            updateAvailable,
            onApplyAvailableUpdate,
            clientAppName,
            clientAppVersion,
        }),
        [
            updateAvailable,
            onApplyAvailableUpdate,
            clientAppName,
            clientAppVersion,
        ]
    )
    return (
        <headerBarContext.Provider value={contextValue}>
            {children}
        </headerBarContext.Provider>
    )
}
HeaderBarContextProvider.propTypes = {
    children: PropTypes.node,
    clientAppName: PropTypes.string,
    clientAppVersion: PropTypes.string,
    updateAvailable: PropTypes.bool,
    onApplyAvailableUpdate: PropTypes.func,
}

export const useHeaderBarContext = () => useContext(headerBarContext)
