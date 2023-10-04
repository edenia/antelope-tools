import React from 'react'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'
import LaunchIcon from '@mui/icons-material/Launch'
import { useTranslation } from 'react-i18next'
import { eosConfig } from '../../config'

const ViewBPProfile = ({ producer }) => {
  const { t } = useTranslation('producerCardComponent')
  const route = eosConfig.networkName !== 'lacchain' ? 'block-producers' : 'entities'

  return (
    <Button
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
