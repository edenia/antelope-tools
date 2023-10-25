import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Collapse,
  Drawer as MuiDrawer,
  Hidden,
  List as MuiList,
  ListItem as MuiListItem,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import LanguageIcon from '@mui/icons-material/Language'
import { makeStyles } from '@mui/styles'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PerfectScrollbar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css'
import moment from 'moment'

import routes from '../../routes'

import styles from './styles'
import NavLink from './NavLink'
import ExternalLink from './ExternalLink'
import SidebarCategory from './SidebarCategory'
import SidebarLink from './SidebarLink'

const useStyles = makeStyles(styles)

const Sidebar = ({ classes, staticContext, onDrawerToggle, ...rest }) => {
  const { t } = useTranslation('routes')
  const location = useLocation()
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
        [index]: isActive || isOpen || isHome,
      })
    })

    return _routes
  }

  const [openRoutes, setOpenRoutes] = useState(() => initOpenRoutes())
  const { i18n } = useTranslation('translations')

  const toggle = (index) => {
    // Collapse all elements
    Object.keys(openRoutes).forEach(
      (item) =>
        openRoutes[index] ||
        setOpenRoutes((openRoutes) =>
          Object.assign({}, openRoutes, { [item]: false }),
        ),
    )

    // Toggle selected element
    setOpenRoutes((openRoutes) =>
      Object.assign({}, openRoutes, { [index]: !openRoutes[index] }),
    )
  }

  const LanguageSelector = () => {
    return (
      <MuiListItem
        className={`${classesStyle.listItem} ${classesStyle.divider}`}
      >
        <Typography className={classesStyle.sidebarSection}>
          {t('options')}
        </Typography>
        <SidebarCategory
          isCollapsable={false}
          name={t('setLanguage>sidebar')}
          icon={<LanguageIcon />}
          activeclassname="active"
          showOnlyIcons={!rest.open}
          classes={classesStyle}
          onClick={() => {
            moment.locale(i18n.language === 'es' ? 'en' : 'es')
            i18n.changeLanguage(i18n.language === 'es' ? 'en' : 'es')
          }}
        />
      </MuiListItem>
    )
  }

  return (
    <MuiDrawer
      variant="permanent"
      className={classesStyle.drawer}
      onClose={onDrawerToggle}
      {...rest}
    >
      <PerfectScrollbar className={classesStyle.scrollbar}>
        <div className={classesStyle.button}>
          <IconButton
            className={classesStyle.iconButton}
            color="inherit"
            aria-label="Open drawer"
            onClick={onDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
        </div>
        <MuiList className={classesStyle.list} disablePadding>
          {routes
            .filter(({ name }) => !!name)
            .map((category, index) => (
              <Tooltip
                title={
                  !rest.open ? (
                    <div className={classesStyle.tooltip}>
                      {t(`${category.path}>sidebar`)}
                    </div>
                  ) : (
                    ''
                  )
                }
                arrow
                placement="left"
                key={`category-${category.name}-${index}`}
              >
                <MuiListItem
                  className={`${classesStyle.listItem} ${
                    category.header ? classesStyle.divider : ''
                  }`}
                >
                  {category.header ? (
                    <>
                      {rest.open && (
                        <Typography className={classesStyle.sidebarSection}>
                          {t(category.header)}
                        </Typography>
                      )}
                    </>
                  ) : null}

                  {category.children ? (
                    <div width="100%">
                      <SidebarCategory
                        isOpen={!openRoutes[index]}
                        name={t(`${category.path}>sidebar`)}
                        icon={category.icon}
                        onClick={() => toggle(index)}
                        isCollapsable
                        button
                        showOnlyIcons={!rest.open}
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
                    </div>
                  ) : (
                    <SidebarCategory
                      isCollapsable={false}
                      name={t(
                        category.path.includes('http')
                          ? category.name
                          : `${category.path}>sidebar`,
                      )}
                      to={category.path}
                      activeclassname="active"
                      component={
                        category.path.includes('http') ? ExternalLink : NavLink
                      }
                      icon={category.icon}
                      exact="true"
                      badge={category.badge}
                      showOnlyIcons={!rest.open}
                      classes={classesStyle}
                    />
                  )}
                </MuiListItem>
              </Tooltip>
            ))}
          <Hidden smUp>
            <LanguageSelector />
          </Hidden>
        </MuiList>
      </PerfectScrollbar>
    </MuiDrawer>
  )
}

Sidebar.propTypes = {
  classes: PropTypes.any,
  staticContext: PropTypes.any,
  location: PropTypes.any,
}

export default Sidebar
