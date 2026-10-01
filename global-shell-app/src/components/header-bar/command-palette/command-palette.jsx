import { colors, spacers } from '@dhis2/ui-constants'
import { IconApps24 } from '@dhis2/ui-icons'
import Fuse from 'fuse.js'
import PropTypes from 'prop-types'
import React, { useCallback, useRef, useEffect, useMemo } from 'react'
import i18n from '../../../locales/index.js'
import { useCustomColorContext } from '../custom-color-context.jsx'
import { useCommandPaletteContext } from './context/command-palette-context.jsx'
import { useAvailableActions } from './hooks/use-actions.jsx'
import useGridNavigation from './hooks/use-grid-navigation.js'
import useModal from './hooks/use-modal.js'
import ModalContainer from './sections/modal-container.jsx'
import NavigationKeysLegend from './sections/navigation-keys-legend.jsx'
import SearchFilter from './sections/search-filter.jsx'
import { ACTION, APP, HOME_VIEW, SHORTCUT } from './utils/constants.js'
import {
    filterItemsPerView,
    fuseOptions,
    wrapAsFuseResult,
} from './utils/filter.js'
import HomeView from './views/home-view.jsx'
import ListView from './views/list-view.jsx'

const CommandPalette = ({ apps, commands, shortcuts }) => {
    const containerEl = useRef(null)
    const { currentView, setCurrentView, filter, setFilter } =
        useCommandPaletteContext()
    const actions = useAvailableActions({ apps, shortcuts, commands })

    const appsFuse = useMemo(() => new Fuse(apps, fuseOptions), [apps])
    const commandsFuse = useMemo(
        () => new Fuse(commands, fuseOptions),
        [commands]
    )
    const shortcutsFuse = useMemo(
        () => new Fuse(shortcuts, fuseOptions),
        [shortcuts]
    )
    const allItemsFuse = useMemo(
        () =>
            new Fuse(
                [...apps, ...shortcuts, ...commands, ...actions],
                fuseOptions
            ),
        [apps, shortcuts, commands, actions]
    )
    const customColor = useCustomColorContext()
    const hoverStyle = customColor?.bgColor
        ? 'opacity: 0.6;'
        : `background: #104f7e;`
    const activeStyle = customColor?.bgColor
        ? 'opacity: 0.8;'
        : `background: #104067;`

    const filteredItems = useMemo(
        () =>
            filterItemsPerView({
                appsFuse,
                commandsFuse,
                shortcutsFuse,
                allItemsFuse,
                apps,
                shortcuts,
                commands,
                actions,
                filter,
                currentView,
            }),
        [
            appsFuse,
            commandsFuse,
            shortcutsFuse,
            allItemsFuse,
            apps,
            shortcuts,
            commands,
            actions,
            filter,
            currentView,
        ]
    )

    const gridItems = useMemo(
        () => (currentView === HOME_VIEW && !filter ? apps : []),
        [currentView, filter, apps]
    )
    const listItems = useMemo(() => {
        const nonSearchableActions = actions.filter(
            (action) => action.type === ACTION
        )

        if (filter) {
            if (filteredItems.length === 0) {
                return []
            }
            return [...wrapAsFuseResult(nonSearchableActions), ...filteredItems]
        }

        if (currentView === HOME_VIEW) {
            return [...actions]
        } else {
            return [...wrapAsFuseResult(nonSearchableActions), ...filteredItems]
        }
    }, [actions, currentView, filter, filteredItems])

    const {
        currentItem,
        grid,
        gridColumnCount,
        gridRowCount,
        handleKeyDown: handleGridNavigation,
    } = useGridNavigation(gridItems, listItems)

    const { modalOpen, modalRef, setModalOpen } = useModal(currentItem)

    const resetModal = useCallback(() => {
        setModalOpen(false)
        setCurrentView(HOME_VIEW)
        setFilter('')
    }, [setModalOpen, setCurrentView, setFilter])

    const handleKeyDown = useCallback(
        (event) => {
            if (currentView !== HOME_VIEW) {
                if (!filter.length && event.key === 'Backspace') {
                    event.preventDefault()
                    setCurrentView(HOME_VIEW)
                }
            }

            handleGridNavigation(event)

            const action =
                currentItem?.item?.['action'] ?? currentItem?.['action']
            const type = currentItem?.item?.['type'] ?? currentItem?.['type']

            switch (event.key) {
                case 'Escape':
                    event.preventDefault()
                    setModalOpen(false)
                    break
                case 'Enter':
                    event.preventDefault()
                    action()
                    if (type === APP || type === SHORTCUT) {
                        resetModal()
                    }
                    break
                case 'Tab':
                    event.preventDefault()
                    break
                default:
                    break
            }
        },
        [
            currentItem,
            currentView,
            filter,
            handleGridNavigation,
            setCurrentView,
            setModalOpen,
            resetModal,
        ]
    )

    const handleVisibilityToggle = useCallback(() => {
        setModalOpen((open) => !open)
        setCurrentView(HOME_VIEW)
    }, [setCurrentView, setModalOpen])

    const handleModalClick = useCallback(
        (event) => {
            if (event.target === modalRef?.current) {
                setModalOpen(false)
            } else {
                modalRef?.current?.querySelector('input').focus()
            }
        },
        [modalRef, setModalOpen]
    )

    useEffect(() => {
        const handleKeyDown = (event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
                event.preventDefault()
                handleVisibilityToggle()
            }
        }
        // Janky...
        // todo: refactor command palette to share 'toggle visibility' function
        window.toggleCommandPaletteListener = handleKeyDown

        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [handleVisibilityToggle])

    return (
        <div
            ref={containerEl}
            data-test="headerbar-apps-menu"
            className="headerbar-apps-menu"
        >
            <button
                onClick={handleVisibilityToggle}
                data-test="headerbar-apps-icon"
                title={i18n.t('Command palette')}
                aria-label={i18n.t('Command palette')}
                style={
                    customColor?.bgColor
                        ? { backgroundColor: customColor?.bgColor }
                        : {}
                }
            >
                <IconApps24 color={customColor?.color ?? colors.white} />
            </button>
            {modalOpen ? (
                <ModalContainer
                    ref={modalRef}
                    onKeyDown={handleKeyDown}
                    onClick={handleModalClick}
                >
                    <div data-test="headerbar-menu" className="headerbar-menu">
                        <SearchFilter />
                        <div className="headerbar-menu-content">
                            {currentView === HOME_VIEW && !filter ? (
                                <HomeView
                                    grid={grid}
                                    gridColumnCount={gridColumnCount}
                                    gridRowCount={gridRowCount}
                                    currentItem={currentItem}
                                    resetModal={resetModal}
                                />
                            ) : (
                                <ListView
                                    grid={grid}
                                    currentItem={currentItem}
                                    resetModal={resetModal}
                                />
                            )}
                        </div>
                        <NavigationKeysLegend />
                    </div>
                </ModalContainer>
            ) : null}
            <style jsx>{`
                button {
                    display: block;
                    background: transparent;
                    padding-block-start: ${spacers.dp4};
                    padding-block-end: 0;
                    padding-inline: ${spacers.dp8};
                    border: 0;
                    cursor: pointer;
                    height: 100%;
                }
                button:focus {
                    outline: 2px solid white;
                    outline-offset: -2px;
                }
                button:focus:not(:focus-visible) {
                    outline: none;
                }
                button:hover {
                    ${hoverStyle}
                }
                button:active {
                    ${activeStyle}
                }
                .headerbar-apps-menu {
                    position: relative;
                    height: 100%;
                }
                .headerbar-menu {
                    width: 100%;
                }
                .headerbar-menu-content {
                    overflow-y: auto;
                    max-height: calc(560px - 100px);
                }
            `}</style>
        </div>
    )
}

CommandPalette.propTypes = {
    apps: PropTypes.array,
    commands: PropTypes.array,
    shortcuts: PropTypes.array,
}

export default CommandPalette
