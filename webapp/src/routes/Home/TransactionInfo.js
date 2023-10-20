/* eslint camelcase: 0 */
import React, { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { useTheme } from '@mui/material/styles'
import PropTypes from 'prop-types'
import moment from 'moment'

import { TRANSACTION_QUERY } from '../../gql'
import { formatWithThousandSeparator, rangeOptions } from '../../utils'
import { useSharedState } from '../../context/state.context'
import { generalConfig } from '../../config'
import TransactionsChartContainer from '../../components/TransactionsChartContainer'

const options = ['Live (30s)', ...rangeOptions]

const TransactionInfo = ({ t, startTrackingInfo, stopTrackingInfo }) => {
  const theme = useTheme()
  const [{ tps, tpb }] = useSharedState()
  const [graphicData, setGraphicData] = useState([
    {
      name: t('transactionsPerSecond'),
      color: theme.palette.primary.main,
    },
    {
      name: t('transactionsPerBlock'),
      color: theme.palette.secondary.main,
    },
  ])
  const [option, setOption] = useState(options[0])
  const [pause, setPause] = useState(false)
  const [getTransactionHistory, { data: transactionsData , loading }] = useLazyQuery(
    TRANSACTION_QUERY,
    { fetchPolicy: 'network-only' },
  )

  useEffect(() => {
    const trxPerSecond = []
    const trxPerBlock = []

    if (pause || option !== options[0]) return

    for (let index = 0; index < tpb.length; index++) {
      trxPerBlock.push({
        name: `Block: ${tpb[index].blocks.join()}`,
        cpu: formatWithThousandSeparator(tpb[index].cpu, 2),
        net: formatWithThousandSeparator(tpb[index].net, 3),
        y: tpb[index].transactions,
        x: index > 0 ? index / 2 : index,
      })
    }

    for (let index = 0; index < tps.length; index++) {
      trxPerSecond.push({
        name: `Blocks: ${tps[index].blocks.join(', ')}`,
        cpu: formatWithThousandSeparator(tps[index].cpu, 2),
        net: formatWithThousandSeparator(tps[index].net, 3),
        y: tps[index].transactions,
        x: index,
      })
    }

    setGraphicData([
      {
        name: t('transactionsPerSecond'),
        color: theme.palette.primary.main,
        data: trxPerSecond,
      },
      {
        name: t('transactionsPerBlock'),
        color: theme.palette.secondary.main,
        data: trxPerBlock,
      },
    ])
    // eslint-disable-next-line
  }, [option, tps, tpb])

  useEffect(() => {
    if (option === options[0]) {
      setPause(false)
      startTrackingInfo()
      return
    }

    stopTrackingInfo()

    setGraphicData([])
    getTransactionHistory({
      variables: {
        range: option,
      },
    })
    // eslint-disable-next-line
  }, [option, theme.palette, getTransactionHistory])

  useEffect(() => {
    if (option === option[0]) return

    if (!transactionsData?.transactions.length) {
      setGraphicData([])
      return
    }

    const data = transactionsData.transactions.map(
      transaction => 
        ({
          name: moment(transaction.datetime)?.format('ll'),
          cpu: transaction.cpu || 0,
          net: transaction.net || 0,
          y: transaction.transactions_count || 0,
          x: new Date(transaction.datetime).getTime(),
        })
    )

    setGraphicData([
      {
        name: t('transactions'),
        color: theme.palette.primary.main,
        data
      },
    ])
    // eslint-disable-next-line
  }, [transactionsData, theme.palette, t])

  return (
    <TransactionsChartContainer 
      title={t('transactions')}
      ariaLabel="Transactions chart select"
      isPaused={pause}
      loading={loading}
      handlePause={() => {
        if (option === options[0]) {
          setPause(!pause)
          if (pause) {
            startTrackingInfo()
          } else {
            stopTrackingInfo()
          }
        }
      }}
      historyState={{
        value: option,
        options: options,
        isLive: option === options[0],
        isHistoryEnabled: generalConfig.historyEnabled,
        onSelect: setOption,
      }}
      data={graphicData}
      chartLabelFormat={{
        ariaLabel: 'select time filter',
        yAxisText: t('transactions'),
        blockTime: 1,
        customFormatter: element => {
          const series = element?.series
          const point = element?.point

          const pointName = point?.name ? `${point.name}<br />` : ''
          const resourcesDetail =
            point?.net && point?.cpu
              ? `<br/>${t('netUsage')}:<b>${point.net} %</b><br/>${t(
                  'cpuUsage',
                )}:<b>${point.cpu} %</b>`
              : ''

          return (
            pointName + `${series?.name}: <b>${point?.y}</b>` + resourcesDetail
          )
        },
      }}
    />
  )
}

TransactionInfo.propTypes = {
  t: PropTypes.any,
  startTrackingInfo: PropTypes.func,
  stopTrackingInfo: PropTypes.func,
}

TransactionInfo.defaultProps = {
  startTrackingInfo: () => {},
  stopTrackingInfo: () => {},
}

export default TransactionInfo
