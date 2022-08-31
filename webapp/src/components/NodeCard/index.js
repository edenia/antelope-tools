/* eslint camelcase: 0 */
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import { useQuery } from '@apollo/client'
import 'flag-icon-css/css/flag-icons.css'

import { generalConfig } from '../../config'
import { onImgError } from '../../utils'
import isLogoValid from '../../utils/validate-image'
import { NODE_CPU_BENCHMARK } from '../../gql'

import CountryFlag from '../CountryFlag'
import ProducerHealthIndicators from '../ProducerHealthIndicators'

import styles from './styles'

const useStyles = makeStyles(styles)

const NodeCard = ({ producer, node }) => {
  const classes = useStyles()
  const { data: { cpu } = {} } = useQuery(NODE_CPU_BENCHMARK, {
    variables: { account: node?.name || producer.owner }
  })
  const { t } = useTranslation('nodeCardComponent')
  const [producerOrg, setProducerOrg] = useState({})

  const Avatar = () => {
    const logo = producerOrg.branding?.logo_256

    return (
      <img
        width="30px"
        height="30px"
        className={classes.avatar}
        src={
          isLogoValid(logo) ? logo : generalConfig.defaultProducerLogo
        }
        onError={onImgError(generalConfig.defaultProducerLogo)}
        alt="avatar"
      />
    )
  }

  const Endpoints = () => {
    const endpoints = [
      { key: 'p2p_endpoint', value: 'P2P' },
      { key: 'api_endpoint', value: 'API' },
      { key: 'ssl_endpoint', value: 'SSL' }
    ]

    return (
      <>
        {(node?.p2p_endpoint || node?.api_endpoint || node?.ssl_endpoint) && (
          <dt className={classes.bold}>{t('endpoints')}</dt>
        )}
        {endpoints.map(({ key, value }, index) => (node[key]?.length && (
          <dd key={`endpoint-${node[key]}-${value}-${index}`}>
            <span className={classes.bold}>{value}</span>: {node[key]}
          </dd>
        )))}
      </>
    )
  }
  const Keys = () => {
    if (!node?.keys) {
      return <></>
    }

    return (
      <>
        <dt className={classes.bold}>{t('keys')}</dt>
        {Object.keys(node.keys).map((key, i) => (
          <dd key={i}>
            <span className={classes.bold}>{key}</span>:{' '}
            <span className={classes.breakLine}>{node.keys[key]}</span>
          </dd>
        ))}
      </>
    )
  }
  const Features = () => {
    if (!node?.features) {
      return <></>
    }

    return (
      <>
        <dt className={classes.bold}>{t('features')}</dt>
        {node.features.map((feature, i) => (
          <dd key={i}>{feature}</dd>
        ))}
      </>
    )
  }
  const CpuBenchmark = () => {
    return (
      <>
        {cpu?.length > 0 && (
          <>
            <dt className={classes.bold}>{t('cpuBenchmark')}</dt>
            <dd>
              {(
                cpu.reduce((total, item) => total + item.usage, 0) / cpu.length
              ).toFixed(2)}
              µs
            </dd>
          </>
        )}
      </>
    )
  }
  const HealthStatus = () => {
    if (!node?.health_status?.length) {
      return <></>
    }

    return (
      <>
        <dt className={classes.bold}>{t('healthStatus')}</dt>
        <dd>
          <ProducerHealthIndicators producer={node} />
        </dd>
      </>
    )
  }

  useEffect(() => {
    setProducerOrg(producer.bp_json?.org || {})
  }, [producer])

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={<Avatar />}
        title={
          producerOrg.candidate_name ||
          producerOrg.organization_name ||
          producer.owner
        }
        subheader={
          <>
            <CountryFlag code={node.location?.country} />
            <span className={classes.country}>
              {node.location?.name || 'N/A'}
            </span>
          </>
        }
      />
      <CardContent className={classes.content}>
        <dl className={classes.dl}>
          {!node && (
            <>
              <dt className={classes.bold}>{t('emptyNode')}</dt>
            </>
          )}

          {node?.name && (
            <>
              <dt className={classes.bold}>{t('nodeName')}</dt>
              <dd>{node?.name}</dd>
            </>
          )}

          {node?.node_type && (
            <>
              <dt className={classes.bold}>{t('nodeType')}</dt>
              <dd>{node?.node_type.toString()}</dd>
            </>
          )}

          {node?.full && (
            <>
              <dt className={classes.bold}>{t('isFull')}</dt>
            </>
          )}

          {node?.server_version_string && (
            <>
              <dt className={classes.bold}>{t('nodeVersion')}</dt>
              <dd>{node?.server_version_string}</dd>
            </>
          )}

          <Features />
          <Endpoints />
          <Keys />
          <CpuBenchmark />
          <HealthStatus />
        </dl>
      </CardContent>
      <CardActions disableSpacing />
    </Card>
  )
}

NodeCard.propTypes = {
  producer: PropTypes.any,
  node: PropTypes.any
}
export default NodeCard
