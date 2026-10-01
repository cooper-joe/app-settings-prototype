import { CustomDataProvider } from '@dhis2/app-runtime'
import React from 'react'
import { createRoot } from 'react-dom/client'
// import App from './App.jsx'

// todo: App imports from @dhis2/pwa, which imports from workbox-precaching,
// which doesn't have a CJS build, so its `import` statements break jest.
// @dhis2/pwa should be split to separate service worker and react envs

it.skip('renders without crashing', () => {
    const div = document.createElement('div')
    const root = createRoot(div)
    root.render(<CustomDataProvider>{/* <App /> */}</CustomDataProvider>)
    root.unmount()
})
