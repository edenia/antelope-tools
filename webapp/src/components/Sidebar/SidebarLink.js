import React from 'react'
import PropTypes from 'prop-types'

import { Chip, ListItem as MuiListItem, ListItemText } from '@mui/material'
import { rgba, darken } from 'polished'
import styled from 'styled-components'

import NavLink from './NavLink'

const Link = styled(MuiListItem)`
  span {
    color: ${(props) => props.theme.palette.neutral.darker};
  }
  &:hover span {
    color: ${(props) => props.theme.palette.neutral.darker};
  }
  &.${(props) => props.activeclassname} {
    background-color: ${(props) =>
      darken(0.06, props.theme.palette.background.default)};
    span {
      color: ${(props) => props.theme.palette.neutral.darker};
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
  classes: PropTypes.any,
}

export default SidebarLink
