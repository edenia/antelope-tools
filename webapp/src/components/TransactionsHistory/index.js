/* eslint camelcase: 0 */
import React, { memo, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import LaunchIcon from '@mui/icons-material/Launch'
import { useSubscription } from '@apollo/client'

import { BLOCK_TRANSACTIONS_HISTORY } from '../../gql'
import { formatWithThousandSeparator, getBlockNumUrl } from '../../utils'
import { generalConfig } from '../../config'

const BodyGraphValue = ({ loading, value, classes, href }) => {
  if (loading) return <LinearProgress />

  return (
    <Typography component="p" variant="h6">
      {value}
      {href && (
        <a href={href} target="_blank" rel="noopener noreferrer">
          <LaunchIcon className={classes.svgLink} color="primary" />
        </a>
      )}
    </Typography>
  )
}

BodyGraphValue.propTypes = {
  loading: PropTypes.bool,
  value: PropTypes.any,
  classes: PropTypes.object,
  href: PropTypes.string
}

BodyGraphValue.defaultProps = {
  value: 0,
  loading: false,
  classes: {}
}

const TransactionsHistory = ({ t, classes, nodesChildren }) => {
  const { data, loading } = useSubscription(BLOCK_TRANSACTIONS_HISTORY)
  const [
    blockWithHighestTransactionsCount,
    setBlockWithHighestTransactionsCount
  ] = useState({})

  useEffect(() => {
    if (!data?.stats?.[0]?.tps_all_time_high?.blocks?.length) {
      return
    }

    const blockWithHighestTransactionsCount =
      data.stats[0].tps_all_time_high.blocks.sort((first, second) =>
        first.transactions_count > second.transactions_count ? -1 : 1
      )[0]
    setBlockWithHighestTransactionsCount(blockWithHighestTransactionsCount)
  }, [data])

  if (!generalConfig.historyEnabled)
    return (
      <>
        {nodesChildren && nodesChildren}
        <div className={classes.cardGrow}>
          <Card className={classes.cardShadow}>
            <CardContent className={classes.cards}>
              <Typography>{`${t('uniqueLocations')}`}</Typography>
              <BodyGraphValue
                value={data?.stats?.[0]?.unique_locations?.count || 0}
                loading={loading}
              />
            </CardContent>
          </Card>
        </div>
      </>
    )

  return (
    <div>
      <div className={classes.cardGrow}>
        <Card>
          <CardContent className={classes.cards}>
            <Typography>{t('tpsAllTimeHigh')}</Typography>
            <BodyGraphValue
              value={data?.stats[0]?.tps_all_time_high?.transactions_count}
              loading={loading}
              classes={classes}
              href={getBlockNumUrl(blockWithHighestTransactionsCount.block_num)}
            />
          </CardContent>
        </Card>
      </div>

      <div className={classes.cardGrow}>
        <Card>
          <CardContent className={classes.cards}>
            <Typography>{t('networkUtilizationAllTimeHigh')}</Typography>
            <BodyGraphValue
              value={`${formatWithThousandSeparator(
                blockWithHighestTransactionsCount.cpu_usage_percent * 100 || 0,
                2
              )}%`}
              classes={classes}
              href={getBlockNumUrl(blockWithHighestTransactionsCount.block_num)}
              loading={loading}
            />
          </CardContent>
        </Card>
      </div>

      <div className={classes.cardGrow}>
        <Card>
          <CardContent className={classes.cards}>
            <Typography>{`${t('transactions')} ${t('lastHour')}`}</Typography>
            <BodyGraphValue
              value={formatWithThousandSeparator(
                data?.stats?.[0]?.transactions_in_last_hour || 0
              )}
              loading={loading}
            />
          </CardContent>
        </Card>
      </div>

      <div className={classes.cardGrow}>
        <Card>
          <CardContent className={classes.cards}>
            <Typography>{`${t('transactions')} ${t('lastDay')}`}</Typography>
            <BodyGraphValue
              value={formatWithThousandSeparator(
                data?.stats?.[0]?.transactions_in_last_day || 0
              )}
              loading={loading}
            />
          </CardContent>
        </Card>
      </div>

      <div className={classes.cardGrow}>
        <Card>
          <CardContent className={classes.cards}>
            <Typography>{`${t('transactions')} ${t(
              'dailyAverage'
            )}`}</Typography>
            <BodyGraphValue
              value={formatWithThousandSeparator(
                data?.stats?.[0]?.average_daily_transactions_in_last_week || 0,
                0
              )}
              loading={loading}
            />
          </CardContent>
        </Card>
      </div>

      <div className={classes.cardGrow}>
        <Card>
          <CardContent className={classes.cards}>
            <Typography>{`${t('transactions')} ${t('lastWeek')}`}</Typography>
            <BodyGraphValue
              value={formatWithThousandSeparator(
                data?.stats?.[0]?.transactions_in_last_week || 0
              )}
              loading={loading}
            />
          </CardContent>
        </Card>
      </div>
      {nodesChildren && nodesChildren}
      <div className={classes.cardow}>
        <Card>
          <CardContent className={classes.cards}>
            <Typography>{`${t('uniqueLocations')}`}</Typography>
            <BodyGraphValue
              value={data?.stats?.[0]?.unique_locations?.count || 0}
              loading={loading}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

TransactionsHistory.propTypes = {
  t: PropTypes.func,
  classes: PropTypes.object,
  nodesChildren: PropTypes.node
}

TransactionsHistory.defaultProps = {
  t: (text) => text,
  classes: {}
}

export default memo(TransactionsHistory)
