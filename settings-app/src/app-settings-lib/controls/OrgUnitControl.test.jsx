import { CustomDataProvider } from '@dhis2/app-runtime'
import { act, render, waitFor } from '@testing-library/react'
import React from 'react'
import { OrgUnitControl } from './OrgUnitControl.jsx'

let mockTreeProps

jest.mock('@dhis2/ui', () => ({
    ...jest.requireActual('@dhis2/ui'),
    OrganisationUnitTree: (props) => {
        mockTreeProps = props
        return null
    },
}))

const data = {
    me: { organisationUnits: [{ id: 'ImspTQPwCqd' }] },
    organisationUnits: {
        organisationUnits: [
            { id: 'O6uvpzGd5pu', path: '/ImspTQPwCqd/O6uvpzGd5pu' },
        ],
    },
}

describe('OrgUnitControl', () => {
    beforeEach(() => {
        mockTreeProps = undefined
    })

    it("opens the tree at the user's roots with the stored unit selected", async () => {
        render(
            <CustomDataProvider data={data}>
                <OrgUnitControl
                    setting={{
                        key: 'homeOrgUnit',
                        type: 'orgUnit',
                        label: 'Default organisation unit',
                    }}
                    value="O6uvpzGd5pu"
                    onChange={() => {}}
                />
            </CustomDataProvider>
        )
        await waitFor(() => expect(mockTreeProps).toBeDefined())
        expect(mockTreeProps.roots).toEqual(['ImspTQPwCqd'])
        expect(mockTreeProps.selected).toEqual(['/ImspTQPwCqd/O6uvpzGd5pu'])
        expect(mockTreeProps.initiallyExpanded).toEqual(['/ImspTQPwCqd'])
        expect(mockTreeProps.singleSelection).toBe(true)
    })

    it('saves the ID of the unit picked in the tree', async () => {
        const onChange = jest.fn()
        render(
            <CustomDataProvider data={data}>
                <OrgUnitControl
                    setting={{
                        key: 'regions',
                        type: 'orgUnit',
                        multiple: true,
                        label: 'Regions to highlight',
                    }}
                    value={['O6uvpzGd5pu']}
                    onChange={onChange}
                />
            </CustomDataProvider>
        )
        await waitFor(() => expect(mockTreeProps).toBeDefined())
        act(() =>
            mockTreeProps.onChange({
                id: 'fdc6uOvgoji',
                path: '/ImspTQPwCqd/fdc6uOvgoji',
                checked: true,
            })
        )
        expect(onChange).toHaveBeenCalledWith('regions', [
            'O6uvpzGd5pu',
            'fdc6uOvgoji',
        ])
    })
})
