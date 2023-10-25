import React, { forwardRef } from 'react'
import { NavLink as RouterNavLink } from 'react-router-dom'

const NavLink = forwardRef(function NavLink(props, ref) {
  return <RouterNavLink ref={ref} {...props} />
})

export default NavLink
