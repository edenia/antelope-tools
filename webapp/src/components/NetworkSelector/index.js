import React, { useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import Box from '@material-ui/core/Box'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'

import styles from './styles'

const useStyles = makeStyles(styles)

const NetworkSelector = ({ title, options, networkLogo }) => {
  const classes = useStyles()
  const [selected, setSelected] = useState(-1)
  const [open, setOpen] = useState(false)

  const toggleDropdown = () => {
    setOpen(!open)
  }

  const handleClick = (i, url) => {
    setSelected(i)
    setOpen(!open)

    window.open(url, '_blank').focus()
  }

  return (
    <Box className={classes.dropdown}>
      <Box onClick={toggleDropdown} className={clsx(classes.toggle)}>
        <Typography component="p" variant="h5">
          {title}
        </Typography>
        <ExpandMoreIcon className={classes.expandMoreIcon} />
      </Box>
      <ul className={clsx(classes.list, { [classes.listActive]: open })}>
        {options.map((option, i) => {
          return (
            <li
              onClick={() => handleClick(i, option.value)}
              key={i}
              className={clsx(classes.listItem, {
                [classes.listItemActive]: i === selected
              })}
            >
              {option.label}
            </li>
          )
        })}
      </ul>
      <Box className={classes.networkLogo}>
        <img src={networkLogo} alt="network logo" />
      </Box>
    </Box>
  )
}

NetworkSelector.propTypes = {
  title: PropTypes.string,
  options: PropTypes.array,
  networkLogo: PropTypes.string
}

NetworkSelector.defaultProps = {
  title: '',
  options: [],
  networkLogo: ''
}

export default NetworkSelector
