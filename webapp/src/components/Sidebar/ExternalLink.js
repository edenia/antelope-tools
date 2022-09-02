import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'

const ExternalLink = forwardRef(function ExternalLink(
  { to, children, className },
  ref
) {
  return (
    <a
      ref={ref}
      href={to}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  )
})

ExternalLink.propTypes = {
  to: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string
}

export default ExternalLink