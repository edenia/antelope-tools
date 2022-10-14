import React from 'react'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import moment from 'moment'

const EndpointInfo = ({ endpoint }) => {
  const { t } = useTranslation('endpointInfoComponent')

  return (
    <>
      <Typography>
        {t('status')}: {endpoint.response?.status || t('error')}
      </Typography>
      <Typography>
        {t('response')}:{' '}
        {t(endpoint.response?.statusText || 'noResponse')}
      </Typography>
      {endpoint.response?.status === 200 && (
        <>
          <Typography>{t('headBlockTime')}</Typography>
          {moment(endpoint.head_block_time).format('lll') || 'N/A'}
        </>
      )}
      <Typography>{t('updatedAt')}</Typography>
      {moment(endpoint.updated_at).format('lll') || 'N/A'}
    </>
  )
}

export default EndpointInfo
