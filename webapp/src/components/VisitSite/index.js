import React from 'react'
import { makeStyles } from '@mui/styles'
import Tooltip from '@mui/material/Tooltip'
import LaunchIcon from '@mui/icons-material/Launch'

import styles from './styles'

const useStyles = makeStyles(styles)

const VisitSite = ({ title, url, Icon, placement = 'left' }) => {
  const classes = useStyles()

  return (
    <Tooltip title={title} arrow placement={placement}>
      <a
        href={url}
        target="_blank"
        rel="nofollow noopener noreferrer"
        className={classes.link}
        aria-label={url}
      >
        {Icon ? (
          <Icon className={classes.clickableIcon} />
        ) : (
          <LaunchIcon className={classes.clickableIcon} />
        )}
      </a>
    </Tooltip>
  )
}

export default VisitSite
