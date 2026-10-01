import css from 'styled-jsx/css'

/** Need to do this to undo <a> styles in the Link component */
const { className, styles } = css.resolve`
    a {
        text-decoration: none;
    }
`

export { className as linkClassName, styles as linkStyles }
