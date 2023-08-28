export const url = process.env.HAPI_EVM_HASURA_URL || ''
export const adminSecret = process.env.HAPI_EVM_HASURA_ADMIN_SECRET || ''
export const databaseURL = process.env.HAPI_EVM_DATABASE_URL || ''

if (!url || !adminSecret || !databaseURL) {
  throw new Error('Missing required hasura env variables')
}
