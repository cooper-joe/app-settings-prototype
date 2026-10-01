import { formatValue, loadDisplayNames, sourceLabel } from './currentValues.js'

describe('formatValue', () => {
    it('formats each kind of value', () => {
        const select = {
            type: 'select',
            options: [{ value: 'dark', label: 'Dark' }],
        }
        expect(formatValue({ type: 'boolean' }, true)).toBe('On')
        expect(formatValue(select, 'dark')).toBe('Dark')
        expect(
            formatValue({ ...select, type: 'multiSelect' }, ['dark', 'x'])
        ).toBe('Dark, x')
        expect(formatValue({ type: 'number' }, 30)).toBe('30')
        expect(formatValue({ type: 'text' }, null)).toBe('(none)')
        expect(formatValue({ type: 'orgUnit', multiple: true }, [])).toBe(
            '(none)'
        )
    })

    it('shows picker IDs by name', () => {
        const names = { ug1: 'Reviewers' }
        expect(formatValue({ type: 'metadata' }, 'ug1', names)).toBe(
            'Reviewers'
        )
        expect(formatValue({ type: 'metadata' }, 'gone', names)).toBe(
            'gone (not found)'
        )
    })
})

describe('sourceLabel', () => {
    it('explains where a value came from', () => {
        expect(sourceLabel('app')).toBe('Saved in System Settings')
        expect(sourceLabel('default')).toBe('Default')
    })
})

describe('loadDisplayNames', () => {
    it('looks up names once per resource', async () => {
        const engine = {
            query: jest.fn(async ({ list }) => ({
                list: {
                    [list.resource]:
                        list.resource === 'userGroups'
                            ? [{ id: 'ug1', displayName: 'Reviewers' }]
                            : [{ id: 'ou1', displayName: 'Bo' }],
                },
            })),
        }
        const description = {
            settings: [
                { key: 'reviewers', type: 'metadata', resource: 'userGroups' },
                { key: 'home', type: 'orgUnit' },
                { key: 'regions', type: 'orgUnit', multiple: true },
                { key: 'theme', type: 'select' },
            ],
        }
        const names = await loadDisplayNames(engine, description, {
            reviewers: 'ug1',
            home: 'ou1',
            regions: ['ou1'],
            theme: 'dark',
        })
        expect(names).toEqual({ ug1: 'Reviewers', ou1: 'Bo' })
        expect(engine.query).toHaveBeenCalledTimes(2)
        expect(engine.query.mock.calls[1][0].list.params.filter).toBe(
            'id:in:[ou1]'
        )
    })
})
