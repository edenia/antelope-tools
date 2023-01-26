/* eslint camelcase: 0 */
import React, { memo } from 'react'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import moment from 'moment'

import { eosConfig } from '../../config'
import { formatWithThousandSeparator } from '../../utils'
import HealthCheck from '../HealthCheck'
import isUrlValid from '../../utils/validate-url'
import EndpointInfo from 'components/EndpointsTable/EndpointInfo'
import VisitSite from 'components/VisitSite'

import styles from './styles'

const useStyles = makeStyles(styles)

const NonCompliantCard = ({ producer, stats }) => {
  const classes = useStyles()
  const { t } = useTranslation('producerCardComponent')

  const getHealthStatus = (healthCheck) => {
    return healthCheck.valid ? 'greenLight' : 'redLight'
  }

  const RowInfo = ({ title, value }) => {
    return (
      <div className={classes.flex}>
        <Typography variant="body1" className={classes.bold}>
          {title}:
        </Typography>
        <Typography variant="body1">{value}</Typography>
      </div>
    )
  }

  return (
    <>
      <div className={`${classes.content} ${classes.account}`}>
        <Typography variant="h3" component="span">
          {producer.owner}
        </Typography>
        <Typography variant="body1">{t('noInfo')}</Typography>
        <Button
          component={Link}
          state={{ owner: producer.owner, url: producer.url }}
          to="/bpjson"
          variant="contained"
          color="secondary"
          mt={2}
        >
          BP JSON generator
        </Button>
      </div>
      <div className={`${classes.content} ${classes.borderLine}`}>
        <Typography variant="overline">{t('info')}</Typography>
        <div className={classes.flex}>
          <Typography variant="body1" className={classes.bold}>
            {t('website')}:
          </Typography>
          {isUrlValid(producer.url) ? (
            <>
              <VisitSite title={t('openLink')} url={producer.url} />
              <HealthCheck status={getHealthStatus(producer.healthCheck)}>
                <EndpointInfo endpoint={producer.healthCheck} />
              </HealthCheck>
            </>
          ) : (
            <Typography variant="body1">{t('invalidUrl')}</Typography>
          )}
        </div>
        {isUrlValid(producer.url) && (
          <div className={classes.flex}>
            <Typography variant="body1" className={classes.bold}>
              {t('bpJson')}:
            </Typography>
            <VisitSite
              title={t('openLink')}
              url={producer.healthCheck.bpJsonUrl}
            />
          </div>
        )}
        <RowInfo
          title={`${t('votes')}`}
          value={`${formatWithThousandSeparator(producer.total_votes_eos, 0)}`}
        />
        <RowInfo
          title={`${t('lastClaimTime')}`}
          value={`${moment(producer.last_claim_time).format('ll')}`}
        />
      </div>
      <div
        className={`${classes.content} ${classes.borderLine} ${classes.hideRewards}`}
      >
        <Typography variant="overline">{t('dailyRewards')}</Typography>
        <RowInfo
          title={`${t('rewards')} (USD)`}
          value={`$${formatWithThousandSeparator(
            producer.total_rewards * stats.tokenPrice,
            0,
          )}`}
        />
        <RowInfo
          title={`${t('rewards')} (${eosConfig.tokenSymbol})`}
          value={`${formatWithThousandSeparator(producer.total_rewards, 0)}`}
        />
      </div>
    </>
  )
}

NonCompliantCard.propTypes = {}

export default memo(NonCompliantCard)
