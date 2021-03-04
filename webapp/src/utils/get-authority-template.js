import { eosConfig } from '../config'

const getAuthoritTemplate = (key) => {
  if (eosConfig.networkName === 'lacchain') {
    return {
      threshold: 2,
      keys: [{ weight: 1, key: key || '' }],
      accounts: [
        { weight: 1, permission: { actor: 'writer', permission: 'access' } }
      ],
      waits: []
    }
  }

  return {
    threshold: 1,
    keys: [{ weight: 1, key: key || '' }],
    accounts: [],
    waits: []
  }
}

export default getAuthoritTemplate
