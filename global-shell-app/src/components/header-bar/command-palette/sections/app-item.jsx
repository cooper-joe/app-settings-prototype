import { colors, spacers } from '@dhis2/ui-constants'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router'
import { linkClassName, linkStyles } from '../../react-router-link-styles.jsx'

function AppItem({ name, displayName, img, highlighted, resetModal }) {
    return (
        <Link
            to={`/${name.replace('dhis-web-', '')}`}
            className={linkClassName}
            onClick={resetModal}
        >
            <div className={cx('item', { highlighted })} tabIndex={-1}>
                <img src={img} alt="app" className="app-icon" />
                <span className="app-name">{displayName}</span>
            </div>
            {linkStyles}
            <style jsx>{`
                .item {
                    display: flex;
                    flex-direction: column;
                    gap: ${spacers.dp12};
                    align-items: center;
                    padding: ${spacers.dp16} ${spacers.dp4};
                    margin: 0;
                    background: ${colors.white};
                    border-radius: 1px;
                    text-decoration: none;
                    color: ${colors.grey900};
                    transition: all 0.1s ease;
                }
                .item:hover,
                .highlighted {
                    background: ${colors.grey200};
                    cursor: pointer;
                }
                .item:active {
                    background: ${colors.grey300};
                }
                .item:focus {
                    outline: none;
                }
                .item:last-of-type {
                    margin-bottom: 0;
                }
                .app-icon {
                    width: 48px;
                    height: 48px;
                }
                .app-name {
                    font-size: 13px;
                    text-align: center;
                }
            `}</style>
        </Link>
    )
}

AppItem.propTypes = {
    displayName: PropTypes.string,
    highlighted: PropTypes.bool,
    img: PropTypes.string,
    name: PropTypes.string,
    resetModal: PropTypes.func,
}

export default AppItem
