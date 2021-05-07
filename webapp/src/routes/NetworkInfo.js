/* eslint camelcase: 0 */
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useQuery } from '@apollo/react-hooks'
import { makeStyles } from '@material-ui/styles'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import moment from 'moment'
import { useTranslation } from 'react-i18next'

import TransactionsLineChart from '../components/TransactionsLineChart'

import { NETWORK_STATS } from '../gql'
import { generalConfig } from '../config'

const useStyles = makeStyles(() => ({
  content: {
    flex: 1
  },
  dl: {
    marginTop: -16,
    marginBottom: -16
  },
  dt: {
    fontWeight: 'bold'
  },
  dd: {
    wordBreak: 'break-word'
  }
}))

const Network = () => {
  const dispatch = useDispatch()
  const classes = useStyles()
  const { t } = useTranslation('networkInfoRoute')
  const [cpuData, setCpuData] = useState({})
  const { data: stats } = useQuery(NETWORK_STATS)

  const getDataModeled = (items = [], valueName) => {
    if (!items.length) return { data: [], firstDate: null, lastDate: null }

    const itemsSorted = items
      .map((block) => ({
        ...block,
        value: block[valueName],
        time: moment(block.created_at).unix()
      }))
      .sort((blockA, blockB) => blockA.time - blockB.time)

    const firstDate = itemsSorted[0].time
    const lastDate = itemsSorted[itemsSorted.length - 1].time

    const itemsData = itemsSorted.reduce((acc, current) => {
      const timeFormat = moment.unix(current.time).format('HH:mm')

      if (!acc.length) {
        return [
          {
            name: current.account,
            data: [[timeFormat, current.value]]
          }
        ]
      }

      const dataIndex = acc.findIndex((item) => item.name === current.account)

      if (dataIndex >= 0) {
        acc[dataIndex].data.push([timeFormat, current.value])

        return acc
      }

      return [
        ...acc,
        {
          name: current.account,
          data: [[timeFormat, current.value]]
        }
      ]
    }, [])

    return { data: itemsData, firstDate, lastDate }
  }

  useEffect(() => {
    dispatch.eos.startTrackingInfo({ interval: 0 })

    return () => {
      dispatch.eos.stopTrackingInfo()
    }
  }, [dispatch])

  useEffect(() => {
    if (stats) {
      const { cpu } = stats

      setCpuData(getDataModeled(cpu, 'usage'))
    }
  }, [stats])

  return (
    <Grid container justify="flex-start" spacing={4}>
      {generalConfig.useCpuBenchmark && (
        <Grid item xs={12}>
          <Card className={classes.root}>
            <CardHeader title={t('cpuBenchmarks')} />
            <CardContent className={classes.content}>
              <TransactionsLineChart data={cpuData.data} />
            </CardContent>
            <CardActions disableSpacing />
          </Card>
        </Grid>
      )}
    </Grid>
  )
}

Network.propTypes = {}

export default Network
