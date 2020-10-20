import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Skeleton from '@material-ui/lab/Skeleton'

const useStyles = makeStyles(() => ({
  wrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}))

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
