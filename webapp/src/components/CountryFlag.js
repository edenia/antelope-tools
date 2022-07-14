import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/material/styles'
import 'flag-icon-css/css/flag-icon.min.css'

import UnknowFlagIcon from './UnknowFlagIcon'

const useStyles = makeStyles((theme) => ({
  country: {
    marginRight: theme.spacing(0.5),
    marginLeft: theme.spacing(1)
  }
}))

const CountryFlag = ({ code = '' }) => {
  const classes = useStyles()

  return (
    <span className={classes.country}>
      {!code && <UnknowFlagIcon />}
      {code && (
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
