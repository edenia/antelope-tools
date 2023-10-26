import React from 'react'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'

import styles from './styles'

const useStyles = makeStyles(styles)

const NoResults = ({ translationScope }) => {
  const classes = useStyles()
  const { t } = useTranslation(translationScope)

  return (
    <Card className={classes.root}>
      <Typography variant="h4" component="p">
        {t('noResultsFound')}
      </Typography>
    </Card>
  )
}

NoResults.defaultProps = {
  translationScope: 'noResultsComponent',
}

export default NoResults
