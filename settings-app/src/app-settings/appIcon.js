// /api/apps lists icons by size. 48 is the size App Platform apps ship.
const PREFERRED_SIZES = ['48', '128', '16']

const isAbsolute = (path) => path.startsWith('/') || /^[a-z]+:/i.test(path)

export const appIconUrl = ({ icons, baseUrl }) => {
    const icon = PREFERRED_SIZES.map((size) => icons?.[size]).find(Boolean)
    if (!icon) {
        return null
    }
    if (isAbsolute(icon)) {
        return icon
    }
    return `${(baseUrl || '').replace(/\/$/, '')}/${icon}`
}
