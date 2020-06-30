import React from 'react'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'
import { useTranslation } from 'react-i18next'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'

const useStyles = makeStyles((theme) => ({
  title: {
    marginBottom: theme.spacing(1),
    fontWeight: 400
  }
}))

const About = () => {
  const classes = useStyles()
  const { t } = useTranslation('about')

  return (
    <Box>
      <Grid container direction="column">
        <Grid item xs>
          <Grid container direction="column">
            <Typography variant="h1" className={classes.title}>
              {t('title')}
            </Typography>
            <Typography variant="h3">{t('subtitle1')}</Typography>
            <Typography variant="body2" align="justify" paragraph>
              {t('body1.paragraph1')}
            </Typography>
            <Typography variant="body2" align="justify" paragraph>
              {t('body1.paragraph2')}
            </Typography>
            <Typography variant="body2" align="justify" paragraph>
              {t('body1.paragraph3')}
            </Typography>
          </Grid>
        </Grid>

        <Grid item xs>
          <Grid container direction="column">
            <Typography variant="h3">{t('subtitle2')}</Typography>
            <Typography variant="body2" align="justify" paragraph>
              {t('body2.paragraph1')}
            </Typography>
            <Typography variant="body2" align="justify" paragraph>
              {t('body2.paragraph2')}
            </Typography>
            <Typography variant="body2" align="justify" paragraph>
              {t('body2.paragraph3')}
            </Typography>
          </Grid>
        </Grid>

        <Grid item xs>
          <Grid container direction="column">
            <Typography variant="h3">{t('subtitle3')}</Typography>
            <Typography variant="body2" align="justify" paragraph>
              {t('body3.paragraph1')}
            </Typography>
            <Typography variant="body2" align="justify" paragraph>
              {t('body3.paragraph2')}
            </Typography>
            <Typography variant="body2" align="justify" paragraph>
              {t('body3.paragraph3')}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}

export default About
