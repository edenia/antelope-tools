import React, { useEffect, useState } from 'react'
import { makeStyles } from '@mui/styles'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import CloseIcon from '@mui/icons-material/Close'
import { Box, IconButton, Typography } from '@mui/material'

import { useSnackbarMessageState } from '../context/snackbar-message.context'

const useStyles = makeStyles((theme) => ({
  alert: {
    '& a': {
      color: theme.palette.info.contrastText,
      lineBreak: 'anywhere'
    }
  }
}))

const SnackbarMessage = () => {
  const [countdown, setCountdown] = useState(-1)
  const [lastTimeout, setLastTimeout] = useState()
  const [open, setOpen] = useState(false)
  const [message, { hideMessage }] = useSnackbarMessageState()
  const classes = useStyles()

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    hideMessage()
  }

  const handleCountdown = (value) => {
    setCountdown(value)

    if (value < 0) {
      return
    }

    if (lastTimeout) {
      clearTimeout(lastTimeout)
    }

    setLastTimeout(
      setTimeout(() => {
        handleCountdown(value - 1000)
      }, 1000)
    )
  }

  useEffect(() => {
    setOpen(message.open)

    if (message.open) {
      handleCountdown(message.autoHideDuration || 6000)
    }
    // eslint-disable-next-line
  }, [message])

  return (
    <>
      {open && (
        <Snackbar
          {...message}
          open={open}
          autoHideDuration={message.autoHideDuration || 6000}
          onClose={handleClose}
        >
          <Alert
            severity={message.type}
            variant="filled"
            onClose={handleClose}
            className={classes.alert}
            action={
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="end"
              >
                {message.content && countdown > 0 && (
                  <Typography>{countdown / 1000}s</Typography>
                )}
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={handleClose}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              </Box>
            }
          >
            {message.content}
          </Alert>
        </Snackbar>
      )}
    </>
  )
}

export default SnackbarMessage
