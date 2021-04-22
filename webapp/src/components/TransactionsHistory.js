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
import { formatWithThousandSeparator } from '../utils'

const BodyGraphValue = ({ loading, value }) => {
  if (loading) return <LinearProgress />

  return (
    <Typography component="p" variant="h6">
      {value}
    </Typography>
  )
}

BodyGraphValue.propTypes = {
  loading: PropTypes.bool,
  value: PropTypes.number
}

BodyGraphValue.defaultProps = {
  value: 0,
  loading: false
}

const TransactionsHistory = ({ t }) => {
  const { data, loading } = useSubscription(BLOCK_TRANSACTIONS_HISTORY)

  return (
    <>
      <Grid item xs={12}>
        <Card>
          <CardContent>
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

      <Grid item xs={12}>
        <Card>
          <CardContent>
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

      <Grid item xs={12}>
        <Card>
          <CardContent>
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
  t: PropTypes.func
}

TransactionsHistory.defaultProps = {
  t: (text) => text
}

export default memo(TransactionsHistory)
