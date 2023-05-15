import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import AccountIcon from '@mui/icons-material/AccountCircle'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import ExitIcon from '@mui/icons-material/ExitToApp'

import useAuthBottonState from './useAuthBottonState'

const LogOutButton = ({ handleSignOut, classes }) => {
  return (
    <div className={classes.logoutContainer}>
      <ExitIcon onClick={handleSignOut} className={classes.loginBtn} />
    </div>
  )
}

const AuthButton = ({ classes }) => {
  const { t } = useTranslation()
  const [{ state }, { handleCloseMenu, handleSignOut, login }] =
    useAuthBottonState()

  return (
    <React.Fragment>
      <div className={classes.authBox}>
        <div className={classes.accountContainer}>
          {state?.ual?.activeUser ? (
            <>
              <AccountIcon className={classes.userBtn} />
              <Typography component="span" variant="h5">
                {state?.ual?.accountName || ''}
              </Typography>
            </>
          ) : (
            <Button
              onClick={() => login('anchor')}
              className={`${classes.loginBtn} ${classes.connectWalletBtn}`}
            >
              <AccountBalanceWalletIcon />
              <Typography component="span" variant="h5">
                {t('connectWallet')}
              </Typography>
            </Button>
          )}
        </div>
        <LogOutButton
          handleSignOut={() => {
            if (state?.ual?.activeUser) {
              handleSignOut()
            }
          }}
          classes={classes}
        />
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
