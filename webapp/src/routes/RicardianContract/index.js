import React from 'react'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import Card from '@mui/material/Card'

import { RicardianContract as RicardianContractComponent } from '@eoscostarica/eoscr-components'

import { eosConfig } from '../../config'
import styles from './styles'

const useStyles = makeStyles(styles)

const RicardianContract = () => {
  const classes = useStyles()
  const { t } = useTranslation('ricardianContractRoute')

  return (
    <Card className={classes.root}>
      <RicardianContractComponent
        contractName="eosio"
        actionName=""
        httpEndpoint={eosConfig.endpoint}
        LinearProgressColor="primary"
        title={t('title')}
      />
    </Card>
  )
}

export default RicardianContract
