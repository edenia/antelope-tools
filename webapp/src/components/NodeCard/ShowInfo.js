import React from 'react'
import { makeStyles } from '@mui/styles'

import styles from './styles'

const useStyles = makeStyles(styles)

const ShowInfo = ({ cond, title, value }) => {
  const classes = useStyles()

  if (!cond && !value) return <></>

  return (
    <>
      <dt className={classes.bold}>{title}</dt>
      <dd>{value}</dd>
    </>
  )
}

export default ShowInfo
