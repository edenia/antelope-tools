import React, { useState, lazy, Suspense } from 'react'
import { useLocation } from 'react-router-dom'
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

import LocaleLink from 'components/LocaleLink'
import ToggleColorMode from 'components/ToggleColorMode'
import { generalConfig } from '../../config'

import AntelopeLogoSvg from './AntelopeLogo'
import styles from './styles'

const AuthButton = lazy(() => import('./AuthButton'))

const useStyles = makeStyles(styles)

const languages = generalConfig.languages.map(language => ({
  value: language,
  label: language.toUpperCase(),
}))

const HeaderLogo = () => {
  const classes = useStyles()
  return (
    <a
      href="https://antelope.tools/"
      rel="external"
      aria-label="Antelope Tools Homepage"
      className={classes.imgHeaderLogo}
    >
      <AntelopeLogoSvg />
    </a>
  )
}

const LanguageMenu = () => {
  const classes = useStyles()
  const [anchorMenu, setAnchorMenu] = useState(null)
  const { i18n } = useTranslation('translations')
  const location = useLocation()

  const toggleMenu = (event) => {
    setAnchorMenu(event.currentTarget)
  }

  const closeMenu = (language) => {
    setAnchorMenu(null)

    if (typeof language === 'string') {
      i18n.changeLanguage(language)
    }
  }

  return (
    <>
      <Button
        startIcon={<LanguageIcon />}
        onClick={toggleMenu}
        className={classes.btnLanguage}
      >
        <span>{i18n.language.substring(0, 2).toUpperCase()}</span>
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
            component={LocaleLink}
            to={location.pathname + location.search}
            locale={language.value}
          >
            {language.label}
          </MenuItem>
        ))}
      </Menu>
    </>
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
            <ToggleColorMode />
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
