/* eslint camelcase: 0 */
import React from 'react'
import { makeStyles } from '@mui/styles'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import Typography from '@mui/material/Typography'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'

import styles from './styles'
import EqualIcon from './EqualIcon'

const useStyles = makeStyles(styles)

const PauseButton = ({ isPaused, handlePause, isEnabled }) => {
  const { t } = useTranslation('homeRoute')
  const classes = useStyles()
  const theme = useTheme()

  return (
    <>
      <div
        onClick={handlePause}
        className={clsx(classes.pauseButton, {
          [classes.disableButton]: !isEnabled,
        })}
      >
        {isPaused ? (
          <PlayArrowIcon />
        ) : (
          <EqualIcon
            width={20}
            height={20}
            color={
              !isEnabled
                ? theme.palette.action.disabled
                : theme.palette.common.black
            }
          />
        )}
        <Typography>{isPaused ? t('play') : t('pause')}</Typography>
      </div>
    </>
  )
}

PauseButton.propTypes = {
  isPaused: PropTypes.bool,
  isEnabled: PropTypes.bool,
  handlePause: PropTypes.func,
}

export default PauseButton
