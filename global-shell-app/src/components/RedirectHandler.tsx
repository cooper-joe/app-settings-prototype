import { Center, CircularLoader } from '@dhis2/ui'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'

type AppsInfoData = {
    appMenu: Array<{
        defaultAction: string
        displayName: string
        icon: string
        name: string
        namespace: string
    }>
    apps: Array<{
        name: string
        displayName: string
        launchUrl: string
        version: string
        // ... and more
    }>
    bundledApps: Array<{
        buildDate: string
        name: string
        source: string
        sourceRef: string
        sourceRepo: string
        version: string
        webName: string
    }>
    systemSettings: {
        startModule: string
        /* ...and more */
    }
}

type AppsInfoQuery = {
    data: AppsInfoData
    loading: boolean
    error: boolean
}

interface RedirectHandlerProps {
    appsInfoQuery: AppsInfoQuery
}

export const RedirectHandler = ({ appsInfoQuery }: RedirectHandlerProps) => {
    const navigate = useNavigate()

    useEffect(() => {
        if (!appsInfoQuery.data) {
            return
        }
        const startModuleAppName = appsInfoQuery.data.systemSettings.startModule
            .replace(/^dhis-web-/, '')
            // Handle legacy startModule values for custom apps
            .replace(/^app:/, '')
        navigate(`/${startModuleAppName}`, { replace: true })
    }, [appsInfoQuery.data, navigate])

    return (
        <Center>
            <CircularLoader />
        </Center>
    )
}
