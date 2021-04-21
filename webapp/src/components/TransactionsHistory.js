import React, { memo } from 'react'
import PropTypes from 'prop-types'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import { useSubscription } from '@apollo/react-hooks'

import { BLOCK_TRANSACTIONS_HISTORY } from '../gql'
import { formatWithThousandSeparator } from '../utils'

const TransactionsHistory = ({ t }) => {
  const { data, loading } = useSubscription(BLOCK_TRANSACTIONS_HISTORY)

  return (
    <Card>
      <CardContent>
        <Typography component="p" variant="h6">
          {t('transactionsHistory')}
        </Typography>
        {loading && <LinearProgress />}
        {!loading && (
          <dl>
            <dt>
              <Typography component="p" variant="subtitle1">
                {t('lastHour')}:
              </Typography>
            </dt>
            <dd>
              <Typography component="p" variant="subtitle2">
                {formatWithThousandSeparator(
                  data?.stats?.[0]?.transactions_in_last_hour || 0
                )}
              </Typography>
            </dd>
            <dt>
              <Typography component="p" variant="subtitle1">
                {t('lastDay')}:
              </Typography>
            </dt>
            <dd>
              <Typography component="p" variant="subtitle2">
                {formatWithThousandSeparator(
                  data?.stats?.[0]?.transactions_in_last_day || 0
                )}
              </Typography>
            </dd>
            <dt>
              <Typography component="p" variant="subtitle1">
                {t('lastWeek')}:
              </Typography>
            </dt>
            <dd>
              <Typography component="p" variant="subtitle2">
                {formatWithThousandSeparator(
                  data?.stats?.[0]?.transactions_in_last_week || 0
                )}
              </Typography>
            </dd>
          </dl>
        )}
      </CardContent>
    </Card>
  )
}

TransactionsHistory.propTypes = {
  t: PropTypes.func
}

TransactionsHistory.defaultProps = {
  t: (text) => text
}

export default memo(TransactionsHistory)
