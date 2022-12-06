import React from 'react'
import PropTypes from 'prop-types'
import Chip from '@mui/material/Chip'
import { makeStyles } from '@mui/styles'

import styles from './styles'

const useStyles = makeStyles(styles)

const ChipList = ({ list = [], title = '' }) => {
  const classes = useStyles()

  if (!list.length) return <></>

  return (
    <>
      <div className={classes.bold}>{title}</div>
      <div
        className={`${classes.chipsContainer} ${
          list.length > 10 ? classes.longList : classes.shortList
        }`}
      >
        {list.map((element, index) => (
          <Chip
            key={`chip-${title}-${element}-${index}`}
            className={classes.chip}
            size="small"
            variant="outlined"
            label={element}
          />
        ))}
      </div>
    </>
  )
}

ChipList.defaultProps = {
  title: '',
  list: [],
}

ChipList.propTypes = {
  title: PropTypes.string,
  list: PropTypes.array,
}

export default ChipList
