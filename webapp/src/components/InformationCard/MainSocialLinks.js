import React from 'react'
import { makeStyles } from '@mui/styles'
import styles from './styles'
import TwitterIcon from '@mui/icons-material/Twitter'
import GitHubIcon from '@mui/icons-material/GitHub'
import TelegramIcon from '@mui/icons-material/Telegram'
import Link  from '@mui/material/Link'

const useStyles = makeStyles(styles)

const MainSocialLinks = ({ social }) => {
  const classes = useStyles()

  return (
    <div className={classes.socialLinksContainer}>
        <Link>
      <TwitterIcon />
        </Link>
      <Link>
      <GitHubIcon />
      </Link>
      <Link>
      <TelegramIcon />
      </Link>
    </div>
  )
}

export default MainSocialLinks
