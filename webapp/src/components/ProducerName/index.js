import React from 'react'
import { makeStyles } from '@mui/styles'
import styles from './styles'
import ProducerAvatar from 'components/ProducerAvatar'
import Typography from '@mui/material/Typography'

const useStyles = makeStyles(styles)

const ProducerName = ({ name, logo, text, account = '', size = 'small' }) => {
  const classes = useStyles()

  return (
    <div className={classes.producerNameContainer}>
      <ProducerAvatar
        logo={logo}
        name={name}
        classes={{
          avatar: size === 'big' ? classes.bigAvatar : classes.smallAvatar,
        }}
      />
      <div className={classes.nameContainer}>
        {account && <Typography variant="body1">{account}</Typography>}
        <Typography variant="h2">{name}</Typography>
        <Typography variant="body1">{text}</Typography>
      </div>
    </div>
  )
}

export default ProducerName
