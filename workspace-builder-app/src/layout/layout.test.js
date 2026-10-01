import {
    DEFAULT_LAYOUT,
    hiddenTileIds,
    hideTile,
    moveTile,
    normaliseLayout,
    showTile,
    toggleSize,
} from './layout.js'

const layout = {
    tiles: [
        { id: 'visits', size: 'wide' },
        { id: 'stock', size: 'normal' },
        { id: 'reports', size: 'normal' },
    ],
}

describe('normaliseLayout', () => {
    it('uses the default for anything that is not a layout', () => {
        expect(normaliseLayout(undefined)).toBe(DEFAULT_LAYOUT)
        expect(normaliseLayout('tiles')).toBe(DEFAULT_LAYOUT)
        expect(normaliseLayout({ tiles: 'x' })).toBe(DEFAULT_LAYOUT)
    })

    it('drops unknown and repeated tiles, and fixes bad sizes', () => {
        expect(
            normaliseLayout({
                tiles: [
                    { id: 'visits', size: 'huge' },
                    { id: 'nope', size: 'wide' },
                    { id: 'visits', size: 'wide' },
                    null,
                    { id: 'map', size: 'wide' },
                ],
            })
        ).toEqual({
            tiles: [
                { id: 'visits', size: 'normal' },
                { id: 'map', size: 'wide' },
            ],
        })
    })

    it('allows an empty home screen', () => {
        expect(normaliseLayout({ tiles: [] })).toEqual({ tiles: [] })
    })
})

describe('layout operations', () => {
    it('moves a tile to where another one was', () => {
        expect(
            moveTile(layout, 'reports', 'visits').tiles.map((t) => t.id)
        ).toEqual(['reports', 'visits', 'stock'])
        expect(moveTile(layout, 'reports', 'reports')).toBe(layout)
        expect(moveTile(layout, 'reports', 'nope')).toBe(layout)
    })

    it('hides and shows tiles', () => {
        const hidden = hideTile(layout, 'stock')
        expect(hidden.tiles.map((t) => t.id)).toEqual(['visits', 'reports'])
        expect(hiddenTileIds(hidden)).toEqual([
            'stock',
            'messages',
            'weather',
            'map',
        ])
        expect(showTile(hidden, 'stock').tiles.at(-1)).toEqual({
            id: 'stock',
            size: 'normal',
        })
        expect(showTile(layout, 'visits')).toBe(layout)
    })

    it('switches a tile between normal and wide', () => {
        expect(toggleSize(layout, 'visits').tiles[0].size).toBe('normal')
        expect(toggleSize(layout, 'stock').tiles[1].size).toBe('wide')
    })
})
