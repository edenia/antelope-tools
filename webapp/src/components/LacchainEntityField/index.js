import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Autocomplete from '@mui/material/Autocomplete'
import { TextField } from '@mui/material'

import { useSharedState } from '../../context/state.context'

const LacchainEntityField = ({
  value,
  onChange,
  label,
  variant,
  className
}) => {
  const [lacchain] = useSharedState()
  const [options, setOptions] = useState([])

  const handleOnFieldChange = (_, newValue) => {
    onChange(newValue)
  }

  useEffect(() => {
    if (
      lacchain?.currentEntity?.name === value ||
      !lacchain?.currentEntity?.name
    ) {
      return
    }

    onChange(lacchain.currentEntity.name)
  }, [lacchain.currentEntity, value, onChange])

  useEffect(() => {
    setOptions((lacchain.entities || []).map((entity) => entity.name))
  }, [lacchain.entities])

  return (
    <Autocomplete
      className={className}
      options={options}
      value={value}
      onChange={handleOnFieldChange}
      disabled={!lacchain.isAdmin}
      renderInput={(params) => (
        <TextField {...params} label={label} variant={variant} />
      )}
    />
  )
}

LacchainEntityField.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  label: PropTypes.string,
  variant: PropTypes.string,
  className: PropTypes.string
}

export default LacchainEntityField
