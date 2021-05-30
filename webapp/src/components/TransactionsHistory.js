/* eslint camelcase: 0 */
import React, { memo } from 'react'
import PropTypes from 'prop-types'
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import { useSubscription } from '@apollo/react-hooks'

import { BLOCK_TRANSACTIONS_HISTORY } from '../gql'
import { formatWithThousandSeparator, getBlockNumUrl } from '../utils'

const BodyGraphValue = ({ loading, value }) => {
  if (loading) return <LinearProgress />

  if (typeof value !== 'number') {
    return <>{value}</>
  }

  return (
    <Typography component="p" variant="h6">
      {value}
    </Typography>
  )
}

BodyGraphValue.propTypes = {
  loading: PropTypes.bool,
  value: PropTypes.any
}

BodyGraphValue.defaultProps = {
  value: 0,
  loading: false
}

const TransactionsHistory = ({ t, classes }) => {
  const { data, loading } = useSubscription(BLOCK_TRANSACTIONS_HISTORY)

  return (
    <>
      <Grid item xs={12} sm={4} lg={3}>
        <Card>
          <CardContent className={classes.cards}>
            <Typography>{t('tpsAllTimeHigh')}</Typography>
            <BodyGraphValue
              value={
                <Typography component="p" variant="h6">
                  {data?.stats?.[0]?.tps_all_time_high?.transactions_count || 0}
                </Typography>
              }
              loading={loading}
            />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={4} lg={3}>
        <Card>
          <CardContent className={classes.cards}>
            <Typography>{t('networkUtilizationAllTimeHigh')}</Typography>
            <BodyGraphValue
              value={
                <Typography
                  className={classes.cardLink}
                  component="p"
                  variant="h6"
                >
                  {data?.stats?.[0]?.tps_all_time_high?.blocks?.map(
                    (block, index) => (
                      <>
                        <a
                          href={getBlockNumUrl(block.block_num)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {block.block_num}
                        </a>{' '}
                        {t('cpu')}:{' '}
                        {formatWithThousandSeparator(
                          block.cpu_usage_percent * 100,
                          4
                        )}
                        %
                        {index <
                        data?.stats?.[0]?.tps_all_time_high?.blocks.length - 1
                          ? ', '
                          : ''}
                      </>
                    )
                  )}
                </Typography>
              }
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
