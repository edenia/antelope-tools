import React, { useEffect, useState } from 'react'
import styled, { withTheme } from 'styled-components'
import { connect } from 'react-redux'
import { darken } from 'polished'
import {
  Badge,
  Grid,
  Hidden,
  InputBase,
  Menu,
  MenuItem,
  AppBar as MuiAppBar,
  IconButton as MuiIconButton,
  Toolbar
} from '@material-ui/core'
import { Menu as MenuIcon } from '@material-ui/icons'
import {
  Bell,
  MessageSquare,
  Search as SearchIcon,
  Power as PowerIcon
} from 'react-feather'
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

const Indicator = styled(Badge)`
  .MuiBadge-badge {
    background: ${(props) => props.theme.header.indicator.background};
    color: ${(props) => props.theme.palette.common.white};
  }
`

const Search = styled.div`
  border-radius: 2px;
  background-color: ${(props) => props.theme.header.background};
  display: none;
  position: relative;
  width: 100%;

  &:hover {
    background-color: ${(props) => darken(0.05, props.theme.header.background)};
  }

  ${(props) => props.theme.breakpoints.up('md')} {
    display: block;
  }
`

const SearchIconWrapper = styled.div`
  width: 50px;
  height: 100%;
  position: absolute;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 22px;
    height: 22px;
  }
`

const Input = styled(InputBase)`
  color: inherit;
  width: 100%;

  > input {
    color: ${(props) => props.theme.header.search.color};
    padding-top: ${(props) => props.theme.spacing(2.5)}px;
    padding-right: ${(props) => props.theme.spacing(2.5)}px;
    padding-bottom: ${(props) => props.theme.spacing(2.5)}px;
    padding-left: ${(props) => props.theme.spacing(12)}px;
    width: 160px;
  }
`

const Flag = styled.img`
  border-radius: 50%;
  width: 22px;
  height: 22px;
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
        <Flag src={`/languages/${currentLanguaje}.png`} alt={currentLanguaje} />
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
          <Grid item>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <Input placeholder="Search topics" />
            </Search>
          </Grid>
          <Grid item xs />
          <Grid item>
            <IconButton color="inherit">
              <Indicator badgeContent={3}>
                <MessageSquare />
              </Indicator>
            </IconButton>
            <IconButton color="inherit">
              <Indicator badgeContent={7}>
                <Bell />
              </Indicator>
            </IconButton>
            <LanguageMenu />
            <UserMenu ual={ual} />
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  </React.Fragment>
)

export default connect()(withTheme(Header))
