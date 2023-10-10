import React from 'react'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'

import styles from './styles'
import AlertSvg from 'components/Icons/Alert'

const useStyles = makeStyles(styles)

const EmptyStateRow = () => {
  const classes = useStyles()
  const { t } = useTranslation('producerCardComponent')

  return (
    <div className={`${classes.emptyStateContainer} ${classes.emptyStateRow}`}>
      <AlertSvg />
      <span>{t('emptyState')}</span>
    </div>
  )
}

export default EmptyStateRow
