import PropTypes from 'prop-types'

export const appPropType = PropTypes.shape({
    baseUrl: PropTypes.string,
    key: PropTypes.string,
    name: PropTypes.string,
})

export const controlPropTypes = {
    setting: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    app: appPropType,
    disabled: PropTypes.bool,
    error: PropTypes.string,
    source: PropTypes.string,
    value: PropTypes.any,
}
