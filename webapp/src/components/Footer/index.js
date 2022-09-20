import React from 'react'
import { makeStyles } from '@mui/styles'
import { List, ListItemText, ListItem, Link } from '@mui/material'
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
        <div>
          <div className={classes.midText}>{t('footer1')}</div>
          <Link
            className={classes.noUnderline}
            href="https://github.com/eoscostarica/eosio-dashboard"
            onClick={(event) => handleLinkClick(event)}
            target="_blank"
            rel="noreferrer"
          >
            <div className={classes.midText}>{t('footer2')}</div>
          </Link>
        </div>
      </div>

      <div className={classes.footerAlign}>
        <div className={classes.sidebarFooter}>
          <Link
            className={classes.noUnderline}
            href="https://github.com/eoscostarica/eosio-dashboard/releases"
            onClick={(event) => handleLinkClick(event)}
            target="_blank"
            rel="noreferrer"
          >
            <div className={classes.linkBadge}>
              {generalConfig.appVersion.split('-').pop()}
            </div>
          </Link>
        </div>
        
        <div>
          <List
            className={`${classes.footerMenuWrapper} ${classes.sidebarFooter}`}
          >
            <Link
              className={classes.noUnderline}
              href="https://github.com/eoscostarica/eosio-dashboard/issues/new/choose"
              onClick={(event) => handleLinkClick(event)}
              target="_blank"
              rel="noreferrer"
            >
              {t('bugRequest')}
            </Link>
          </List>
        </div>
      </div>
    </div>
  )
}

export default Footer
