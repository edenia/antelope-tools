/* eslint camelcase: 0 */
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import { useSubscription } from '@apollo/client'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import 'flag-icon-css/css/flag-icons.css'

import { BLOCK_TRANSACTIONS_HISTORY } from '../../gql'
import ChipList from '../ChipList'
import CountryFlag from '../CountryFlag'
import ProducerHealthIndicators from '../ProducerHealthIndicators'
import LightIcon from '../HealthCheck/LightIcon'

import ShowInfo from './ShowInfo'
import styles from './styles'
import SupportedAPIs from './SupportedAPIs'

const useStyles = makeStyles(styles)

const NodesCard = ({ nodes }) => {
  const classes = useStyles()
  const { t } = useTranslation('nodeCardComponent')

  if (!nodes?.length) return

  const HealthStatus = ({ node }) => {
    const { data, loading } = useSubscription(BLOCK_TRANSACTIONS_HISTORY)
    const [missedBlocks, setMissedBlocks] = useState({})

    useEffect(() => {
      if (data?.stats?.length) {
        setMissedBlocks(data.stats[0].missed_blocks)
      }
    }, [data, loading])

    if (!node?.health_status?.length) return <></>

    return (
      <>
        <dt className={classes.bold}>{t('healthStatus')}</dt>
        <dd>
          {missedBlocks && `${t('missedBlocks')}: ${missedBlocks}`}
          <ProducerHealthIndicators producer={node} />
        </dd>
      </>
    )
  }

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

  const Endpoints = ({ node }) => {
    if (!node?.endpoints?.length) return <></>

    const totalEndpoints = node.endpoints.filter((e) => {
      return e.type !== 'p2p'
    })?.length
    const workingEndpoints = node.info?.endpoints?.count

    return (
      <>
        <dt className={`${classes.bold} ${classes.endpointsTitle}`}>
          {t('endpoints')}
          {!!totalEndpoints && (
            <div className={classes.lightIcon}>
              {`${workingEndpoints}/${totalEndpoints}`}
              <LightIcon
                status={getHealthStatus(totalEndpoints, workingEndpoints)}
              />
            </div>
          )}
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

  const Keys = ({ node }) => {
    if (!node?.node_info?.length || !node?.node_info[0]?.features?.keys)
      return <></>

    const keys = node.node_info[0].features.keys

    return (
      <>
        <dt className={classes.bold}>{t('keys')}</dt>
        {Object.keys(keys).map((key, i) => (
          <dd key={i}>
            <p className={classes.bold}>{key}:</p>
            <p className={classes.breakLine}>{keys[key]}</p>
          </dd>
        ))}
      </>
    )
  }

  const NodeInfo = ({ node }) => {
    return (
      <>
        <ShowInfo value={node?.full} title={t('isFull')} />
        <ShowInfo value={node?.node_info?.version} title={t('nodeVersion')} />
        <Endpoints node={node} />
        <ChipList
          title={t('features')}
          list={node?.node_info[0]?.features?.list}
        />
        {node.type.includes('query') && <SupportedAPIs node={node} />}
        <Keys node={node} />
        <HealthStatus node={node} />
      </>
    )
  }

  const capitalizeText = (text) => {
    if (!text) return

    return text.substring(0, 1).toUpperCase() + text.substring(1, text.length)
  }

  const getType = (node) => {
    if (!node?.type.length) return ''

    const type = node.type
      .map((nodeType) => {
        return capitalizeText(nodeType)
      })
      .join(', ')

    return type
  }

  const Location = ({ location }) => {
    return (
      <>
        <span className={classes.country}>{location?.name || 'N/A'}</span>
        <CountryFlag code={location?.country} />
      </>
    )
  }

  const showLocations = (node) => {
    if (node?.locations?.length) {
      return (
        <>
          {node.locations.map((location, index) => (
            <div
              key={`location-${location?.name}-${node?.type?.join()}-${index}`}
            >
              <Location location={location} />
            </div>
          ))}
        </>
      )
    }

    return <Location location={node.location} />
  }

  return (
    <div className={classes.nodesWrapper}>
      <div className={classes.nodesContainer}>
        {(nodes || []).map((node, index) => (
          <div key={`node-${index}`} className={classes.nodes}>
            <CardHeader
              className={classes.cardHeader}
              title={getType(node) || ''}
              subheader={showLocations(node)}
            />
            <CardContent className={classes.content}>
              <NodeInfo node={node} />
            </CardContent>
          </div>
        ))}
      </div>
    </div>
  )
}

NodesCard.propTypes = {
  nodes: PropTypes.array,
}
export default NodesCard
