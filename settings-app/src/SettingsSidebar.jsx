import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { AppIcon } from './app-settings/AppIcon.jsx'
import styles from './SettingsSidebar.module.css'

const Item = ({ active, onClick, children }) => (
    <li>
        <button
            type="button"
            className={
                active ? `${styles.item} ${styles.itemActive}` : styles.item
            }
            aria-current={active ? 'page' : undefined}
            onClick={onClick}
        >
            {children}
        </button>
    </li>
)

Item.propTypes = {
    active: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    children: PropTypes.node,
}

class SettingsSidebar extends React.Component {
    // d2-ui Sidebar cleared its input here without firing a search.
    // Calling onChangeSearchText('') would debounce into searchSettings('')
    // and bounce every section change back to General.
    clearSearchBox = () => {}

    handleSearchChange = (event) => {
        this.props.onChangeSearchText(event.target.value)
    }

    render() {
        const {
            apps,
            currentAppKey,
            currentSection,
            sections,
            searchFieldLabel,
            searchText,
        } = this.props
        const onAppsPage = currentSection === 'apps'

        return (
            <nav className={styles.sidebar} aria-label="Settings">
                <div className={styles.searchWrap}>
                    <input
                        className={styles.search}
                        type="search"
                        placeholder={searchFieldLabel}
                        value={searchText || ''}
                        onChange={this.handleSearchChange}
                    />
                </div>
                <ul className={styles.list}>
                    {sections.map((section) => (
                        <Item
                            key={section.key}
                            active={section.key === currentSection}
                            onClick={() =>
                                this.props.onChangeSection(section.key)
                            }
                        >
                            {section.label}
                        </Item>
                    ))}
                </ul>
                {apps.length > 0 && (
                    <>
                        <h2
                            className={styles.groupHeading}
                            id="app-settings-heading"
                        >
                            {i18n.t('App settings')}
                        </h2>
                        <ul
                            className={styles.list}
                            aria-labelledby="app-settings-heading"
                        >
                            {apps.map((app) => (
                                <Item
                                    key={app.key}
                                    active={
                                        onAppsPage && app.key === currentAppKey
                                    }
                                    onClick={() =>
                                        this.props.onChangeApp(app.key)
                                    }
                                >
                                    <AppIcon iconUrl={app.iconUrl} size={20} />
                                    <span className={styles.itemLabel}>
                                        {app.name}
                                    </span>
                                </Item>
                            ))}
                        </ul>
                    </>
                )}
            </nav>
        )
    }
}

SettingsSidebar.defaultProps = {
    apps: [],
}

SettingsSidebar.propTypes = {
    sections: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        })
    ).isRequired,
    onChangeApp: PropTypes.func.isRequired,
    onChangeSearchText: PropTypes.func.isRequired,
    onChangeSection: PropTypes.func.isRequired,
    apps: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            iconUrl: PropTypes.string,
        })
    ),
    currentAppKey: PropTypes.string,
    currentSection: PropTypes.string,
    searchFieldLabel: PropTypes.string,
    searchText: PropTypes.string,
}

export default SettingsSidebar
