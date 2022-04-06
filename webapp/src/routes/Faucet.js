import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import { useTranslation } from 'react-i18next'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

import { CREATE_ACCOUNT_MUTATION } from '../gql'

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(4, 4, 0, 0)
  }
}))

const Faucet = ({ ual }) => {
  const classes = useStyles()
  const { t } = useTranslation('faucetRoute')
  const [account, setAccount] = useState('')
  const [publicKey, setPublicKey] = useState('')
  const [createFaucetAccount, { data: dataCreateAccount }] = useMutation(
    CREATE_ACCOUNT_MUTATION
  )

  const createAccount = async () => {
    try {
      await createFaucetAccount({
        variables: {
          public_key: publicKey
        }
      })
    } catch (err) {
      console.log('ERR', err)
    }
  }

  const issueTokens = async () => {}

  useEffect(() => {
    if (!dataCreateAccount) return

    const { createAccount } = dataCreateAccount

    console.log('NEW-ACCOUNT', createAccount.acocunt)
  }, [dataCreateAccount])

  return (
    <Grid container spacing={2}>
      <Grid item xs={8}>
        <Card>
          <CardContent>
            <Typography variant="h5">{t('createAccount')}</Typography>
            <Grid container alignItems="flex-end">
              <TextField
                key="action-field-issue-tokens"
                label="Public Key (Active/Owner)"
                variant="outlined"
                className={classes.formControl}
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={createAccount}
              >
                {t('createButton')}
              </Button>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={4}>
        <Card>
          <CardContent>
            <Typography variant="h5">{t('issueTokens')}</Typography>
            <Grid container alignItems="flex-end">
              <TextField
                key="action-field-issue-tokens"
                label="Account (500 UOS)"
                variant="outlined"
                className={classes.formControl}
                value={account}
                onChange={(e) => setAccount(e.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={issueTokens}
              >
                {t('getUOS')}
              </Button>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

Faucet.propTypes = {
  ual: PropTypes.object
}

export default Faucet
