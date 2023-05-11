import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'
import { Hidden, Menu, MenuItem, AppBar, IconButton } from '@mui/material'
import Button from '@mui/material/Button'
import Toolbar from '@mui/material/Toolbar'
import MenuIcon from '@mui/icons-material/Menu'
import LanguageIcon from '@mui/icons-material/Language'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import 'moment/locale/es'

import AuthButton from './AuthButton'
import styles from './styles'

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
    <a href="https://antelope.tools/" rel="external">
      <img
        alt="antelope tools dashboard"
        src={'/antelope-tools.svg'}
        width={145}
        height={64}
        className={classes.imgHeaderLogo}
      />
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
    <>
      <Button
        startIcon={<LanguageIcon />}
        onClick={toggleMenu}
        className={classes.btnLanguage}
      >
        <span className={classes.mobileHidden}>
          {currentLanguaje.toUpperCase()}
        </span>
      </Button>
      <Menu
        id="menu-appbar"
        anchorEl={anchorMenu}
        open={Boolean(anchorMenu)}
        onClose={closeMenu}
        className={classes.cardShadow}
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
    </>
  )
}

const Header = ({ onDrawerToggle }) => {
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
            <AuthButton classes={classes} />
          </div>
        </div>
      </Toolbar>
    </AppBar>
  )
}

Header.propTypes = {
  onDrawerToggle: PropTypes.func,
}

export default Header
