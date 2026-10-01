import {
    idFromPath,
    nextSelection,
    parentPaths,
    toIds,
    toValue,
} from './orgUnitSelection.js'

describe('orgUnitSelection', () => {
    it('reads IDs from a value', () => {
        expect(toIds(null)).toEqual([])
        expect(toIds('a')).toEqual(['a'])
        expect(toIds(['a', 'b'])).toEqual(['a', 'b'])
    })

    it('takes the ID from a path', () => {
        expect(idFromPath('/ImspTQPwCqd/O6uvpzGd5pu')).toBe('O6uvpzGd5pu')
    })

    it('lists the parents to expand', () => {
        expect(parentPaths(['/A/B/C', '/A'])).toEqual(['/A/B'])
    })

    it('keeps one path in single selection', () => {
        expect(
            nextSelection({
                multiple: false,
                current: ['/A'],
                path: '/A/B',
                checked: true,
            })
        ).toEqual(['/A/B'])
        expect(
            nextSelection({
                multiple: false,
                current: ['/A/B'],
                path: '/A/B',
                checked: false,
            })
        ).toEqual([])
    })

    it('adds and removes paths in multiple selection', () => {
        expect(
            nextSelection({
                multiple: true,
                current: ['/A'],
                path: '/A/B',
                checked: true,
            })
        ).toEqual(['/A', '/A/B'])
        expect(
            nextSelection({
                multiple: true,
                current: ['/A', '/A/B'],
                path: '/A',
                checked: false,
            })
        ).toEqual(['/A/B'])
    })

    it('turns paths into the stored value', () => {
        expect(toValue({ multiple: false, paths: [] })).toBeNull()
        expect(toValue({ multiple: false, paths: ['/A/B'] })).toBe('B')
        expect(toValue({ multiple: true, paths: ['/A', '/A/B'] })).toEqual([
            'A',
            'B',
        ])
    })
})
