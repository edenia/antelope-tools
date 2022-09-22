import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'
import 'flag-icon-css/css/flag-icons.css'

import UnknowFlagIcon from '../UnknowFlagIcon'

import styles from './styles'

const useStyles = makeStyles(styles)

const CountryFlag = ({ code = '' }) => {
  const classes = useStyles()

  return (
    <span className={classes.country}>
      {!code && <UnknowFlagIcon />}
      {!!code && (
        <span
          className={`flag-icon flag-icon-squared flag-icon-${code.toLocaleLowerCase()}`}
        />
      )}
    </span>
  )
}

CountryFlag.propTypes = {
  code: PropTypes.string
}

export default CountryFlag
