import React from 'react'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'
import { useTranslation } from 'react-i18next'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'

import Logo from './Logo'
import styles from './styles'

const useStyles = makeStyles(styles)

const About = () => {
  const classes = useStyles()
  const { t } = useTranslation('aboutRoute')

  return (
    <Box>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={7}>
              <Box>
                <Box className={classes.boxInfo}>
                  <Typography variant="body2" align="justify" paragraph>
                    {t('body.paragraph1')}
                  </Typography>
                </Box>

                <Box className={classes.boxInfo}>
                  <Typography variant="h4">{t('subtitle1')}</Typography>
                  <Typography variant="body2" align="justify" paragraph>
                    {t('body1.paragraph1')}
                  </Typography>
                </Box>

                <Box className={classes.boxInfo}>
                  <Typography variant="h4">{t('subtitle2')}</Typography>
                  <Typography variant="body2" align="justify" paragraph>
                    {t('body2.paragraph1')}
                  </Typography>
                </Box>

                <Box className={classes.boxInfo}>
                  <Typography variant="h4">{t('subtitle3')}</Typography>
                  <Typography variant="body2" align="justify" paragraph>
                    {t('body3.paragraph1')}
                  </Typography>
                  <Typography variant="body2" align="justify" paragraph>
                    {t('body3.paragraph2')}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={5}>
              <Logo className={classes.logo} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}

export default About
