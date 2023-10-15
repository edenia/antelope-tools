import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import Typography from '@mui/material/Typography'
import moment from 'moment'

import ChipList from '../ChipList'
import HealthCheck from '../HealthCheck'
import { generalConfig } from '../../config'

import styles from './styles'

const useStyles = makeStyles(styles)

const EndpointsChips = ({ node }) => {
  const classes = useStyles()
  const { t } = useTranslation('nodeCardComponent')
  const { healthLights } = generalConfig

  if (!node?.endpoints?.length) return <></>

  const getHealthStatus = (totalEndpoints, workingEndpoints) => {
    switch (workingEndpoints) {
      case totalEndpoints:
        return healthLights.greenLight
      case 0:
        return healthLights.redLight
      default:
        return healthLights.yellowLight
    }
  }

  const getStatusMessage = (healthStatus, failingEndpoints) => {
    switch (healthStatus) {
      case healthLights.greenLight:
        return t('allWorking')
      case healthLights.redLight:
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
    let healthStatus
    
    if(!status.isLoading) {
      healthStatus = getHealthStatus(totalEndpoints, workingEndpoints)
    }

    return (
      <div className={classes.lightIcon}>
        {healthStatus && (
          <span>{`${workingEndpoints}/${totalEndpoints}`}</span>
        )}
        <HealthCheck status={healthStatus}>
          <Typography>{t('status')}:</Typography>
          <Typography>
            {getStatusMessage(healthStatus, failingEndpoints)}
          </Typography>
          <Typography>{t('updatedAt')}:</Typography>
          {moment(updatedAt).format('lll') || 'N/A'}
        </HealthCheck>
      </div>
    )
  }

  const status = {
    totalEndpoints: 0,
    failingEndpoints: [],
    updatedAt: 'N/A',
    isLoading: false
  }

  for (const endpoint of node.endpoints){
    if (endpoint?.response?.status === undefined) {
      status.isLoading = true

      break
    }

    if (!endpoint?.response?.isWorking) {
      status.failingEndpoints.push(endpoint.type)
    }

    status.totalEndpoints += 1
    status.updatedAt = endpoint.updated_at
  }

  return (
    <>
      <span className={`${classes.bold} ${classes.endpointsTitle}`}>
        {t('endpoints')}
        {!!node.endpoints.length && <EndpointsInfo status={status} />}
      </span>
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
