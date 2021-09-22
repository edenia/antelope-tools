import React from 'react'
import PropTypes from 'prop-types'
import Link from '@material-ui/core/Link'
import LanguageIcon from '@material-ui/icons/Language'
import TwitterIcon from '@material-ui/icons/Twitter'
import YouTubeIcon from '@material-ui/icons/YouTube'
import FacebookIcon from '@material-ui/icons/Facebook'
import GitHubIcon from '@material-ui/icons/GitHub'
import RedditIcon from '@material-ui/icons/Reddit'
import TelegramIcon from '@material-ui/icons/Telegram'
import Typography from '@material-ui/core/Typography'

const prefix = {
  hive: 'https://hive.com/',
  twitter: 'https://twitter.com/',
  youtube: 'https://youtube.com/',
  facebook: 'https://facebook.com/',
  github: 'https://github.com/',
  reddit: 'https://reddit.com/',
  keybase: 'https://keybase.io/',
  telegram: 'https://t.me/',
  wechat: 'https://wechat.com/'
}

const icons = {
  twitter: <TwitterIcon />,
  youtube: <YouTubeIcon />,
  facebook: <FacebookIcon />,
  github: <GitHubIcon />,
  reddit: <RedditIcon />,
  telegram: <TelegramIcon />
}

const ProducerSocialLinks = ({ items, message }) => {
  const itemsArray = Object.keys(items)

  if (!itemsArray.length) return <Typography>{message}</Typography>

  return itemsArray
    .filter((key) => !!items[key])
    .map((key, i) => (
      <Link
        key={`social-link${i}`}
        href={`${prefix[key]}${items[key]}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {icons[key] || <LanguageIcon />} {key}
      </Link>
    ))
}

ProducerSocialLinks.propTypes = {
  items: PropTypes.object,
  message: PropTypes.string
}

export default ProducerSocialLinks
