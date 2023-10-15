import React from 'react'
import { makeStyles } from '@mui/styles'
import TwitterIcon from '@mui/icons-material/Twitter'
import GitHubIcon from '@mui/icons-material/GitHub'
import TelegramIcon from '@mui/icons-material/Telegram'
import Link from '@mui/material/Link'

import styles from './styles'

const useStyles = makeStyles(styles)

const MainSocialLinks = ({ social, name }) => {
  const classes = useStyles()
  const socialMediaNames = ['twitter', 'github', 'telegram']
  const links = {}

  const icons = {
    twitter: <TwitterIcon />,
    github: <GitHubIcon />,
    telegram: <TelegramIcon />,
  }

  social.forEach((item, index) => {
    if (
      index > socialMediaNames.length ||
      !socialMediaNames.includes(item?.name)
    )
      return
    links[item?.name] = item.url
  })

  return (
    <div className={classes.socialLinksContainer}>
      {socialMediaNames.map((socialMedia, index) =>
        links[socialMedia] ? (
          <Link
            key={`${name}-${socialMedia}-${index}`}
            href={links[socialMedia]}
            target="_blank"
            rel="nofollow noopener noreferrer"
            aria-label={`${name} ${socialMedia}`}
          >
            {icons[socialMedia]}
          </Link>
        ) : (
          <span key={`${name}-${index}`}/>
        ),
      )}
    </div>
  )
}

export default MainSocialLinks
