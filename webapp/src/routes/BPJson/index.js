import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import { BPJsonGenerator } from '@eoscostarica/eoscr-components'
import { makeStyles } from '@mui/styles'

import { eosConfig } from '../../config'

import useBPJsonState from './useBPJsonState'
import styles from './styles'

const useStyles = makeStyles(styles)

const BPJson = () => {
  const classes = useStyles()
  const [
    { loading, inconsistencyMessage, initData, producer, error, ual },
    { t, handleOnSubmit },
  ] = useBPJsonState()

  return (
    <Card className={classes.cardShadow}>
      <CardContent>
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
      </CardContent>
    </Card>
  )
}

export default BPJson
