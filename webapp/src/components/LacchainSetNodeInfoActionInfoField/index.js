/* eslint camelcase: 0 */
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { makeStyles } from '@mui/styles'
import { ArrayTextField } from '@eoscostarica/eoscr-components'

import { useSharedState } from '../../context/state.context'
import { countries } from '../../utils/countries'
import {
  NODE_TYPE_LABEL,
  getNewFieldPayload,
  getNodeFeatures
} from '../../utils/lacchain'
import MultipleSelect from '../MultipleSelect'

import styles from './styles'

const useStyles = makeStyles(styles)

const LacchainSetNodeInfoActionInfoField = ({
  onChange,
  variant,
  className,
  t
}) => {
  const classes = useStyles()
  const [lacchain] = useSharedState()
  const [payload, setPayload] = useState({})
  const [optionsForCountry, setOptionsForCountry] = useState([])
  const [nodeType, setNodeType] = useState('')

  const features = getNodeFeatures()

  const Features = () => {
    if (nodeType === 'observer' || nodeType === 'writer') {
      return (
        <MultipleSelect
          onChange={handleOnFieldChange(`${nodeType}_features`)}
          variant={variant}
          className={className}
          label={t('features')}
          value={payload[`${nodeType}_features`] || []}
          options={features}
        />
      )
    }

    return <></>
  }

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

    setPayload(info)
    onChange(JSON.stringify(info))
    setNodeType(NODE_TYPE_LABEL[lacchain.currentNode?.type] || '')
    // eslint-disable-next-line
  }, [lacchain.currentNode])

  return (
    <>
      <ArrayTextField
        label={t('peer_keys')}
        variant={variant}
        className={className}
        value={payload[`${nodeType}_keys`]?.peer_keys || []}
        onChange={handleOnFieldChange(`${nodeType}_keys.peer_keys`)}
      />
      {(nodeType === 'boot' || nodeType === 'validator') && (
        <TextField
          label={t(`${nodeType}_p2p`)}
          variant={variant}
          className={className}
          value={payload[`${nodeType}_endpoints`]?.[`${nodeType}_p2p`] || ''}
          onChange={handleOnFieldChange(
            `${nodeType}_endpoints.${nodeType}_p2p`
          )}
        />
      )}
      {(nodeType === 'observer' || nodeType === 'writer') && (
        <>
          <TextField
            label={t('endpoints_api')}
            variant={variant}
            className={className}
            value={payload[`${nodeType}_endpoints`]?.[`${nodeType}_api`] || ''}
            onChange={handleOnFieldChange(
              `${nodeType}_endpoints.${nodeType}_api`
            )}
          />
          <TextField
            label={t('endpoints_ssl')}
            variant={variant}
            className={className}
            value={payload[`${nodeType}_endpoints`]?.[`${nodeType}_ssl`] || ''}
            onChange={handleOnFieldChange(
              `${nodeType}_endpoints.${nodeType}_ssl`
            )}
          />
          <TextField
            label={t('endpoints_p2p')}
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
        label={t('location_name')}
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
          <TextField
            {...params}
            label={t('location_country')}
            variant={variant}
          />
        )}
      />
      <TextField
        label={t('location_latitude')}
        variant={variant}
        className={className}
        value={payload[`${nodeType}_location`]?.latitude || ''}
        onChange={handleOnFieldChange(`${nodeType}_location.latitude`)}
      />
      <TextField
        label={t('location_longitude')}
        variant={variant}
        className={className}
        value={payload[`${nodeType}_location`]?.longitude || ''}
        onChange={handleOnFieldChange(`${nodeType}_location.longitude`)}
      />
      <Features />
    </>
  )
}

LacchainSetNodeInfoActionInfoField.propTypes = {
  onChange: PropTypes.func,
  variant: PropTypes.string,
  className: PropTypes.string,
  t: PropTypes.func
}

LacchainSetNodeInfoActionInfoField.defaultProps = {
  t: () => {}
}

export default LacchainSetNodeInfoActionInfoField
