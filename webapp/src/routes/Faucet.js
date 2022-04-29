import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import { useTranslation } from 'react-i18next'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

import { eosConfig } from '../config'
import { CREATE_ACCOUNT_MUTATION, TRANFER_FAUCET_TOKENS_MUTATION } from '../gql'
import { useSnackbarMessageState } from '../context/snackbar-message.context'

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(4, 4, 0, 0)
  }
}))

const Faucet = () => {
  const classes = useStyles()
  const { t } = useTranslation('faucetRoute')
  const [, { showMessage }] = useSnackbarMessageState()
  const [account, setAccount] = useState('')
  const [publicKey, setPublicKey] = useState('')
  const [newCreatedAccount, setNewCreatedAccount] = useState('')
  const [transferTokensTransaction, setTransferTokensTransaction] = useState('')
  const [
    createFaucetAccount,
    { data: dataCreateAccount, loading: loadingCreateAccount }
  ] = useMutation(CREATE_ACCOUNT_MUTATION)
  const [
    transferFaucetTokens,
    { data: dataTransferFaucetTokens, loading: loadingTransferFaucetTokens }
  ] = useMutation(TRANFER_FAUCET_TOKENS_MUTATION)
  const { executeRecaptcha } = useGoogleReCaptcha()

  const createAccount = async () => {
    setNewCreatedAccount('')

    const reCaptchaToken = await executeRecaptcha?.('submit')

    if (!reCaptchaToken || !publicKey) return

    try {
      await createFaucetAccount({
        variables: {
          token: reCaptchaToken,
          public_key: publicKey
        }
      })
    } catch (err) {
      const errorMessage = err.message.replace(
        'GraphQL error: assertion failure with message: ',
        ''
      )
      showMessage({
        type: 'error',
        content: errorMessage
      })
    }
  }

  const transferTokens = async () => {
    setTransferTokensTransaction('')

    const reCaptchaToken = await executeRecaptcha?.('submit')

    if (!reCaptchaToken || !account) return

    try {
      await transferFaucetTokens({
        variables: {
          token: reCaptchaToken,
          to: account
        }
      })
    } catch (err) {
      const errorMessage = err.message.replace(
        'GraphQL error: assertion failure with message: ',
        ''
      )
      showMessage({
        type: 'error',
        content: errorMessage
      })
    }
  }

  useEffect(() => {
    if (!dataCreateAccount) return

    const { createAccount } = dataCreateAccount

    setNewCreatedAccount(createAccount.account)
  }, [dataCreateAccount])

  useEffect(() => {
    if (!dataTransferFaucetTokens) return

    const { transferFaucetTokens } = dataTransferFaucetTokens

    setTransferTokensTransaction(transferFaucetTokens.tx)
  }, [dataTransferFaucetTokens])

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Card>
          <CardContent>
            <Typography variant="h5">{t('createAccount')}</Typography>
            <Grid
              container
              alignItems="flex-end"
              className={classes.formControl}
              spacing={2}
            >
              <Grid item>
                <TextField
                  key="action-field-issue-tokens"
                  label="Public Key (Active/Owner)"
                  variant="outlined"
                  value={publicKey}
                  onChange={(e) => setPublicKey(e.target.value)}
                />
              </Grid>
              <Grid item>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loadingCreateAccount}
                  endIcon={
                    loadingCreateAccount ? (
                      <CircularProgress size={20} />
                    ) : (
                      <></>
                    )
                  }
                  onClick={createAccount}
                >
                  {t('createButton')}
                </Button>
              </Grid>
              {newCreatedAccount && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="h5">{`${t(
                    'newCreatedAccount'
                  )} ${newCreatedAccount}`}</Typography>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Card>
          <CardContent>
            <Typography variant="h5">{t('issueTokens')}</Typography>
            <Grid
              container
              alignItems="flex-end"
              className={classes.formControl}
              spacing={2}
            >
              <Grid item>
                <TextField
                  key="action-field-issue-tokens"
                  label={`Account (500 ${eosConfig.tokenSymbol})`}
                  variant="outlined"
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                />
              </Grid>
              <Grid item>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loadingTransferFaucetTokens}
                  endIcon={
                    loadingTransferFaucetTokens ? (
                      <CircularProgress size={20} />
                    ) : (
                      <></>
                    )
                  }
                  onClick={transferTokens}
                >
                  {t('getTokens')}
                </Button>
              </Grid>
              {transferTokensTransaction && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="h5">
                    {t('transferTokensTransaction')}
                  </Typography>
                  <a
                    href={eosConfig.blockExplorerUrl.replace(
                      '(transaction)',
                      transferTokensTransaction
                    )}
                  >
                    {transferTokensTransaction.slice(0, 7)}
                  </a>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Faucet
