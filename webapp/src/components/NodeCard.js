/* eslint camelcase: 0 */
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import { useQuery } from '@apollo/client'
import 'flag-icon-css/css/flag-icon.min.css'

import { generalConfig } from '../config'
import { onImgError } from '../utils'
import { NODE_CPU_BENCHMARK } from '../gql'

import CountryFlag from './CountryFlag'
import ProducerHealthIndicators from './ProducerHealthIndicators'

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexFlow: 'column'
  },
  content: {
    flex: 1
  },
  avatar: {
    borderRadius: '100%',
    backgroundColor: theme.palette.primary.contrastText
  },
  dl: {
    marginTop: -16,
    marginBottom: -16
  },
  bold: {
    fontWeight: 'bold'
  },
  breakLine: {
    wordBreak: 'break-word'
  }
}))

const NodeCard = ({ producer, node }) => {
  const classes = useStyles()
  const { data: { cpu } = {} } = useQuery(NODE_CPU_BENCHMARK, {
    variables: { account: node?.name || producer.owner }
  })
  const { t } = useTranslation('nodeCardComponent')
  const [producerOrg, setProducerOrg] = useState({})

  const Endpoints = () => {
    return (
      <>
        {(node?.p2p_endpoint || node?.api_endpoint || node?.ssl_endpoint) && (
          <dt className={classes.bold}>{t('endpoints')}</dt>
        )}
        {node?.p2p_endpoint && (
          <dd>
            <span className={classes.bold}>P2P</span>: {node.p2p_endpoint}
          </dd>
        )}
        {node?.api_endpoint && (
          <dd>
            <span className={classes.bold}>API</span>: {node.api_endpoint}
          </dd>
        )}
        {node?.ssl_endpoint && (
          <dd>
            <span className={classes.bold}>SSL</span>: {node.ssl_endpoint}
          </dd>
        )}
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
        avatar={
          <img
            width="30px"
            height="30px"
            className={classes.avatar}
            src={
              producerOrg.branding?.logo_256 ||
              generalConfig.defaultProducerLogo
            }
            onError={onImgError(generalConfig.defaultProducerLogo)}
            alt="avatar"
          />
        }
        title={
          producerOrg.candidate_name ||
          producerOrg.organization_name ||
          producer.owner
        }
        subheader={
          <>
            <CountryFlag code={producerOrg.location?.country} />
            <span className={classes.country}>
              {producerOrg.location?.name || 'N/A'}
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
              <dd>{node?.node_type}</dd>
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
