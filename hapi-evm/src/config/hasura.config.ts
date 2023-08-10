export const url =
  process.env.HAPI_HASURA_URL || 'http://hasura:8080/v1/graphql'
export const adminSecret =
  process.env.HAPI_HASURA_ADMIN_SECRET || 'myadminsecretkey'

if (!url || !adminSecret) {
  throw new Error('Missing required hasura env variables')
}
