import React from 'react'
import { useParams, Navigate } from 'react-router-dom'
import Helmet from 'react-helmet'
import { useTranslation } from 'react-i18next'

import useProducerProfileState from './useProducerProfileState'
import EmptyState from 'components/InformationCard/EmptyState'
import { eosConfig } from 'config'

const ProducerProfile = () => {
  const { t } = useTranslation('producerCardComponent')
  let { bpName } = useParams()
  const [{ ldJson, producer }] = useProducerProfileState(bpName)

  if (!producer) return <></> 

  if (!producer?.owner) return <Navigate to="/404" /> 

  const bpJsonHealthStatus = producer?.health_status?.find(
    (status) => status.name === 'bpJson',
  )

  if (!bpJsonHealthStatus?.valid && eosConfig.networkName !== 'lacchain')
    return <EmptyState t={t} />

  return (
    <>
      <Helmet>
        {ldJson && <script type="application/ld+json">{ldJson}</script>}
      </Helmet>
    </>
  )
}

export default ProducerProfile
