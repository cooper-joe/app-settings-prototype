import { IconApps16, IconApps24 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import styles from './AppIcon.module.css'

export const AppIcon = ({ iconUrl, size }) => {
    // Remember which URL failed, so a new URL gets a fresh try.
    const [failedUrl, setFailedUrl] = useState(null)

    if (iconUrl && failedUrl !== iconUrl) {
        return (
            <img
                className={styles.icon}
                src={iconUrl}
                alt=""
                width={size}
                height={size}
                onError={() => setFailedUrl(iconUrl)}
            />
        )
    }
    return (
        <span
            className={styles.fallback}
            style={{ width: size, height: size }}
            aria-hidden="true"
            data-test="app-icon-fallback"
        >
            {size >= 32 ? <IconApps24 /> : <IconApps16 />}
        </span>
    )
}

AppIcon.propTypes = {
    size: PropTypes.number.isRequired,
    iconUrl: PropTypes.string,
}
