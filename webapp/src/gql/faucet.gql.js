import gql from 'graphql-tag'

export const CREATE_ACCOUNT_MUTATION = (includeName = true) => gql`
  mutation ($token: String!, $public_key: String! ${
    includeName ? ', $name: String' : ''
  }) {
    createAccount(token: $token, public_key: $public_key ${
      includeName ? ', name: $name' : ''
    }) {
      account
    }
  }
`

export const TRANFER_FAUCET_TOKENS_MUTATION = gql`
  mutation ($token: String!, $to: String!) {
    transferFaucetTokens(token: $token, to: $to) {
      tx
    }
  }
`
