import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme, makeStyles } from '@mui/styles'
import { Grid, Hidden, Menu, MenuItem, AppBar, IconButton, Link } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Toolbar from '@mui/material/Toolbar'
import MenuIcon from '@mui/icons-material/Menu'
import LanguageIcon from '@mui/icons-material/Language'
import FingerprintIcon from '@mui/icons-material/Fingerprint'
import AccountIcon from '@mui/icons-material/AccountCircle'
import ExitIcon from '@mui/icons-material/ExitToApp'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import 'moment/locale/es'

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
    <Grid justifyContent='flex-start'>
      <Link href="https://mainnet.eosio.online/">
      <img alt="eosio dashboard" 
      src={'/eosio-dashboard.svg'}
      className={classes.imgHeaderLogo}
      />
      </Link>
    </Grid>
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
    <Grid display="flex">
      <Box justifyItems="flex-start">
        <HeaderLogo />
      </Box>

      <Button
        startIcon={<LanguageIcon />}
        onClick={toggleMenu}
        className={classes.btnLanguage}
      >
        {currentLanguaje.toUpperCase()}
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
    </Grid>
  )
}

const UserMenu = ({ ual }) => {
  const classes = useStyles()
  const { t } = useTranslation()

  const handleOnLogin = () => {
    ual.showModal()
  }

  const handleSignOut = () => {
    ual.logout()
  }

  return (
    <Grid display='flex'>
      {ual.activeUser && (
        <>
          <Button startIcon={<AccountIcon />}>
            {ual.activeUser.accountName}
          </Button>
          <Button
            startIcon={<ExitIcon />}
            onClick={handleSignOut}
            className={classes.btnLogin}
          >
            {t('logout')}
          </Button>
        </>
      )}
      {!ual.activeUser && (
        <Button
          startIcon={<FingerprintIcon />}
          onClick={handleOnLogin}
          className={classes.btnLogin}
        >
          {t('login')}
        </Button>
      )}
    </Grid>
  )
}

UserMenu.propTypes = {
  ual: PropTypes.any,
}

const Header = ({ ual, onDrawerToggle }) => {
  const theme = useTheme()
  const classes = useStyles()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

  return (
    <AppBar className={classes.appBar} position="sticky" elevation={0}>
      <Toolbar>
        <Grid container alignItems="center">
          {!isDesktop && (
            <>
              <Grid item md={0} xs={1}>
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
              </Grid>
              <Grid item md={3} xs={4}>
                <img
                  alt="eosio dashboard"
                  className={classes.imgHeaderLogo}
                  src={'/eosio-dashboard.svg'}
                />
              </Grid>
            </>
          )}
          <Grid item md={12} xs={7}>
            <div className={classes.userBox}>
              <LanguageMenu />
              <UserMenu ual={ual} />
            </div>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  )
}

Header.propTypes = {
  ual: PropTypes.any,
  onDrawerToggle: PropTypes.func,
}

export default Header
