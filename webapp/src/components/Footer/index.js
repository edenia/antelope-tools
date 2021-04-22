import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { Grid, List, ListItemText, ListItem, Box } from '@material-ui/core'

import { generalConfig } from '../../config'

import styles from './styles'

const useStyles = makeStyles(styles)

const Footer = () => {
  const classes = useStyles()

  return (
    <Box className={classes.wrapper}>
      <Grid container item xs={12}>
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
    </Box>
  )
}

export default Footer
