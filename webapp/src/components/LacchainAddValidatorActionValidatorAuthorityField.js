import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { TextField } from '@material-ui/core'
import Chip from '@material-ui/core/Chip'
import InputAdornment from '@material-ui/core/InputAdornment'

const LacchainAddValidatorActionValidatorAuthorityField = ({
  value,
  onChange,
  label,
  variant,
  className
}) => {
  const [key, setKey] = useState()

  const handleOnFieldChange = (event) => {
    onChange([
      'block_signing_authority_v0',
      {
        threshold: 1,
        keys: [
          {
            key: event.target.value,
            weight: 1
          }
        ]
      }
    ])
  }

  useEffect(() => {
    if (!Array.isArray(value) || value.length < 2) {
      return
    }

    setKey(value[1]?.keys[0]?.key)
  }, [value])
  return (
    <TextField
      className={className}
      value={key || ''}
      label={label}
      variant={variant}
      onChange={handleOnFieldChange}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Chip label="public_key" />
          </InputAdornment>
        )
      }}
    />
  )
}

LacchainAddValidatorActionValidatorAuthorityField.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func,
  label: PropTypes.string,
  variant: PropTypes.string,
  className: PropTypes.string
}

export default LacchainAddValidatorActionValidatorAuthorityField
