/* eslint camelcase: 0 */
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { getNodes, getSchedule, NODE_TYPE_ID } from '../utils/lacchain'

import MultipleSelect from './MultipleSelect'

const LacchainSetNodeInfoActionInfoField = ({
  label,
  variant,
  className,
  value,
  onChange
}) => {
  const [options, setOptions] = useState([])

  const handleChange = (value) => {
    onChange(value)
  }

  useEffect(() => {
    const init = async () => {
      const validators = await getNodes(NODE_TYPE_ID.validator)
      setOptions(
        validators.map((validator) => ({
          value: validator.name,
          label: validator.name
        }))
      )
      const schedule = await getSchedule()

      if (schedule?.active?.producers?.length > 0) {
        onChange(
          schedule.active.producers.map((producer) => producer.producer_name)
        )
      }
    }

    init()
    // eslint-disable-next-line
  }, [])

  return (
    <MultipleSelect
      label={label}
      variant={variant}
      className={className}
      value={value || []}
      onChange={handleChange}
      options={options}
    />
  )
}

LacchainSetNodeInfoActionInfoField.propTypes = {
  label: PropTypes.string,
  variant: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.array,
  onChange: PropTypes.func
}

export default LacchainSetNodeInfoActionInfoField
