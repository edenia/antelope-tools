import React from 'react'
import { makeStyles } from '@mui/styles'

import styles from './styles'

const useStyles = makeStyles(styles)

const ShowInfo = ({ cond, title, value }) => {
  const classes = useStyles()

  if (!cond && !value) return <></>

  return (
    <>
      <span className={classes.bold}>{title}</span>
      {value}
    </>
  )
}

export default ShowInfo
