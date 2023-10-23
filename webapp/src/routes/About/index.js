import React from 'react'
import Typography from '@mui/material/Typography'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import Link from '@mui/material/Link'

import { eosConfig } from '../../config'

import Logo from './Logo'
import styles from './styles'

const useStyles = makeStyles(styles)

const About = () => {
  const classes = useStyles()
  const { t } = useTranslation('aboutRoute')
  const networkNameLabel = (
    eosConfig.networkName !== 'lacchain' ? eosConfig.networkLabel : 'EOS'
  )
    .replace(' Mainnet', '')
    .replace(' Testnet', '')

  return (
    <Card className={classes.mainText}>
      <div className={classes.logoContainer}>
        <Logo className={classes.logo} />
      </div>
      <div className={classes.boxInfo}>
        <Typography variant="body2" paragraph>
          {t('body.paragraph1', { networkName: networkNameLabel })}
        </Typography>
        <Typography component="h2" variant="h4">
          {t('subtitle1')}
        </Typography>
        <Typography variant="body2" paragraph>
          <Link
            href="https://edenia.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('body1.edenia')}
          </Link>{' '}
          {t('body1.paragraph1')}
        </Typography>
        <Typography component="h2" variant="h4">
          {t('subtitle2')}
        </Typography>
        <Typography variant="body2" paragraph>
          {t('body2.paragraph1')}
        </Typography>
        <Typography component="h2" variant="h4">
          {t('subtitle3')}
        </Typography>
        <Typography variant="body2" paragraph>
          {t('body3.paragraph1', { networkName: networkNameLabel })}
        </Typography>
        <Typography component="h2" variant="h4">
          {t('subtitle4')}
        </Typography>
        <Typography variant="body2" paragraph>
          {t('body4.paragraph1')}
        </Typography>
        <Typography component="h2" variant="h4">
          {t('subtitle5')}
        </Typography>
        <Typography variant="body2" paragraph>
          {t('body5.paragraph1')}{' '}
          <Link
            href="https://pomelo.io/grants/eosiodashboa"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('body5.pomelo')}
          </Link>
          {t('body5.paragraph2')}
        </Typography>
        <Typography component="h2" variant="h4">
          {t('subtitle6')}
        </Typography>
        <Typography variant="body2" paragraph>
          {t('body6.paragraph1')}
          <Link
            href="https://github.com/edenia/antelope-tools"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('body6.github')}
          </Link>{' '}
          {t('body6.paragraph2')}
          <Link
            href="https://t.me/eoscr"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('body6.telegram')}
          </Link>
          {'. '}
          {t('body6.paragraph3')}
        </Typography>
      </div>
    </Card>
  )
}

export default About
