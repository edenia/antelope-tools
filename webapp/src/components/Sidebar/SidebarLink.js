import React from 'react'
import PropTypes from 'prop-types'

import {
  Chip,
  ListItem as MuiListItem,
  ListItemText
} from '@mui/material'
import { rgba, darken } from 'polished'
import styled from 'styled-components'

import NavLink from './NavLink'

const Link = styled(MuiListItem)`
  span {
    color: ${(props) => rgba(props.theme.sidebar.color, 0.7)};
  }
  &:hover span {
    color: ${(props) => rgba(props.theme.sidebar.color, 0.9)};
  }
  &.${(props) => props.activeclassname} {
    background-color: ${(props) =>
    darken(0.06, props.theme.sidebar.background)};
    span {
      color: ${(props) => props.theme.sidebar.color};
    }
  }
`

const SidebarLink = ({ name, icon, to, badge, classes }) => (
  <Link
    button
    dense
    component={NavLink}
    exact
    to={to}
    activeclassname="active"
    href={to}
  >
    {icon}
    <ListItemText className={classes.linkText}>{name}</ListItemText>
    {badge ? <Chip className={classes.linkBadge} label={badge} /> : ''}
  </Link>
)

SidebarLink.propTypes = {
  icon: PropTypes.node,
  name: PropTypes.string,
  to: PropTypes.string,
  badge: PropTypes.string,
  classes: PropTypes.any
}

export default SidebarLink