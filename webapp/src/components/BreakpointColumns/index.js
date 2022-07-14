import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@mui/material/styles'

import ColumnCreator from './ColumnCreator'

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(3, 0, 2, 0)
  },
  paper: {
    marginBottom: theme.spacing(4)
  },
  masonryGrid: {
    display: 'flex',
    marginLeft: theme.spacing(-4),
    width: 'inherit'
  },
  masonryColumn: {
    paddingLeft: theme.spacing(4),
    backgroundClip: 'padding-box'
  }
}))

const BreakpointMasonry = ({ children }) => {
  const classes = useStyles()
  const theme = useTheme()

  const breakpointCols = {
    default: 4,
    [theme.breakpoints.values.xl]: 3,
    [theme.breakpoints.values.lg]: 3,
    [theme.breakpoints.values.md]: 2,
    [theme.breakpoints.values.sm]: 1,
    [theme.breakpoints.values.xs]: 1
  }

  return (
    <ColumnCreator
      breakpointCols={breakpointCols}
      className={classes.masonryGrid}
      columnClassName={classes.masonryColumn}
    >
      {children}
    </ColumnCreator>
  )
}

BreakpointMasonry.propTypes = {
  children: PropTypes.node
}

export default BreakpointMasonry
