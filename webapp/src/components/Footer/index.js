import React from 'react'
import { makeStyles } from '@mui/styles'
import {
  Grid,
  List,
  ListItemText,
  ListItem,
  Box,
  Typography
} from '@mui/material'

import { generalConfig } from '../../config'

import styles from './styles'

const useStyles = makeStyles(styles)

const Footer = () => {
  const classes = useStyles()

  return (
    <div className={classes.wrapper}>
      <Grid container item xs={12} sm={4} className={classes.GridFooter} justifyContent="center">
        <Box className={classes.sidebarFooter}>
          <Grid container spacing={2}>
            <Grid item>
              <Typography className={classes.sidebarFooterText} variant="body2">An open source project </Typography>
              <Typography className={classes.sidebarFooterText} variant="body2">made with X by Edenia </Typography>
            </Grid>
          </Grid>
        </Box>
      </Grid>

      <Grid container item xs={12} sm={8} justifyContent="flex-end">
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
    </div>
  )
}

export default Footer
