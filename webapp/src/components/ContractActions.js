import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import Chip from '@material-ui/core/Chip'
import InputAdornment from '@material-ui/core/InputAdornment'

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: '100%',
    marginBottom: theme.spacing(2)
  }
}))

const ContractActions = ({ accountName, abi, onSubmitAction }) => {
  const classes = useStyles()
  const [actions, setActions] = useState([])
  const [action, setAction] = useState('')
  const [fields, setFields] = useState([])
  const [payload, setPayload] = useState({})
  const { t } = useTranslation('accountInfo')

  const handleSubmit = () => {
    if (!onSubmitAction) return

    onSubmitAction({
      account: accountName,
      name: action,
      data: payload
    })
  }

  const handleFieldChange = (name) => (event) => {
    const value = event.target.value

    setPayload((prevValue) => ({
      ...prevValue,
      [name]: value
    }))
  }

  useEffect(() => {
    if (!abi) {
      setActions([])

      return
    }

    setActions(abi.actions.map(({ name }) => name))
  }, [abi])

  useEffect(() => {
    if (!action) {
      setFields([])

      return
    }

    const struct = abi.structs.find((struct) => struct.name === action)
    setFields(struct.fields)
  }, [action, abi])

  return (
    <Box width="100%">
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="actionNameLabel">{t('action')}</InputLabel>
        <Select
          labelId="actionNameLabel"
          id="actionName"
          value={action}
          onChange={(event) => setAction(event.target.value)}
          label={t('action')}
        >
          {actions.map((item) => (
            <MenuItem key={`action-menu-item-${item}`} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {fields.map((field) => (
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
      ))}

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
    </Box>
  )
}

ContractActions.propTypes = {
  accountName: PropTypes.string,
  abi: PropTypes.any,
  onSubmitAction: PropTypes.func
}

ContractActions.defaultProps = {}

export default ContractActions
