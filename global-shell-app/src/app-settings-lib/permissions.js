export const canAdminister = (description, authorities) => {
    const held = new Set(authorities || [])
    return held.has('ALL') || held.has(description.adminAuthority)
}
