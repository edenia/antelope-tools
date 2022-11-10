import React, { lazy, useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'
import { makeStyles } from '@mui/styles'
import LinearProgress from '@mui/material/LinearProgress'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import queryString from 'query-string'
import CardContent from '@mui/material/CardContent'

import { signTransaction } from '../../utils/eos'
import eosApi, { ENDPOINTS_ERROR } from '../../utils/eosapi'
import getTransactionUrl from '../../utils/get-transaction-url'
import { useSnackbarMessageState } from '../../context/snackbar-message.context'
import SearchBar from '../../components/SearchBar'

import styles from './styles'

const AccountInfo = lazy(() => import('../../components/AccountInfo'))

const useStyles = makeStyles(styles)

const Accounts = ({ ual }) => {
  const classes = useStyles()
  const location = useLocation()
  const [filters, setFilters] = useState(null)
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
        content: t('loginBeforeUseAction'),
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
            permission: 'active',
          },
        ],
        ...action,
      })
      const { trxId, explorerUrl } = getTransactionUrl(result.transactionId)

      showMessage({
        type: 'success',
        content: (
          <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
            {t('successMessage')} {trxId}
          </a>
        ),
      })
    } catch (error) {
      showMessage({
        type: 'error',
        content: error?.cause?.message || error?.message || t('unknownError'),
      })
    }

    setLoading(false)
  }

  const handleGetTableRows = useCallback(
    async ({ loadMore, ...payload }) => {
      setLoading(true)

      try {
        const tableData = await eosApi.getTableRows(payload)

        if (loadMore) {
          setTableData((prev) => ({
            ...prev,
            ...tableData,
            rows: prev.rows.concat(...tableData.rows),
          }))

          return
        }

        setTableData(tableData)
      } catch (error) {
        showMessage({
          type: 'error',
          content:
            error?.message === ENDPOINTS_ERROR
              ? t('endpointFailure')
              : t('tableNotFound'),
        })
      }
      setLoading(false)
    },
    [showMessage, t],
  )

  const handleOnSearch = async (valueAccount) => {
    const accountName = valueAccount?.owner ?? ''

    setAccount(null)
    setAbi(null)
    setHash(null)
    setTableData(null)
    hideMessage(null)
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    try {
      const account = await eosApi.getAccount(accountName)

      setAccount(account)
    } catch (error) {
      showMessage({
        type: 'error',
        content:
          error?.message === ENDPOINTS_ERROR
            ? t('endpointFailure')
            : t('accountNotFound'),
      })
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

  useEffect(() => {
    const params = queryString.parse(location.search)

    handleOnSearch({ owner: params?.account || 'eosio' })
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    const params = queryString.parse(location.search)

    setFilters({
      owner: params?.account,
      table: params?.table || 'producers',
    })
    // eslint-disable-next-line
  }, [location.search])

  return (
    <div>
      <Card className={classes.cardShadow}>
        <CardContent className={classes.cardContent}>
          <SearchBar
            filters={filters}
            onChange={handleOnSearch}
            translationScope="accountsRoute"
          />
        </CardContent>
      </Card>
      {loading && <LinearProgress color="primary" />}
      {account && (
        <AccountInfo
          account={account}
          abi={abi}
          hash={hash}
          tableName={filters.table}
          onSubmitAction={handleSubmitAction}
          tableData={tableData}
          onGetTableRows={handleGetTableRows}
        />
      )}
    </div>
  )
}

Accounts.propTypes = {
  ual: PropTypes.object,
}

export default Accounts
