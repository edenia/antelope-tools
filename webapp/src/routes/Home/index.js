import React, { lazy, useEffect } from 'react'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'

import { useSharedState } from '../../context/state.context'

import styles from './styles'

const useStyles = makeStyles(styles)

const BlockProducerInfo = lazy(() => import('./BlockProducerInfo'))

const Home = () => {
  const [
    ,
    {
      startTrackingInfo,
      startTrackingProducerSchedule,
      stopTrackingInfo,
      stopTrackingProducerSchedule,
    },
  ] = useSharedState()

  const { t } = useTranslation('homeRoute')
  const classes = useStyles()

  useEffect(() => {
    startTrackingInfo({ interval: 0.5 })
    startTrackingProducerSchedule({ interval: 60 })

    return () => {
      stopTrackingInfo()
      stopTrackingProducerSchedule()
    }
    // eslint-disable-next-line
  }, [])

  return (
    <BlockProducerInfo t={t} classes={classes} />
  )
}

Home.propTypes = {}

export default Home
