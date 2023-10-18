import React from 'react'
import LinearProgress from '@mui/material/LinearProgress'
import Alert from '@mui/material/Alert'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { BPJsonGenerator } from '@eoscostarica/eoscr-components'

import { eosConfig } from '../../config'

import useBPJsonState from './useBPJsonState'

const BPJson = () => {
  const [
    { loading, inconsistencyMessage, initData, producer, error, ual },
    { t, handleOnSubmit },
  ] = useBPJsonState()

  return (
    <Card>
      {loading && (
        <>
          <Typography variant="h5" align="center">
            {t('loadText')}
          </Typography>
          <LinearProgress color="primary" />
        </>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      {inconsistencyMessage && (
        <Alert severity="warning">{inconsistencyMessage}</Alert>
      )}
      <BPJsonGenerator
        accountName={ual.activeUser?.accountName || initData.account_name}
        bpJson={producer?.bpJson || initData}
        onSubmit={eosConfig.bpJsonOnChainContract ? handleOnSubmit : null}
      />
    </Card>
  )
}

export default BPJson
