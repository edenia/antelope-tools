import React, { lazy, useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import styles from './styles'

const useStyles = makeStyles(styles)

const Box = lazy(() => import('@material-ui/core/Box'))
const BlockProducerInfo = lazy(() => import('./BlockProducerInfo'))
const TransactionInfo = lazy(() => import('./TransactionInfo'))

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

  console.log('home comp')

  return (
    <Box>
      <BlockProducerInfo t={t} classes={classes} />
      <TransactionInfo t={t} classes={classes} />
    </Box>
  )
}

Home.propTypes = {}

export default Home
