import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { TextField } from '@material-ui/core'
import Chip from '@material-ui/core/Chip'
import InputAdornment from '@material-ui/core/InputAdornment'

const LacchainAddNodeAuthorityField = ({
  value,
  onChange,
  label,
  variant,
  className
}) => {
  const [key, setKey] = useState()

  const handleOnFieldChange = (event) => {
    onChange({
      target: {
        value: {
          threshold: 1,
          keys: [
            {
              key: event.target.value,
              weight: 1
            }
          ],
          waits: [],
          accounts: []
        }
      }
    })
  }

  useEffect(() => {
    setKey(value?.keys?.[0]?.key || '')
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

LacchainAddNodeAuthorityField.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func,
  label: PropTypes.string,
  variant: PropTypes.string,
  className: PropTypes.string
}

export default LacchainAddNodeAuthorityField
