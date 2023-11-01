/* eslint camelcase: 0 */
import React, { memo } from 'react'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import LanguageIcon from '@mui/icons-material/Language'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import moment from 'moment'

import { eosConfig, generalConfig } from '../../config'
import { formatWithThousandSeparator } from '../../utils'
import HealthCheck from '../HealthCheck'
import HealthCheckInfo from 'components/HealthCheck/HealthCheckInfo'
import isValidUrl from '../../utils/validate-url'
import VisitSite from 'components/VisitSite'

import styles from './styles'

const useStyles = makeStyles(styles)

const NonCompliantRow = ({ producer, tokenPrice }) => {
  const classes = useStyles()
  const { t } = useTranslation('producerCardComponent')
  const { healthLights } = generalConfig

  const getHealthStatus = healthCheck => {
    return healthCheck.valid ? healthLights.greenLight : healthLights.redLight
  }

  return (
    <>
      <TableCell align="center">
        <Typography variant="h3" component="p">{`${producer.rank}`}</Typography>
      </TableCell>
      <TableCell align="center">
        <Typography variant="h6" component="h2">
          {producer.owner}
        </Typography>
      </TableCell>
      {isValidUrl(producer.url) ? (
        <>
          <TableCell align="center">
            <div className={classes.websiteContainer}>
              <VisitSite
                title={t('openLink')}
                url={producer.url}
                Icon={LanguageIcon}
              />
              <HealthCheck status={getHealthStatus(producer.healthCheck)}>
                <HealthCheckInfo healthCheck={producer.healthCheck} />
              </HealthCheck>
            </div>
          </TableCell>
          <TableCell align="center">
            <VisitSite title={t('openLink')} url={producer.bp_json_url} />
          </TableCell>
        </>
      ) : (
        <TableCell align="center" colSpan={2}>
          <Typography variant="body1">{t('invalidUrl')}</Typography>
        </TableCell>
      )}
      <TableCell align="center">
        <Typography variant="body1">{`${formatWithThousandSeparator(
          producer.total_votes_eos,
          0,
        )}`}</Typography>
      </TableCell>
      <TableCell align="center">
        <Typography variant="body1">{`${moment(producer.last_claim_time).format(
          'll',
        )}`}</Typography>
      </TableCell>
      <TableCell align="center">
        <Typography variant="body1">{`${formatWithThousandSeparator(
          producer.total_rewards,
          0,
        )} ${eosConfig.tokenSymbol}`}</Typography>
        <Typography variant="body1">{`$${formatWithThousandSeparator(
          producer.total_rewards * tokenPrice,
          0,
        )} USD`}</Typography>
      </TableCell>
      <TableCell align="center">
        <Typography variant="body1">{`${formatWithThousandSeparator(
          producer.total_rewards * 365,
          0,
        )} ${eosConfig.tokenSymbol}`}</Typography>
        <Typography variant="body1">{`$${formatWithThousandSeparator(
          producer.total_rewards * 365 * tokenPrice,
          0,
        )} USD`}</Typography>
      </TableCell>
    </>
  )
}

NonCompliantRow.propTypes = {}

export default memo(NonCompliantRow)
