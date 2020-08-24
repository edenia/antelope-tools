/* eslint camelcase: 0 */
import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/styles'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import Link from '@material-ui/core/Link'
import { useTranslation } from 'react-i18next'

import { formatWithThousandSeparator, countries } from '../utils'
import { generalConfig } from '../config'

const useStyles = makeStyles((theme) => ({
  popover: {
    padding: theme.spacing(2),
    paddingTop: 0
  },
  popoverItem: {
    fontWeight: 'bold',
    marginRight: 4
  },
  popoverClose: {
    textAlign: 'right',
    position: 'sticky',
    background: 'white',
    paddingTop: theme.spacing(2),

    top: 0
  },
  popoverCloseIcon: {
    cursor: 'pointer'
  },
  countryFlag: {
    marginRight: 4
  },
  logo: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    display: 'inline-block',
    width: '2em',
    height: '2em',
    borderRadius: '500rem'
  },
  capitalize: {
    textTransform: 'capitalize'
  },
  centerVertically: {
    display: 'flex',
    alignItems: 'center'
  },
  ul: {
    marginTop: 0,
    marginBottom: 0
  }
}))

const ProducerSummary = ({ producer, onClose }) => {
  const classes = useStyles()
  const { t } = useTranslation('producerSummary')

  const getApiEndpoints = (type) => (producer = {}) => {
    if (!producer.bp_json) {
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

  return (
    <div className={classes.popover}>
      <div className={classes.popoverClose}>
        <CloseIcon className={classes.popoverCloseIcon} onClick={onClose} />
      </div>
      <Typography>
        <span className={classes.popoverItem}>{t('account')}:</span>
        <Link
          href={
            generalConfig.eosRateLink
              ? `${generalConfig.eosRateLink}/block-producers/${producer?.owner}`
              : producer?.url
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          {producer?.owner}
        </Link>
      </Typography>
      {producer?.url && (
        <Typography>
          <span className={classes.popoverItem}>{t('website')}:</span>
          <span>
            <Link
              href={producer?.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {producer?.url}
            </Link>
          </span>
        </Typography>
      )}
      {generalConfig.useVotes && (
        <Typography>
          <span className={classes.popoverItem}>{t('votes')}:</span>
          <span>
            {formatWithThousandSeparator(producer?.total_votes_eos, 2)}
          </span>
        </Typography>
      )}
      {generalConfig.useVotes && (
        <Typography>
          <span className={classes.popoverItem}>{t('rewards')}:</span>
          <span>{formatWithThousandSeparator(producer?.total_rewards, 2)}</span>
        </Typography>
      )}
      <Typography>
        <span className={classes.popoverItem}>{t('country')}:</span>
        <span
          className={clsx(
            `flag-icon flag-icon-squared flag-icon-${producer.bp_json?.org?.location?.country?.toLocaleLowerCase()}`,
            classes.countryFlag
          )}
        />
        <span>{countries[producer.bp_json?.org.location.country]?.name}</span>
      </Typography>
      {generalConfig.eosRateLink && (
        <Typography>
          <span className={classes.popoverItem}>{t('eosRate')}:</span>
          <Link
            href={`${generalConfig.eosRateLink}/block-producers/${producer?.owner}`}
            target="_blank"
            rel="noopener noreferrer"
            className={classes.owner}
          >
            {`${generalConfig.eosRateLink}/block-producers/${producer?.owner}`}
          </Link>
        </Typography>
      )}
      <div>
        <Typography>
          <span className={classes.popoverItem}>{t('p2pEndpoints')}:</span>
        </Typography>
        <ul className={classes.ul}>
          {getApiEndpoints('p2p')(producer).map((url, i) => (
            <li key={i}>{url}</li>
          ))}
        </ul>
      </div>
      <div>
        <Typography>
          <span className={classes.popoverItem}>{t('apiEndpoints')}:</span>
        </Typography>
        <ul className={classes.ul}>
          {getApiEndpoints('api')(producer).map((url, i) => (
            <li key={i}>{url}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

ProducerSummary.propTypes = {
  producer: PropTypes.any,
  onClose: PropTypes.func
}

export default ProducerSummary
