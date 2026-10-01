import i18n from '@dhis2/d2-i18n'
import { Tag, Tooltip } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useDefaultDashboardId } from '../../../components/AppDataProvider/AppDataProvider.jsx'

const DefaultDashboardTag = ({ id }) => {
    const [defaultDashboardId] = useDefaultDashboardId()

    if (!id || id !== defaultDashboardId) {
        return null
    }

    return (
        <Tooltip
            content={i18n.t(
                "Opens for people who haven't opened a dashboard before. Set in System Settings › Apps › Dashboard, or from this dashboard's menu."
            )}
            openDelay={200}
            closeDelay={100}
        >
            {(props) => (
                <div {...props} data-test="default-dashboard-tag">
                    <Tag>{i18n.t('Default')}</Tag>
                </div>
            )}
        </Tooltip>
    )
}

DefaultDashboardTag.propTypes = {
    id: PropTypes.string,
}

export default DefaultDashboardTag
