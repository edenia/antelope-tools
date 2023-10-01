import React from 'react'
import Typography from '@mui/material/Typography'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import Link from '@mui/material/Link'
import HttpIcon from '@mui/icons-material/Http'
import TelegramIcon from '@mui/icons-material/Telegram'
import GitHubIcon from '@mui/icons-material/GitHub'
import { Link as RouterLink } from 'react-router-dom'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

import { eosConfig } from '../../config'

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
        <Typography component="h2" variant="h4">
          {t('subtitle3')}
        </Typography>
        {eosConfig.networkName !== 'lacchain' ? (
          <>
            <Typography variant="body2" paragraph>
              {t('body3.paragraph1Text1')}{' '}
              <RouterLink to="/accounts?account=eosio&table=producers">
                eosio
              </RouterLink>
              {' '}{t('body3.eosioAccount')} {t('body3.paragraph1Text2')}{' '}
              <a
                href="https://github.com/eosrio/bp-info-standard"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('standard')}
              </a>{'.'}
            </Typography>
          </>
        ) : (
          <Typography variant="body2" paragraph>
            {t('body3.paragraph1Text1')}{' '}
            <RouterLink to="/accounts?account=eosio&table=entity">
              eosio
            </RouterLink>
            {' '}{t('body3.eosioAccount')} {t('body3.paragraph1Text2')}{' '}
              <a
                href="https://github.com/eosrio/bp-info-standard"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('standard')}
              </a>{'.'}
          </Typography>
        )}
        <Typography component="h2" variant="h4" className={classes.title}>
          {t('title2')}
        </Typography>
        <Typography variant="body2" align="justify" paragraph>
          {t('paragraph2')}
        </Typography>
        <ol>
          <li><b>{t('bullet1Title')} </b>{t('bullet1')}</li>
          <li><b>{t('bullet2Title')} </b>{t('bullet2')}</li>
          <ul>
            <li>
            <b>{t('subBullet2Title')} </b>{t('subBullet2')}
              <a
                href="https://edenia.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://edenia.com
              </a>
              {t('subBullet2b')}
              <a
                href="https://edenia.com/chains.json"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://edenia.com/chains.json
              </a>
              {t('subBullet2c')}
              <a
                href="https://edenia.com/bp.json"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://edenia.com/bp.json
              </a>{'.'}
            </li>
          </ul>
          <li><b>{t('bullet3Title')} </b>{t('bullet3')}</li>
        </ol>
        <Typography component="h2" variant="h4" className={classes.title}>
          {t('title3')}
        </Typography>
        <Typography variant="body2" align="justify" paragraph>
          {t('paragraph3')}{' '}
          <a
                href="/bpjson"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('bpjsonGenerator')}
              </a>{'.'}
        </Typography>
        <Typography component="h2" variant="h4" className={classes.title}>
          {t('title4')}
        </Typography>
        <Typography variant="body2" align="justify" paragraph>
          {t('paragraph4')}
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
          <Link href="https://t.me/eoscr" target="_blank" rel="noreferrer">
            <Typography variant="body1">{t('telegramChannel')}</Typography>
          </Link>
        </div>
        <div className={classes.boxLinks}>
          <HttpIcon />
          <Link href="https://edenia.com" target="_blank" rel="noreferrer">
            <Typography variant="body1">{t('websiteEOSCR')}</Typography>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default Help
