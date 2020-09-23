/* eslint camelcase: 0 */
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Link from '@material-ui/core/Link'
import moment from 'moment'
import 'flag-icon-css/css/flag-icon.min.css'

import { generalConfig } from '../config'
import { formatWithThousandSeparator, onImgError } from '../utils'

import CountryFlag from './CountryFlag'
import ProducerHealthIndicators from './ProducerHealthIndicators'
import UsageChart from './UsageChart'

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    height: '100%',
    display: 'flex',
    flexFlow: 'column'
  },
  content: {
    flex: 1
  },
  avatar: {
    width: '3em',
    height: '3em',
    borderRadius: '100%',
    backgroundColor: theme.palette.primary.contrastText
  },
  dl: {
    marginTop: -16,
    marginBottom: -16
  },
  dt: {
    fontWeight: 'bold'
  }
}))

const ProducerCard = ({ producer, rank }) => {
  const classes = useStyles()
  const { t } = useTranslation('producerSummary')
  const [apiEndpoints, setApiEndpoints] = useState([])
  const [p2pEndpoints, setP2pEndpoints] = useState([])

  const getApiEndpoints = (type) => (producer = {}) => {
    if (!producer?.bp_json?.nodes) {
      return []
    }

    return Object.keys(
      producer.bp_json.nodes.reduce((endpoints, node) => {
        let newEndpoints = {}

        if (node.api_endpoint && type === 'api') {
          newEndpoints = {
            ...newEndpoints,
            [node.api_endpoint]: true
          }
        }

        if (node.ssl_endpoint && type === 'api') {
          newEndpoints = {
            ...newEndpoints,
            [node.ssl_endpoint]: true
          }
        }

        if (node.p2p_endpoint && type === 'p2p') {
          newEndpoints = {
            ...newEndpoints,
            [node.p2p_endpoint]: true
          }
        }

        return {
          ...endpoints,
          ...newEndpoints
        }
      }, {})
    )
  }

  useEffect(() => {
    setApiEndpoints(getApiEndpoints('api')(producer))
    setP2pEndpoints(getApiEndpoints('p2p')(producer))
  }, [producer])

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <img
            className={classes.avatar}
            src={
              producer?.bp_json?.org?.branding?.logo_256 ||
              generalConfig.defaultProducerLogo
            }
            onError={onImgError(generalConfig.defaultProducerLogo)}
            alt="avatar"
          />
        }
        title={producer?.owner}
        subheader={
          <>
            <CountryFlag code={producer?.bp_json?.org?.location?.country} />
            <span className={classes.country}>
              {producer?.bp_json?.org?.location?.name || 'N/A'}
            </span>
          </>
        }
      />
      <CardContent className={classes.content}>
        <dl className={classes.dl}>
          {generalConfig.useVotes && (
            <>
              <dt className={classes.dt}>{t('rank')}:</dt>
              <dd>#{rank}</dd>
            </>
          )}

          {producer.url && (
            <>
              <dt className={classes.dt}>{t('website')}:</dt>
              <dd>
                <Link
                  href={producer?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {producer?.url}
                </Link>
              </dd>
            </>
          )}

          {producer.server_version_string && (
            <>
              <dt className={classes.dt}>{t('serverVersion')}:</dt>
              <dd>{producer.server_version_string}</dd>
            </>
          )}

          {producer.ping && (
            <>
              <dt className={classes.dt}>{t('pingFromCostaRica')}:</dt>
              <dd>{producer.ping}ms</dd>
            </>
          )}

          {generalConfig.useVotes && (
            <>
              <dt className={classes.dt}>{t('votes')}:</dt>
              <dd>
                {formatWithThousandSeparator(producer?.total_votes_eos, 2)}
              </dd>
            </>
          )}

          {generalConfig.useRewards && (
            <>
              <dt className={classes.dt}>{t('rewards')}:</dt>
              <dd>{formatWithThousandSeparator(producer?.total_rewards, 2)}</dd>
            </>
          )}

          {apiEndpoints.length > 0 && (
            <>
              <dt className={classes.dt}>{t('apiEndpoints')}:</dt>
              {apiEndpoints.map((url, i) => (
                <dd key={i}>{url}</dd>
              ))}
            </>
          )}

          {p2pEndpoints.length > 0 && (
            <>
              <dt className={classes.dt}>{t('p2pEndpoints')}:</dt>
              {p2pEndpoints.map((url, i) => (
                <dd key={i}>{url}</dd>
              ))}
            </>
          )}

          <dt className={classes.dt}>{t('missedBlocks')}</dt>
          <dd>{producer?.missed_blocks?.length}</dd>

          <dt className={classes.dt}>{t('lastTimeChecked')}</dt>
          <dd>
            {moment(new Date()).diff(moment(producer.updated_at), 'seconds')}
            {t('secondsAgo')}
          </dd>

          <dt className={classes.dt}>{t('healthStatus')}</dt>
          <dd>
            <ProducerHealthIndicators producer={producer} />
          </dd>

          {producer?.cpus?.length > 0 && (
            <>
              <dt className={classes.dt}>{t('cpuUsage')}</dt>
              <dd>
                <UsageChart items={producer.cpus} />
              </dd>
            </>
          )}
        </dl>
      </CardContent>
      <CardActions disableSpacing />
    </Card>
  )
}

ProducerCard.propTypes = {
  producer: PropTypes.any,
  rank: PropTypes.number
}
export default ProducerCard
