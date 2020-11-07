import React, { useEffect, useState } from 'react'
import styled, { withTheme } from 'styled-components'
import {
  Grid,
  Hidden,
  Menu,
  MenuItem,
  AppBar as MuiAppBar,
  IconButton as MuiIconButton,
  Toolbar
} from '@material-ui/core'
import { Menu as MenuIcon } from '@material-ui/icons'
import { Power as PowerIcon } from 'react-feather'
import { useTranslation } from 'react-i18next'

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

const Flag = styled.img`
  border-radius: 50%;
`

const languages = [
  {
    value: 'en',
    label: 'English'
  },
  {
    value: 'es',
    label: 'Español'
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
      i18n.changeLanguage(language)
    }
  }

  useEffect(() => {
    setCurrentLanguaje(i18n.language.substring(0, 2))
  }, [i18n.language])

  return (
    <React.Fragment>
      <IconButton
        aria-owns={Boolean(anchorMenu) ? 'menu-appbar' : undefined}
        aria-haspopup="true"
        onClick={toggleMenu}
        color="inherit"
      >
        <Flag
          width="22px"
          height="22px"
          srcset={`languages/${currentLanguaje}.png, languages/${currentLanguaje}-2x.png 2x, languages/${currentLanguaje}-3x.png 3x`}
          src={`/languages/${currentLanguaje}.png`}
          alt={currentLanguaje}
        />
      </IconButton>
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
    </React.Fragment>
  )
}

const UserMenu = ({ ual }) => {
  const [anchorMenu, setAnchorMenu] = useState(null)

  const toggleMenu = (event) => {
    setAnchorMenu(event.currentTarget)
  }

  const closeMenu = () => {
    setAnchorMenu(null)
  }

  const handleOnLogin = () => {
    ual.showModal()
    setAnchorMenu(null)
  }

  const handleSignOut = () => {
    ual.logout()
    setAnchorMenu(null)
  }

  return (
    <React.Fragment>
      <IconButton
        aria-owns={Boolean(anchorMenu) ? 'menu-appbar' : undefined}
        aria-haspopup="true"
        onClick={toggleMenu}
        color="inherit"
        aria-label="account"
      >
        <PowerIcon />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorMenu}
        open={Boolean(anchorMenu)}
        onClose={closeMenu}
      >
        {!ual.activeUser && <MenuItem onClick={handleOnLogin}>Login</MenuItem>}
        {ual.activeUser && (
          <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
        )}
      </Menu>
    </React.Fragment>
  )
}

const Header = ({ ual, onDrawerToggle }) => (
  <React.Fragment>
    <AppBar position="sticky" elevation={0}>
      <Toolbar>
        <Grid container alignItems="center">
          <Hidden mdUp>
            <Grid item>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={onDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            </Grid>
          </Hidden>
          <Grid item />
          <Grid item xs />
          <Grid item>
            <LanguageMenu />
            <UserMenu ual={ual} />
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  </React.Fragment>
)

export default withTheme(Header)
