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

const order = {
  twitter: 0,
  github: 1,
  telegram: 2,
  medium: 3,
  youtube: 4,
  reddit: 5,
  wechat: 6,
  keybase: 7,
  steemit: 8,
  hive: 9,
  facebook: 10,
}

const getOrder = name => order[name] ?? Infinity

const ProducerSocialLinks = ({ items }) => {
  const itemsArray = Object.keys(items).sort((a,b) => getOrder(a) - getOrder(b)).flatMap((key) =>
    !!items[key]
      ? {
          name: key,
          url: `${prefix[key] ?? 'https://' + key + '/'}${items[key]}`,
        }
      : [],
  )

  return itemsArray.map((items, i) => (
    <Link
      key={`social-link${i}`}
      href={items.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={items.url}
    >
      {icons[items.name] || <LanguageIcon />}
    </Link>
  ))
}

ProducerSocialLinks.propTypes = {
  items: PropTypes.object,
}

export default memo(ProducerSocialLinks)
