import gql from 'graphql-tag'

export const CREATE_ACCOUNT_MUTATION = gql`
  mutation ($public_key: String!) {
    createAccount(public_key: $public_key) {
      account
    }
  }
`
