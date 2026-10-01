import { CustomDataProvider } from '@dhis2/app-runtime'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { PeriodTypeControl } from './PeriodTypeControl.jsx'

describe('PeriodTypeControl', () => {
    it('shows the stored period type', async () => {
        render(
            <CustomDataProvider
                data={{
                    periodTypes: {
                        periodTypes: [{ name: 'Monthly' }, { name: 'Weekly' }],
                    },
                }}
            >
                <PeriodTypeControl
                    setting={{
                        key: 'reportingPeriod',
                        type: 'periodType',
                        label: 'Reporting period type',
                    }}
                    value="Weekly"
                    onChange={() => {}}
                />
            </CustomDataProvider>
        )
        expect(await screen.findByText('Weekly')).toBeTruthy()
    })

    it('shows a stored period type that no longer exists', async () => {
        render(
            <CustomDataProvider
                data={{
                    periodTypes: {
                        periodTypes: [{ name: 'Monthly' }, { name: 'Weekly' }],
                    },
                }}
            >
                <PeriodTypeControl
                    setting={{
                        key: 'reportingPeriod',
                        type: 'periodType',
                        label: 'Reporting period type',
                    }}
                    value="Yearly"
                    onChange={() => {}}
                />
            </CustomDataProvider>
        )
        expect(await screen.findByText('Yearly (not found)')).toBeTruthy()
    })
})
