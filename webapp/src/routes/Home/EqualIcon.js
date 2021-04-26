import React from 'react'
import PropTypes from 'prop-types'
import Box from '@material-ui/core/Box'

const EqualIcon = ({ width, height }) => {
  return (
    <Box width={24} height={24}>
      <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6 4H10V20H6V4Z"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14 4H18V20H14V4Z"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Box>
  )
}

EqualIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number
}

EqualIcon.defaultProps = {
  width: 24,
  height: 24
}

export default EqualIcon
