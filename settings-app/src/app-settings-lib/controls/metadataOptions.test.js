import { metadataOptions } from './metadataOptions.js'

const items = [{ id: 'ug1', displayName: 'Reviewers' }]

describe('metadataOptions', () => {
    it('turns API items into options', () => {
        expect(metadataOptions(items, null)).toEqual([
            { value: 'ug1', label: 'Reviewers' },
        ])
    })

    it('keeps stored IDs that no longer exist, marked not found', () => {
        expect(metadataOptions(items, ['ug1', 'gone'])).toEqual([
            { value: 'ug1', label: 'Reviewers' },
            { value: 'gone', label: 'gone (not found)' },
        ])
    })
})
