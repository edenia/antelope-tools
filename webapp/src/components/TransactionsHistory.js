/* eslint camelcase: 0 */
import React, { memo, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import LaunchIcon from '@material-ui/icons/Launch'
import { useSubscription } from '@apollo/react-hooks'

import { BLOCK_TRANSACTIONS_HISTORY } from '../gql'
import { formatWithThousandSeparator, getBlockNumUrl } from '../utils'
import { generalConfig } from '../config'

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

const TransactionsHistory = ({ t, classes }) => {
  const { data, loading } = useSubscription(BLOCK_TRANSACTIONS_HISTORY)
  const [allTimeHigh, setallTimeHigh] = useState({})

  useEffect(() => {
    if (data?.stats?.[0]?.tps_all_time_high?.blocks?.length) {
      const result = data.stats[0].tps_all_time_high.blocks.reduce(
        (prev, current) => {
          return {
            tps: {
              value:
                prev.value > current.transactions_count
                  ? prev.value
                  : current.transactions_count,
              link: getBlockNumUrl(
                prev.value > current.transactions_count
                  ? prev.link
                  : current.block_num
              )
            },
            cpu: {
              value: formatWithThousandSeparator(
                prev.value > current.cpu_usage_percent
                  ? prev.value
                  : current.cpu_usage_percent * 100,
                1
              ),
              link: getBlockNumUrl(
                prev.value > current.cpu_usage_percent
                  ? prev.link
                  : current.block_num
              )
            }
          }
        },
        {
          tps: {
            value: 0,
            link: ''
          },
          cpu: {
            value: 0,
            link: ''
          }
        }
      )

      setallTimeHigh(result)
    }
  }, [data])

  if (!generalConfig.historyEnabled)
    return (
      <Grid item xs={12} sm={4} lg={3}>
        <Card>
          <CardContent className={classes.cards}>
            <Typography>{`${t('uniqueLocations')}`}</Typography>
            <BodyGraphValue
              value={data?.stats?.[0]?.unique_locations?.count || 0}
              loading={loading}
            />
          </CardContent>
        </Card>
      </Grid>
    )

  return (
    <>
      <Grid item xs={12} sm={4} lg={3}>
        <Card>
          <CardContent className={classes.cards}>
            <Typography>{t('tpsAllTimeHigh')}</Typography>
            <BodyGraphValue
              value={allTimeHigh?.tps?.value}
              loading={loading}
              classes={classes}
              href={allTimeHigh?.tps?.link}
            />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={4} lg={3}>
        <Card>
          <CardContent className={classes.cards}>
            <Typography>{t('networkUtilizationAllTimeHigh')}</Typography>
            <BodyGraphValue
              value={`${allTimeHigh?.cpu?.value}%`}
              classes={classes}
              href={allTimeHigh?.cpu?.link}
              loading={loading}
            />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={4} lg={3}>
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
      </Grid>

      <Grid item xs={12} sm={4} lg={3}>
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
      </Grid>

      <Grid item xs={12} sm={4} lg={3}>
        <Card>
          <CardContent className={classes.cards}>
            <Typography>{`${t('transactions')} ${t(
              'dailyAverage'
            )}`}</Typography>
            <BodyGraphValue
              value={formatWithThousandSeparator(
                data?.stats?.[0]?.average_daily_transactions_in_last_week || 0
              )}
              loading={loading}
            />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={4} lg={3}>
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
      </Grid>

      <Grid item xs={12} sm={4} lg={3}>
        <Card>
          <CardContent className={classes.cards}>
            <Typography>{`${t('uniqueLocations')}`}</Typography>
            <BodyGraphValue
              value={data?.stats?.[0]?.unique_locations?.count || 0}
              loading={loading}
            />
          </CardContent>
        </Card>
      </Grid>
    </>
  )
}

TransactionsHistory.propTypes = {
  t: PropTypes.func,
  classes: PropTypes.object
}

TransactionsHistory.defaultProps = {
  t: (text) => text,
  classes: {}
}

export default memo(TransactionsHistory)
