import { colors, theme, spacers } from '@dhis2/ui-constants'
import { IconMessages24, IconMail24 } from '@dhis2/ui-icons'
import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router'
import css from 'styled-jsx/css'
import i18n from '../../locales/index.js'
import { useCustomColorContext } from './custom-color-context.jsx'

function icon(kind, color) {
    if (kind === 'message') {
        return <IconMessages24 color={color} />
    } else {
        return <IconMail24 color={color} />
    }
}

const getStyles = (bgColor) => {
    const hoverStyle = bgColor ? 'opacity: 0.6;' : `background: #104f7e;`

    return css.resolve`
        a {
            /* Need this to undo <a> styles in Link component: */
            text-decoration: none;
            /* Rest of styles: */
            position: relative;
            margin: 0;
            cursor: pointer;
            padding: 0 ${spacers.dp8};
            height: 100%;
            display: flex;
            align-items: center;
        }
        a:focus {
            outline: 2px solid white;
            outline-offset: -2px;
        }
        a:focus:not(:focus-visible) {
            outline: none;
        }
        a:hover {
            ${hoverStyle}
        }
        a:active {
            ${hoverStyle}
        }
    `
}

export const NotificationIcon = ({
    count = 0,
    path,
    kind,
    dataTestId,
    title,
    'aria-label': ariaLabel,
}) => {
    const {
        color = colors.white,
        bgColor,
        hasCustomColor,
    } = useCustomColorContext()

    const { className, styles } = getStyles(bgColor)

    return (
        <Link
            dir="ltr"
            to={path}
            className={className}
            data-test={dataTestId}
            title={i18n.t(title)}
            aria-label={i18n.t(ariaLabel)}
        >
            {icon(kind, color)}

            {count > 0 && (
                <span data-test={`${dataTestId}-count`}>{count}</span>
            )}

            {styles}
            <style jsx>{`
                span {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1;
                    position: absolute;
                    top: 3px;
                    inset-inline-end: 2px;
                    min-inline-size: 16px;
                    min-block-size: 16px;
                    border-radius: ${spacers.dp12};
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1),
                        0 1px 2px 0 rgba(0, 0, 0, 0.06);
                    background-color: ${theme.secondary500};
                    border: 1px solid ${theme.secondary700};
                    ${hasCustomColor ? ` color: white !important;` : ''}
                    color: ${color};
                    text-shadow: 0px 0px 2px rgba(0, 0, 0, 0.5);
                    font-size: 12px;
                    font-weight: 500;
                    line-height: 15px;
                    text-align: center;
                    cursor: inherit;
                    padding: 0 ${spacers.dp4};
                }
            `}</style>
        </Link>
    )
}
NotificationIcon.propTypes = {
    'aria-label': PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    count: PropTypes.number,
    dataTestId: PropTypes.string,
    kind: PropTypes.oneOf(['interpretation', 'message']),
}
