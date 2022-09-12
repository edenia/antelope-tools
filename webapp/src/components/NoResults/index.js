import React  from 'react'
import { makeStyles } from '@mui/styles'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import { useTranslation } from 'react-i18next'

import styles from './styles'

const useStyles = makeStyles(styles)

const NoResults = () => {
  const classes = useStyles()
  const { t } = useTranslation('noResultsComponent')

  return (
    <Card className={classes.root}>
      <CardHeader title={t('noResultsFound')} />
    </Card>
  )
}

export default NoResults
