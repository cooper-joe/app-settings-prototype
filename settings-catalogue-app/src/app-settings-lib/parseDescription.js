import { isEmpty, validateValue } from './validateValue.js'

export const SUPPORTED_TYPES = [
    'boolean',
    'select',
    'multiSelect',
    'text',
    'number',
    'orgUnit',
    'metadata',
    'periodType',
    'custom',
]

export const METADATA_RESOURCES = [
    'dashboards',
    'userGroups',
    'userRoles',
    'dataSets',
    'programs',
    'dataElementGroups',
    'indicatorGroups',
    'organisationUnitGroups',
    'organisationUnitGroupSets',
]

export class DescriptionError extends Error {}

const requireString = (raw, field) => {
    if (typeof raw[field] !== 'string' || raw[field] === '') {
        throw new DescriptionError(`Missing "${field}"`)
    }
}

// Assumes the plugin URL is built by concatenating this path onto a
// non-empty absolute app baseUrl (see CustomControl). Allowlisting the
// character set closes off encoded, backslash and whitespace traversal
// (e.g. "%2e%2e/x", "..\\other\\plugin.html", ".\t./other/plugin.html")
// that a URL parser could still resolve out of the app's own folder;
// the "." / ".." segment rule then still blocks plain traversal.
const isRelativePath = (path) =>
    typeof path === 'string' &&
    path !== '' &&
    !path.startsWith('/') &&
    /^[A-Za-z0-9._~/-]+$/.test(path) &&
    !path.split('/').some((segment) => segment === '.' || segment === '..')

const checkTypeRules = (setting) => {
    const { key, type } = setting
    if (
        (type === 'select' || type === 'multiSelect') &&
        !(Array.isArray(setting.options) && setting.options.length > 0)
    ) {
        throw new DescriptionError(`Select setting "${key}" needs options`)
    }
    if (
        type === 'number' &&
        typeof setting.min === 'number' &&
        typeof setting.max === 'number' &&
        setting.min > setting.max
    ) {
        throw new DescriptionError(`Number setting "${key}" has min above max`)
    }
    if (type === 'metadata' && !METADATA_RESOURCES.includes(setting.resource)) {
        throw new DescriptionError(
            `Metadata setting "${key}" uses an unsupported resource "${setting.resource}"`
        )
    }
    if (type === 'custom') {
        if (!setting.plugin && !setting.appPath) {
            throw new DescriptionError(
                `Custom setting "${key}" needs a plugin or an appPath`
            )
        }
        if (setting.plugin !== undefined && !isRelativePath(setting.plugin)) {
            throw new DescriptionError(
                `Custom setting "${key}" has an invalid plugin path`
            )
        }
        if (
            setting.appPath !== undefined &&
            !(
                typeof setting.appPath === 'string' &&
                setting.appPath.startsWith('#')
            )
        ) {
            throw new DescriptionError(
                `Custom setting "${key}" needs an appPath starting with "#"`
            )
        }
    }
}

export const parseDescription = (raw) => {
    if (!raw || typeof raw !== 'object') {
        throw new DescriptionError('A settings description must be an object')
    }
    if (raw.version !== 1) {
        throw new DescriptionError(
            `Unsupported settings description version: ${raw.version}`
        )
    }
    ;['app', 'title', 'namespace', 'adminAuthority'].forEach((field) =>
        requireString(raw, field)
    )

    const sections = Array.isArray(raw.sections) ? raw.sections : []
    const sectionIds = new Set(sections.map((section) => section.id))

    if (!Array.isArray(raw.settings) || raw.settings.length === 0) {
        throw new DescriptionError('A settings description needs settings')
    }

    const keys = new Set()
    const settings = raw.settings.map((setting) => {
        if (typeof setting.key !== 'string' || setting.key === '') {
            throw new DescriptionError('Every setting needs a "key"')
        }
        if (keys.has(setting.key)) {
            throw new DescriptionError(`Duplicate setting key "${setting.key}"`)
        }
        keys.add(setting.key)
        if (setting.section && !sectionIds.has(setting.section)) {
            throw new DescriptionError(`Unknown section "${setting.section}"`)
        }
        checkTypeRules(setting)
        const parsed = {
            ...setting,
            label: setting.label || setting.key,
            unsupported: !SUPPORTED_TYPES.includes(setting.type),
        }
        if (!parsed.unsupported) {
            if (setting.required && isEmpty(setting.default)) {
                throw new DescriptionError(
                    `Required setting "${setting.key}" needs a default`
                )
            }
            const problem = validateValue(parsed, parsed.default)
            if (problem) {
                throw new DescriptionError(
                    `Default for "${setting.key}" is not valid: ${problem.message}`
                )
            }
        }
        return parsed
    })

    return { ...raw, sections, settings }
}
