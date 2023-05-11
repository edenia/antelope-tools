import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Menu, Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import AccountIcon from '@mui/icons-material/AccountCircle'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import ExitIcon from '@mui/icons-material/ExitToApp'

import Tooltip from 'components/Tooltip'

import useAuthBottonState from './useAuthBottonState'

const AuthButton = ({ classes }) => {
  const { t } = useTranslation()
  const [{ state }, { handleCloseMenu, handleSignOut, login }] =
    useAuthBottonState()
  const [anchorEl, setAnchorEl] = useState(null)

  const handlePopoverOpen = (target) => {
    setAnchorEl(target)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  const openPopOver = (event) => {
    handlePopoverOpen(event.target)
  }

  return (
    <React.Fragment>
      <div className={classes.authBox}>
        {state?.ual?.activeUser ? (
          <>
            <Tooltip 
              anchorEl={anchorEl}
              open={anchorEl !== null}
              hideCloseButton
              onClose={handlePopoverClose}
            >
              <Button
                startIcon={<ExitIcon />}
                onClick={handleSignOut}
                className={classes.loginBtn}
              >
                {t('logout')}
              </Button>
            </Tooltip> 
            <Button className={classes.userBtn} startIcon={<AccountIcon />} onClick={openPopOver}>
              {state?.ual?.accountName || ''}
            </Button>
          </>
        ) : (
          <Button
            onClick={() => {
              login('anchor')
              handlePopoverClose()
            }}
            className={classes.loginBtn}
            startIcon={<AccountBalanceWalletIcon />}
          >
            {t('connectWallet')}
          </Button>
        )}
      </div>
      <Menu
        className={classes.menuBox}
        anchorEl={state.elemRef}
        id="account-menu"
        open={state.openMenuWallets}
        onClose={handleCloseMenu}
        onClick={handleCloseMenu}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {(state?.ual?.authenticators || []).map((wallet) => {
          const style = wallet.getStyle()

          return (
            <div
              key={style.text}
              className={classes.menuItem}
              style={{
                backgroundColor: style.background,
                color: style.textColor,
              }}
              onClick={() => login(style.text.toLowerCase())}
            >
              <div className={classes.iconText}>
                <img src={style.icon} width={28} height={28} alt="wallet img" />
                {style.text}
              </div>
              <KeyboardArrowRightIcon />
            </div>
          )
        })}
      </Menu>
    </React.Fragment>
  )
}

AuthButton.propTypes = {
  classes: PropTypes.object,
}

export default AuthButton
