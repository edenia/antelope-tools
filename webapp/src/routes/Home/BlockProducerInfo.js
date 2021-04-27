import React, { lazy, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useQuery } from '@apollo/react-hooks'
import PropTypes from 'prop-types'

import { formatWithThousandSeparator } from '../../utils'
import { NODES_QUERY } from '../../gql'

const Card = lazy(() => import('@material-ui/core/Card'))
const CardContent = lazy(() => import('@material-ui/core/CardContent'))
const Grid = lazy(() => import('@material-ui/core/Grid'))
const Box = lazy(() => import('@material-ui/core/Box'))
const Typography = lazy(() => import('@material-ui/core/Typography'))
const LinearProgress = lazy(() => import('@material-ui/core/LinearProgress'))
const ProducersChart = lazy(() => import('../../components/ProducersChart'))
const TransactionsHistory = lazy(() =>
  import('../../components/TransactionsHistory')
)

const BlockProducerInfo = ({ t, classes }) => {
  const { data: { loading, producers } = {} } = useQuery(NODES_QUERY)
  const scheduleInfo = useSelector((state) => state.eos.schedule)
  const info = useSelector((state) => state.eos.info)
  const [schedule, setSchedule] = useState({ producers: [] })

  useEffect(() => {
    const newProducers = scheduleInfo.producers.map((item) => {
      const data =
        (producers || []).find((producer) => {
          let result = producer.owner === item.producer_name

          if (!result) {
            result = producer.bp_json?.nodes.find(
              (node) => node.node_name === item.producer_name
            )
          }

          return result
        }) || {}

      return {
        logo: data?.bp_json?.org?.branding?.logo_256,
        url: data?.url,
        owner: item.producer_name || data.owner,
        rewards: data.total_rewards,
        total_votes_percent: data.total_votes_percent * 100,
        value: 20
      }
    })
    setSchedule({
      ...scheduleInfo,
      producers: newProducers
    })
  }, [scheduleInfo, producers])

  return (
    <Grid container justify="space-between">
      <Grid
        container
        item
        xs={12}
        md={3}
        className={classes.leftColumn}
        justify="flex-start"
      >
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography>{t('currentProducer')}</Typography>
              <Typography component="p" variant="h6">
                {info.head_block_producer}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography>{t('headBlock')}</Typography>
              <Typography component="p" variant="h6">
                {formatWithThousandSeparator(info.head_block_num)}
              </Typography>
              <Box className={classes.boxIrreversible}>
                <Typography>
                  {`${t('lastBlock')}: `}
                  <strong>
                    {formatWithThousandSeparator(
                      info.last_irreversible_block_num
                    )}
                  </strong>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <TransactionsHistory t={t} />
      </Grid>
      {loading && <LinearProgress />}
      <Grid item xs={12} md={9} className={classes.rightColumn}>
        <Card>
          <CardContent>
            <Typography component="p" variant="h6">
              {t('bpSchedule')}
            </Typography>
            <Typography variant="caption">Ver. {schedule?.version}</Typography>
            <ProducersChart info={info} producers={schedule.producers} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

BlockProducerInfo.propTypes = {
  t: PropTypes.any,
  classes: PropTypes.object
}

BlockProducerInfo.defaultProps = {
  classes: {}
}

export default BlockProducerInfo
