import React, { memo } from 'react'
import PropTypes from 'prop-types'
import Link from '@mui/material/Link'
import LanguageIcon from '@mui/icons-material/Language'
import TwitterIcon from '@mui/icons-material/Twitter'
import YouTubeIcon from '@mui/icons-material/YouTube'
import FacebookIcon from '@mui/icons-material/Facebook'
import GitHubIcon from '@mui/icons-material/GitHub'
import RedditIcon from '@mui/icons-material/Reddit'
import TelegramIcon from '@mui/icons-material/Telegram'

const icons = {
  twitter: <TwitterIcon />,
  youtube: <YouTubeIcon />,
  facebook: <FacebookIcon />,
  github: <GitHubIcon />,
  reddit: <RedditIcon />,
  telegram: <TelegramIcon />,
}

const ProducerSocialLinks = ({ items }) => {
  return items.map((item, i) => (
    <Link
      key={`social-link${i}`}
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={item.url}
    >
      {icons[item.name] || <LanguageIcon />}
    </Link>
  ))
}

ProducerSocialLinks.propTypes = {
  items: PropTypes.object,
}

export default memo(ProducerSocialLinks)
