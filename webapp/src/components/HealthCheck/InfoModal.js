import React, { useState } from 'react'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import ReportIcon from '@mui/icons-material/Report'
import VerifiedIcon from '@mui/icons-material/Verified'
import TimerOffIcon from '@mui/icons-material/TimerOff'
import WarningIcon from '@mui/icons-material/Warning'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'

import Tooltip from '../Tooltip'

import styles from './styles'

const useStyles = makeStyles(styles)

const InfoModal = () => {
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
        <div className={classes.item}>
          <VerifiedIcon className={classes.success} /> {t('updated')}
        </div>
        <div className={classes.item}>
          <TimerOffIcon className={classes.timerOff} /> {t('outdated')}
        </div>
        <div className={classes.item}>
          <WarningIcon className={classes.warning} /> {t('error')}
        </div>
        <div className={classes.item}>
          <ReportIcon className={classes.fail} /> {t('not working')}
        </div>
      </div>
    )
  }

  return (
    <>
      <HelpOutlineIcon
        className={classes.helpIcon}
        onClick={handlePopoverOpen}
      />
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
