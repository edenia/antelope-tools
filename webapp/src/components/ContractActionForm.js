/* eslint complexity: 0 */
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import { useTranslation } from 'react-i18next'
import Button from '@material-ui/core/Button'
import Chip from '@material-ui/core/Chip'
import InputAdornment from '@material-ui/core/InputAdornment'
import { ArrayTextField } from '@eoscostarica/eoscr-components'

import LacchainEntitySelectField from './LacchainEntitySelectField'
import LacchainSetEntInfoField from './LacchainSetEntInfoField'
import LacchainSetNodeInfoActionNodeField from './LacchainSetNodeInfoActionNodeField'
import LacchainSetNodeInfoActionInfoField from './LacchainSetNodeInfoActionInfoField'
import LacchainAddEntityActionEntityTypeField from './LacchainAddEntityActionEntityTypeField'
import LacchainEntityField from './LacchainEntityField'
import Authority from './Authority'
import BlockSigningAuthority from './BlockSigningAuthority'
import LacchainSetScheduleActionValidatorsField from './LacchainSetScheduleActionValidatorsField'
import EOSIONewAccountAuthority from './EOSIONewAccountAuthority'

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: '100%',
    marginBottom: theme.spacing(4)
  }
}))

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

  console.log({ action, fields })
  console.log({ payload })

  const renderField = (field) => {
    console.log(`${accountName}.${action}.${field.name}`)
    console.log(field)

    switch (`${accountName}.${action}.${field.name}`) {
      case 'eosio.addentity.entity_type':
        return (
          <LacchainAddEntityActionEntityTypeField
            key={`action-field-${field.name}`}
            label={t(field.name)}
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
            label={t(field.name)}
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
            label={t(field.name)}
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
            label={t(field.name)}
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
            label={t(field.name)}
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
            label={t(field.name)}
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
            label={t(field.name)}
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
            label={t(field.name)}
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
            label={t(field.name)}
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
            label={t(field.name)}
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
            label={t(field.name)}
            variant="outlined"
            className={classes.formControl}
            value={payload[field.name] || ''}
            onChange={handleFieldChange(field.name)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Chip label={t('public_key')} />
                </InputAdornment>
              )
            }}
          />
        )
      case 'eosio.newaccount.active':
        return (
          <EOSIONewAccountAuthority
            key={`action-field-${field.name}`}
            label={t(field.name)}
            variant="outlined"
            className={classes.formControl}
            value={payload[field.name] || ''}
            onChange={handleFieldChange(field.name)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Chip label={t('public_key')} />
                </InputAdornment>
              )
            }}
          />
        )
      default:
        return (
          <TextField
            key={`action-field-${field.name}`}
            label={t(field.name)}
            variant="outlined"
            className={classes.formControl}
            value={payload[field.name] || ''}
            onChange={handleFieldChange(field.name)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Chip label={t(field.type)} />
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

export default ContractActionForm
