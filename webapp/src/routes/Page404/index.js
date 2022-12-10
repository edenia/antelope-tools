import React from 'react'
import { Button, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Link } from 'react-router-dom'
import Helmet from 'react-helmet'
import { useTranslation } from 'react-i18next'

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
        component={Link}
        to="/"
        variant="contained"
        color="secondary"
        mt={2}
      >
        {t('return')}
      </Button>
    </div>
  )
}

export default Page404
