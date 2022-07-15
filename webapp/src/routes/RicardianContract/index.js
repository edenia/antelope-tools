import React from 'react'
import Box from '@mui/material/Box'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import { RicardianContract as RicardianContractComponent } from '@eoscostarica/eoscr-components'

import { eosConfig } from '../../config'
import styles from './styles'

const useStyles = makeStyles(styles)

const RicardianContract = () => {
  const classes = useStyles()
  const { t } = useTranslation('ricardianContractRoute')

  return (
    <Box className={classes.root}>
      <RicardianContractComponent
        contractName="eosio"
        actionName=""
        httpEndpoint={eosConfig.endpoint}
        LinearProgressColor="primary"
        title={t('title')}
      />
    </Box>
  )
}

export default RicardianContract
