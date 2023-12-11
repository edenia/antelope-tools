import React, { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink as RouterNavLink } from 'react-router-dom'

import { getLocalePath } from '../../utils/url-localization'

const NavLink = forwardRef(function NavLink(props, ref) {
  const { i18n } = useTranslation()

  return (
    <RouterNavLink
      {...props}
      to={getLocalePath(props.to, i18n.language)}
      ref={ref}
    />
  )
})

export default NavLink
