import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { Chip, ListItem as MuiListItem, ListItemText } from '@mui/material'
import styled from 'styled-components'
import { darken } from 'polished'
import { eosConfig } from 'config'

const Category = styled(MuiListItem)`
  font-weight: ${(props) => props.theme.typography.fontWeightRegular};
  color: ${(props) => props.theme.palette.neutral.darker};
  display: flex;
  flex-direction: row;
  svg {
    opacity: 0.5;
    object-fit: contain;
    font-size: 20px;
    width: 20px;
    height: 20px;
  }
  .iconContainer {
    width: 20px;
    height: 20px;
  }
  &:hover,
  &.${(props) => props.activeclassname} {
    background-color: ${(props) =>
      darken(0.05, props.theme.palette.background.default)};
    svg {
      opacity: 1;
    }
  }
`

const SidebarCategory = ({
  name,
  icon,
  classes,
  isOpen,
  isCollapsable,
  badge,
  showOnlyIcons,
  ...rest
}) => {
  if (showOnlyIcons)
    return (
      <Category
        {...rest}
        aria-label={`Link to ${name}`}
        title={`${eosConfig.networkLabel} ${name}`}
      >
        <span title="" className="iconContainer">
          {icon}
        </span>
      </Category>
    )

  return (
    <Category {...rest} aria-label={`Link to ${name}`}>
      {icon}
      <ListItemText className={classes.categoryText}>{name}</ListItemText>
      {isCollapsable ? (
        isOpen ? (
          <ExpandMore className={classes.categoryIconMore} />
        ) : (
          <ExpandLess className={classes.categoryIconLess} />
        )
      ) : null}
      {badge ? (
        <Chip
          className={clsx(classes.linkBadge, classes.categoryBadge)}
          label={badge}
        />
      ) : (
        ''
      )}
    </Category>
  )
}

SidebarCategory.propTypes = {
  name: PropTypes.string,
  icon: PropTypes.node,
  classes: PropTypes.any,
  isOpen: PropTypes.bool,
  isCollapsable: PropTypes.bool,
  badge: PropTypes.string,
}

export default SidebarCategory
