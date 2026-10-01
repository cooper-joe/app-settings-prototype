import { CustomDataProvider } from '@dhis2/app-runtime'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { MetadataControl } from './MetadataControl.jsx'

const data = {
    userGroups: {
        userGroups: [
            { id: 'ug1', displayName: 'Reviewers' },
            { id: 'ug2', displayName: 'Admins' },
        ],
    },
}

const setting = {
    key: 'reviewers',
    type: 'metadata',
    resource: 'userGroups',
    label: 'Reviewer group',
}

describe('MetadataControl', () => {
    it('shows the stored group by name', async () => {
        render(
            <CustomDataProvider data={data}>
                <MetadataControl
                    setting={setting}
                    value="ug1"
                    onChange={() => {}}
                />
            </CustomDataProvider>
        )
        expect(await screen.findByText('Reviewers')).toBeTruthy()
    })

    it('shows a stored ID that no longer exists', async () => {
        render(
            <CustomDataProvider data={data}>
                <MetadataControl
                    setting={setting}
                    value="gone"
                    onChange={() => {}}
                />
            </CustomDataProvider>
        )
        expect(await screen.findByText('gone (not found)')).toBeTruthy()
    })

    it('shows a load error instead of marking the value not found', async () => {
        render(
            <CustomDataProvider
                data={{
                    userGroups: () => {
                        throw new Error('network down')
                    },
                }}
            >
                <MetadataControl
                    setting={setting}
                    value="ug1"
                    onChange={() => {}}
                />
            </CustomDataProvider>
        )
        expect(await screen.findByText('Could not load the list')).toBeTruthy()
        expect(screen.queryByText('ug1 (not found)')).toBeNull()
    })
})
