import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import AccountIcon from '@mui/icons-material/AccountCircle'
import FingerprintIcon from '@mui/icons-material/Fingerprint'
import ExitIcon from '@mui/icons-material/ExitToApp'

import useAuthBottonState from './useAuthBottonState'

const AuthButton = ({ classes }) => {
  const { t } = useTranslation()
  const [{ state }, { handleCloseMenu, handleSignOut, login }] =
    useAuthBottonState()

  return (
    <React.Fragment>
      <div className={classes.authBox}>
        {state?.ual?.activeUser ? (
          <>
            <Button className={classes.userBtn} startIcon={<AccountIcon />}>
              {state?.ual?.accountName || ''}
            </Button>
            <Button
              startIcon={<ExitIcon />}
              onClick={handleSignOut}
              className={classes.loginBtn}
            >
              {t('logout')}
            </Button>
          </>
        ) : (
          <Button
            onClick={() => login('anchor')}
            className={classes.loginBtn}
            startIcon={<FingerprintIcon />}
          >
            {t('login')}
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
