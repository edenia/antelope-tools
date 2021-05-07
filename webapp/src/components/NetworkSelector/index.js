import React, { useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'

import styles from './styles'

const useStyles = makeStyles(styles)

const NetworkSelector = ({ title, options, networkLogo }) => {
  const classes = useStyles()
  const [state, setState] = useState({
    selected: -1,
    active: false
  })

  const toggleDropdown = () => {
    setState({
      ...state,
      active: !state.active
    })
  }

  const handleClick = (i) => {
    setState({
      ...state,
      selected: i,
      active: !state.active
    })
  }

  return (
    <Box className={classes.dropdown}>
      <Box onClick={() => toggleDropdown()} className={clsx(classes.toggle)}>
        <Typography component="p" variant="h5">
          {title}
        </Typography>
      </Box>
      <ul
        className={clsx(classes.list, { [classes.listActive]: state.active })}
      >
        {options.map((option, i) => {
          return (
            <li
              onClick={() => handleClick(i)}
              key={i}
              className={clsx(classes.listItem, {
                [classes.listItemActive]: i === state.selected
              })}
            >
              {option}
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
  options: [
    'EOS Mainnet',
    'Jungle Testnet',
    'Telos Mainnet',
    'WAX Mainnet',
    'LACChain Testnet'
  ],
  networkLogo: ''
}

export default NetworkSelector
