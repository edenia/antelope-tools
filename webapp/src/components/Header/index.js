import React, { useEffect, useState, lazy, Suspense } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'
import Hidden from '@mui/material/Hidden'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import AppBar from '@mui/material/AppBar'
import IconButton from '@mui/material/IconButton'
import Skeleton from '@mui/material/Skeleton'
import Button from '@mui/material/Button'
import Toolbar from '@mui/material/Toolbar'
import MenuIcon from '@mui/icons-material/Menu'
import LanguageIcon from '@mui/icons-material/Language'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import 'moment/locale/es'

import styles from './styles'
import AntelopeLogoSvg from './AntelopeLogo'

const AuthButton = lazy(() => import('./AuthButton'))

const useStyles = makeStyles(styles)

const languages = [
  {
    value: 'en',
    label: 'EN',
  },
  {
    value: 'es',
    label: 'ES',
  },
]

const HeaderLogo = () => {
  const classes = useStyles()
  return (
    <a href="https://antelope.tools/" rel="external" className={classes.imgHeaderLogo}>
      <AntelopeLogoSvg />
    </a>
  )
}

const LanguageMenu = () => {
  const classes = useStyles()
  const [anchorMenu, setAnchorMenu] = useState(null)
  const { i18n } = useTranslation('translations')
  const [currentLanguaje, setCurrentLanguaje] = useState('')

  const toggleMenu = (event) => {
    setAnchorMenu(event.currentTarget)
  }

  const closeMenu = (language) => {
    setAnchorMenu(null)

    if (typeof language === 'string') {
      moment.locale(language)
      i18n.changeLanguage(language)
    }
  }

  useEffect(() => {
    moment.locale(i18n.language.substring(0, 2))
    setCurrentLanguaje(i18n.language.substring(0, 2))
  }, [i18n.language])

  return (
    <Hidden smDown implementation="css">
      <Button
        startIcon={<LanguageIcon />}
        onClick={toggleMenu}
        className={classes.btnLanguage}
      >
        <span>{currentLanguaje.toUpperCase()}</span>
      </Button>
      <Menu
        id="menu-appbar"
        anchorEl={anchorMenu}
        open={Boolean(anchorMenu)}
        onClose={closeMenu}
      >
        {languages.map((language) => (
          <MenuItem
            key={`language-menu-${language.value}`}
            onClick={() => closeMenu(language.value)}
          >
            {language.label}
          </MenuItem>
        ))}
      </Menu>
    </Hidden>
  )
}

const Header = ({ onDrawerToggle, useConnectWallet = false }) => {
  const classes = useStyles()

  return (
    <AppBar className={classes.appBar} position="sticky" elevation={1}>
      <Toolbar>
        <Hidden mdUp>
          <IconButton
            className={classes.iconButton}
            color="inherit"
            aria-label="Open drawer"
            onClick={onDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
        <div className={classes.iconsHeader}>
          <div className={classes.HeaderLogo}>
            <HeaderLogo />
          </div>
          <div className={classes.userBox}>
            <LanguageMenu />
            {useConnectWallet && (
              <Suspense
                fallback={
                  <Skeleton variant="rectangular" width={210} height={40} />
                }
              >
                <AuthButton classes={classes} />
              </Suspense>
            )}
          </div>
        </div>
      </Toolbar>
    </AppBar>
  )
}

Header.propTypes = {
  onDrawerToggle: PropTypes.func,
  useConnectWallet: PropTypes.bool,
}

export default Header
