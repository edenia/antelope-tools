/* eslint camelcase: 0 */
import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Popover from '@mui/material/Popover'
import CloseIcon from '@mui/icons-material/Close'

const useStyles = makeStyles((theme) => ({
  paper: {
    border: '1px solid rgba(0, 0, 0, 0.12)'
  },
  popover: {
    padding: theme.spacing(2),
    paddingTop: 0
  },
  popoverClose: {
    textAlign: 'right',
    position: 'sticky',
    paddingTop: theme.spacing(2),
    top: 0
  },
  popoverCloseIcon: {
    cursor: 'pointer'
  }
}))

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
      <Box className={classes.popover}>
        <Box className={classes.popoverClose}>
          <CloseIcon className={classes.popoverCloseIcon} onClick={onClose} />
        </Box>
        <Box>{children}</Box>
      </Box>
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
