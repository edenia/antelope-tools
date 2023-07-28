import React, { useState } from 'react'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { Tooltip as MUITooltip } from '@mui/material'

import Tooltip from '../Tooltip'

import styles from './styles'
import LightIcon from './LightIcon'

const useStyles = makeStyles(styles)
const defaultLights = {
  greenLight: 'updated',
  timerOff: 'outdated',
  yellowLight: 'error',
  redLight: 'not working',
}

const InfoModal = ({ lights = defaultLights }) => {
  const classes = useStyles()
  const { t } = useTranslation('healthCheckComponent')
  const [anchorEl, setAnchorEl] = useState(null)

  const handlePopoverOpen = (target) => {
    setAnchorEl(target)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  const HealthInfo = () => {
    return (
      <div className={classes.modal}>
        <p>{t('help')}</p>
        {lights &&
          Object.keys(lights).map((light, index) => (
            <div className={classes.item} key={`light-${light}-${index}`}>
              <LightIcon status={light} /> {t(lights[light])}
            </div>
          ))}
      </div>
    )
  }

  return (
    <>
      <MUITooltip title={t('help')} arrow>
        <HelpOutlineIcon
          className={classes.helpIcon}
          onClick={(e) => {
            handlePopoverOpen(e.target)
          }}
        />
      </MUITooltip>
      <Tooltip
        anchorEl={anchorEl}
        open={anchorEl !== null}
        onClose={handlePopoverClose}
      >
        <HealthInfo />
      </Tooltip>
    </>
  )
}

export default InfoModal
