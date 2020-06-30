import React from 'react'
import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/styles'
import { RicardianContract } from '@eoscostarica/eoscr-components'

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

const BlockProducerAgreementContract = () => {
  const classes = useStyles()
  // TODO: update the contract name when new version of RicardianContract is released with support for mainnet network
  return (
    <Box className={classes.root}>
      <RicardianContract name="consent2life" />
    </Box>
  )
}

export default BlockProducerAgreementContract
