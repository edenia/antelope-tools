import React from 'react'
import Typography from '@mui/material/Typography'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

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
    <Card className={classes.cardShadow}>
      <CardContent>
        <div className={classes.mainText}>
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
              {t('body1.paragraph1')}
            </Typography>
            <Typography component="h2" variant="h4">
              {t('subtitle2')}
            </Typography>
            <Typography variant="body2" paragraph>
              {t('body2.paragraph1', { networkName: networkNameLabel })}
            </Typography>
            <Typography
              component="h2"
              variant="h4"
            >
              {t('subtitle3')}
            </Typography>
            {eosConfig.networkName !== 'lacchain' ? (
              <>
                <Typography variant="body2" paragraph>
                  {t('body3.paragraph1Text1')}{' '}
                  <RouterLink to="/accounts?account=eosio&table=producers">
                    eosio
                  </RouterLink>
                  {t('body3.paragraph1Text2')}{' '}
                  <a
                    href="https://github.com/eosrio/bp-info-standard"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t('standard')}.
                  </a>
                </Typography>

                <Typography variant="body2" paragraph>
                  {t('body3.paragraph2')}
                </Typography>
                <Typography variant="body2" paragraph>
                  {t('body3.paragraph3')}
                </Typography>
                <Typography variant="body2" paragraph>
                  {t('body3.paragraph4Text1')}{' '}
                  <a
                    href="https://edenia.com/chains.json"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://edenia.com/chains.json
                  </a>{' '}
                  {t('body3.paragraph4Text2')}{' '}
                  <a
                    href="https://edenia.com/bp.json"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://edenia.com/bp.json
                  </a>
                  {eosConfig.networkName !== 'mainnet' &&
                    t('body3.paragraph4Text3')}
                  .
                </Typography>
              </>
            ) : (
              <Typography variant="body2" paragraph>
                {t('body3.paragraph1Text1')}{' '}
                <RouterLink to="/accounts?account=eosio&table=entity">
                  eosio
                </RouterLink>
                .
              </Typography>
            )}
            <Typography variant="body2" paragraph>
              {t('body3.paragraph5')}
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default About
