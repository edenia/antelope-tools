import React, { lazy, useEffect } from 'react'
import { makeStyles } from '@mui/styles'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import styles from './styles'

const useStyles = makeStyles(styles)

const BlockProducerInfo = lazy(() => import('./BlockProducerInfo'))

const Home = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation('homeRoute')
  const classes = useStyles()

  useEffect(() => {
    dispatch.eos.startTrackingInfo({ interval: 0.5 })
    dispatch.eos.startTrackingProducerSchedule({ interval: 60 })

    return () => {
      dispatch.eos.stopTrackingInfo()
      dispatch.eos.stopTrackingProducerSchedule()
    }
  }, [dispatch])

  return (
    <div>
      <BlockProducerInfo t={t} classes={classes} />
    </div>
  )
}

Home.propTypes = {}

export default Home
