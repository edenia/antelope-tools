/* eslint camelcase: 0 */
import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Popover from '@material-ui/core/Popover'
import CloseIcon from '@material-ui/icons/Close'

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

const Tooltip = ({
  anchorEl,
  anchorOrigin,
  open,
  onClose,
  children,
  useAnchor
}) => {
  const classes = useStyles()
  // const restProps = useAnchor ? { anchorEl } : {}

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
  // useAnchor: PropTypes.bool
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
