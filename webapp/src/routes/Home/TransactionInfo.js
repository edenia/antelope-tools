/* eslint camelcase: 0 */
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLazyQuery } from '@apollo/react-hooks'
import { useTheme } from '@material-ui/core/styles'
import clsx from 'clsx'
import moment from 'moment'
import PropTypes from 'prop-types'
import Select from '@material-ui/core/Select'
import Card from '@material-ui/core/Card'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'

import TransactionsLineChart from '../../components/TransactionsLineChart'
import EqualIcon from './EqualIcon'

import { TRANSACTION_QUERY } from '../../gql'

const options = [
  { value: '0', label: 'Live (5 min)' },
  { value: '1 Hour', label: 'Last Hour' },
  { value: '1 Day', label: 'Last Day' },
  { value: '1 Week', label: 'Last Week' },
  { value: '1 Year', label: 'Last Year' }
]
const baseValues = { block_num: null, transaction_length: 0 }

const TransactionInfo = ({ t, classes }) => {
  const theme = useTheme()
  const tps = useSelector((state) => state.eos.tps)
  const tpb = useSelector((state) => state.eos.tpb)
  const [graphicData, setGraphicData] = useState([])
  const [option, setOption] = useState(options[0].value)
  const [pause, setPause] = useState(false)
  const [
    getTransactionHistory,
    { loading: trxHistoryLoading, data: trxHistory }
  ] = useLazyQuery(TRANSACTION_QUERY)

  useEffect(() => {
    const majorLength = tps.length > tpb.length ? tps.length : tpb.length
    const trxPerSecond = []
    const trxPerBlock = []

    if (!majorLength || pause || option !== '0') return

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
        name: 'Transactions per Second',
        color: theme.palette.secondary.main,
        data: trxPerSecond
      },
      {
        name: 'Transactions per Block',
        color: '#00C853',
        data: trxPerBlock
      }
    ])
    // eslint-disable-next-line
  }, [tps, tpb])

  useEffect(() => {
    if (option !== '0') {
      const values = option.split(' ')
      const date = moment().subtract(values[0], values[1]).utc().toString()
      getTransactionHistory({
        variables: { date }
      })
    }
  }, [option, getTransactionHistory])

  useEffect(() => {
    const trxPerSecond = []
    const trxPerBlock = []

    if (option !== '0') {
      if (!trxHistory?.block_history?.length) {
        setGraphicData([])

        return
      }

      for (let i = 1; i < trxHistory.block_history.length; i = i + 2) {
        const item = trxHistory.block_history[i] || baseValues
        const prevItem = trxHistory.block_history[i - 1] || baseValues
        const trxPer = item.transaction_length + prevItem.transaction_length
        const blocks = `Blocks:[${item.block_num}, ${prevItem.block_num}]`

        trxPerSecond.push([blocks, trxPer])
        trxPerBlock.push([blocks, trxPer])
      }

      setGraphicData([
        {
          name: 'Transactions per Second',
          color: theme.palette.secondary.main,
          data: trxPerSecond
        },
        {
          name: 'Transactions per Block',
          color: '#00C853',
          data: trxPerBlock
        }
      ])
    }
    // eslint-disable-next-line
  }, [trxHistoryLoading, trxHistory])

  return (
    <Grid container className={classes.bottomRow}>
      <Grid item xs={12}>
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
                    {options.map((item) => (
                      <MenuItem key={item.label} value={item.value}>
                        {t(item.label)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Box
                  onClick={() =>
                    option === options[0].value && setPause(!pause)
                  }
                  className={clsx(classes.pauseButton, {
                    [classes.disableButton]: option !== options[0].value
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

            <TransactionsLineChart data={graphicData} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
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
