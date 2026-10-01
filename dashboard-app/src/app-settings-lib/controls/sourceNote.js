import i18n from '@dhis2/d2-i18n'

export const sourceNote = (source) => {
    if (source === 'legacy') {
        return i18n.t('Not changed here yet: using the old system setting')
    }
    if (source === 'default') {
        return i18n.t("Not set: using the app's default")
    }
    return undefined
}

export const helpTextFor = (setting, source) =>
    sourceNote(source) || setting.help
