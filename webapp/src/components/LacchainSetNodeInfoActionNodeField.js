import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { TextField } from '@material-ui/core'

import { useSharedState } from '../context/state.context'

const LacchainSetNodeInfoActionNodeField = ({
  value,
  onChange,
  label,
  variant,
  className
}) => {
  const [lacchain, { update }] = useSharedState()
  const [nodes, setNodes] = useState([])
  const [options, setOptions] = useState([])

  const handleOnFieldChange = (event, newValue) => {
    onChange(newValue)
    update({
      currentNode: nodes.find((node) => node.name === newValue)
    })
  }

  useEffect(() => {
    if (lacchain?.currentNode?.name === value || !lacchain?.currentNode?.name) {
      return
    }

    onChange(lacchain.currentNode.name)
  }, [lacchain.currentNode, value, onChange])

  useEffect(() => {
    const nodes = lacchain.nodes || []

    setNodes(nodes)
    setOptions(
      nodes
        .filter(
          (node) =>
            lacchain.isAmin || node.entity === lacchain.currentEntity?.name
        )
        .map((entity) => entity.name)
    )
  }, [lacchain.nodes, lacchain.isAmin, lacchain.currentEntity])

  return (
    <Autocomplete
      className={className}
      options={options}
      value={value}
      onChange={handleOnFieldChange}
      renderInput={(params) => (
        <TextField {...params} label={label} variant={variant} />
      )}
    />
  )
}

LacchainSetNodeInfoActionNodeField.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  label: PropTypes.string,
  variant: PropTypes.string,
  className: PropTypes.string
}

export default LacchainSetNodeInfoActionNodeField
