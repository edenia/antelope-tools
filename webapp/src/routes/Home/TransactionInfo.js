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
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import TransactionsLineChart from '../../components/TransactionsLineChart'
import EqualIcon from './EqualIcon'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'

import { TRANSACTION_QUERY } from '../../gql'

const options = [
  'Live (5 min)',
  'Last Hour',
  'Last Day',
  'Last Week',
  'Last Year'
]

const TransactionInfo = ({ t, classes }) => {
  const theme = useTheme()
  const tps = useSelector((state) => state.eos.tps)
  const tpb = useSelector((state) => state.eos.tpb)
  const [graphicData, setGraphicData] = useState([])
  const [option, setOption] = useState(options[0])
  const [pause, setPause] = useState(false)
  const [
    getTransactionHistory,
    { loading: trxHistoryLoading, data: trxHistory }
  ] = useLazyQuery(TRANSACTION_QUERY)

  useEffect(() => {
    const majorLength = tps.length > tpb.length ? tps.length : tpb.length
    const dataModeled = []

    if (!majorLength || pause) return

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
    if (option === 'Live (5 min)') {
      console.log({ loading: trxHistoryLoading, data: trxHistory })
    } else {
      getTransactionHistory({
        variables: {}
      })
    }
  }, [option, getTransactionHistory])

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
                      <MenuItem key={item} value={item}>
                        {t(item)}
                      </MenuItem>
                    ))}
                  </Select>
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
