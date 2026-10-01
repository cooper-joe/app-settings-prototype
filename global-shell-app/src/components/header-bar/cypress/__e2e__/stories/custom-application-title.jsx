import React from 'react'
import { HeaderBar } from '../../index.js'
import {
    dataProviderData,
    createDecoratorCustomDataProviderHeaderBar,
    createDecoratorProvider,
} from './common.jsx'

export const CustomApplicationTitle = () => <HeaderBar appName="Example!" />

CustomApplicationTitle.decorators = [
    createDecoratorCustomDataProviderHeaderBar({
        ...dataProviderData,
        ['systemSettings/applicationTitle']: {
            applicationTitle: 'Barbaz',
        },
    }),
    createDecoratorProvider(),
]
