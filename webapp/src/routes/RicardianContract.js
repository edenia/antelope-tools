import React from 'react'
import Box from '@mui/material/Box'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import { RicardianContract as RicardianContractComponent } from '@eoscostarica/eoscr-components'

import { eosConfig } from '../config'

const useStyles = makeStyles((theme) => ({
  root: {
    '& svg': {
      fontSize: '35px !important'
    },
    '& h4': {
      fontSize: '15px !important',
      fontWeight: '600'
    },
    '& a': {
      lineBreak: 'anywhere'
    },
    [theme.breakpoints.up('sm')]: {
      '& svg': {
        fontSize: '45px !important'
      },

      '& h4': {
        fontSize: '34px !important',
        fontWeight: 'normal'
      }
    }
  }
}))

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
