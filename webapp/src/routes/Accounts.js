import React, { lazy, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'
import { makeStyles } from '@material-ui/styles'
import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress'
import { useTranslation } from 'react-i18next'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined'
import Card from '@material-ui/core/Card'
import queryString from 'query-string'
import CardContent from '@material-ui/core/CardContent'

import { signTransaction } from '../utils/eos'
import eosApi from '../utils/eosapi'
import getTransactionUrl from '../utils/get-transaction-url'
import { useSnackbarMessageState } from '../context/snackbar-message.context'

const AccountInfo = lazy(() => import('../components/AccountInfo'))

const useStyles = makeStyles((theme) => ({
  field: {
    marginBottom: theme.spacing(2),
    width: '100%'
  },
  alert: {
    marginBottom: theme.spacing(2)
  }
}))

const Accounts = ({ ual }) => {
  const classes = useStyles()
  const location = useLocation()
  const [accountName, setAccountName] = useState(null)
  const [account, setAccount] = useState(null)
  const [abi, setAbi] = useState(null)
  const [hash, setHash] = useState(null)
  const [tableData, setTableData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [, { showMessage, hideMessage }] = useSnackbarMessageState()
  const { t } = useTranslation('accountsRoute')

  const handleSubmitAction = async (action) => {
    if (!ual.activeUser) {
      showMessage({
        type: 'error',
        content: t('loginBeforeUseAction')
      })

      return
    }

    hideMessage()
    setLoading(true)

    try {
      const result = await signTransaction(ual, {
        authorization: [
          {
            actor: ual.activeUser.accountName,
            permission: 'active'
          }
        ],
        ...action
      })
      const { trxId, explorerUrl } = getTransactionUrl(result.transactionId)

      showMessage({
        type: 'success',
        content: (
          <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
            {t('successMessage')} {trxId}
          </a>
        )
      })
    } catch (error) {
      showMessage({
        type: 'error',
        content: error?.cause?.message || error?.message || t('unknownError')
      })
    }

    setLoading(false)
  }

  const handleGetTableRows = async ({ loadMore, ...payload }) => {
    setLoading(true)
    try {
      const tableData = await eosApi.getTableRows(payload)

      if (loadMore) {
        setTableData((prev) => ({
          ...prev,
          ...tableData,
          rows: prev.rows.concat(...tableData.rows)
        }))

        return
      }

      setTableData(tableData)
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  const handleOnSearch = async (valueAccount) => {
    setAccount(null)
    setAbi(null)
    setHash(null)
    setTableData(null)
    hideMessage(null)
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    try {
      const account = await eosApi.getAccount(valueAccount)
      setAccount(account)
    } catch (error) {
      showMessage({
        type: 'error',
        content: t('accountNotFound')
      })
    }

    try {
      const { abi } = await eosApi.getAbi(valueAccount)
      setAbi(abi)
      const { code_hash: hash = '' } = await eosApi.getCodeHash(valueAccount)
      setHash(hash)
    } catch (error) {
      console.log(error)
    }

    setLoading(false)
  }

  const handleOnKeyDown = (event) => {
    if (event.keyCode !== 13) return

    handleOnSearch(accountName)
  }

  useEffect(() => {
    const params = queryString.parse(location.search)

    if (!params.account) {
      setAccountName('eosio')
      handleOnSearch('eosio')

      return
    }

    setAccountName(params.account)
    handleOnSearch(params.account)
  }, [location.search])

  useEffect(() => {
    handleOnSearch('eosio')
    // eslint-disable-next-line
  }, [])

  return (
    <Grid item xs={12}>
      <Card>
        <CardContent>
          <TextField
            id="accountTxt"
            label={t('account')}
            variant="outlined"
            value={accountName || ''}
            onChange={(event) => {
              setAccountName(event.target.value)
            }}
            onKeyDown={handleOnKeyDown}
            className={classes.field}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => handleOnSearch(accountName)}
                    edge="end"
                    aria-label="search"
                  >
                    <SearchOutlinedIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </CardContent>
      </Card>
      {loading && <LinearProgress color="primary" />}
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

Accounts.propTypes = {
  ual: PropTypes.object
}

export default Accounts
