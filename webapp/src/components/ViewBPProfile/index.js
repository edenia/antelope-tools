import React from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import Button from '@mui/material/Button'
import LaunchIcon from '@mui/icons-material/Launch'

import { eosConfig } from '../../config'

import styles from './styles'

const useStyles = makeStyles(styles)

const ViewBPProfile = ({ producer }) => {
  const classes = useStyles()
  const { t } = useTranslation('producerCardComponent')
  const route = eosConfig.networkName !== 'lacchain' ? 'block-producers' : 'entities'

  return (
    <Button
      className={classes.button}
      component={Link}
      to={`/${route}/${producer?.owner}`}
      state={{ producer }}
      variant="contained"
      color="secondary"
      mt={2}
      endIcon={<LaunchIcon/>}
    >
      {t('viewProfile')}
    </Button>
  )
}

export default ViewBPProfile
