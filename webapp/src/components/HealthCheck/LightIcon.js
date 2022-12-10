import React from 'react'
import { makeStyles } from '@mui/styles'
import CloseIcon from '@mui/icons-material/Close'
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined'
import TimerOffOutlinedIcon from '@mui/icons-material/TimerOffOutlined'
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined'

import styles from './styles'

const useStyles = makeStyles(styles)

const LightIcon = ({ status }) => {
  const classes = useStyles()

  switch (status) {
    case 'greenLight':
      return <DoneOutlinedIcon className={classes.greenLight} />
    case 'timerOff':
      return <TimerOffOutlinedIcon className={classes.timerOff} />
    case 'yellowLight':
      return <ReportProblemOutlinedIcon className={classes.yellowLight} />
    default:
      return <CloseIcon className={classes.redLight} />
  }
}

export default LightIcon
