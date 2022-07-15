import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { makeStyles } from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

import { eosConfig } from '../../config'
import {
  CREATE_ACCOUNT_MUTATION,
  TRANFER_FAUCET_TOKENS_MUTATION
} from '../../gql'
import { useSnackbarMessageState } from '../../context/snackbar-message.context'

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
  const [createAccountValues, setCreateAccountValues] = useState({})
  const [transferTokensTransaction, setTransferTokensTransaction] = useState('')
  const [createFaucetAccount, { loading: loadingCreateAccount }] = useMutation(
    CREATE_ACCOUNT_MUTATION
  )
  const [transferFaucetTokens, { loading: loadingTransferFaucetTokens }] =
    useMutation(TRANFER_FAUCET_TOKENS_MUTATION)
  const { executeRecaptcha } = useGoogleReCaptcha()

  const createAccount = async () => {
    const reCaptchaToken = await executeRecaptcha?.('submit')

    if (eosConfig.networkName === 'libre-testnet') {
      if (
        !reCaptchaToken ||
        (!createAccountValues.publicKey && !createAccountValues.accountName)
      )
        return
    } else {
      if (!reCaptchaToken || createAccountValues.publicKey) return
    }

    try {
      const {
        data: {
          createAccount: { account = '' }
        }
      } = await createFaucetAccount({
        variables: {
          token: reCaptchaToken,
          public_key: createAccountValues.publicKey,
          name: createAccountValues.accountName
        }
      })

      showMessage({
        type: 'success',
        content: `${t('newCreatedAccount')} ${account}`
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
    setCreateAccountValues({})
  }

  const transferTokens = async () => {
    setTransferTokensTransaction('')

    const reCaptchaToken = await executeRecaptcha?.('submit')

    if (!reCaptchaToken || !account) return

    try {
      const result = await transferFaucetTokens({
        variables: {
          token: reCaptchaToken,
          to: account
        }
      })

      const {
        data: {
          transferFaucetTokens: { tx = '' }
        }
      } = result

      showMessage({
        type: 'success',
        content: (
          <a href={eosConfig.blockExplorerUrl.replace('(transaction)', tx)}>
            {`${t('transferTokensTransaction')} ${tx.slice(0, 7)}`}
          </a>
        )
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

    setAccount('')
  }

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
                  label={t('publicKey')}
                  variant="outlined"
                  value={createAccountValues.publicKey || ''}
                  onChange={(e) =>
                    setCreateAccountValues({
                      ...createAccountValues,
                      ...{ publicKey: e.target.value }
                    })
                  }
                />
              </Grid>
              {eosConfig.networkName === 'libre-testnet' && (
                <Grid item>
                  <TextField
                    key="action-field-issue-tokens"
                    label={t('accountName')}
                    variant="outlined"
                    value={createAccountValues.accountName || ''}
                    onChange={(e) =>
                      setCreateAccountValues({
                        ...createAccountValues,
                        ...{ accountName: e.target.value }
                      })
                    }
                  />
                </Grid>
              )}
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
