import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './tiles.module.css'

const List = ({ items }) => (
    <ul className={styles.list}>
        {items.map((item) => (
            <li key={item}>{item}</li>
        ))}
    </ul>
)

List.propTypes = { items: PropTypes.arrayOf(PropTypes.string).isRequired }

const Visits = () => (
    <List
        items={[
            'Ngelehun CHC · 09:00',
            'Bumpeh CHP · 11:30',
            'Njandama MCHP · 14:00',
        ]}
    />
)

const Stock = () => (
    <List
        items={[
            i18n.t('ORS sachets: 3 days left'),
            i18n.t('Malaria RDTs: 5 days left'),
        ]}
    />
)

const Reports = () => (
    <List
        items={[
            i18n.t('Monthly HMIS: due in 4 days'),
            i18n.t('EPI weekly: due tomorrow'),
        ]}
    />
)

const Messages = () => <p className={styles.big}>{i18n.t('2 unread')}</p>

const Weather = () => (
    <p className={styles.big}>{i18n.t('28°C, light rain later')}</p>
)

const TeamMap = () => (
    <svg
        className={styles.map}
        viewBox="0 0 120 60"
        role="img"
        aria-label={i18n.t('Map of team locations')}
    >
        <rect width="120" height="60" rx="4" className={styles.mapBackground} />
        <circle cx="30" cy="20" r="4" className={styles.dot} />
        <circle cx="70" cy="38" r="4" className={styles.dot} />
        <circle cx="96" cy="16" r="4" className={styles.dot} />
    </svg>
)

// Titles are functions so they're translated when drawn, not at import time.
export const TILES = {
    visits: { title: () => i18n.t("Today's visits"), Component: Visits },
    stock: { title: () => i18n.t('Stock alerts'), Component: Stock },
    reports: { title: () => i18n.t('Reports due'), Component: Reports },
    messages: { title: () => i18n.t('Messages'), Component: Messages },
    weather: { title: () => i18n.t('Weather'), Component: Weather },
    map: { title: () => i18n.t('Team map'), Component: TeamMap },
}
