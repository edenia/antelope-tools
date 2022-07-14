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
    <Box className={classes.wrapper} display="flex">
      <Grid container item xs={12} sm={8}>
        <List>
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
      <Grid container item xs={12} sm={4} className={classes.gridFooter}>
        <Box className={classes.sidebarFooter}>
          <Grid container spacing={2}>
            <Grid item>
              <Typography className={classes.sidebarFooterText} variant="body2">
                An open source project by
              </Typography>
              <Box className={classes.footerBoxLink}>
                <img
                  alt="edenia"
                  src="/edenia.png"
                  className={classes.footerImg}
                />
                <a
                  href="https://edenia.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Edenia
                </a>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Box>
  )
}

export default Footer
