import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { TextField } from '@material-ui/core'
import Chip from '@material-ui/core/Chip'
import InputAdornment from '@material-ui/core/InputAdornment'

const BlockSigningAuthority = ({
  value,
  onChange,
  label,
  variant,
  className,
  t
}) => {
  const [key, setKey] = useState()

  const handleOnFieldChange = (event) => {
    onChange({
      target: {
        value: [
          'block_signing_authority_v0',
          {
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
        ]
      }
    })
  }

  useEffect(() => {
    setKey(value[1]?.keys?.[0]?.key || '')
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
            <Chip label={t('public_key')} />
          </InputAdornment>
        )
      }}
    />
  )
}

BlockSigningAuthority.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func,
  label: PropTypes.string,
  variant: PropTypes.string,
  className: PropTypes.string,
  t: PropTypes.func
}

BlockSigningAuthority.defaultProps = {
  t: () => {}
}

export default BlockSigningAuthority
