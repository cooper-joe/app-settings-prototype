import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { Tile } from '../tiles/Tile.jsx'
import styles from './layout.module.css'

export const LayoutGrid = ({ layout }) => {
    if (layout.tiles.length === 0) {
        return (
            <p className={styles.empty}>
                {i18n.t('There are no tiles on the home screen.')}
            </p>
        )
    }
    return (
        <div className={styles.grid}>
            {layout.tiles.map((tile) => (
                <div
                    key={tile.id}
                    className={tile.size === 'wide' ? styles.wide : undefined}
                >
                    <Tile id={tile.id} />
                </div>
            ))}
        </div>
    )
}

LayoutGrid.propTypes = {
    layout: PropTypes.shape({ tiles: PropTypes.array.isRequired }).isRequired,
}
