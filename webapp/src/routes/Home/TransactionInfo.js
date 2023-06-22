/* eslint camelcase: 0 */
import React, { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { makeStyles } from '@mui/styles'
import { useTheme } from '@mui/material/styles'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import Select from '@mui/material/Select'
import Card from '@mui/material/Card'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import LinearProgress from '@mui/material/LinearProgress'

import { TRANSACTION_QUERY } from '../../gql'
import { rangeOptions } from '../../utils'
import TransactionsLineChart from '../../components/TransactionsLineChart'
import { useSharedState } from '../../context/state.context'
import { generalConfig } from '../../config'

import EqualIcon from './EqualIcon'
import styles from './styles'

const useStyles = makeStyles(styles)

const options = ['Live (30s)', ...rangeOptions]

const TransactionInfo = ({
  t,
  startTrackingInfo,
  stopTrackingInfo,
}) => {
  const classes = useStyles()
  const theme = useTheme()
  const [{ tps, tpb }] = useSharedState()
  const [graphicData, setGraphicData] = useState([
    {
      name: t('transactionsPerSecond'),
      color: theme.palette.secondary.main,
    },
    {
      name: t('transactionsPerBlock'),
      color: '#00C853',
    },
  ])
  const [option, setOption] = useState(options[0])
  const [pause, setPause] = useState(false)
  const [getTransactionHistory, { data, loading }] = useLazyQuery(
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
        cpu: tpb[index].cpu,
        net: tpb[index].net,
        y: tpb[index].transactions,
        x: index > 0 ? index / 2 : index,
      })
    }

    for (let index = 0; index < tps.length; index++) {
      trxPerSecond.push({
        name: `Blocks: ${tps[index].blocks.join(', ')}`,
        cpu: tps[index].cpu,
        net: tps[index].net,
        y: tps[index].transactions,
        x: index,
      })
    }

    setGraphicData([
      {
        name: t('transactionsPerSecond'),
        color: theme.palette.secondary.main,
        data: trxPerSecond,
      },
      {
        name: t('transactionsPerBlock'),
        color: '#00C853',
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
  }, [option, getTransactionHistory])

  useEffect(() => {
    if (option === option[0]) return

    if (!data?.transactions.length) {
      setGraphicData([])
      return
    }

    const intervalGraphicData = data.transactions.map((transactionHistory) => {
      return [
        new Date(transactionHistory.datetime).getTime(),
        transactionHistory.transactions_count || 0,
      ]
    })

    setGraphicData([
      {
        name: t('transactionsPerBlock'),
        color: '#00C853',
        data: intervalGraphicData,
      },
    ])
    // eslint-disable-next-line
  }, [data, t])

  return (
    <Card className={classes.cardShadow}>
      <CardContent
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div className={classes.headerTransactionLine}>
          <Typography component="p" variant="h6">
            {t('transactions')}
          </Typography>
          <div className={classes.formControl}>
            <FormControl>
              {generalConfig.historyEnabled && (
                <>
                  <InputLabel id="option-linebar">{t('timeFrame')}</InputLabel>
                  <Select
                    labelId="option-linebar"
                    value={option}
                    onChange={(e) => setOption(e.target.value)}
                    fullWidth
                  >
                    {options.map((item, index) => (
                      <MenuItem key={index} value={item}>
                        {t(item)}
                      </MenuItem>
                    ))}
                  </Select>
                </>
              )}
            </FormControl>
            <div
              onClick={() => {
                if (option === options[0]) {
                  setPause(!pause)
                  if (pause) {
                    startTrackingInfo()
                  } else {
                    stopTrackingInfo()
                  }
                }
              }}
              className={clsx(classes.pauseButton, {
                [classes.disableButton]: option !== options[0],
              })}
            >
              {pause ? (
                <PlayArrowIcon />
              ) : (
                <EqualIcon
                  width={20}
                  height={20}
                  color={
                    option !== options[0]
                      ? theme.palette.action.disabled
                      : theme.palette.common.black
                  }
                />
              )}
              <Typography>{pause ? t('play') : t('pause')}</Typography>
            </div>
          </div>
        </div>
        {loading && <LinearProgress color="primary" />}
        <TransactionsLineChart
          zoomEnabled={option !== options[0]}
          yAxisProps={{
            reversed: false,
            title: {
              enabled: true,
              text: t('transactions'),
            },
            maxPadding: 0.05,
          }}
          xAxisProps={{
            type: 'datetime',
            reversed: option === options[0],
            title: {
              enabled: option === options[0],
              text: t('secondsAgo'),
            },
            labels: {
              format: option === options[0] ? '{value}s' : null,
            },
            maxPadding: 0.05,
          }}
          data={graphicData}
        />
      </CardContent>
    </Card>
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
