/* eslint camelcase: 0 */
import React from 'react'
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
import ProducerSocialLinks from './ProducerSocialLinks'

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
  },
  social: {
    '& a': {
      display: 'flex'
    },
    '& svg': {
      marginRight: theme.spacing(1)
    }
  }
}))

const ProducerCard = ({ producer, rank }) => {
  const classes = useStyles()
  const { t } = useTranslation('producerSummary')

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <img
            className={classes.avatar}
            src={
              producer.bp_json?.branding?.logo_256 ||
              generalConfig.defaultProducerLogo
            }
            onError={onImgError(generalConfig.defaultProducerLogo)}
            alt="avatar"
          />
        }
        title={
          producer.bp_json?.candidate_name ||
          producer.bp_json?.organization_name ||
          producer.owner
        }
        subheader={
          <>
            <CountryFlag code={producer.bp_json?.location?.country} />
            <span className={classes.country}>
              {producer.bp_json?.location?.name || 'N/A'}
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

          {producer.bp_json?.business_contact && (
            <>
              <dt className={classes.dt}>{t('businessContact')}:</dt>
              <dd>{producer.bp_json.business_contact}</dd>
            </>
          )}

          {producer.bp_json?.technical_contact && (
            <>
              <dt className={classes.dt}>{t('technicalContact')}:</dt>
              <dd>{producer.bp_json.technical_contact}</dd>
            </>
          )}

          {producer.bp_json?.email && (
            <>
              <dt className={classes.dt}>{t('email')}:</dt>
              <dd>
                <Link
                  href={`mailto:${producer.bp_json.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {producer.bp_json.email}
                </Link>
              </dd>
            </>
          )}

          {producer.bp_json?.website && (
            <>
              <dt className={classes.dt}>{t('website')}:</dt>
              <dd>
                <Link
                  href={producer.bp_json.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {producer.bp_json.website}
                </Link>
              </dd>
            </>
          )}

          {producer.bp_json?.social && (
            <>
              <dt className={classes.dt}>{t('social')}:</dt>
              <dd className={classes.social}>
                <ProducerSocialLinks items={producer.bp_json.social} />
              </dd>
            </>
          )}

          {producer.bp_json?.ownership_disclosure && (
            <>
              <dt className={classes.dt}>{t('ownershipDisclosure')}:</dt>
              <dd>
                <Link
                  href={producer.bp_json.ownership_disclosure}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {producer.bp_json.ownership_disclosure}
                </Link>
              </dd>
            </>
          )}

          {producer.bp_json?.chain_resources && (
            <>
              <dt className={classes.dt}>{t('chainResources')}:</dt>
              <dd>
                <Link
                  href={producer.bp_json?.chain_resources}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {producer.bp_json?.chain_resources}
                </Link>
              </dd>
            </>
          )}

          {producer.bp_json?.other_resources?.length > 0 && (
            <>
              <dt className={classes.dt}>{t('otherResources')}:</dt>
              {producer.bp_json.other_resources.map((url, i) => (
                <dd key={i}>
                  <Link href={url} target="_blank" rel="noopener noreferrer">
                    {url}
                  </Link>
                </dd>
              ))}
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
                {formatWithThousandSeparator(producer.total_votes_eos, 2)}
              </dd>
            </>
          )}

          {generalConfig.useRewards && (
            <>
              <dt className={classes.dt}>{t('rewards')}:</dt>
              <dd>{formatWithThousandSeparator(producer.total_rewards, 2)}</dd>
            </>
          )}

          <dt className={classes.dt}>{t('missedBlocks')}</dt>
          <dd>
            {(producer.missed_blocks || []).reduce(
              (result, current) => result + current.value,
              0
            )}
          </dd>

          <dt className={classes.dt}>{t('lastTimeChecked')}</dt>
          <dd>
            {moment(new Date()).diff(moment(producer.updated_at), 'seconds')}
            {t('secondsAgo')}
          </dd>

          <dt className={classes.dt}>{t('healthStatus')}</dt>
          <dd>
            <ProducerHealthIndicators producer={producer} />
          </dd>

          {producer.cpus?.length > 0 && (
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
