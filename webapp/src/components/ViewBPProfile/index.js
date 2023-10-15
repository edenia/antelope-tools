import React from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import Button from '@mui/material/Button'

import { eosConfig } from '../../config'

import styles from './styles'

const useStyles = makeStyles(styles)

const ViewBPProfile = ({ producer }) => {
  const classes = useStyles()
  const { t } = useTranslation('producerCardComponent')

  return (
    <Button
      className={classes.button}
      component={Link}
      to={`/${eosConfig.producersRoute}/${producer?.owner}`}
      state={{ producer }}
      variant="contained"
      color="primary"
      mt={2}
    >
      {t('viewProfile')}
    </Button>
  )
}

export default ViewBPProfile
