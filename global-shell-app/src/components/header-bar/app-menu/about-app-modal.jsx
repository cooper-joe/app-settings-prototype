import { colors, spacers } from '@dhis2/ui-constants'
import { IconLaunch16 } from '@dhis2/ui-icons'
import { Button, ButtonStrip } from '@dhis2-ui/button'
import { Modal, ModalActions, ModalContent } from '@dhis2-ui/modal'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from '../../../locales/index.js'
import { appHubUrl } from './appInfo.js'

/**
 * "About <app>": what /api/apps says about the open app. An app that isn't
 * in /api/apps still gets its name and version.
 */
export const AboutAppModal = ({
    appName,
    appVersion,
    appIcon,
    about,
    onClose,
}) => {
    const hubUrl = appHubUrl(about?.appHubId)

    return (
        <Modal
            small
            onClose={onClose}
            position="middle"
            dataTest="headerbar-about-app-modal"
        >
            <ModalContent>
                <div className="identity">
                    {appIcon && <img className="icon" src={appIcon} alt="" />}
                    <div>
                        <div className="name">{appName}</div>
                        <div className="version">
                            {appVersion
                                ? i18n.t('Version {{version}}', {
                                      version: appVersion,
                                  })
                                : i18n.t('Version unknown')}
                        </div>
                    </div>
                </div>

                {about?.description && (
                    <p className="description">{about.description}</p>
                )}

                {about && (
                    <dl>
                        {about.developer && (
                            <>
                                <dt>{i18n.t('Developer')}</dt>
                                <dd>{about.developer}</dd>
                            </>
                        )}
                        <dt>{i18n.t('Type')}</dt>
                        <dd>
                            {about.coreApp
                                ? i18n.t('Core app')
                                : i18n.t('Installed app')}
                        </dd>
                        {hubUrl && (
                            <>
                                <dt>{i18n.t('App Hub')}</dt>
                                <dd>
                                    <a
                                        href={hubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {i18n.t('View on App Hub')}
                                        <IconLaunch16 color={colors.blue700} />
                                    </a>
                                </dd>
                            </>
                        )}
                    </dl>
                )}
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button onClick={() => onClose()}>{i18n.t('Close')}</Button>
                </ButtonStrip>
            </ModalActions>

            <style jsx>{`
                .identity {
                    display: flex;
                    align-items: center;
                    gap: ${spacers.dp12};
                }
                .icon {
                    width: 48px;
                    height: 48px;
                    flex-shrink: 0;
                }
                .name {
                    font-size: 16px;
                    font-weight: 500;
                    color: ${colors.grey900};
                }
                .version {
                    margin-block-start: 2px;
                    font-size: 14px;
                    color: ${colors.grey700};
                }
                .description {
                    margin: ${spacers.dp16} 0 0;
                    font-size: 14px;
                    line-height: 20px;
                    color: ${colors.grey800};
                }
                dl {
                    display: grid;
                    grid-template-columns: max-content 1fr;
                    gap: ${spacers.dp8} ${spacers.dp16};
                    margin: ${spacers.dp16} 0 0;
                    padding-block-start: ${spacers.dp16};
                    border-block-start: 1px solid ${colors.grey300};
                    font-size: 14px;
                    line-height: 18px;
                }
                dt {
                    color: ${colors.grey700};
                }
                dd {
                    margin: 0;
                    color: ${colors.grey900};
                }
                a {
                    display: inline-flex;
                    align-items: center;
                    gap: ${spacers.dp4};
                    color: ${colors.blue700};
                }
            `}</style>
        </Modal>
    )
}

AboutAppModal.propTypes = {
    appName: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    about: PropTypes.shape({
        appHubId: PropTypes.string,
        coreApp: PropTypes.bool,
        description: PropTypes.string,
        developer: PropTypes.string,
    }),
    appIcon: PropTypes.string,
    appVersion: PropTypes.string,
}
