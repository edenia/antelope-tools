import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Autocomplete from '@mui/material/Autocomplete'
import { TextField } from '@mui/material'

import { useSharedState } from '../../context/state.context'

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
    let nodes = lacchain.nodes || []

    if (!lacchain.isAdmin) {
      nodes = nodes.filter(
        (node) => node.entity === lacchain.currentEntity?.name
      )
    }

    setNodes(nodes)
    setOptions(nodes.map((node) => node.name))
  }, [lacchain.nodes, lacchain.isAdmin, lacchain.currentEntity])

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
