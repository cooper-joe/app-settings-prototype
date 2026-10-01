export const toIds = (value) => {
    if (Array.isArray(value)) {
        return value
    }
    return value ? [value] : []
}

export const idFromPath = (path) => path.split('/').filter(Boolean).pop()

export const parentPaths = (paths) =>
    paths.map((path) => path.split('/').slice(0, -1).join('/')).filter(Boolean)

export const nextSelection = ({ multiple, current, path, checked }) => {
    if (!multiple) {
        return checked ? [path] : []
    }
    const without = current.filter((entry) => entry !== path)
    return checked ? [...without, path] : without
}

export const toValue = ({ multiple, paths }) => {
    const ids = paths.map(idFromPath)
    return multiple ? ids : ids[0] ?? null
}
