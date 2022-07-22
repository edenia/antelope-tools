import React from 'react'
import PropTypes from 'prop-types'
import Autocomplete from '@mui/material/Autocomplete'
import { TextField } from '@mui/material'
import { useTranslation } from 'react-i18next'

const LacchainAddEntityActionEntityTypeField = ({
  value,
  onChange,
  label,
  variant,
  className
}) => {
  const { t } = useTranslation(
    'lacchainAddEntityActionEntityTypeFieldComponent'
  )

  const options = [
    { value: 1, label: t('entityType1') },
    { value: 2, label: t('entityType2') }
  ]

  const handleOnFieldChange = (_, item) => {
    onChange(item?.value)
  }

  return (
    <Autocomplete
      className={className}
      options={options}
      getOptionLabel={(option) => {
        if (typeof option !== 'object') {
          return options.find((item) => item.value === option)?.label || ''
        }

        return option?.label || ''
      }}
      value={value || ''}
      onChange={handleOnFieldChange}
      renderInput={(params) => (
        <TextField {...params} label={label} variant={variant} />
      )}
    />
  )
}

LacchainAddEntityActionEntityTypeField.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
  label: PropTypes.string,
  variant: PropTypes.string,
  className: PropTypes.string
}

export default LacchainAddEntityActionEntityTypeField
