import React from 'react'
import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/styles'
import { RicardianContract as RicardianContractComponent } from '@eoscostarica/eoscr-components'

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

  return (
    <Box className={classes.root}>
      <RicardianContractComponent
        contractName="eosio"
        actionName="regproducer"
        httpEndpoint="https://api.eosio.cr"
        LinearProgressColor="primary"
      />
    </Box>
  )
}

export default RicardianContract
