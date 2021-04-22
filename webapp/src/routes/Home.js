/* eslint camelcase: 0 */
import React, { lazy, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/styles'
import { useQuery } from '@apollo/react-hooks'
import { useTranslation } from 'react-i18next'

import { formatWithThousandSeparator } from '../utils'
import { NODES_QUERY } from '../gql'

const Card = lazy(() => import('@material-ui/core/Card'))
const CardContent = lazy(() => import('@material-ui/core/CardContent'))
const Grid = lazy(() => import('@material-ui/core/Grid'))
const Box = lazy(() => import('@material-ui/core/Box'))
const Typography = lazy(() => import('@material-ui/core/Typography'))
const LinearProgress = lazy(() => import('@material-ui/core/LinearProgress'))
const ProducersChart = lazy(() => import('../components/ProducersChart'))
const TransactionsHistory = lazy(() =>
  import('../components/TransactionsHistory')
)
const TransactionsLineChart = lazy(() =>
  import('../components/TransactionsLineChart')
)

const useStyles = makeStyles((theme) => ({
  leftColumn: {
    alignContent: 'space-between',
    paddingRight: 0,
    '& .MuiCard-root': {
      height: 125,
      marginBottom: theme.spacing(2),
      '& .MuiTypography-body1': {
        marginBottom: theme.spacing(2)
      }
    },
    [theme.breakpoints.up('md')]: {
      paddingRight: theme.spacing(2)
    }
  },
  rightColumn: {
    paddingLeft: 0,
    marginBottom: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      paddingLeft: theme.spacing(2)
    }
  },
  bottomRow: {
    paddingTop: 0,
    [theme.breakpoints.up('md')]: {
      paddingTop: theme.spacing(1)
    }
  },
  boxIrreversible: {
    display: 'flex',
    alignItems: 'baseline',
    paddingTop: theme.spacing(3),
    '& .MuiTypography-body1': {
      marginBottom: '0 !important',
      letterSpacing: '0.09px',
      color: 'rgba(0, 0, 0, 0.54)',
      '& strong': {
        color: '#212121'
      }
    }
  }
}))

const Home = () => {
  const dispatch = useDispatch()
  const classes = useStyles()
  const { data: { loading, producers } = {} } = useQuery(NODES_QUERY)
  const info = useSelector((state) => state.eos.info)
  const tps = useSelector((state) => state.eos.tps)
  const tpb = useSelector((state) => state.eos.tpb)
  const scheduleInfo = useSelector((state) => state.eos.schedule)
  const [schedule, setSchedule] = useState({ producers: [] })
  const [graphicData, setGraphicData] = useState([])
  const { t } = useTranslation('homeRoute')

  useEffect(() => {
    const majorLength = tps.length > tpb.length ? tps.length : tpb.length
    const dataModeled = []

    if (!majorLength) return

    for (let index = 0; index < majorLength; index++) {
      dataModeled.push({
        tps: tps[index] ? tps[index].transactions : 0,
        tpb: tpb[index] ? tpb[index].transactions : 0,
        blocks: {
          tps: tps[index] ? tps[index].blocks : [0],
          tpb: tpb[index] ? tpb[index].blocks : [0]
        }
      })
    }

    setGraphicData(dataModeled)
  }, [tps, tpb])

  useEffect(() => {
    dispatch.eos.startTrackingInfo({ interval: 0.5 })
    dispatch.eos.startTrackingProducerSchedule({ interval: 60 })
  }, [dispatch])

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

  useEffect(() => {
    return () => {
      dispatch.eos.stopTrackingInfo()
      dispatch.eos.stopTrackingProducerSchedule()
    }
  }, [dispatch])

  return (
    <Box>
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
              <Typography variant="caption">
                Ver. {schedule?.version}
              </Typography>
              <ProducersChart info={info} producers={schedule.producers} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container className={classes.bottomRow}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography component="p" variant="h6">
                {t('transactions')}
              </Typography>
              <TransactionsLineChart data={graphicData} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

Home.propTypes = {}

export default Home
