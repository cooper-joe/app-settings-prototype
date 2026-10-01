import { pickApp } from './pickApp.js'

const dashboard = { app: { key: 'dashboard' } }
const workspaceBuilder = { app: { key: 'workspace-builder' } }
const catalogue = { found: [dashboard, workspaceBuilder], manageable: [workspaceBuilder] }

describe('pickApp', () => {
    it('picks the app named by the key, even one the user cannot change', () => {
        expect(pickApp(catalogue, 'dashboard')).toBe(dashboard)
    })

    it('falls back to the first app the user can change', () => {
        expect(pickApp(catalogue, null)).toBe(workspaceBuilder)
        expect(pickApp(catalogue, 'not-installed')).toBe(workspaceBuilder)
    })

    it('returns null when nothing matches and the user can change no apps', () => {
        expect(pickApp({ found: [dashboard], manageable: [] }, null)).toBeNull()
    })

    it('copes with a catalogue that is still loading', () => {
        expect(pickApp({ loading: true }, 'dashboard')).toBeNull()
    })
})
