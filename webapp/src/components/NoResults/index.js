import React  from 'react'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'

import styles from './styles'

const useStyles = makeStyles(styles)

const NoResults = () => {
  const classes = useStyles()
  const { t } = useTranslation('noResultsComponent')

  return (
    <div className={`simple-card ${classes.root}`}>
      <Typography variant="h4" component="p">{t('noResultsFound')}</Typography>
    </div>
  )
}

export default NoResults
