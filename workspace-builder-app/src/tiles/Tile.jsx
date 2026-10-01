import PropTypes from 'prop-types'
import React from 'react'
import { TILES } from './tiles.jsx'
import styles from './tiles.module.css'

export const Tile = ({ id, children }) => {
    const { title, Component } = TILES[id]
    return (
        <article className={styles.tile}>
            <h3 className={styles.title}>{title()}</h3>
            <Component />
            {children}
        </article>
    )
}

Tile.propTypes = {
    id: PropTypes.string.isRequired,
    children: PropTypes.node,
}
