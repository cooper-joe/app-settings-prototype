import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './App.module.css'
import { LayoutGrid } from './layout/LayoutGrid.jsx'

export const HomeScreen = ({ layout, isAdmin }) => (
    <main className={styles.page}>
        <header className={styles.header}>
            <h1 className={styles.title}>{i18n.t('Workspace Builder')}</h1>
            {isAdmin && (
                <Button
                    small
                    onClick={() => {
                        window.location.hash = '#/edit-layout'
                    }}
                >
                    {i18n.t('Edit layout')}
                </Button>
            )}
        </header>
        <LayoutGrid layout={layout} />
    </main>
)

HomeScreen.propTypes = {
    isAdmin: PropTypes.bool.isRequired,
    layout: PropTypes.object.isRequired,
}
