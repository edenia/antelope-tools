import React from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@mui/styles'
import Button from '@mui/material/Button'

import { eosConfig } from '../../config'

import styles from './styles'

const useStyles = makeStyles(styles)

const ViewBPProfile = ({ producer, text }) => {
  const classes = useStyles()

  return (
    <Button
      aria-label={`BP ${producer?.owner} Profile Page`}
      className={classes.button}
      component={Link}
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
