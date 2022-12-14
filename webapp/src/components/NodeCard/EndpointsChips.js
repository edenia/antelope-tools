import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import Typography from '@mui/material/Typography'
import moment from 'moment'

import ChipList from '../ChipList'
import HealthCheck from '../HealthCheck'

import styles from './styles'

const useStyles = makeStyles(styles)

const EndpointsChips = ({ node }) => {
  const classes = useStyles()
  const { t } = useTranslation('nodeCardComponent')

  if (!node?.endpoints?.length) return <></>

  const getHealthStatus = (totalEndpoints, workingEndpoints) => {
    switch (workingEndpoints) {
      case totalEndpoints:
        return 'greenLight'
      case 0:
        return 'redLight'
      default:
        return 'yellowLight'
    }
  }

  const getStatusMessage = (healthStatus, failingEndpoints) => {
    switch (healthStatus) {
      case 'greenLight':
        return t('allWorking')
      case 'redLight':
        return t('noneWorking')
      default:
        const beginning =
          failingEndpoints.length > 1
            ? t('endpointPlural')
            : t('endpointSingular')
        const end = failingEndpoints.join(', ').toUpperCase()

        return `${beginning} ${end}`
    }
  }

  const EndpointsInfo = ({ status }) => {
    const { t } = useTranslation('endpointInfoComponent')
    const { totalEndpoints, failingEndpoints, updatedAt } = status
    const workingEndpoints = totalEndpoints - failingEndpoints.length
    const healthStatus = getHealthStatus(totalEndpoints, workingEndpoints)

    return (
      <div className={classes.lightIcon}>
        {`${workingEndpoints}/${totalEndpoints}`}
        <HealthCheck status={healthStatus}>
          <Typography>{t('status')}</Typography>
          <Typography>
            {getStatusMessage(healthStatus, failingEndpoints)}
          </Typography>
          <Typography>{t('updatedAt')}</Typography>
          {moment(updatedAt).format('lll') || 'N/A'}
        </HealthCheck>
      </div>
    )
  }

  const defaultStatus = {
    totalEndpoints: 0,
    failingEndpoints: [],
    updatedAt: 'NA',
  }
  const status = node.endpoints.reduce((status, endpoint) => {
    if (endpoint?.type !== 'p2p') {
      if (endpoint?.response?.status !== 200) {
        status.failingEndpoints.push(endpoint.type)
      }

      status.totalEndpoints += 1
      status.updatedAt = endpoint.updated_at
    }

    return status
  }, defaultStatus)

  return (
    <>
      <dt className={`${classes.bold} ${classes.endpointsTitle}`}>
        {t('endpoints')}
        {!!status.totalEndpoints && <EndpointsInfo status={status} />}
      </dt>
      <ChipList
        list={node.endpoints.map(({ type, value }) => {
          return (
            <>
              <span>{type.toUpperCase()}</span>:{' '}
              <a href={value} target="_blank" rel="noopener noreferrer">
                {value || 'N/A'}
              </a>
            </>
          )
        })}
      />
    </>
  )
}

export default memo(EndpointsChips)
