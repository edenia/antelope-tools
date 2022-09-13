import React from 'react'
import { makeStyles } from '@mui/styles'
import { List, ListItemText, ListItem, Link } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { generalConfig } from '../../config'

import styles from './styles'

const useStyles = makeStyles(styles)
const preventDefault = (event) => event.preventDefault()

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
            <Link
              href="https://github.com/eoscostarica/eosio-dashboard"
              onClick={preventDefault}
              style={{ textDecoration: 'none' }}
            >
              <div className={classes.sidebarFooterText}>
              {t('footer1')}
              </div>
              <div
                className={classes.sidebarFooterText}
                style={{ color: '#1E88E5', textDecoration: 'underline' }}
              >
                {t('footer2')}
              </div>
            </Link>
          </div>
      </div>

      <div className={classes.footerAlign}>
        <div className={classes.sidebarFooter}>
          <div className={classes.linkBadge}>
            {generalConfig.appVersion.split('-').pop()}
          </div>
        </div>
        <div>
          <List className={`${classes.footerMenuWrapper} ${classes.sidebarFooter}`}>
            {generalConfig.featBug.map((link, index) => (
              <ListItem className={classes.listItem} key={index}>
                <ListItemText
                  primary={
                    <a
                      href={link.src}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.text}
                    </a>
                  }
                />
              </ListItem>
            ))}
          </List>
        </div>
      </div>
    </div>
  )
}

export default Footer
