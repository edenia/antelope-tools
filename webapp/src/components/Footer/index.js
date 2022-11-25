import React from 'react'
import { makeStyles } from '@mui/styles'
import { List, ListItemText, ListItem } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { generalConfig } from '../../config'

import styles from './styles'

const useStyles = makeStyles(styles)

const handleLinkClick = () => {}

const Footer = () => {
  const classes = useStyles()
  const { t } = useTranslation('translations')

  return (
    <div className={classes.wrapper}>
      <div className={classes.left}>
        <List className={classes.footerMenuWrapper}>
          {generalConfig.footerLinks.map((link, index) => (
            <ListItem className={classes.listItem} key={index}>
              <ListItemText
                primary={
                  <a href={link.src} target="_blank" rel="noopener noreferrer">
                    {link.text}
                  </a>
                }
              />
            </ListItem>
          ))}
        </List>
      </div>

      <div className={classes.gridFooter}>
        <div className={classes.midText}>{t('footer1')}</div>
        <a
          className={classes.noUnderline}
          href="https://edenia.com/"
          onClick={() => handleLinkClick()}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className={classes.midFooter}>
            {t('footer2')}
            <img
              alt="antelope tools dashboard"
              src={'/edenia.png'}
              className={classes.imgHeaderLogo}
              loading="lazy"
            />
          </div>
        </a>
      </div>

      <div className={classes.footerAlign}>
        <div className={classes.sidebarFooter}>
          <a
            className={classes.noUnderline}
            href="https://github.com/edenia/antelope-tools/releases"
            onClick={() => handleLinkClick()}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className={classes.linkBadge}>
              {generalConfig.appVersion.split('-').pop()}
            </div>
          </a>
        </div>

        <List
          className={`${classes.footerMenuWrapper} ${classes.sidebarFooter}`}
        >
          <a
            className={classes.noUnderline}
            href="https://github.com/edenia/antelope-tools/issues/new/choose"
            onClick={() => handleLinkClick()}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('bugRequest')}
          </a>
        </List>
      </div>
    </div>
  )
}

export default Footer
