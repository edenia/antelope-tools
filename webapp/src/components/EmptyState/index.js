import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import Link from '@mui/material/Link'

import styles from './styles'

const useStyles = makeStyles(styles)

const EmptyState = () => {
  const classes = useStyles()
  const { t } = useTranslation('producerCardComponent')

  return (
    <div className={classes.emptyState}>
      <img
        className={classes.imgError}
        src="/empty-states/Error.webp"
        loading="lazy"
        alt=""
      />
      <span>{t('emptyState')}</span>
      <Link
        component={RouterLink}
        to="/undiscoverable-bps"
        variant="contained"
        color="secondary"
        mt={2}
      >
        {t('viewList')}
      </Link>
    </div>
  )
}

export default EmptyState
