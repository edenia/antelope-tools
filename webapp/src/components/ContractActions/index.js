import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import Autocomplete from '@mui/material/Autocomplete'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'

import ContractActionForm from '../ContractActionForm'

import styles from './styles'

const useStyles = makeStyles(styles)

const ContractActions = ({ accountName, abi, onSubmitAction }) => {
  const classes = useStyles()
  const [actions, setActions] = useState([])
  const [action, setAction] = useState('')
  const { t } = useTranslation('contractActionsComponent')

  useEffect(() => {
    if (!abi) {
      setActions([])

      return
    }

    setActions(abi.actions.map(({ name }) => name))
  }, [abi])

  return (
    <div className={classes.formControl}>
      <FormControl variant="outlined" className={classes.formControl}>
        <Autocomplete
            id="actionName"
            labelid="actionNameLabel"
            options={actions}
            value={action}
            inputValue={action}
            onChange={(_e, value) => setAction(value || '')}
            onInputChange={(_e, value) => setAction(value || '')}
            renderInput={params => (
              <TextField {...params} label={t('action')} />
            )}
            noOptionsText={t('noOptions')}
          />
      </FormControl>

      <ContractActionForm
        accountName={accountName}
        action={actions.find(element => element === action)}
        abi={abi}
        onSubmitAction={onSubmitAction}
      />
    </div>
  )
}

ContractActions.propTypes = {
  accountName: PropTypes.string,
  abi: PropTypes.any,
  onSubmitAction: PropTypes.func,
}

ContractActions.defaultProps = {}

export default ContractActions
