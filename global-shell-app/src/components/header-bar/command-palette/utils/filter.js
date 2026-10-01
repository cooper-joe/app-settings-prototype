import {
    ALL_APPS_VIEW,
    ALL_COMMANDS_VIEW,
    ALL_SHORTCUTS_VIEW,
    APP,
    COMMAND,
    FILTERABLE_ACTION,
    SHORTCUT,
} from './constants.js'

export const fuseOptions = {
    includeScore: true,
    threshold: 0.3,
    ignoreDiacritics: true,
    shouldSort: true,
    keys: ['displayName', 'name', 'appName'],
    includeMatches: true,
}

export const filterItemsArray = (fuse, filter) =>
    fuse.search(filter).map(({ item, matches }) => ({ item, matches }))

export const wrapAsFuseResult = (list) =>
    list.map((item) => ({ item, matches: undefined }))

export const filterItemsPerView = ({
    appsFuse,
    commandsFuse,
    shortcutsFuse,
    allItemsFuse,
    apps,
    commands,
    shortcuts,
    actions,
    filter,
    currentView,
}) => {
    if (!filter) {
        if (currentView === ALL_APPS_VIEW) {
            return wrapAsFuseResult([...apps])
        }
        if (currentView === ALL_COMMANDS_VIEW) {
            return wrapAsFuseResult([...commands])
        }
        if (currentView === ALL_SHORTCUTS_VIEW) {
            return wrapAsFuseResult([...shortcuts])
        }

        return [
            ...wrapAsFuseResult(apps),
            ...wrapAsFuseResult(commands),
            ...wrapAsFuseResult(shortcuts),
            ...wrapAsFuseResult(actions),
        ]
    }

    // If there is a filter
    if (currentView === ALL_APPS_VIEW) {
        return filterItemsArray(appsFuse, filter)
    }
    if (currentView === ALL_COMMANDS_VIEW) {
        return filterItemsArray(commandsFuse, filter)
    }
    if (currentView === ALL_SHORTCUTS_VIEW) {
        return filterItemsArray(shortcutsFuse, filter)
    }

    const filteredItems = filterItemsArray(allItemsFuse, filter)

    const filteredApps = filteredItems.filter(({ item }) => item.type === APP)
    const filteredShortcuts = filteredItems.filter(
        ({ item }) => item.type === SHORTCUT
    )
    const filteredCommands = filteredItems.filter(
        ({ item }) => item.type === COMMAND
    )
    const filteredActions = filteredItems.filter(
        ({ item }) => item.type === FILTERABLE_ACTION
    )

    // Group each app with its shortcuts
    // Filter for matched apps and return them with their shortcuts
    // Append remaining shortcuts that match
    const shortcutsByApp = new Map()
    for (const shortcut of shortcuts) {
        if (!shortcutsByApp.has(shortcut.appName)) {
            shortcutsByApp.set(shortcut.appName, [])
        }
        shortcutsByApp.get(shortcut.appName).push(shortcut)
    }

    const filteredAppsWithShortcuts = filteredApps.flatMap(
        ({ item, matches }) => [
            { item, matches },
            ...wrapAsFuseResult(shortcutsByApp.get(item.displayName) ?? []),
        ]
    )

    const matchedAppNames = new Set(
        filteredApps.map(({ item }) => item.displayName || item.name)
    )

    const remainingShortcuts = filteredShortcuts.filter(
        ({ item }) => !matchedAppNames.has(item.appName)
    )

    return [
        ...filteredAppsWithShortcuts,
        ...remainingShortcuts,
        ...filteredCommands,
        ...filteredActions,
    ]
}
