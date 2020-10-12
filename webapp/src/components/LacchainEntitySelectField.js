import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { TextField } from '@material-ui/core'

import { useSharedState } from '../context/state.context'

const LacchainEntitySelectField = ({
  value,
  onChange,
  label,
  variant,
  className
}) => {
  const [lacchain, { update }] = useSharedState()
  const [entities, setEntities] = useState([])
  const [options, setOptions] = useState([])

  const handleOnFieldChange = (event, newValue) => {
    onChange(newValue)
    update({
      currentEntity: entities.find((entity) => entity.name === newValue)
    })
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
    const entities = lacchain.entities || []
    setEntities(entities)
    setOptions(entities.map((entity) => entity.name))
  }, [lacchain.entities])

  return (
    <Autocomplete
      className={className}
      options={options}
      value={value}
      onChange={handleOnFieldChange}
      disabled={!lacchain.allowChangeEntity}
      renderInput={(params) => (
        <TextField {...params} label={label} variant={variant} />
      )}
    />
  )
}

LacchainEntitySelectField.propTypes = {
  children: PropTypes.node
}

export default LacchainEntitySelectField
