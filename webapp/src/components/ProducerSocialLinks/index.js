import React from 'react'
import PropTypes from 'prop-types'
import Link from '@mui/material/Link'
import LanguageIcon from '@mui/icons-material/Language'
import TwitterIcon from '@mui/icons-material/Twitter'
import YouTubeIcon from '@mui/icons-material/YouTube'
import FacebookIcon from '@mui/icons-material/Facebook'
import GitHubIcon from '@mui/icons-material/GitHub'
import RedditIcon from '@mui/icons-material/Reddit'
import TelegramIcon from '@mui/icons-material/Telegram'
import Typography from '@mui/material/Typography'

const prefix = {
  hive: 'https://hive.blog/@',
  twitter: 'https://twitter.com/',
  youtube: 'https://youtube.com/',
  facebook: 'https://facebook.com/',
  github: 'https://github.com/',
  reddit: 'https://www.reddit.com/user/',
  keybase: 'https://keybase.io/',
  telegram: 'https://t.me/',
  wechat: 'https://wechat.com/',
  steemit: 'https://steemit.com/@',
  discord: 'https://discord/',
  medium: 'https://medium.com/@',
}

const icons = {
  twitter: <TwitterIcon />,
  youtube: <YouTubeIcon />,
  facebook: <FacebookIcon />,
  github: <GitHubIcon />,
  reddit: <RedditIcon />,
  telegram: <TelegramIcon />,
}

const ProducerSocialLinks = ({ items, message }) => {
  const itemsArray = Object.keys(items).filter((key) => !!items[key])

  if (!itemsArray?.length) return <Typography>{message}</Typography>

  return itemsArray.map((key, i) => (
    <Link
      key={`social-link${i}`}
      href={`${prefix[key] ?? 'https://' + key + '/'}${items[key]}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {icons[key] || <LanguageIcon />} {key}
    </Link>
  ))
}

ProducerSocialLinks.propTypes = {
  items: PropTypes.object,
  message: PropTypes.string,
}

export default ProducerSocialLinks
