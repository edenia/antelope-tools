import React from 'react'
import { makeStyles } from '@mui/styles'
import Button from '@mui/material/Button'

import { eosConfig } from '../../config'

import LocaleLink from 'components/LocaleLink'

import styles from './styles'

const useStyles = makeStyles(styles)

const ViewBPProfile = ({ producer, text }) => {
  const classes = useStyles()

  return (
    <Button
      aria-label={`${text} ${producer?.owner} Page`}
      className={classes.button}
      component={LocaleLink}
      to={`/${eosConfig.producersRoute}/${producer?.owner}`}
      state={{ producer }}
      variant="contained"
      color="primary"
      mt={2}
    >
      {text}
    </Button>
  )
}

export default ViewBPProfile
