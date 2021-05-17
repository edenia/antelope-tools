import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'

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
  const [open, setOpen] = useState(false)
  const [message, { hideMessage }] = useSnackbarMessageState()
  const classes = useStyles()

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
    hideMessage()
  }

  useEffect(() => {
    if (open === message.open) {
      return
    }

    setOpen(message.open)
  }, [open, message])

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert
        severity={message.type || 'info'}
        variant="filled"
        onClose={handleClose}
        className={classes.alert}
      >
        {message.content}
      </Alert>
    </Snackbar>
  )
}

export default SnackbarMessage
