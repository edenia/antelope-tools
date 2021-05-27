/* eslint camelcase: 0 */
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLazyQuery } from '@apollo/react-hooks'
import { useTheme } from '@material-ui/core/styles'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import Select from '@material-ui/core/Select'
import Card from '@material-ui/core/Card'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import CardContent from '@material-ui/core/CardContent'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'

import { TRANSACTION_QUERY } from '../../gql'
import { rangeOptions } from '../../utils'
import TransactionsLineChart from '../../components/TransactionsLineChart'

import EqualIcon from './EqualIcon'

const options = ['Live (30s)', ...rangeOptions]

const TransactionInfo = ({ t, classes }) => {
  const theme = useTheme()
  const tps = useSelector((state) => state.eos.tps)
  const tpb = useSelector((state) => state.eos.tpb)
  const [graphicData, setGraphicData] = useState([])
  const [option, setOption] = useState(options[0])
  const [pause, setPause] = useState(false)
  const [getTransactionHistory, { data: trxHistory }] =
    useLazyQuery(TRANSACTION_QUERY)

  useEffect(() => {
    const majorLength = tps.length > tpb.length ? tps.length : tpb.length
    const trxPerSecond = []
    const trxPerBlock = []

    if (pause || option !== options[0]) {
      return
    }

    for (let index = 0; index < majorLength; index++) {
      const labelBlockPS = `Blocks:[${(tps[index]
        ? tps[index].blocks
        : ['']
      ).join()}]`
      const labelBlockPB = `Blocks:[${(tpb[index]
        ? tpb[index].blocks
        : []
      ).join()}]`

      trxPerSecond.push([
        labelBlockPS,
        tps[index] ? tps[index].transactions : 0
      ])
      trxPerBlock.push([labelBlockPB, tpb[index] ? tpb[index].transactions : 0])
    }

    setGraphicData([
      {
        name: t('transactionsPerSecond'),
        color: theme.palette.secondary.main,
        data: trxPerSecond.reverse()
      },
      {
        name: t('transactionsPerBlock'),
        color: '#00C853',
        data: trxPerBlock.reverse()
      }
    ])
    // eslint-disable-next-line
  }, [option, tps, tpb])

  useEffect(() => {
    if (option === options[0]) {
      return
    }

    getTransactionHistory({
      variables: { range: option }
    })
  }, [option, getTransactionHistory])

  useEffect(() => {
    const trxPerBlock = []

    if (option === option[0]) {
      return
    }

    if (!trxHistory?.transactions?.length) {
      setGraphicData([])

      return
    }

    for (let i = 0; i < trxHistory.transactions.length; i++) {
      trxPerBlock.push([
        new Date(trxHistory.transactions[i].datetime).getTime(),
        trxHistory.transactions[i].transactions_count || 0
      ])
    }

    setGraphicData([
      {
        name: t('transactionsPerBlock'),
        color: '#00C853',
        data: trxPerBlock
      }
    ])
    // eslint-disable-next-line
  }, [trxHistory, t])

  return (
    <Card>
      <CardContent>
        <Box className={classes.headerTransactionLine}>
          <Typography component="p" variant="h6">
            {t('transactions')}
          </Typography>
          <Box className={classes.formControl}>
            <FormControl>
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
            </FormControl>
            <Box
              onClick={() => option === options[0].value && setPause(!pause)}
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
                    option !== options[0].value
                      ? theme.palette.action.disabled
                      : theme.palette.common.black
                  }
                />
              )}
              <Typography>{pause ? t('play') : t('pause')}</Typography>
            </Box>
          </Box>
        </Box>

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
            reversed: true,
            title: {
              enabled: true,
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
