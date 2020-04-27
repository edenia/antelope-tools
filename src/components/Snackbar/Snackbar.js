import React from 'react'
import PropTypes from 'prop-types'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'
import AlertTitle from '@material-ui/lab/AlertTitle'

const Profile = ({
  open,
  title,
  message,
  elevation = 6,
  autoHideDuration = 5000,
  onClose,
  ...props
}) => (
  <Snackbar open={open} autoHideDuration={autoHideDuration} onClose={onClose}>
    <Alert elevation={elevation} {...props}>
      {title && <AlertTitle>{title}</AlertTitle>}
      {message}
    </Alert>
  </Snackbar>
)

Profile.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  message: PropTypes.string,
  elevation: PropTypes.number,
  autoHideDuration: PropTypes.number,
  onClose: PropTypes.func
}

export default Profile
