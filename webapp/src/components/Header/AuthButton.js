import React from 'react'
import PropTypes from 'prop-types'
import { Box, Menu, Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import AccountIcon from '@mui/icons-material/AccountCircle'
import FingerprintIcon from '@mui/icons-material/Fingerprint'
import ExitIcon from '@mui/icons-material/ExitToApp'

import useAuthBottonState from './useAuthBottonState'

const AuthButton = ({ classes }) => {
  const { t } = useTranslation()
  const [{ state }, { handleOpenMenu, handleCloseMenu, handleSignOut, login }] =
    useAuthBottonState()

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
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
            onClick={handleOpenMenu}
            className={classes.loginBtn}
            startIcon={<FingerprintIcon />}
          >
            {t('login')}
          </Button>
        )}
      </Box>
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
