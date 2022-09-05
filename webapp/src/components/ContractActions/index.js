import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'

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
    <div>
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

      <ContractActionForm
        accountName={accountName}
        action={action}
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
