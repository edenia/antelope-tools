import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'

import PauseButton from '../../components/PauseButton'

import styles from './styles'

const useStyles = makeStyles(styles)

const ChartHeader = ({
  title,
  options,
  value,
  isHistoryEnabled,
  isLive,
  isPaused,
  onSelect,
  handlePause,
  ariaLabel,
}) => {
  const classes = useStyles()
  const { t } = useTranslation()

  return (
    <div className={classes.headerContainer}>
      <Typography component="p" variant="h6">
        {title}
      </Typography>
      <div
        className={clsx(classes.formControl, {
          [classes.onlySelect]: isHistoryEnabled && !handlePause,
        })}
      >
        <FormControl>
          {isHistoryEnabled && (
            <>
              <InputLabel htmlFor={ariaLabel}>{t('timeFrame')}</InputLabel>
              <Select
                inputProps={{ id: ariaLabel }}
                value={value}
                onChange={(e) => onSelect(e.target.value)}
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
        {handlePause && (
          <PauseButton
            handlePause={handlePause}
            isPaused={isPaused}
            isEnabled={isLive}
          />
        )}
      </div>
    </div>
  )
}

ChartHeader.propTypes = {
  ariaLabel: PropTypes.string,
  title: PropTypes.string,
  isPaused: PropTypes.bool,
  handlePause: PropTypes.func,
  value: PropTypes.string,
  options: PropTypes.array,
  isLive: PropTypes.bool,
  isHistoryEnabled: PropTypes.bool,
  onSelect: PropTypes.func,
}

ChartHeader.defaultProps = {
  title: '',
  ariaLabel: '',
  isPaused: false,
  isLive: false,
  isHistoryEnabled: false,
  handlePause: undefined,
  onSelect: undefined,
}

export default ChartHeader
