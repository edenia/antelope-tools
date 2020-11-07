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

const NodeCard = ({ anchorEl, open, onClose, children }) => {
  const classes = useStyles()

  return (
    <Popover
      open={open}
      onClose={onClose}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'center'
      }}
      transformOrigin={{
        vertical: 'center',
        horizontal: 'center'
      }}
      classes={{
        paper: classes.paper
      }}
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

NodeCard.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  children: PropTypes.node
}

NodeCard.defaultProps = {
  onClose: () => {}
}

export default NodeCard
