import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Box from '@material-ui/core/Box'
import ContractActionForm from './ContractActionForm'

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
  const { t } = useTranslation('accountInfo')

  useEffect(() => {
    if (!abi) {
      setActions([])

      return
    }

    setActions(abi.actions.map(({ name }) => name))
  }, [abi])

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

      <ContractActionForm
        accountName={accountName}
        action={action}
        abi={abi}
        onSubmitAction={onSubmitAction}
      />
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
