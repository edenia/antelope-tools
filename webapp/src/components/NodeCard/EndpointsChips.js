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

  const getHealthMessage = (total, listFailing) => {
    switch (total - listFailing.length) {
      case total:
        return t('allWorking')
      case 0:
        return t('noneWorking')
      default:
        const beginning = t('noResponding')
        const middle =
          listFailing.length > 1 ? t('endpointPlural') : t('endpointSingular')
        const end = listFailing.join(', ').toUpperCase()

        return `${beginning} ${middle} ${end}`
    }
  }

  const EndpointsInfo = ({ status }) => {
    const { t } = useTranslation('endpointInfoComponent')
    const { totalEndpoints, failingEndpoints, updatedAt } = status
    const workingEndpoints = totalEndpoints - failingEndpoints.length

    return (
      <div className={classes.lightIcon}>
        {`${workingEndpoints}/${totalEndpoints}`}
        <HealthCheck status={getHealthStatus(totalEndpoints, workingEndpoints)}>
          <>
            <Typography>{t('status')}</Typography>
            <Typography>
              {getHealthMessage(totalEndpoints, failingEndpoints)}
            </Typography>
            <Typography>{t('updatedAt')}</Typography>
            {moment(updatedAt).format('lll') || 'N/A'}
          </>
        </HealthCheck>
      </div>
    )
  }

  const status = node.endpoints.reduce(
    (status, endpoint) => {
      if (endpoint?.type !== 'p2p') {
        if (endpoint?.response?.status !== 200) {
          status.failingEndpoints.push(endpoint.type)
        }

        status.totalEndpoints += 1
        status.updatedAt = endpoint.updated_at
      }
      return status
    },
    { failingEndpoints: [], totalEndpoints: 0 },
  )

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
