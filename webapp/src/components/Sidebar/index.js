import React, { useState, forwardRef } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { ExpandLess, ExpandMore } from '@material-ui/icons'
import {
  Box,
  Chip,
  Collapse,
  Drawer as MuiDrawer,
  List as MuiList,
  ListItem as MuiListItem,
  ListItemText,
  Typography
} from '@material-ui/core'
import styled from 'styled-components'
import { makeStyles } from '@material-ui/styles'
import { rgba, darken } from 'polished'
import { NavLink as RouterNavLink, withRouter } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PerfectScrollbar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css'

import routes from '../../routes'
import { eosConfig } from '../../config'

import styles from './styles'

const useStyles = makeStyles((theme) => styles(theme, rgba))

const NavLink = forwardRef(function NavLink(props, ref) {
  return <RouterNavLink innerRef={ref} {...props} />
})

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

const DashboardIcon = ({ className }) => {
  if (eosConfig.networkName.toLowerCase().includes('airwire')) {
    return (
      <img
        alt="EOS Costa Rica - Open Source Projects"
        src="/airware.webp"
        className={className.airWareIcon}
      />
    )
  }

  return (
    <img
      alt="EOS Costa Rica - Open Source Projects"
      src="/eosio-dashboard.svg"
      className={className.brandIcon}
    />
  )
}

const Category = styled(MuiListItem)`
  padding-top: ${(props) => props.theme.spacing(3)}px;
  padding-bottom: ${(props) => props.theme.spacing(3)}px;
  padding-left: ${(props) => props.theme.spacing(6)}px;
  padding-right: ${(props) => props.theme.spacing(5)}px;
  font-weight: ${(props) => props.theme.typography.fontWeightRegular};
  color: ${(props) => props.theme.sidebar.color};
  display: flex;
  flex-direction: row;

  svg {
    opacity: 0.5;
    font-size: 20px;
    width: 20px;
    height: 20px;
  }

  &:hover,
  &.${(props) => props.activeClassName} {
    background-color: ${(props) =>
      darken(0.05, props.theme.sidebar.background)};
    svg {
      opacity: 1;
    }
  }
`

const Link = styled(MuiListItem)`
  padding-left: ${(props) => props.theme.spacing(15)}px;
  padding-top: ${(props) => props.theme.spacing(2)}px;
  padding-bottom: ${(props) => props.theme.spacing(2)}px;

  span {
    color: ${(props) => rgba(props.theme.sidebar.color, 0.7)};
  }

  &:hover span {
    color: ${(props) => rgba(props.theme.sidebar.color, 0.9)};
  }

  &.${(props) => props.activeClassName} {
    background-color: ${(props) =>
      darken(0.06, props.theme.sidebar.background)};

    span {
      color: ${(props) => props.theme.sidebar.color};
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
  ...rest
}) => {
  return (
    <Category {...rest}>
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
  badge: PropTypes.string
}

const SidebarLink = ({ name, icon, to, badge, classes }) => (
  <Link
    button
    dense
    component={NavLink}
    exact
    to={to}
    activeClassName="active"
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

const Sidebar = ({ classes, staticContext, location, ...rest }) => {
  const { t } = useTranslation('routes')
  const classesStyle = useStyles()
  const initOpenRoutes = () => {
    /* Open collapse element that matches current url */
    const pathName = location.pathname

    let _routes = {}

    routes.forEach((route, index) => {
      const isActive = pathName.indexOf(route.path) === 0
      const isOpen = route.open
      const isHome = route.containsHome && pathName === '/'

      _routes = Object.assign({}, _routes, {
        [index]: isActive || isOpen || isHome
      })
    })

    return _routes
  }

  const [openRoutes, setOpenRoutes] = useState(() => initOpenRoutes())

  const toggle = (index) => {
    // Collapse all elements
    Object.keys(openRoutes).forEach(
      (item) =>
        openRoutes[index] ||
        setOpenRoutes((openRoutes) =>
          Object.assign({}, openRoutes, { [item]: false })
        )
    )

    // Toggle selected element
    setOpenRoutes((openRoutes) =>
      Object.assign({}, openRoutes, { [index]: !openRoutes[index] })
    )
  }

  return (
    <MuiDrawer variant="permanent" className={classesStyle.drawer} {...rest}>
      <Box className={classesStyle.brand}>
        <DashboardIcon className={classesStyle} />
      </Box>
      <PerfectScrollbar className={classesStyle.scrollbar}>
        <MuiList className={classesStyle.list} disablePadding>
          {routes
            .filter(({ name }) => !!name)
            .map((category, index) => (
              <MuiListItem className={classesStyle.listItem} key={index}>
                {category.header ? (
                  <Typography className={classesStyle.sidebarSection}>
                    {t(category.header)}
                  </Typography>
                ) : null}

                {category.children ? (
                  <Box width="100%">
                    <SidebarCategory
                      isOpen={!openRoutes[index]}
                      name={t(`${category.path}>sidebar`)}
                      icon={category.icon}
                      onClick={() => toggle(index)}
                      isCollapsable
                      button
                      classes={classesStyle}
                    />

                    <Collapse
                      in={openRoutes[index]}
                      timeout="auto"
                      unmountOnExit
                    >
                      {category.children.map((route, index) => (
                        <SidebarLink
                          key={`sidebar-link${index}`}
                          name={route.name}
                          to={route.path}
                          icon={route.icon}
                          badge={route.badge}
                          classes={classesStyle}
                        />
                      ))}
                    </Collapse>
                  </Box>
                ) : (
                  <SidebarCategory
                    isCollapsable={false}
                    name={t(
                      category.path.includes('http')
                        ? category.name
                        : `${category.path}>sidebar`
                    )}
                    to={category.path}
                    activeClassName="active"
                    component={
                      category.path.includes('http') ? ExternalLink : NavLink
                    }
                    icon={category.icon}
                    exact
                    badge={category.badge}
                    classes={classesStyle}
                  />
                )}
              </MuiListItem>
            ))}
        </MuiList>
      </PerfectScrollbar>
    </MuiDrawer>
  )
}

Sidebar.propTypes = {
  classes: PropTypes.any,
  staticContext: PropTypes.any,
  location: PropTypes.any
}

export default withRouter(Sidebar)
