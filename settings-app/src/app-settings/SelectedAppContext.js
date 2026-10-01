import { createContext } from 'react'

// The app named in #/apps?app=<key>, or null when the URL names none.
// app.component.jsx provides it. AppSettingsPage is drawn by
// settingsFields.component.jsx, which passes it no props.
export const SelectedAppContext = createContext(null)
