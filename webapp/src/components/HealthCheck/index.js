import React, { useState } from 'react'
import { makeStyles } from '@mui/styles'

import Tooltip from '../Tooltip'

import styles from './styles'
import LightIcon from './LightIcon'

const useStyles = makeStyles(styles)

const HealthCheck = ({ children, status }) => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null)

  const handlePopoverOpen = (target) => {
    setAnchorEl(target)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  if (status === undefined) return

  return (
    <div className={classes.icon}>
      <div
        onClick={(e) => {
          handlePopoverOpen(e.target)
        }}
      >
        <LightIcon status={status} />
      </div>
      <Tooltip
        anchorEl={anchorEl}
        open={anchorEl !== null}
        onClose={handlePopoverClose}
      >
        {children}
      </Tooltip>
    </div>
  )
}

export default HealthCheck
