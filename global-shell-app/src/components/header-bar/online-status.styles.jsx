import { colors, spacers } from '@dhis2/ui-constants'
import css from 'styled-jsx/css'
import { useCustomColorContext } from './custom-color-context.jsx'

const useOnlineStatusStyles = () => {
    const { hasCustomColor, color } = useCustomColorContext()

    // "Lighten" on light backgrounds with black text; "darken" on dark BGs
    const customBgColor =
        color === 'black' ? 'rgba(255,255,255, 0.2)' : 'rgba(0,0,0, 0.2)'

    const shadedStyle = hasCustomColor
        ? `background-color: ${customBgColor}; color: ${color} !important;`
        : `background-color: #10436a; color: ${colors.grey050};`
    const textShadow =
        !hasCustomColor || color === 'white'
            ? '0px 0px 2px rgba(0, 0, 0, 0.5)'
            : ''

    return css`
        .container {
            display: flex;
            align-items: center;
            justify-content: center; // new
            flex-shrink: 0; // ?

            text-shadow: ${textShadow};
            ${shadedStyle}
        }

        .container.badge {
            margin-inline-end: ${spacers.dp8};
            padding: 6px;
            border-radius: 5px;
            font-size: 13px;
        }

        .container.bar {
            display: none;
            padding: 0px ${spacers.dp4};
            min-height: 24px;
            font-size: 13px;
        }

        @media (max-width: 480px) {
            .container.badge {
                display: none;
            }

            .container.bar {
                display: flex;
            }
        }

        .unselectable {
            cursor: default;
            user-select: none;
        }

        .info {
            margin-inline-end: ${spacers.dp12};
        }

        .info-dense {
            margin-inline-start: ${spacers.dp12};
            font-size: 12px;
        }

        .icon {
            width: 8px;
            min-width: 8px;
            height: 8px;
            border-radius: 8px;
            margin-inline-end: ${spacers.dp4};
        }

        .icon.online {
            background-color: ${colors.teal400};
        }

        .icon.offline {
            background-color: transparent;
            border: 1px solid ${colors.yellow300};
        }

        .icon.reconnecting {
            background: ${colors.grey300};
            -webkit-animation: fadeinout 2s linear infinite;
            animation: fadeinout 2s linear infinite;
            opacity: 0;
        }

        @-webkit-keyframes fadeinout {
            50% {
                opacity: 1;
            }
        }

        @keyframes fadeinout {
            50% {
                opacity: 1;
            }
        }

        .label,
        .info {
            letter-spacing: 0.1px;
        }
    `
}

export default useOnlineStatusStyles
