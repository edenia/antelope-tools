/* eslint camelcase: 0 */
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { TextField } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { makeStyles } from '@material-ui/core/styles'
import { ArrayTextField } from '@eoscostarica/eoscr-components'

import { useSharedState } from '../context/state.context'
import { countries } from '../utils/countries'
import { getNewFieldPayload } from '../utils/lacchain'

const useStyles = makeStyles((theme) => ({
  flag: {
    marginRight: theme.spacing(1)
  }
}))

const LacchainSetEntInfoField = ({ onChange, variant, className }) => {
  const classes = useStyles()
  const [lacchain] = useSharedState()
  const [optionsForCountry, setOptionsForCountry] = useState([])
  const [payload, setPayload] = useState({})

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
    setPayload(
      lacchain.currentEntity ? JSON.parse(lacchain.currentEntity.info) : {}
    )
    onChange(lacchain.currentEntity?.info || '{}')
    // eslint-disable-next-line
  }, [lacchain.currentEntity])

  return (
    <>
      <TextField
        label="organization_name"
        variant={variant}
        className={className}
        value={payload.organization_name || ''}
        onChange={handleOnFieldChange('organization_name')}
      />
      <TextField
        label="organization_id"
        variant={variant}
        className={className}
        value={payload.organization_id || ''}
        onChange={handleOnFieldChange('organization_id')}
      />
      <TextField
        label="technical_contact"
        variant={variant}
        className={className}
        value={payload.technical_contact || ''}
        onChange={handleOnFieldChange('technical_contact')}
      />
      <TextField
        label="business_contact"
        variant={variant}
        className={className}
        value={payload.business_contact || ''}
        onChange={handleOnFieldChange('business_contact')}
      />
      <TextField
        label="email"
        variant={variant}
        className={className}
        value={payload.email || ''}
        onChange={handleOnFieldChange('email')}
      />
      <TextField
        label="website"
        variant={variant}
        className={className}
        value={payload.website || ''}
        onChange={handleOnFieldChange('website')}
      />
      <TextField
        label="code_of_conduct"
        variant={variant}
        className={className}
        value={payload.code_of_conduct || ''}
        onChange={handleOnFieldChange('code_of_conduct')}
      />
      <TextField
        label="ownership_disclosure"
        variant={variant}
        className={className}
        value={payload.ownership_disclosure || ''}
        onChange={handleOnFieldChange('ownership_disclosure')}
      />
      <ArrayTextField
        label="github_user"
        variant={variant}
        className={className}
        value={payload.github_user || []}
        onChange={handleOnFieldChange('github_user')}
      />
      <TextField
        label="chain_resources"
        variant={variant}
        className={className}
        value={payload.chain_resources || ''}
        onChange={handleOnFieldChange('chain_resources')}
      />
      <ArrayTextField
        label="other_resources"
        variant={variant}
        className={className}
        value={payload.other_resources || []}
        onChange={handleOnFieldChange('other_resources')}
      />
      <TextField
        label="logo_256"
        variant={variant}
        className={className}
        value={payload.branding?.logo_256 || ''}
        onChange={handleOnFieldChange('branding.logo_256')}
      />
      <TextField
        label="logo_1024"
        variant={variant}
        className={className}
        value={payload.branding?.logo_1024 || ''}
        onChange={handleOnFieldChange('branding.logo_1024')}
      />
      <TextField
        label="logo_svg"
        variant={variant}
        className={className}
        value={payload.branding?.logo_svg || ''}
        onChange={handleOnFieldChange('branding.logo_svg')}
      />
      <TextField
        label="location_name"
        variant={variant}
        className={className}
        value={payload.location?.name || ''}
        onChange={handleOnFieldChange('location.name')}
      />
      <Autocomplete
        className={className}
        value={payload.location?.country || ''}
        onInputChange={handleOnFieldChange('location.country')}
        options={optionsForCountry}
        autoHighlight
        renderOption={(option) => (
          <>
            <span className={classes.flag}>{countries[option]?.flag}</span>
            {countries[option]?.name}
          </>
        )}
        renderInput={(params) => (
          <TextField {...params} label="country" variant={variant} />
        )}
      />
      <TextField
        label="latitude"
        variant={variant}
        className={className}
        value={payload.location?.latitude || ''}
        onChange={handleOnFieldChange('location.latitude')}
      />
      <TextField
        label="longitude"
        variant={variant}
        className={className}
        value={payload.location?.longitude || ''}
        onChange={handleOnFieldChange('location.longitude')}
      />
      {Object.keys(payload.social || {}).map((key) => (
        <TextField
          key={`social-item-${key}`}
          label={key}
          variant={variant}
          className={className}
          value={payload.social?.[key] || ''}
          onChange={handleOnFieldChange(`social.${key}`)}
        />
      ))}
    </>
  )
}

LacchainSetEntInfoField.propTypes = {
  onChange: PropTypes.func,
  variant: PropTypes.string,
  className: PropTypes.string
}

export default LacchainSetEntInfoField
