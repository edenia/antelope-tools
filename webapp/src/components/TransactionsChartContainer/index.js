import React from 'react'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import PropTypes from 'prop-types'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'

import PauseButton from '../../components/PauseButton'
import TransactionsLineChart from '../../components/TransactionsLineChart'

import styles from './styles'

const useStyles = makeStyles(styles)

const TransactionsChartContainer = ({
  title,          
  ariaLabel,      
  loading,
  data,
  isPaused,        
  handlePause, 
  chartLabelFormat,
  historyState
}) => {
  const classes = useStyles()
  const { t } = useTranslation()

  return (
    <Card>
        <div className={classes.headerTransactionLine}>
          <Typography component="p" variant="h6">
            {title}
          </Typography>
          <div className={classes.formControl}>
            <FormControl>
              {historyState?.isHistoryEnabled && (
                <>
                  <InputLabel htmlFor={ariaLabel}>{t('timeFrame')}</InputLabel>
                  <Select
                    inputProps={{ id: ariaLabel }}
                    value={historyState?.value}
                    onChange={e => historyState?.onSelect(e.target.value)}
                    fullWidth
                  >
                    {historyState?.options.map((item, index) => (
                      <MenuItem key={index} value={item}>
                        {t(item)}
                      </MenuItem>
                    ))}
                  </Select>
                </>
              )}
            </FormControl>
            {handlePause && (
              <PauseButton
                handlePause={handlePause}
                isPaused={isPaused}
                isEnabled={historyState?.isLive}
              />
            )}
          </div>
        </div>
        {loading && <LinearProgress color="primary" />}
        <TransactionsLineChart
          zoomEnabled={!historyState?.isLive}
          yAxisProps={{
            reversed: false,
            title: {
              text: chartLabelFormat?.yAxisText,
              enabled: true,
            },
            maxPadding: 0.05,
          }}
          xAxisProps={{
            type: 'datetime',
            reversed: historyState?.isLive,
            title: {
              enabled: historyState?.isLive,
              text: t('secondsAgo'),
            },
            labels: {
              formatter() {
                return historyState?.isLive && this?.value
                  ? `${this.value * chartLabelFormat?.blockTime}s`
                  : null
              },
            },
            maxPadding: 0.05,
          }}
          data={data}
          shared={chartLabelFormat?.shared}
          customFormatter={chartLabelFormat?.customFormatter}
        />
    </Card>
  )
}

TransactionsChartContainer.propTypes = {
  ariaLabel: PropTypes.string,
  title: PropTypes.string,
  loading: PropTypes.bool,
  isPaused: PropTypes.bool,
  data: PropTypes.array,
  handlePause: PropTypes.func,
  chartLabelFormat: PropTypes.shape({
    yAxisText: PropTypes.string,
    shared: PropTypes.bool,
    blockTime: PropTypes.number,
    customFormatter: PropTypes.func,
  }),
  historyState: PropTypes.shape({
    value: PropTypes.string,
    options: PropTypes.array,
    isLive: PropTypes.bool,
    isHistoryEnabled: PropTypes.bool,
    onSelect: PropTypes.func,
  })
}

TransactionsChartContainer.defaultProps = {
  title: '',
  ariaLabel: '',
  loading: false,
  isPaused: false,
  handlePause: undefined,
}

export default TransactionsChartContainer
