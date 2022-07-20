import React from 'react'
import { makeStyles } from '@mui/styles'
import PropTypes from 'prop-types'
import Skeleton from '@mui/material/Skeleton'

import styles from './styles'

const useStyles = makeStyles(styles)

const ChartSkeleton = ({ variant, width, height }) => {
  const classes = useStyles()

  return (
    <div className={classes.wrapper}>
      <Skeleton
        variant={variant}
        width={width}
        height={height}
        animation="wave"
      />
    </div>
  )
}

ChartSkeleton.propTypes = {
  variant: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number
}

ChartSkeleton.defaultProps = {}

export default ChartSkeleton
