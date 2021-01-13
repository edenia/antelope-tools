import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { ExpandLess, ExpandMore } from '@material-ui/icons'
import {
  Box,
  Chip,
  Collapse,
  Drawer as MuiDrawer,
  Grid,
  List as MuiList,
  ListItem as MuiListItem,
  ListItemText,
  Typography
} from '@material-ui/core'
import styled from 'styled-components'
import { rgba, darken } from 'polished'
import { NavLink as RouterNavLink, withRouter } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PerfectScrollbar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css'

import routes from '../routes'

const NavLink = React.forwardRef((props, ref) => (
  <RouterNavLink innerRef={ref} {...props} />
))

const ExternalLink = React.forwardRef(({ to, children, className }, ref) => (
  <a
    ref={ref}
    href={to}
    className={className}
    target="_blank"
    rel="noopener noreferrer"
  >
    {children}
  </a>
))

ExternalLink.propTypes = {
  to: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string
}

const Drawer = styled(MuiDrawer)`
  border-right: 0;

  > div {
    border-right: 0;
  }
`

const Scrollbar = styled(PerfectScrollbar)`
  background-color: ${(props) => props.theme.sidebar.background};
`

const List = styled(MuiList)`
  background-color: ${(props) => props.theme.sidebar.background};
`

const ListItem = styled(MuiListItem)`
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
`

const Brand = styled(Box)`
  font-size: ${(props) => props.theme.typography.h5.fontSize};
  font-weight: ${(props) => props.theme.typography.fontWeightMedium};
  color: ${(props) => props.theme.sidebar.header.color};
  background-color: ${(props) => props.theme.sidebar.header.background};
  font-family: ${(props) => props.theme.typography.fontFamily};
  min-height: 56px;
  padding-left: ${(props) => props.theme.spacing(6)}px;
  padding-right: ${(props) => props.theme.spacing(6)}px;
  cursor: default;
  padding-bottom: 16px;

  ${(props) => props.theme.breakpoints.up('sm')} {
    min-height: 64px;
  }

  &:hover {
    background-color: ${(props) => props.theme.sidebar.header.background};
  }
`

const DashboardIcon = () => (
  <img
    alt="EOS Costa Rica - Open Source Projects"
    src="/eosio-dashboard.svg"
    width="200px"
    height="100px"
  />
)

const BrandIcon = styled(DashboardIcon)`
  margin-right: ${(props) => props.theme.spacing(2)}px;
  color: ${(props) => props.theme.sidebar.header.brand.color};
`

const Category = styled(ListItem)`
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

const CategoryText = styled(ListItemText)`
  margin: 0;
  span {
    color: ${(props) => props.theme.sidebar.color};
    font-size: ${(props) => props.theme.typography.body1.fontSize}px;
    font-weight: ${(props) => props.theme.sidebar.category.fontWeight};
    padding: 0 ${(props) => props.theme.spacing(4)}px;
  }
`

const CategoryIconLess = styled(ExpandLess)`
  color: ${(props) => rgba(props.theme.sidebar.color, 0.5)};
`

const CategoryIconMore = styled(ExpandMore)`
  color: ${(props) => rgba(props.theme.sidebar.color, 0.5)};
`

const Link = styled(ListItem)`
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

const LinkText = styled(ListItemText)`
  color: ${(props) => props.theme.sidebar.color};
  span {
    font-size: ${(props) => props.theme.typography.body1.fontSize}px;
  }
  margin-top: 0;
  margin-bottom: 0;
`

const LinkBadge = styled(Chip)`
  font-size: 11px;
  font-weight: ${(props) => props.theme.typography.fontWeightBold};
  height: 20px;
  position: absolute;
  right: 12px;
  top: 8px;
  background-color: ${(props) => props.theme.palette.secondary.main};

  span.MuiChip-label,
  span.MuiChip-label:hover {
    cursor: pointer;
    color: ${(props) => props.theme.sidebar.badge.color};
    padding-left: ${(props) => props.theme.spacing(2)}px;
    padding-right: ${(props) => props.theme.spacing(2)}px;
  }
`

const CategoryBadge = styled(LinkBadge)`
  top: 12px;
`

const SidebarSection = styled(Typography)`
  color: ${(props) => props.theme.sidebar.color};
  padding: ${(props) => props.theme.spacing(4)}px
    ${(props) => props.theme.spacing(6)}px
    ${(props) => props.theme.spacing(1)}px;
  opacity: 0.9;
  display: block;
  font-weight: 600;
`

const SidebarFooter = styled.div`
  background-color: ${(props) =>
    props.theme.sidebar.footer.background} !important;
  padding: ${(props) => props.theme.spacing(2.75)}px
    ${(props) => props.theme.spacing(4)}px;
  min-height: 61px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const SidebarFooterText = styled(Typography)`
  color: ${(props) => props.theme.sidebar.footer.color};
`

const SidebarFooterSubText = styled(Typography)`
  color: ${(props) => props.theme.sidebar.footer.color};
  font-size: 0.725rem;
  display: block;
  padding: 1px;
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
      <CategoryText>{name}</CategoryText>
      {isCollapsable ? (
        isOpen ? (
          <CategoryIconMore />
        ) : (
          <CategoryIconLess />
        )
      ) : null}
      {badge ? <CategoryBadge label={badge} /> : ''}
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

const SidebarLink = ({ name, icon, to, badge }) => (
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
    <LinkText>{name}</LinkText>
    {badge ? <LinkBadge label={badge} /> : ''}
  </Link>
)

SidebarLink.propTypes = {
  icon: PropTypes.node,
  name: PropTypes.string,
  to: PropTypes.string,
  badge: PropTypes.string
}

const Sidebar = ({ classes, staticContext, location, ...rest }) => {
  const { t } = useTranslation('routes')
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
    <Drawer variant="permanent" {...rest}>
      <Brand>
        <BrandIcon />
      </Brand>
      <Scrollbar>
        <List disablePadding>
          {routes
            .filter(({ name }) => !!name)
            .map((category, index) => (
              <ListItem key={index}>
                {category.header ? (
                  <SidebarSection>{t(category.header)}</SidebarSection>
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
                  />
                )}
              </ListItem>
            ))}
        </List>
      </Scrollbar>
      <SidebarFooter>
        <Grid container spacing={2}>
          <Grid item>
            <SidebarFooterText variant="body2">
              An open source project by{' '}
              <a
                href="https://eoscostarica.io/"
                target="_blank"
                rel="noopener noreferrer"
              >
                EOS Costa Rica
              </a>
            </SidebarFooterText>
            <SidebarFooterSubText />
          </Grid>
        </Grid>
      </SidebarFooter>
    </Drawer>
  )
}

Sidebar.propTypes = {
  classes: PropTypes.any,
  staticContext: PropTypes.any,
  location: PropTypes.any
}

export default withRouter(Sidebar)
