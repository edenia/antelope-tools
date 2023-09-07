import React, { memo } from 'react'
import { makeStyles } from '@mui/styles'
import PropTypes from 'prop-types'

import styles from './styles'
import MoreInfoTooltip from './MoreInfoTooltip'
import useOpenModalState from 'hooks/customHooks/useOpenModalState'

const useStyles = makeStyles(styles)

const CardTooltip = ({ helperText, children }) => {
  const classes = useStyles()
  const [{ open }, { handleOpen, handleClose }] = useOpenModalState()

  return (
    <div
      onMouseOver={handleOpen}
      onMouseMove={handleOpen}
      onMouseOut={handleClose}
      className={classes.titleContainer}
    >
      {children}
      <MoreInfoTooltip
        helperText={helperText}
        open={open}
        handleOpenTooltip={handleOpen}
        handleCloseTooltip={handleClose}
      />
    </div>
  )
}

CardTooltip.propTypes = {
  helperText: PropTypes.string,
  children: PropTypes.node,
}

CardTooltip.defaultProps = {
  helperText: '',
}

export default memo(CardTooltip)
