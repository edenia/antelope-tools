import React from 'react'
import { makeStyles } from '@mui/styles'
import styles from './styles'
import ProducerAvatar from 'components/ProducerAvatar'
import Typography from '@mui/material/Typography'

const useStyles = makeStyles(styles)

const ProducerName = ({ name, logo, position }) => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <ProducerAvatar logo={logo} name={name} />
      <div className={classes.nameContainer}>
        <Typography variant="h2">{name}</Typography>
        <Typography variant="body1">{position}</Typography>
      </div>
    </div>
  )
}

export default ProducerName
