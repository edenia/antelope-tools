import gql from 'graphql-tag'

export const CREATE_ACCOUNT_MUTATION = gql`
  mutation ($token: String!, $public_key: String!) {
    createAccount(token: $token, public_key: $public_key) {
      account
    }
  }
`

export const TRANFER_FAUCET_TOKENS_MUTATION = gql`
  mutation ($token: String!, $faucet: String!, $to: String!) {
    transferFaucetTokens(token: $token, faucet: $faucet, to: $to) {
      tx
    }
  }
`
