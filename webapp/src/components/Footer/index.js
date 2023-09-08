import React from 'react'
import { makeStyles } from '@mui/styles'
import { List, ListItemText, ListItem } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { generalConfig } from '../../config'

import styles from './styles'

const useStyles = makeStyles(styles)

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
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className={classes.midFooter}>
            {t('footer2')}
            <img
              alt="antelope tools dashboard"
              src={'/edenia.webp'}
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
          <ListItem>
            <ListItemText
              primary={
                <a
                  className={classes.noUnderline}
                  href="https://github.com/edenia/antelope-tools/issues/new/choose"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('bugRequest')}
                </a>
              }
            />
          </ListItem>
        </List>
      </div>
    </div>
  )
}

export default Footer
