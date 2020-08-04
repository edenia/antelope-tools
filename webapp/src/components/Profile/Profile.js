import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 'fit-content'
  },
  avatar: {
    width: 60,
    height: 60,
    cursor: 'pointer'
  },
  name: {
    marginTop: theme.spacing(1)
  }
}))

const Profile = ({ user, onClick }) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Avatar
        alt="Person"
        className={classes.avatar}
        src={user.profilePicture}
        onClick={onClick}
      />
      <Typography className={classes.name} variant="h4">
        {user.name}
      </Typography>
      <Typography variant="body2">{user.headline}</Typography>
    </div>
  )
}

Profile.propTypes = {
  user: PropTypes.object,
  onClick: PropTypes.func
}

export default Profile
