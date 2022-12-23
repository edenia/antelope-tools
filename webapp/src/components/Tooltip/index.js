/* eslint camelcase: 0 */
import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'
import Popover from '@mui/material/Popover'
import CloseIcon from '@mui/icons-material/Close'

import styles from './styles'

const useStyles = makeStyles(styles)

const Tooltip = ({
  anchorEl,
  anchorOrigin,
  open,
  onClose,
  closeOnMouseLeave,
  hideCloseButton,
  children,
}) => {
  const classes = useStyles()

  return (
    <Popover
      open={open}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      transformOrigin={{
        vertical: 'center',
        horizontal: 'center',
      }}
      PaperProps={{ onMouseLeave: closeOnMouseLeave ? onClose : () => {} }}
      classes={{
        paper: classes.paper,
      }}
      anchorEl={anchorEl}
    >
      <div className={classes.popover}>
        <div className={classes.popoverClose}>
          {!hideCloseButton && (
            <CloseIcon className={classes.popoverCloseIcon} onClick={onClose} />
          )}
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
  anchorOrigin: PropTypes.object,
  closeOnMouseLeave: PropTypes.bool,
  hideCloseButton: PropTypes.bool
}

Tooltip.defaultProps = {
  onClose: () => {},
  closeOnMouseLeave: false,
  anchorOrigin: {
    vertical: 'center',
    horizontal: 'center',
  },
  anchorEl: null,
  hideCloseButton: false,
}

export default Tooltip
