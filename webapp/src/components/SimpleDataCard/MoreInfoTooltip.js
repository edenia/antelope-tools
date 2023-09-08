import React, { memo } from 'react'
import { makeStyles } from '@mui/styles'
import PropTypes from 'prop-types'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import Tooltip from '@mui/material/Tooltip'

import styles from './styles'

const useStyles = makeStyles(styles)

const MoreInfoTooltip = ({
  helperText,
  open,
  handleOpenTooltip,
  handleCloseTooltip,
}) => {
  const classes = useStyles()

  return (
    <Tooltip
      open={open}
      onOpen={handleOpenTooltip}
      onClose={handleCloseTooltip}
      title={<div>{helperText}</div>}
      placement="top"
      arrow
      enterTouchDelay={0}
      disableFocusListener
      className={classes.tooltip}
      classes={{ popper: classes.tooltipPopper }}
    >
      <InfoOutlinedIcon />
    </Tooltip>
  )
}

MoreInfoTooltip.propTypes = {
  helperText: PropTypes.string,
  open: PropTypes.bool,
  handleOpenTooltip: PropTypes.func,
  handleCloseTooltip: PropTypes.func,
}

MoreInfoTooltip.defaultProps = {
  helperText: '',
  open: false,
}

export default memo(MoreInfoTooltip)
