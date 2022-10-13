import React from 'react'
import { makeStyles } from '@mui/styles'
import ReportIcon from '@mui/icons-material/Report'
import VerifiedIcon from '@mui/icons-material/Verified'
import TimerOffIcon from '@mui/icons-material/TimerOff'
import WarningIcon from '@mui/icons-material/Warning'

import styles from './styles'

const useStyles = makeStyles(styles)

const LightIcon = ({ status }) => {
  const classes = useStyles()

  switch (status) {
    case 'greenLight':
      return <VerifiedIcon className={classes.greenLight} />
    case 'timerOff':
      return <TimerOffIcon className={classes.timerOff} />
    case 'yellowLight':
      return <WarningIcon className={classes.yellowLight} />
    default:
      return <ReportIcon className={classes.redLight} />
  }
}

export default LightIcon
