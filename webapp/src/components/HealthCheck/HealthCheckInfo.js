import React from 'react'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import moment from 'moment'

const HealthCheckInfo = ({ healthCheck }) => {
  const { t } = useTranslation('endpointInfoComponent')

  return (
    <>
      <Typography>
        {t('status')}: {healthCheck.response?.status || t('error')}
      </Typography>
      <Typography>
        {t('response')}: {t(healthCheck.response?.statusText || 'noResponse')}
      </Typography>
      {healthCheck.head_block_time && healthCheck.response?.status === 200 && (
        <>
          <Typography>{t('headBlockTime')}</Typography>
          {moment(healthCheck.head_block_time).format('lll') || 'N/A'}
        </>
      )}
      <Typography>{t('updatedAt')}</Typography>
      {moment(healthCheck.updated_at).format('lll') || 'N/A'}
    </>
  )
}

export default HealthCheckInfo
