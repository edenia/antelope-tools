/* eslint camelcase: 0 */
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLazyQuery } from '@apollo/client'
import { useTheme } from '@mui/material/styles'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import Select from '@mui/material/Select'
import Card from '@mui/material/Card'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import LinearProgress from '@mui/material/LinearProgress'

import { TRANSACTION_HISTORY_QUERY } from '../../gql'
import { rangeOptions } from '../../utils'
import TransactionsLineChart from '../../components/TransactionsLineChart'
import { generalConfig } from '../../config'

import EqualIcon from './EqualIcon'

const options = ['Live (30s)', ...rangeOptions]

const TransactionInfo = ({ t, classes }) => {
  const theme = useTheme()
  const tps = useSelector((state) => state.eos.tps)
  const tpb = useSelector((state) => state.eos.tpb)
  const [graphicData, setGraphicData] = useState([
    {
      name: t('transactionsPerSecond'),
      color: theme.palette.secondary.main
    },
    {
      name: t('transactionsPerBlock'),
      color: '#00C853'
    }
  ])
  const [option, setOption] = useState(options[0])
  const [pause, setPause] = useState(false)
  const [getTransactionHistory, { data, loading }] = useLazyQuery(
    TRANSACTION_HISTORY_QUERY,
    { fetchPolicy: 'network-only' }
  )

  useEffect(() => {
    const trxPerSecond = []
    const trxPerBlock = []

    if (pause || option !== options[0]) {
      return
    }

    for (let index = 0; index < tpb.length; index++) {
      trxPerBlock.push({
        name: `Block: ${tpb[index].blocks.join()}`,
        y: tpb[index].transactions,
        x: index > 0 ? index / 2 : index
      })
    }

    for (let index = 0; index < tps.length; index++) {
      trxPerSecond.push({
        name: `Blocks: ${tps[index].blocks.join(', ')}`,
        y: tps[index].transactions,
        x: index
      })
    }

    setGraphicData([
      {
        name: t('transactionsPerSecond'),
        color: theme.palette.secondary.main,
        data: trxPerSecond
      },
      {
        name: t('transactionsPerBlock'),
        color: '#00C853',
        data: trxPerBlock
      }
    ])
    // eslint-disable-next-line
  }, [option, tps, tpb])

  useEffect(() => {
    if (option === options[0]) {
      return
    }

    setGraphicData([])
    getTransactionHistory({
      variables: {}
    })
  }, [option, getTransactionHistory])

  useEffect(() => {
    const trxHistory = data?.trxHistory?.length
      ? data.trxHistory[0].transaction_history
      : null

    if (option === option[0]) {
      return
    }

    if (!trxHistory) {
      setGraphicData([])
      return
    }

    const intervalGraphicData = (trxHistory[option] || []).map(
      (transactionHistory) => {
        return [
          new Date(transactionHistory.datetime).getTime(),
          transactionHistory.transactions_count || 0
        ]
      }
    )

    setGraphicData([
      {
        name: t('transactionsPerBlock'),
        color: '#00C853',
        data: intervalGraphicData
      }
    ])
    // eslint-disable-next-line
  }, [data, t])

  return (
    <Card>
      <CardContent
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <Box className={classes.headerTransactionLine}>
          <Typography component="p" variant="h6">
            {t('transactions')}
          </Typography>
          <Box className={classes.formControl}>
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
            <Box
              onClick={() => option === options[0] && setPause(!pause)}
              className={clsx(classes.pauseButton, {
                [classes.disableButton]: option !== options[0]
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
            </Box>
          </Box>
        </Box>
        {loading && <LinearProgress color="primary" />}
        <TransactionsLineChart
          yAxisProps={{
            reversed: false,
            title: {
              enabled: true,
              text: t('transactions')
            },
            maxPadding: 0.05
          }}
          xAxisProps={{
            type: 'datetime',
            reversed: option === options[0],
            title: {
              enabled: option === options[0],
              text: t('secondsAgo')
            },
            labels: {
              format: option === options[0] ? '{value}s' : null
            },
            maxPadding: 0.05
          }}
          data={graphicData}
        />
      </CardContent>
    </Card>
  )
}

TransactionInfo.propTypes = {
  t: PropTypes.any,
  classes: PropTypes.object
}

TransactionInfo.defaultProps = {
  classes: {}
}

export default TransactionInfo
