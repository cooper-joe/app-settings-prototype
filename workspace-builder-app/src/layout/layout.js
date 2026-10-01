import { TILE_IDS } from '../tiles/tileIds.js'

export const SIZES = ['normal', 'wide']

// Keep this in step with the default in public/settings.json. A test checks it.
export const DEFAULT_LAYOUT = {
    tiles: [
        { id: 'visits', size: 'wide' },
        { id: 'stock', size: 'normal' },
        { id: 'reports', size: 'normal' },
        { id: 'messages', size: 'normal' },
    ],
}

// The host saves whatever the plugin sends, and anyone with write access can
// change the datastore directly, so the app cleans up its own value on read.
export const normaliseLayout = (value) => {
    if (!value || typeof value !== 'object' || !Array.isArray(value.tiles)) {
        return DEFAULT_LAYOUT
    }
    const seen = new Set()
    const tiles = []
    value.tiles.forEach((tile) => {
        if (!tile || !TILE_IDS.includes(tile.id) || seen.has(tile.id)) {
            return
        }
        seen.add(tile.id)
        tiles.push({
            id: tile.id,
            size: SIZES.includes(tile.size) ? tile.size : 'normal',
        })
    })
    return { tiles }
}

export const hiddenTileIds = (layout) =>
    TILE_IDS.filter((id) => !layout.tiles.some((tile) => tile.id === id))

export const moveTile = (layout, activeId, overId) => {
    const from = layout.tiles.findIndex((tile) => tile.id === activeId)
    const to = layout.tiles.findIndex((tile) => tile.id === overId)
    if (from === -1 || to === -1 || from === to) {
        return layout
    }
    const tiles = [...layout.tiles]
    const [moved] = tiles.splice(from, 1)
    tiles.splice(to, 0, moved)
    return { tiles }
}

export const hideTile = (layout, id) => ({
    tiles: layout.tiles.filter((tile) => tile.id !== id),
})

export const showTile = (layout, id) =>
    !TILE_IDS.includes(id) || layout.tiles.some((tile) => tile.id === id)
        ? layout
        : { tiles: [...layout.tiles, { id, size: 'normal' }] }

export const toggleSize = (layout, id) => ({
    tiles: layout.tiles.map((tile) =>
        tile.id === id
            ? { ...tile, size: tile.size === 'wide' ? 'normal' : 'wide' }
            : tile
    ),
})
