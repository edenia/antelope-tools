/* eslint camelcase: 0 */
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import Autocomplete from '@material-ui/lab/Autocomplete'
import Chip from '@material-ui/core/Chip'
import { makeStyles } from '@material-ui/core/styles'
import { ArrayTextField } from '@eoscostarica/eoscr-components'

import { useSharedState } from '../context/state.context'
import { countries } from '../utils/countries'
import {
  getNodeTypes,
  getNewFieldPayload,
  getNodeFeatures
} from '../utils/lacchain'
import Checkbox from '@material-ui/core/Checkbox'
import ListItemText from '@material-ui/core/ListItemText'

const useStyles = makeStyles((theme) => ({
  flag: {
    marginRight: theme.spacing(1)
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    marginBottom: theme.spacing(1)
  },
  chip: {
    marginBottom: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  selectChips: {
    paddingBottom: 0
  }
}))

const LacchainSetNodeInfoActionInfoField = ({
  onChange,
  variant,
  className
}) => {
  const classes = useStyles()
  const [lacchain] = useSharedState()
  const [payload, setPayload] = useState({})
  const [optionsForCountry, setOptionsForCountry] = useState([])
  const [nodeType, setNodeType] = useState([])

  const features = getNodeFeatures()

  const handleOnFieldChange = (field) => (event, value) => {
    const newPayload = getNewFieldPayload(field, event, value, payload)
    setPayload(newPayload)
    onChange(JSON.stringify(newPayload))
  }

  useEffect(() => {
    setOptionsForCountry(
      Object.values(countries).map((country) => country.code)
    )
  }, [])

  useEffect(() => {
    const getInfo = () => {
      try {
        return lacchain.currentNode ? JSON.parse(lacchain.currentNode.info) : {}
      } catch (error) {}

      return {}
    }

    const info = getInfo()
    const nodeTypes = getNodeTypes()

    setPayload(info)
    onChange(JSON.stringify(info))
    setNodeType(nodeTypes[lacchain.currentNode?.type] || '')
    // eslint-disable-next-line
  }, [lacchain.currentNode])

  return (
    <>
      <ArrayTextField
        label="peer_keys"
        variant={variant}
        className={className}
        value={payload[`${nodeType}_keys`]?.peer_keys || []}
        onChange={handleOnFieldChange(`${nodeType}_keys.peer_keys`)}
      />
      {(nodeType === 'boot' || nodeType === 'validator') && (
        <>
          <TextField
            label="endpoints_p2p_out"
            variant={variant}
            className={className}
            value={
              payload[`${nodeType}_endpoints`]?.[`${nodeType}_p2p_out`] || ''
            }
            onChange={handleOnFieldChange(
              `${nodeType}_endpoints.${nodeType}_p2p_out`
            )}
          />
          <TextField
            label="endpoints_p2p_bidir"
            variant={variant}
            className={className}
            value={
              payload[`${nodeType}_endpoints`]?.[`${nodeType}_p2p_bidir`] || ''
            }
            onChange={handleOnFieldChange(
              `${nodeType}_endpoints.${nodeType}_p2p_bidir`
            )}
          />
        </>
      )}
      {(nodeType === 'observer' || nodeType === 'writer') && (
        <>
          <TextField
            label="endpoints_api"
            variant={variant}
            className={className}
            value={payload[`${nodeType}_endpoints`]?.[`${nodeType}_api`] || ''}
            onChange={handleOnFieldChange(
              `${nodeType}_endpoints.${nodeType}_api`
            )}
          />
          <TextField
            label="endpoints_ssl"
            variant={variant}
            className={className}
            value={payload[`${nodeType}_endpoints`]?.[`${nodeType}_ssl`] || ''}
            onChange={handleOnFieldChange(
              `${nodeType}_endpoints.${nodeType}_ssl`
            )}
          />
          <TextField
            label="endpoints_p2p"
            variant={variant}
            className={className}
            value={payload[`${nodeType}_endpoints`]?.[`${nodeType}_p2p`] || ''}
            onChange={handleOnFieldChange(
              `${nodeType}_endpoints.${nodeType}_p2p`
            )}
          />
        </>
      )}
      <TextField
        label="location_name"
        variant={variant}
        className={className}
        value={payload[`${nodeType}_location`]?.name || ''}
        onChange={handleOnFieldChange(`${nodeType}_location.name`)}
      />
      <Autocomplete
        className={className}
        value={payload[`${nodeType}_location`]?.country || ''}
        onChange={handleOnFieldChange(`${nodeType}_location.country`)}
        options={optionsForCountry}
        autoHighlight
        renderOption={(option) => (
          <>
            <span className={classes.flag}>{countries[option]?.flag}</span>
            {countries[option]?.name}
          </>
        )}
        renderInput={(params) => (
          <TextField {...params} label="location_country" variant={variant} />
        )}
      />
      <TextField
        label="location_latitude"
        variant={variant}
        className={className}
        value={payload[`${nodeType}_location`]?.latitude || ''}
        onChange={handleOnFieldChange(`${nodeType}_location.latitude`)}
      />
      <TextField
        label="location_longitude"
        variant={variant}
        className={className}
        value={payload[`${nodeType}_location`]?.longitude || ''}
        onChange={handleOnFieldChange(`${nodeType}_location.longitude`)}
      />
      {(nodeType === 'observer' || nodeType === 'writer') && (
        <TextField
          onChange={handleOnFieldChange(`${nodeType}_features`)}
          variant="outlined"
          label="features"
          select
          SelectProps={{
            multiple: true,
            classes: {
              root: payload[`${nodeType}_features`]?.length
                ? classes.selectChips
                : ''
            },
            renderValue: (selected) => (
              <div className={classes.chips}>
                {selected.map((value, index) => (
                  <Chip
                    key={`chip-item-${index}`}
                    label={value}
                    className={classes.chip}
                  />
                ))}
              </div>
            )
          }}
          value={payload[`${nodeType}_features`] || []}
          className={className}
        >
          {features.map((option, index) => (
            <MenuItem key={`menu-item-${index}`} value={option.value}>
              <Checkbox
                checked={
                  (payload[`${nodeType}_features`] || []).indexOf(
                    option.value
                  ) > -1
                }
              />
              <ListItemText primary={option.label} />
            </MenuItem>
          ))}
        </TextField>
      )}
    </>
  )
}

LacchainSetNodeInfoActionInfoField.propTypes = {
  onChange: PropTypes.func,
  variant: PropTypes.string,
  className: PropTypes.string
}

export default LacchainSetNodeInfoActionInfoField
