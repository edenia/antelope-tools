/* eslint complexity: 0 */
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'
import TextField from '@mui/material/TextField'
import { useTranslation } from 'react-i18next'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import InputAdornment from '@mui/material/InputAdornment'
import { ArrayTextField } from '@eoscostarica/eoscr-components'

import LacchainEntitySelectField from '../LacchainEntitySelectField'
import LacchainSetEntInfoField from '../LacchainSetEntInfoField'
import LacchainSetNodeInfoActionNodeField from '../LacchainSetNodeInfoActionNodeField'
import LacchainSetNodeInfoActionInfoField from '../LacchainSetNodeInfoActionInfoField'
import LacchainAddEntityActionEntityTypeField from '../LacchainAddEntityActionEntityTypeField'
import LacchainEntityField from '../LacchainEntityField'
import Authority from '../Authority'
import BlockSigningAuthority from '../BlockSigningAuthority'
import LacchainSetScheduleActionValidatorsField from '../LacchainSetScheduleActionValidatorsField'
import EOSIONewAccountAuthority from '../EOSIONewAccountAuthority'

import styles from './styles'

const useStyles = makeStyles(styles)

const ContractActionForm = ({ accountName, action, abi, onSubmitAction }) => {
  const { t } = useTranslation('lacchainManagement')
  const classes = useStyles()
  const [fields, setFields] = useState([])
  const [payload, setPayload] = useState({})

  const handleSubmit = () => {
    if (!onSubmitAction) return

    onSubmitAction({
      account: accountName,
      name: action,
      data: payload,
    })
  }

  const handleFieldChange = (name) => (event) => {
    const value =
      typeof event === 'object' && !Array.isArray(event)
        ? event?.target?.value
        : event

    setPayload((prevValue) => ({
      ...prevValue,
      [name]: value,
    }))
  }

  const _getFieldLabel = (label) => {
    if (!label.includes('_')) return label

    return (label.charAt(0).toUpperCase() + label.slice(1)).replace('_', ' ')
  }

  const renderField = (field, label) => {
    switch (`${accountName}.${action}.${field.name}`) {
      case 'eosio.addentity.entity_type':
        return (
          <LacchainAddEntityActionEntityTypeField
            key={`action-field-${field.name}`}
            label={label}
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
            label={label}
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
            label={label}
            variant="outlined"
            className={classes.formControl}
            value={payload[field.name] || ''}
            onChange={handleFieldChange(field.name)}
            t={t}
          />
        )
      case 'eosio.setnodeinfo.node':
        return (
          <LacchainSetNodeInfoActionNodeField
            key={`action-field-${field.name}`}
            label={label}
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
            label={label}
            variant="outlined"
            className={classes.formControl}
            value={payload[field.name] || ''}
            onChange={handleFieldChange(field.name)}
            t={t}
          />
        )
      case 'eosio.newaccount.creator':
      case 'eosio.setram.entity':
      case 'eosio.addboot.entity':
      case 'eosio.addobserver.entity':
      case 'eosio.addwriter.entity':
      case 'eosio.addvalidator.entity':
        return (
          <LacchainEntityField
            key={`action-field-${field.name}`}
            label={label}
            variant="outlined"
            className={classes.formControl}
            value={payload[field.name] || ''}
            onChange={handleFieldChange(field.name)}
          />
        )
      case 'eosio.addwriter.writer_authority':
        return (
          <Authority
            key={`action-field-${field.name}`}
            label={label}
            variant="outlined"
            className={classes.formControl}
            value={payload[field.name] || {}}
            onChange={handleFieldChange(field.name)}
            t={t}
          />
        )
      case 'eosio.addvalidator.validator_authority':
        return (
          <BlockSigningAuthority
            key={`action-field-${field.name}`}
            label={label}
            variant="outlined"
            className={classes.formControl}
            value={payload[field.name] || []}
            onChange={handleFieldChange(field.name)}
            t={t}
          />
        )
      case 'eosio.netsetgroup.group':
        return (
          <ArrayTextField
            key={`action-field-${field.name}`}
            label={label}
            variant="outlined"
            className={classes.formControl}
            value={payload[field.name] || []}
            onChange={handleFieldChange(field.name)}
          />
        )
      case 'eosio.setschedule.validators':
        return (
          <LacchainSetScheduleActionValidatorsField
            key={`action-field-${field.name}`}
            label={label}
            variant="outlined"
            className={classes.formControl}
            value={payload[field.name] || []}
            onChange={handleFieldChange(field.name)}
          />
        )
      case 'eosio.newaccount.owner':
        return (
          <EOSIONewAccountAuthority
            key={`action-field-${field.name}`}
            label={label}
            variant="outlined"
            className={classes.formControl}
            value={payload[field.name] || ''}
            onChange={handleFieldChange(field.name)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Chip label={t('public_key')} />
                </InputAdornment>
              ),
            }}
          />
        )
      case 'eosio.newaccount.active':
        return (
          <EOSIONewAccountAuthority
            key={`action-field-${field.name}`}
            label={label}
            variant="outlined"
            className={classes.formControl}
            value={payload[field.name] || ''}
            onChange={handleFieldChange(field.name)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Chip label={t('public_key')} />
                </InputAdornment>
              ),
            }}
          />
        )
      default:
        return (
          <TextField
            key={`action-field-${field.name}`}
            label={label}
            variant="outlined"
            className={classes.formControl}
            value={payload[field.name] || ''}
            onChange={handleFieldChange(field.name)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Chip label={t(field.type)} />
                </InputAdornment>
              ),
            }}
          />
        )
    }
  }

  useEffect(() => {
    if (!action) {
      setFields([])

      return
    }

    const struct = abi?.structs?.find((struct) => struct.name === action)
    setFields(struct?.fields || [])
  }, [action, abi])

  return (
    <>
      {fields.map((field) => {
        const label = _getFieldLabel(t(field.name))

        return renderField(field, label)
      })}

      {action && (
        <Button variant="contained" color="primary" onClick={handleSubmit}>
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
  onSubmitAction: PropTypes.func,
}

export default ContractActionForm
