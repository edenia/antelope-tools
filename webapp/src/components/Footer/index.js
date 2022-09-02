import React from 'react'
import { makeStyles } from '@mui/styles'
import {
  Grid,
  List,
  ListItemText,
  ListItem,
  Box,
  Link,
  Typography,
} from '@mui/material'

import { generalConfig } from '../../config'

import styles from './styles'

const useStyles = makeStyles(styles)
const preventDefault = (event) => event.preventDefault()

const Footer = () => {
  const classes = useStyles()

  return (
    <div className={classes.wrapper}>
      <Grid container item xs={12} sm={8} justifyContent='flex-start'>
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
      </Grid>

      <Grid
        container
        item
        xs={12}
        sm={8}
        className={classes.GridFooter}
        justifyContent='center'
      >
        <Box className={classes.sidebarFooter}>
          <Grid container>
            <Grid item>
              <Link
                href="https://github.com/eoscostarica/eosio-dashboard"
                onClick={preventDefault}
                style={{ textDecoration: 'none' }}
              >
                <Typography className={classes.sidebarFooterText}>
                  This app is Open Source
                </Typography>
                <Typography
                  className={classes.sidebarFooterText}
                  style={{ color: '#1E88E5', textDecoration: 'underline' }}
                >
                  find out how to contribute
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Grid>

      <Grid container item xs={12} sm={8} className={classes.footerAlign} justifyContent='flex-end'>
        <Box xs={12} sm={8} className={classes.GridFooter}>
          <Box className={classes.sidebarFooter} alignItems="center">
            <Box className={classes.linkBadge}>{generalConfig.appVersion.split('-').pop()}</Box>
          </Box>
        </Box>
        <Box container item xs={12} sm={8}>
          <List className={classes.footerMenuWrapper}>
            {generalConfig.privacyTerms.map((link, index) => (
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
        </Box>
      </Grid>
    </div>
  )
}

export default Footer
