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

  const openPopOver = (event) => {
    handlePopoverOpen(event.target)
  }

  return (
    <>
      <div
        className={classes.icon}
        onClick={openPopOver}
        onMouseEnter={openPopOver}
      >
        <LightIcon status={status} />
      </div>
      <Tooltip
        anchorEl={anchorEl}
        open={anchorEl !== null}
        closeOnMouseLeave
        onClose={handlePopoverClose}
      >
        {children}
      </Tooltip>
    </>
  )
}

export default HealthCheck
