import { TILE_IDS } from './tileIds.js'
import { TILES } from './tiles.jsx'

describe('tiles', () => {
    it('has a component and title for every tile ID', () => {
        expect(Object.keys(TILES)).toEqual(TILE_IDS)
        TILE_IDS.forEach((id) => {
            expect(typeof TILES[id].title()).toBe('string')
            expect(typeof TILES[id].Component).toBe('function')
        })
    })
})
