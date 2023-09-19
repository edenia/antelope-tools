import React from 'react'
import Typography from '@mui/material/Typography'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import Link from '@mui/material/Link'
import HttpIcon from '@mui/icons-material/Http'
import TelegramIcon from '@mui/icons-material/Telegram'
import GitHubIcon from '@mui/icons-material/GitHub'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

import styles from './styles'

const useStyles = makeStyles(styles)

const Help = () => {
  const classes = useStyles()
  const { t } = useTranslation('helpRoute')

  return (
    <Card className={classes.cardShadow}>
      <CardContent>
        <Typography component="h2" variant="h4" className={classes.title}>
          {t('title')}
        </Typography>
        <Typography variant="body2" align="justify" paragraph>
          {t('paragraph')}
        </Typography>

        <div className={classes.boxLinks}>
          <GitHubIcon />
          <Link
            href="https://github.com/edenia"
            target="_blank"
            rel="noreferrer"
          >
            <Typography variant="body1">{t('githubEOSCR')}</Typography>
          </Link>
        </div>
        <div className={classes.boxLinks}>
          <TelegramIcon />
          <Link
            href="https://t.me/eoscr"
            target="_blank"
            rel="noreferrer"
          >
            <Typography variant="body1">{t('telegramChannel')}</Typography>
          </Link>
        </div>
        <div className={classes.boxLinks}>
          <HttpIcon />
          <Link
            href="https://edenia.com"
            target="_blank"
            rel="noreferrer"
          >
            <Typography variant="body1">{t('websiteEOSCR')}</Typography>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default Help
