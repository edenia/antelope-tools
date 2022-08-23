import React, { lazy, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'
import { makeStyles } from '@mui/styles'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import { useTranslation } from 'react-i18next'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import queryString from 'query-string'
import CardContent from '@mui/material/CardContent'

import { signTransaction } from '../../utils/eos'
import eosApi from '../../utils/eosapi'
import getTransactionUrl from '../../utils/get-transaction-url'
import { useSnackbarMessageState } from '../../context/snackbar-message.context'

import styles from './styles'

const AccountInfo = lazy(() => import('../../components/AccountInfo'))

const useStyles = makeStyles(styles)

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
    // eslint-disable-next-line
  }, [location.search])

  useEffect(() => {
    handleOnSearch('eosio')
    // eslint-disable-next-line
  }, [])

  return (
    <Grid item xs={12}>
      <Card>
        <CardContent>
          <Typography className={classes.title}>{t('title')}</Typography>
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
