import React from 'react'
import { Button, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import Helmet from 'react-helmet'
import { useTranslation } from 'react-i18next'

import LocaleLink from 'components/LocaleLink'

import styles from './styles'

const useStyles = makeStyles(styles)

const Page404 = () => {
  const classes = useStyles()
  const { t } = useTranslation('noFound')

  return (
    <div className={classes.wrapper}>
      <Helmet title="404 Error" />
      <Typography component="h1" variant="h1" align="center" gutterBottom>
        404
      </Typography>
      <Typography component="h2" variant="h5" align="center" gutterBottom>
        {t('subTitle')}
      </Typography>
      <Typography component="h2" variant="body1" align="center" gutterBottom>
        {t('message')}
      </Typography>

      <Button
        component={LocaleLink}
        to="/"
        variant="contained"
        color="primary"
        mt={2}
      >
        {t('return')}
      </Button>
    </div>
  )
}

export default Page404
