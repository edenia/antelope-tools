import { useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'

import { PRODUCERS_QUERY } from '../../gql'
import isValidAccountName from 'utils/validate-account-name'

const useProducerProfileState = (name) => {
  const defaultVariables = {
    limit: 1,
    offset: 0,
    endpointFilter: undefined,
    where: {
      owner: { _eq: name },
    },
  }
  const [ldJson, setLdJson] = useState()
  const [loadProducers, { loading, data: { producers } = {} }] =
    useLazyQuery(PRODUCERS_QUERY)

  const isValidName = isValidAccountName(name)

  useEffect(() => {
    if (isValidName) {
      loadProducers({ variables: defaultVariables })
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (!producers || !producers.length) return

    const bp = producers.at(0)?.bp_json?.org

    if (!bp) return

    setLdJson(
      JSON.stringify({
        '@context': 'http://schema.org',
        '@type': 'Organization',
        name: bp.candidate_name,
        url: bp.website,
        contactPoint: {
          '@type': 'ContactPoint',
          email: bp.email,
          contactType: 'customer service',
        },
        logo: bp.branding.logo_256,
      }),
    )
  }, [producers])

  const getProducer = (producers) =>
    !isValidName || (Array.isArray(producers) && !producers.length)
      ? {}
      : producers?.at(0)

  return [{ loading, producer: getProducer(producers), ldJson }, {}]
}

export default useProducerProfileState
