import React, { forwardRef } from 'react'
import { NavLink } from 'react-router-dom'

const CustomRouterLink = forwardRef((props, ref) => (
  <div ref={ref} style={{ flexGrow: 1 }}>
    <NavLink {...props} />
  </div>
))

export default CustomRouterLink
