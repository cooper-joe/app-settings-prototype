import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { SettingsForm } from './SettingsForm.jsx'

const description = {
    sections: [
        {
            id: 'itemMenu',
            label: 'Dashboard item menu',
            description: 'Which actions users see',
        },
    ],
    settings: [
        {
            key: 'allowVisViewAs',
            section: 'itemMenu',
            type: 'boolean',
            default: true,
            label: 'Allow users to switch view type',
            unsupported: false,
        },
        {
            key: 'basemap',
            type: 'basemap',
            default: 'osmLight',
            label: 'Default basemap',
            unsupported: true,
        },
    ],
}

describe('SettingsForm', () => {
    it('draws sections and checkboxes and reports changes', () => {
        const onChange = jest.fn()
        render(
            <SettingsForm
                description={description}
                values={{ allowVisViewAs: true }}
                sources={{ allowVisViewAs: 'legacy' }}
                onChange={onChange}
            />
        )
        expect(screen.getByText('Dashboard item menu')).toBeTruthy()
        expect(
            screen.getByText(
                'Not changed here yet: using the old system setting'
            )
        ).toBeTruthy()
        fireEvent.click(
            screen.getByLabelText('Allow users to switch view type')
        )
        expect(onChange).toHaveBeenCalledWith('allowVisViewAs', false)
    })

    it('explains settings it cannot draw', () => {
        render(
            <SettingsForm
                description={description}
                values={{}}
                sources={{}}
                onChange={() => {}}
            />
        )
        expect(
            screen.getByText(
                'This setting needs a newer version of System Settings.'
            )
        ).toBeTruthy()
    })

    it('does not pass on a value that fails validation, and shows why', () => {
        const onChange = jest.fn()
        const text = {
            sections: [],
            settings: [
                {
                    key: 'banner',
                    type: 'text',
                    required: true,
                    label: 'Banner text',
                    unsupported: false,
                },
            ],
        }
        render(
            <SettingsForm
                description={text}
                values={{ banner: 'Hello' }}
                sources={{ banner: 'app' }}
                onChange={onChange}
            />
        )
        // A required field's label also holds the required marker.
        const input = screen.getByLabelText('Banner text', { exact: false })
        fireEvent.change(input, { target: { value: '' } })
        fireEvent.blur(input)
        expect(onChange).not.toHaveBeenCalled()
        expect(screen.getByText('This setting is required')).toBeTruthy()
    })

    it('does not pass on a non-empty value that fails validation, and shows why', () => {
        const onChange = jest.fn()
        const text = {
            sections: [],
            settings: [
                {
                    key: 'banner',
                    type: 'text',
                    maxLength: 3,
                    label: 'Banner text',
                    unsupported: false,
                },
            ],
        }
        render(
            <SettingsForm
                description={text}
                values={{ banner: 'Hi' }}
                sources={{ banner: 'app' }}
                onChange={onChange}
            />
        )
        const input = screen.getByLabelText('Banner text', { exact: false })
        fireEvent.change(input, { target: { value: 'abcd' } })
        fireEvent.blur(input)
        expect(onChange).not.toHaveBeenCalled()
        expect(screen.getByText('Use 3 characters or fewer')).toBeTruthy()
    })
})
