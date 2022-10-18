import React from 'react'
import { Chip } from '@mui/material'
import { makeStyles } from '@mui/styles'

import styles from './styles'

const useStyles = makeStyles(styles)

const ChipList = ({ list = [], title = '' }) => {
  const classes = useStyles()

  if (!list.length) return <></>

  return (
    <div className={classes.chip}>
      <dt className={classes.bold}>{title}</dt>
      {list.map((element, index) => (
        <Chip
          key={`chip-${title}-${element}-${index}`}
          size="small"
          variant="outlined"
          label={element}
        />
      ))}
    </div>
  )
}

export default ChipList
