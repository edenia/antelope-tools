import React from 'react'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import Button from '@mui/material/Button'

import LocaleLink from 'components/LocaleLink'

import styles from './styles'

const useStyles = makeStyles(styles)

const EmptyState = ({ isNonCompliant }) => {
  const classes = useStyles()
  const { t } = useTranslation('producerCardComponent')

  return (
    <div className={`${classes.emptyStateContainer} ${classes.emptyState}`}>
      <img
        className={classes.imgError}
        src="/empty-states/Error.webp"
        loading="lazy"
        alt=""
      />
      <span>{t('emptyState')}</span>
      {isNonCompliant && (
        <Button
          component={LocaleLink}
          to="/undiscoverable-bps"
          variant="contained"
          color="primary"
          mt={2}
        >
          {t('viewList')}
        </Button>
      )}
    </div>
  )
}

export default EmptyState
