import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import TextField from '@mui/material/TextField'

import getAuthoritTemplate from '../../utils/get-authority-template'

const LacchainNewAccount = ({
  value,
  onChange,
  label,
  variant,
  className,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState()

  const handleOnFieldChange = (event) => {
    onChange({
      target: {
        value: getAuthoritTemplate(event.target.value)
      }
    })
  }

  useEffect(() => {
    if (!value) {
      return
    }

    try {
      setInternalValue(value?.keys[0]?.key || '')
    } catch (error) {}
  }, [value])

  return (
    <TextField
      {...props}
      className={className}
      value={internalValue || ''}
      onChange={handleOnFieldChange}
      label={label}
      variant={variant}
    />
  )
}

LacchainNewAccount.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
  label: PropTypes.string,
  variant: PropTypes.string,
  className: PropTypes.string
}

export default LacchainNewAccount
