import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Chip from '@material-ui/core/Chip'
import InputAdornment from '@material-ui/core/InputAdornment'
import { ArrayTextField } from '@eoscostarica/eoscr-components'

import LacchainEntitySelectField from './LacchainEntitySelectField'
import LacchainSetEntInfoField from './LacchainSetEntInfoField'
import LacchainSetNodeInfoActionNodeField from './LacchainSetNodeInfoActionNodeField'
import LacchainSetNodeInfoActionInfoField from './LacchainSetNodeInfoActionInfoField'
import LacchainAddEntityActionEntityTypeField from './LacchainAddEntityActionEntityTypeField'
import LacchainAddValidatorActionEntityField from './LacchainAddValidatorActionEntityField'
import LacchainAddValidatorActionValidatorAuthorityField from './LacchainAddValidatorActionValidatorAuthorityField'

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: '100%',
    marginBottom: theme.spacing(2)
  }
}))

const ContractActionForm = ({ accountName, action, abi, onSubmitAction }) => {
  const classes = useStyles()
  const [fields, setFields] = useState([])
  const [payload, setPayload] = useState({})
  const { t } = useTranslation('contractActionFormComponent')

  const handleSubmit = () => {
    if (!onSubmitAction) return

    onSubmitAction({
      account: accountName,
      name: action,
      data: payload
    })
  }

  const handleFieldChange = (name) => (event) => {
    const value =
      typeof event === 'object' && !Array.isArray(event)
        ? event?.target?.value
        : event

    setPayload((prevValue) => ({
      ...prevValue,
      [name]: value
    }))
  }

  useEffect(() => {
    if (!action) {
      setFields([])

      return
    }

    const struct = abi?.structs?.find((struct) => struct.name === action)
    setFields(struct?.fields || [])
  }, [action, abi])

  const renderField = (field) => {
    switch (`${accountName}.${action}.${field.name}`) {
      case 'eosio.addentity.entity_type':
        return (
          <LacchainAddEntityActionEntityTypeField
            key={`action-field-${field.name}`}
            label={field.name}
            variant="outlined"
            className={classes.formControl}
            value={payload[field.name]}
            onChange={handleFieldChange(field.name)}
          />
        )
      case 'eosio.setentinfo.entity':
        return (
          <LacchainEntitySelectField
            key={`action-field-${field.name}`}
            label={field.name}
            variant="outlined"
            className={classes.formControl}
            value={payload[field.name] || ''}
            onChange={handleFieldChange(field.name)}
          />
        )
      case 'eosio.setentinfo.info':
        return (
          <LacchainSetEntInfoField
            key={`action-field-${field.name}`}
            label={field.name}
            variant="outlined"
            className={classes.formControl}
            value={payload[field.name] || ''}
            onChange={handleFieldChange(field.name)}
          />
        )
      case 'eosio.setnodeinfo.node':
        return (
          <LacchainSetNodeInfoActionNodeField
            key={`action-field-${field.name}`}
            label={field.name}
            variant="outlined"
            className={classes.formControl}
            value={payload[field.name] || ''}
            onChange={handleFieldChange(field.name)}
          />
        )
      case 'eosio.setnodeinfo.info':
        return (
          <LacchainSetNodeInfoActionInfoField
            key={`action-field-${field.name}`}
            label={field.name}
            variant="outlined"
            className={classes.formControl}
            value={payload[field.name] || ''}
            onChange={handleFieldChange(field.name)}
          />
        )
      case 'eosio.addvalidator.entity':
        return (
          <LacchainAddValidatorActionEntityField
            key={`action-field-${field.name}`}
            label={field.name}
            variant="outlined"
            className={classes.formControl}
            value={payload[field.name] || ''}
            onChange={handleFieldChange(field.name)}
          />
        )
      case 'eosio.addvalidator.validator_authority':
        return (
          <LacchainAddValidatorActionValidatorAuthorityField
            key={`action-field-${field.name}`}
            label={field.name}
            variant="outlined"
            className={classes.formControl}
            value={payload[field.name] || []}
            onChange={handleFieldChange(field.name)}
          />
        )
      case 'eosio.netsetgroup.group':
        return (
          <ArrayTextField
            key={`action-field-${field.name}`}
            label={field.name}
            variant="outlined"
            className={classes.formControl}
            value={payload[field.name] || []}
            onChange={handleFieldChange(field.name)}
          />
        )
      default:
        return (
          <TextField
            key={`action-field-${field.name}`}
            label={field.name}
            variant="outlined"
            className={classes.formControl}
            value={payload[field.name] || ''}
            onChange={handleFieldChange(field.name)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Chip label={field.type} />
                </InputAdornment>
              )
            }}
          />
        )
    }
  }

  return (
    <>
      {fields.map(renderField)}
      {action && (
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          {t('executeTransaction')}
        </Button>
      )}
    </>
  )
}

ContractActionForm.propTypes = {
  accountName: PropTypes.string,
  action: PropTypes.string,
  abi: PropTypes.any,
  onSubmitAction: PropTypes.func
}

ContractActionForm.defaultProps = {}

export default ContractActionForm
