import React, { useReducer, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import queryString from 'query-string'

import { signTransaction } from '../../utils/eos'
import eosApi, { ENDPOINTS_ERROR } from '../../utils/eosapi'
import getTransactionUrl from '../../utils/get-transaction-url'
import { useSnackbarMessageState } from '../../context/snackbar-message.context'
import { useSharedState } from '../../context/state.context'

const INITIAL_ACCOUNT_STATE = {
  filters: null,
  account: null,
  abi: null,
  hash: null,
  tableData: null,
  loading: false,
}

const accountStateReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FILTERS':
      return { ...state, filters: action.payload }

    case 'SET_ACCOUNT':
      return { ...state, account: action.payload }

    case 'SET_ABI':
      return { ...state, abi: action.payload }

    case 'SET_HASH':
      return { ...state, hash: action.payload }

    case 'SET_TABLE_DATA':
      return { ...state, tableData: action.payload }

    case 'SET_LOADING':
      return { ...state, loading: action.payload }

    default: {
      throw new Error(`Unsupported action type: ${action.type}`)
    }
  }
}

const useAccountState = () => {
  const location = useLocation()
  const { t } = useTranslation('accountsRoute')
  const [, { showMessage, hideMessage }] = useSnackbarMessageState()
  const [{ ual }] = useSharedState()
  const [state, dispatch] = useReducer(
    accountStateReducer,
    INITIAL_ACCOUNT_STATE,
  )

  const getErrorMessage = useCallback((error, resultRequested = '') => {
    if (error?.message === ENDPOINTS_ERROR) {
      return t('endpointFailure')
    } else {
      try {
        const actionError = JSON.parse(error?.message).error.details[0].message

        return actionError?.substring(0, 11) === 'unknown key'
          ? `${resultRequested} ${t('notFound')}`
          : actionError
      } catch (error) {
        return t('unknownError')
      }
    }
  }, [t])

  const handleSubmitAction = async (action) => {
    if (!ual.activeUser) {
      showMessage({
        type: 'error',
        content: t('loginBeforeUseAction'),
      })

      return
    }

    hideMessage()
    dispatch({ payload: true, type: 'SET_LOADING' })

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

    dispatch({ payload: false, type: 'SET_LOADING' })
  }

  const handleGetTableRows = useCallback(
    async ({ loadMore, ...payload }) => {
      if (state.loading) return

      dispatch({ payload: true, type: 'SET_LOADING' })

      try {
        const tableData = await eosApi.getTableRows(payload)

        if (loadMore) {
          dispatch({
            type: 'SET_TABLE_DATA',
            payload: {
              ...state.tableData,
              ...tableData,
              rows: state.tableData.rows.concat(...tableData.rows),
            },
          })
        } else {
          dispatch({
            type: 'SET_TABLE_DATA',
            payload: tableData,
          })
        }
      } catch (error) {
        showMessage({
          type: 'error',
          content: getErrorMessage(error, `${t('table')} ${payload?.table}`),
        })

        console.log(error)
      }
      dispatch({ payload: false, type: 'SET_LOADING' })
    },
    [showMessage, getErrorMessage, t, state.tableData, state.loading],
  )

  const handleOnSearch = async (valueAccount) => {
    const accountName = valueAccount?.owner ?? ''

    if (!accountName) return

    hideMessage(null)
    dispatch({ payload: true, type: 'SET_LOADING' })

    await new Promise((resolve) => setTimeout(resolve, 500))

    try {
      const account = await eosApi.getAccount(accountName)

      dispatch({ payload: account, type: 'SET_ACCOUNT' })

      const { abi } = await eosApi.getAbi(accountName)

      dispatch({ payload: abi, type: 'SET_ABI' })

      if (abi?.tables?.length) {
        let tableName = valueAccount?.table ?? ''

        if (tableName) {
          tableName =
            abi?.tables.find((table) => table.name === tableName)?.name ?? ''

          if (!tableName) {
            showMessage({
              type: 'error',
              content: t(
                `${t('table')} ${valueAccount?.table} ${t('notFound')}`,
              ),
            })
          }
        } else {
          tableName =
            accountName === 'eosio' &&
            abi?.tables.find((table) => table.name === 'producers')
              ? 'producers'
              : abi?.tables[0]?.name
        }

        dispatch({
          type: 'SET_FILTERS',
          payload: {
            owner: accountName,
            table: tableName,
          },
        })
      }

      const { code_hash: hash = '' } = await eosApi.getCodeHash(accountName)

      dispatch({ payload: hash, type: 'SET_HASH' })
    } catch (error) {
      showMessage({
        type: 'error',
        content: getErrorMessage(error, `${t('account')} ${accountName}`),
      })

      console.log(error)
    }

    dispatch({ payload: false, type: 'SET_LOADING' })
  }

  useEffect(() => {
    const params = queryString.parse(location.search)

    handleOnSearch({
      owner: params?.account || 'eosio',
      table: params?.table,
    })
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    const params = queryString.parse(location.search)

    dispatch({
      type: 'SET_FILTERS',
      payload: {
        owner: params?.account,
        table: params?.table,
      },
    })
    // eslint-disable-next-line
  }, [location.search])

  return [state, { handleSubmitAction, handleGetTableRows, handleOnSearch }]
}

export default useAccountState
