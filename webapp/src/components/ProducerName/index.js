import React, { memo } from 'react'
import { makeStyles } from '@mui/styles'
import Typography from '@mui/material/Typography'

import ProducerAvatar from 'components/ProducerAvatar'

import styles from './styles'

const useStyles = makeStyles(styles)

const ProducerName = ({ name, logo, text, lazy = true, account = '', size = 'small' }) => {
  const classes = useStyles()
  const isBig = size === 'big'

  return (
    <div className={classes.producerNameContainer}>
      <ProducerAvatar
        logo={logo}
        name={name}
        lazy={lazy}
        classes={{
          avatar: isBig ? classes.bigAvatar : classes.smallAvatar,
        }}
      />
      <div
        className={`${classes.nameContainer} ${
          isBig ? classes.bigContainer : classes.smallContainer
        }`}
      >
        {account && (
          <Typography variant="body1" className={classes.bold}>
            {account}
          </Typography>
        )}
        {name && <Typography variant="h2">{name}</Typography>}
        <Typography variant="body2">{text}</Typography>
      </div>
    </div>
  )
}

export default memo(ProducerName)
