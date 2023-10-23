import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { makeStyles } from '@mui/styles'
import Card from '@mui/material/Card'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

import { eosConfig } from '../../config'
import isValidAccountName from 'utils/validate-account-name'
import {
  CREATE_ACCOUNT_MUTATION,
  TRANFER_FAUCET_TOKENS_MUTATION,
} from '../../gql'
import { useSnackbarMessageState } from '../../context/snackbar-message.context'

import styles from './styles'

const useStyles = makeStyles(styles)

const Faucet = () => {
  const classes = useStyles()
  const { t } = useTranslation('faucetRoute')
  const isUltraTestnet = eosConfig.networkName === 'ultra-testnet'
  const [, { showMessage }] = useSnackbarMessageState()
  const [account, setAccount] = useState('')
  const [createAccountValues, setCreateAccountValues] = useState({})
  const [transferTokensTransaction, setTransferTokensTransaction] = useState('')
  const [createFaucetAccount, { loading: loadingCreateAccount }] = useMutation(
    CREATE_ACCOUNT_MUTATION(!isUltraTestnet),
  )
  const [transferFaucetTokens, { loading: loadingTransferFaucetTokens }] =
    useMutation(TRANFER_FAUCET_TOKENS_MUTATION)
  const { executeRecaptcha } = useGoogleReCaptcha()

  const createAccount = async () => {
    const reCaptchaToken = await executeRecaptcha?.('submit')

    if (
      !reCaptchaToken ||
      !createAccountValues.publicKey ||
      (!isUltraTestnet &&
        !createAccountValues.accountName)
    ) {
      showMessage({
        type: 'error',
        content: t('emptyFields'),
      })
      return
    }

    if (
      !isUltraTestnet &&
      !isValidAccountName(createAccountValues.accountName)
    ) {
      showMessage({
        type: 'error',
        content: t('invalidAccount'),
      })
      return
    }

    try {
      const {
        data: {
          createAccount: { account = '' },
        },
      } = await createFaucetAccount({
        variables: {
          token: reCaptchaToken,
          public_key: createAccountValues.publicKey,
          name: createAccountValues.accountName,
        },
      })

      showMessage({
        type: 'success',
        content: (
          <Link to={`/accounts?account=${account}`}>{`${t(
            'newCreatedAccount',
          )} ${account}`}</Link>
        ),
      })
    } catch (err) {
      const errorMessage = err.message
        .replace('GraphQL error:', '')
        .replace('assertion failure with message: ', '')

      showMessage({
        type: 'error',
        content: errorMessage,
      })
    }
    setCreateAccountValues({})
  }

  const transferTokens = async () => {
    setTransferTokensTransaction('')

    const reCaptchaToken = await executeRecaptcha?.('submit')

    if (!reCaptchaToken) return

    if (!account || !isValidAccountName(account)) {
      showMessage({
        type: 'error',
        content: t('invalidAccount'),
      })
      return
    }

    try {
      const result = await transferFaucetTokens({
        variables: {
          token: reCaptchaToken,
          to: account,
        },
      })

      const {
        data: {
          transferFaucetTokens: { tx = '' },
        },
      } = result

      showMessage({
        type: 'success',
        content: (
          <a
            href={eosConfig.blockExplorerUrl.replace('(transaction)', tx)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {`${t('transferTokensTransaction')} ${tx.slice(0, 7)}`}
          </a>
        ),
      })
    } catch (err) {
      const errorMessage = err.message.replace(
        'GraphQL error: assertion failure with message: ',
        '',
      )

      showMessage({
        type: 'error',
        content: errorMessage,
      })
    }

    setAccount('')
  }

  return (
    <div
      className={classes.container}
      style={{
        height: isUltraTestnet ? '250px' : '375px',
      }}
    >
      <Card className={classes.card}>
        <Typography component="h2" variant="h5">{t('createAccount')}</Typography>
        <div className={classes.formControl}>
          <div>
            <TextField
              key="action-field-issue-tokens"
              label={t('publicKey')}
              variant="outlined"
              value={createAccountValues.publicKey || ''}
              onChange={(e) =>
                setCreateAccountValues({
                  ...createAccountValues,
                  ...{ publicKey: e.target.value },
                })
              }
              helperText={t('keyFormat')}
              required
            />
          </div>
          {!isUltraTestnet && (
            <div>
              <TextField
                key="action-field-issue-tokens"
                label={t('accountName')}
                variant="outlined"
                value={createAccountValues.accountName || ''}
                onChange={(e) =>
                  setCreateAccountValues({
                    ...createAccountValues,
                    ...{ accountName: e.target.value },
                  })
                }
                error={!!createAccountValues.accountName && !isValidAccountName(createAccountValues.accountName)}
                helperText={t('accountFormat')}
                required
              />
            </div>
          )}
          <div>
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
          </div>
        </div>
      </Card>
      <Card className={classes.card}>
        <Typography component="h2" variant="h5">{`${t('issueTokens')} (500 ${eosConfig.tokenSymbol})`}</Typography>
        <div className={classes.formControl}>
          <div>
            <TextField
              key="action-field-issue-tokens"
              label={`${t('accountName')}`}
              variant="outlined"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              error={!!account && !isValidAccountName(account)}
              helperText={t('accountFormat')}
              required
            />
          </div>
          <div>
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
          </div>
          {transferTokensTransaction && (
            <div>
              <Typography variant="h5">
                {t('transferTokensTransaction')}
              </Typography>
              <a
                href={eosConfig.blockExplorerUrl.replace(
                  '(transaction)',
                  transferTokensTransaction,
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                {transferTokensTransaction.slice(0, 7)}
              </a>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default Faucet
