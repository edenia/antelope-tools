import React from 'react'
import Typography from '@mui/material/Typography'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

import Logo from './Logo'
import styles from './styles'

const useStyles = makeStyles(styles)

const About = () => {
  const classes = useStyles()
  const { t } = useTranslation('aboutRoute')

  return (
    <Card className={classes.cardShadow}>
      <CardContent>
        <div className={classes.mainText}>
          <div>
            <div className={classes.boxInfo}>
              <Typography variant="body2" align="justify" paragraph>
                {t('body.paragraph1')}
              </Typography>
            </div>

            <div className={classes.boxInfo}>
              <Typography variant="h4">{t('subtitle1')}</Typography>
              <Typography variant="body2" align="justify" paragraph>
                {t('body1.paragraph1')}
              </Typography>
            </div>

            <div className={classes.boxInfo}>
              <Typography variant="h4">{t('subtitle2')}</Typography>
              <Typography variant="body2" align="justify" paragraph>
                {t('body2.paragraph1')}
              </Typography>
            </div>

            <div className={classes.boxInfo}>
              <Typography variant="h4">{t('subtitle3')}</Typography>
              <Typography variant="body2" align="justify" paragraph>
                {t('body3.paragraph1')}
                <a
                  href="https://eoscostarica.io/bp.json"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('bpjsonexample')}
                </a>
              </Typography>
              <Typography variant="body2" align="justify" paragraph>
                {t('body3.paragraph2')}
              </Typography>
            </div>
          </div>

          <div>
            <Logo className={classes.logo} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default About
