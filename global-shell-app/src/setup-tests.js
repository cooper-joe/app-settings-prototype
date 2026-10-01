import { TextEncoder, TextDecoder } from 'util'
import { configure } from '@testing-library/dom'
import '@testing-library/jest-dom'

Object.assign(global, { TextDecoder, TextEncoder })

configure({
    testIdAttribute: 'data-test',
})
