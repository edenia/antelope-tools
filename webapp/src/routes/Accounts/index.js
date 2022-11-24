import React, { lazy } from 'react'
import { makeStyles } from '@mui/styles'
import LinearProgress from '@mui/material/LinearProgress'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

import SearchBar from '../../components/SearchBar'

import useAccountState from './useAccountState'
import styles from './styles'

const AccountInfo = lazy(() => import('../../components/AccountInfo'))

const useStyles = makeStyles(styles)

const Accounts = () => {
  const classes = useStyles()
  const [
    { filters, abi, loading, account, tableData, hash },
    { handleSubmitAction, handleGetTableRows, handleOnSearch },
  ] = useAccountState()

  return (
    <>
      <Card className={classes.cardShadow}>
        <CardContent className={classes.cardContent}>
          <SearchBar
            filters={filters}
            onChange={handleOnSearch}
            delay={1500}
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
          // onGetTableRows={() => console.log('callback render', account)}
        />
      )}
    </>
  )
}

export default Accounts
