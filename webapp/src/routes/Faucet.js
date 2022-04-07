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
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

import { CREATE_ACCOUNT_MUTATION, TRANFER_FAUCET_TOKENS_MUTATION } from '../gql'

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
  const [transferFaucetTokens, { data: dataTransferFaucetTokens }] =
    useMutation(TRANFER_FAUCET_TOKENS_MUTATION)
  const { executeRecaptcha } = useGoogleReCaptcha()

  const createAccount = async () => {
    const reCaptchaToken = await executeRecaptcha?.('submit')

    if (!reCaptchaToken) return

    try {
      await createFaucetAccount({
        variables: {
          token: reCaptchaToken,
          public_key: publicKey
        }
      })
    } catch (err) {
      console.log('ERR', err)
    }
  }

  const transferTokens = async () => {
    const reCaptchaToken = await executeRecaptcha?.('submit')

    console.log('RE-CATPCHA-TOKEN', reCaptchaToken)

    if (!reCaptchaToken) return

    try {
      await transferFaucetTokens({
        variables: {
          token: reCaptchaToken,
          faucet: '1aa2aa3aa4ai',
          to: account
        }
      })
    } catch (err) {
      console.log('ERR-TRANSFER', err)
    }
  }

  useEffect(() => {
    if (!dataCreateAccount) return

    const { createAccount } = dataCreateAccount

    console.log('NEW-ACCOUNT', createAccount.account)
  }, [dataCreateAccount])

  useEffect(() => {
    if (!dataTransferFaucetTokens) return
    console.log('DATA-TRANSFER-FAUCET-TOKENS', dataTransferFaucetTokens)

    const { transferFaucetTokens } = dataTransferFaucetTokens

    console.log('NEW-ACCOUNT', transferFaucetTokens.tx)
  }, [dataTransferFaucetTokens])

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
                onClick={transferTokens}
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
