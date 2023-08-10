export const url =
  process.env.HAPI_HASURA_URL || 'http://hasura:8080/v1/graphql'
export const adminSecret =
  process.env.HAPI_HASURA_ADMIN_SECRET || 'myadminsecretkey'
export const databaseURL = process.env.HAPI_DATABASE_URL

if (!url || !adminSecret || !databaseURL) {
  throw new Error('Missing required hasura env variables')
}
