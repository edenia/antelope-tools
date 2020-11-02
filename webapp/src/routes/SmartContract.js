import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress'
import { useTranslation } from 'react-i18next'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Alert from '@material-ui/lab/Alert'
import EosApi from 'eosjs-api'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined'

import AccountInfo from '../components/AccountInfo'
import PageTitle from '../components/PageTitle'
import { eosConfig } from '../config'

const eosApi = EosApi({
  httpEndpoint: eosConfig.endpoint,
  verbose: false,
  fetchConfiguration: {}
})

const useStyles = makeStyles((theme) => ({
  field: {
    marginBottom: theme.spacing(2),
    width: '100%'
  },
  loader: {
    marginBottom: theme.spacing(2)
  },
  alert: {
    marginBottom: theme.spacing(2)
  }
}))

const SmartContract = ({ ual }) => {
  const classes = useStyles()
  const [accountName, setAccountName] = useState(null)
  const [account, setAccount] = useState(null)
  const [abi, setAbi] = useState(null)
  const [hash, setHash] = useState(null)
  const [tableData, setTableData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const { t } = useTranslation('smartContract')

  const handleSubmitAction = async (action) => {
    if (!ual.activeUser) {
      setErrorMessage(t('loginBeforeUseAction'))

      return
    }

    setErrorMessage(null)
    setSuccessMessage(null)
    setLoading(true)

    try {
      const actions = []

      if (eosConfig.includeDefaultTransaction) {
        actions.push(eosConfig.includeDefaultTransaction)
      }

      actions.push({
        authorization: [
          {
            actor: ual.activeUser.accountName,
            permission: 'active'
          }
        ],
        ...action
      })

      const result = await ual.activeUser.signTransaction(
        {
          actions
        },
        {
          broadcast: true
        }
      )
      setSuccessMessage(`Success transaction ${result.transactionId}`)
    } catch (error) {
      setErrorMessage(
        error?.cause?.message || error?.message || t('unknownError')
      )
    }

    setLoading(false)
  }

  const handleGetTableRows = async (payload) => {
    setLoading(true)
    try {
      // TODO: implement load next page
      const tableData = await eosApi.getTableRows(payload)
      setTableData(tableData)
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  const handleOnSearch = async () => {
    setAccount(null)
    setAbi(null)
    setHash(null)
    setTableData(null)
    setErrorMessage(null)
    setSuccessMessage(null)
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    try {
      const account = await eosApi.getAccount(accountName)
      setAccount(account)
    } catch (error) {
      setErrorMessage(t('accountNotFound'))
    }

    try {
      const { abi } = await eosApi.getAbi(accountName)
      setAbi(abi)
      const { code_hash: hash = '' } = await eosApi.getCodeHash(accountName)
      setHash(hash)
    } catch (error) {
      console.log(error)
    }

    setLoading(false)
  }

  return (
    <Grid item xs={12}>
      <PageTitle title={t('htmlTitle')} />

      <Typography variant="h3">{t('title')}</Typography>

      <TextField
        label={t('account')}
        variant="outlined"
        value={accountName || ''}
        onChange={(event) => {
          setAccountName(event.target.value)
        }}
        className={classes.field}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleOnSearch} edge="end">
                <SearchOutlinedIcon />
              </IconButton>
            </InputAdornment>
          )
        }}
      />

      {loading && <LinearProgress className={classes.loader} color="primary" />}

      {errorMessage && (
        <Alert
          severity="error"
          className={classes.alert}
          onClose={() => setErrorMessage(null)}
        >
          {errorMessage}
        </Alert>
      )}

      {successMessage && (
        <Alert
          severity="success"
          className={classes.alert}
          onClose={() => setSuccessMessage(null)}
        >
          {successMessage}
        </Alert>
      )}

      {account && (
        <AccountInfo
          account={account}
          abi={abi}
          hash={hash}
          onSubmitAction={handleSubmitAction}
          tableData={tableData}
          onGetTableRows={handleGetTableRows}
        />
      )}
    </Grid>
  )
}

SmartContract.propTypes = {
  ual: PropTypes.object
}

export default SmartContract
