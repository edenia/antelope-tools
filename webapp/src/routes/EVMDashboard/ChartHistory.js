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

import TransactionsLineChart from 'components/TransactionsLineChart'

import styles from './styles'

const useStyles = makeStyles(styles)

const ChartHistory = ({
  title,
  ariaLabel,
  options,
  value,
  yAxisText,
  onSelect,
  shared,
  loading,
  data,
  customFormatter
}) => {
  const classes = useStyles()
  const { t } = useTranslation()

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
        <div className={classes.header}>
          <Typography component="p" variant="h6">
            {title}
          </Typography>
          <FormControl>
            <InputLabel htmlFor={ariaLabel}>{t('timeFrame')}</InputLabel>
            <Select
              inputProps={{ id: ariaLabel }}
              value={value}
              onChange={e => onSelect(e.target.value)}
              fullWidth
            >
              {options.map((item, index) => (
                <MenuItem key={index} value={item}>
                  {t(item)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        {loading && <LinearProgress color="primary" />}
        <TransactionsLineChart
          yAxisProps={{
            title: {
              text: yAxisText,
            },
            maxPadding: 0.05,
          }}
          xAxisProps={{
            type: 'datetime',
            maxPadding: 0.05,
          }}
          data={data}
          shared={shared}
          customFormatter={customFormatter}
          zoomEnabled
        />
      </CardContent>
    </Card>
  )
}

ChartHistory.propTypes = {
  title: PropTypes.string,
  ariaLabel: PropTypes.string,
  options: PropTypes.array,
  value: PropTypes.string,
  yAxisText: PropTypes.string,
  onSelect: PropTypes.func,
  shared: PropTypes.bool,
  loading: PropTypes.bool,
  data: PropTypes.array,
  customFormatter: PropTypes.func
}

ChartHistory.defaultProps = {
  title: '',
  ariaLabel: 'select',
  yAxisText: '',
  shared: false,
  loading: false,
  customFormatter: undefined
}

export default ChartHistory
