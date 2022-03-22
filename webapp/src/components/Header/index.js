import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled, { withTheme } from 'styled-components'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme, makeStyles } from '@mui/styles'
import {
  Grid,
  Hidden,
  Menu,
  MenuItem,
  AppBar as MuiAppBar,
  IconButton as MuiIconButton
} from '@mui/material'
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

const AppBar = styled(MuiAppBar)`
  background: ${(props) => props.theme.header.background};
  color: ${(props) => props.theme.header.color};
  box-shadow: ${(props) => props.theme.shadows[1]};
`

const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`

const UserBox = styled(Box)`
  display: flex;
  float: right;
  justify-content: center;
  align-items: center;
  button {
    color: #757575;
  }
`

const languages = [
  {
    value: 'en',
    label: 'EN'
  },
  {
    value: 'es',
    label: 'ES'
  }
]

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
    <Box>
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
    </Box>
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
    <Box>
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
    </Box>
  )
}

UserMenu.propTypes = {
  ual: PropTypes.any
}

const Header = ({ ual, onDrawerToggle }) => {
  const theme = useTheme()
  const classes = useStyles()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

  return (
    <AppBar position="sticky" elevation={0} sx={{ backgroundColor: 'white' }}>
      <Toolbar>
        <Grid container alignItems="center">
          {!isDesktop && (
            <>
              <Grid item md={0} xs={1}>
                <Hidden mdUp>
                  <IconButton
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
                  className={classes.imgHeaderLogo}
                  src={'/eosio-dashboard.svg'}
                  alt="eosio dashboard"
                />
              </Grid>
            </>
          )}
          <Grid item md={12} xs={7}>
            <UserBox>
              <LanguageMenu />
              <UserMenu ual={ual} />
            </UserBox>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  )
}

Header.propTypes = {
  ual: PropTypes.any,
  onDrawerToggle: PropTypes.func
}

export default withTheme(Header)
