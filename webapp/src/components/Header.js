import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled, { withTheme } from 'styled-components'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme } from '@material-ui/core/styles'
import {
  Grid,
  Hidden,
  Menu,
  MenuItem,
  AppBar as MuiAppBar,
  IconButton as MuiIconButton
} from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Toolbar from '@material-ui/core/Toolbar'
import MenuIcon from '@material-ui/icons/Menu'
import LanguageIcon from '@material-ui/icons/Language'
import FingerprintIcon from '@material-ui/icons/Fingerprint'
import AccountIcon from '@material-ui/icons/AccountCircle'
import ExitIcon from '@material-ui/icons/ExitToApp'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import 'moment/locale/es'

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
      <Button startIcon={<LanguageIcon />} onClick={toggleMenu}>
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
          <Button startIcon={<ExitIcon />} onClick={handleSignOut}>
            {t('logout')}
          </Button>
        </>
      )}
      {!ual.activeUser && (
        <Button startIcon={<FingerprintIcon />} onClick={handleOnLogin}>
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
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

  return (
    <AppBar position="sticky" elevation={0}>
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
                  style={{ width: '90px', marginLeft: '15px' }}
                  src={'/eosio-dashboard.svg'}
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
