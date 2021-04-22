import gql from 'graphql-tag'

export const SETTING_QUERY = gql`
  query setting {
    setting: setting_by_pk(id: 1) {
      id
      eos_price
    }
  }
`
