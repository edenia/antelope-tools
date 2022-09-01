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
      <Grid container item xs={12} sm={8}>
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
        sm={4}
        className={classes.GridFooter}
        justifyContent="center"
      >
        <Box className={classes.sidebarFooter}>
          <Grid container spacing={2}>
            <Grid item>
              <Link
                href="https://github.com/eoscostarica/eosio-dashboard"
                onClick={preventDefault}
                style={{ textDecoration: 'none' }}
              >
                <Typography
                  className={classes.sidebarFooterText}
                  variant="body2"
                >
                  This app is Open Source
                </Typography>
                <Typography
                  className={classes.sidebarFooterText}
                  variant="body2"
                >
                  find out how to contribute
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Grid>

      <Grid container item xs={12} sm={8} justifyContent="flex-end">
        <List className={classes.footerMenuWrapper}>
          <Box className={classes.appVersion} justifyContent='center'>{generalConfig.appVersion}</Box>
          {generalConfig.privacyTerms.map((link, index) => (
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
    </div>
  )
}

export default Footer
