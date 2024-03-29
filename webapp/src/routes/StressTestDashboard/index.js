import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import TransactionInfo from 'routes/Home/TransactionInfo'

import { useSharedState } from '../../context/state.context'
import TransactionsHistory from '../../components/TransactionsHistory'

const StressTestDashboard = () => {
  const { t } = useTranslation('homeRoute')
  const [, { startTrackingInfo, stopTrackingInfo }] = useSharedState()

  useEffect(() => {
    startTrackingInfo({ interval: 0.5 })

    return () => {
      stopTrackingInfo()
    }
    // eslint-disable-next-line
  }, [])

  return (
    <>
      <TransactionInfo
        t={t}
        stopTrackingInfo={stopTrackingInfo}
        startTrackingInfo={() => {
          startTrackingInfo({ interval: 0.5 })
        }}
      />
      <TransactionsHistory t={t} />
    </>
  )
}

export default StressTestDashboard
