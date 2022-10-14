/* eslint camelcase: 0 */
import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'
import Popover from '@mui/material/Popover'
import CloseIcon from '@mui/icons-material/Close'

import styles from './styles'

const useStyles = makeStyles(styles)

const Tooltip = ({ anchorEl, anchorOrigin, open, onClose, children }) => {
  const classes = useStyles()

  return (
    <Popover
      open={open}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      transformOrigin={{
        vertical: 'center',
        horizontal: 'center'
      }}
      classes={{
        paper: classes.paper
      }}
      anchorEl={anchorEl}
    >
      <div className={classes.popover}>
        <div className={classes.popoverClose}>
          <CloseIcon className={classes.popoverCloseIcon} onClick={onClose} />
        </div>
        {children}
      </div>
    </Popover>
  )
}

Tooltip.propTypes = {
  anchorEl: PropTypes.any,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.node,
  anchorOrigin: PropTypes.object
}

Tooltip.defaultProps = {
  onClose: () => {},
  anchorOrigin: {
    vertical: 'center',
    horizontal: 'center'
  },
  anchorEl: null
}

export default Tooltip
