import React from 'react'
import { makeStyles } from '@mui/styles'
import ReportIcon from '@mui/icons-material/Report'
import VerifiedIcon from '@mui/icons-material/Verified'
import TimerOffIcon from '@mui/icons-material/TimerOff'
import WarningIcon from '@mui/icons-material/Warning'

import styles from './styles'

const useStyles = makeStyles(styles)

const HealthCheck = ({ children, status }) => {
  const classes = useStyles()

  const getIcon = (status) => {
    switch (status) {
      case 'updated':
        return <VerifiedIcon className={classes.success} />
      case 'outdated':
        return <TimerOffIcon className={classes.timerOff} />
      case 'error':
        return <WarningIcon className={classes.warning} />
      default:
        return <ReportIcon className={classes.fail} />
    }
  }

  return (
    <div className={classes.icon}>
      {status !== undefined && getIcon(status)} {children}
    </div>
  )
}

export default HealthCheck
