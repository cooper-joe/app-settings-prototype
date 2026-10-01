// Categories whose query string is part of what's on screen: the search
// terms, and the app picked under "App settings".
const QUERY_CATEGORIES = ['search', 'apps']

/**
 * Whether selecting a category needs a new history entry. Other sections
 * keep whatever query they were opened with.
 */
export const shouldPushLocation = ({ category, pathname, search, location }) =>
    pathname !== location.pathname ||
    (QUERY_CATEGORIES.includes(category) && search !== location.search)
