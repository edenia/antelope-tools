import React, { memo } from 'react'
import { makeStyles } from '@mui/styles'
import PropTypes from 'prop-types'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import Tooltip from '@mui/material/Tooltip'

import styles from './styles'

const useStyles = makeStyles(styles)

const MoreInfoTooltip = ({ helperText }) => {
  const classes = useStyles()

  return (
    <Tooltip
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
}

MoreInfoTooltip.defaultProps = {
  helperText: '',
}

export default memo(MoreInfoTooltip)
