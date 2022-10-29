import React from 'react'
import PropTypes from 'prop-types'

const EqualIcon = ({ width, height, color }) => {
  return (
    <div>
      <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6 4H10V20H6V4Z"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14 4H18V20H14V4Z"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

EqualIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string
}

EqualIcon.defaultProps = {
  width: 24,
  height: 24,
  color: 'black'
}

export default EqualIcon
