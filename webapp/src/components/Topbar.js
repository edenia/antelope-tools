import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/material/styles'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import IconButton from '@mui/material/IconButton'
import { useTranslation } from 'react-i18next'
import FingerprintIcon from '@mui/icons-material/Fingerprint'
import LogoutIcon from '@mui/icons-material/ExitToApp'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import LanguageSelector from './LanguageSelector'

const useStyles = makeStyles((theme) => ({
  sessionText: {
    marginLeft: 5,
    color: theme.palette.primary.contrastText,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'inline'
    }
  },
  link: {
    color: 'white',
    textDecoration: 'none'
  },
  box: {
    display: 'flex',
    justifyContent: 'flex-end',
    flex: 1
  }
}))

const Topbar = ({ user, onLogout, onLogin }) => {
  const classes = useStyles()
  const { t } = useTranslation('topbarComponent')

  return (
    <Box className={classes.box}>
      <LanguageSelector />
      {user && (
        <>
          <IconButton color="inherit">
            <AccountCircleIcon />
            <Typography className={classes.sessionText} variant="body1">
              {user.accountName}
            </Typography>
          </IconButton>
          <IconButton color="inherit" onClick={onLogout}>
            <LogoutIcon />
          </IconButton>
        </>
      )}
      {!user && (
        <IconButton color="inherit" onClick={onLogin}>
          <FingerprintIcon />
          <Typography className={classes.sessionText} variant="body1">
            {t('login')}
          </Typography>
        </IconButton>
      )}
    </Box>
  )
}

Topbar.propTypes = {
  user: PropTypes.object,
  onLogout: PropTypes.func,
  onLogin: PropTypes.func
}

export default Topbar
