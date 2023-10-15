import React, { lazy, Suspense } from 'react'
import { useParams, Navigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

import { eosConfig } from '../../config'
import PageTitle from 'components/PageTitle'

import GeneralInformation from './GeneralInformation'
import ProfileCard from './ProfileCard'
import useProducerProfileState from './useProducerProfileState'
import styles from './styles'

const NodesCard = lazy(() => import('./../../components/NodeCard/NodesCard'))
const EmptyState = lazy(() =>
  import('./../../components/EmptyState'),
)

const useStyles = makeStyles(styles)

const ProducerProfile = () => {
  const classes = useStyles()
  const { t } = useTranslation('producerCardComponent')
  let { bpName } = useParams()
  const location = useLocation()
  const [{ ldJson, producer }] = useProducerProfileState(
    bpName,
    location?.state?.producer,
  )

  window.history.replaceState({}, document.title)

  if (!producer) return <></>

  if (!producer?.owner) return <Navigate to="/404" />

  const metaData = {
    bpName: producer?.media?.name || bpName,
    networkName: eosConfig.networkLabel,
  }
  const pageTitle = t('bpProfile>title', metaData)
  const metaTitle = t('bpProfile>metaTitle', metaData)
  const metaDescription = t('bpProfile>metaDescription', metaData)

  const WrapperContainer = ({ title, children }) => {
    return (
      <div className={`simple-card ${classes.container}`}>
        <Typography variant="h3">{title}</Typography>
        <div className={classes.dataContainer}>{children}</div>
      </div>
    )
  }

  return (
    <>
      <PageTitle
        title={pageTitle}
        metaTitle={metaTitle}
        metaDescription={metaDescription}
        ldJson={ldJson}
      />
      <div className={`simple-card ${classes.container} ${classes.profileContainer}`}>
        <ProfileCard producer={producer}/>
      </div>
      <WrapperContainer title={t('generalInformation')}>
        <GeneralInformation producer={producer} />
        {producer?.hasEmptyBPJson && (
          <Suspense fallback={<CircularProgress />}>
            <EmptyState />
          </Suspense>
        )}
      </WrapperContainer>
      {!producer?.hasEmptyBPJson && !!producer?.nodes?.length && (
        <Suspense fallback={<CircularProgress />}>
          <WrapperContainer title={t('nodes')}>
            <NodesCard nodes={producer.nodes} />
          </WrapperContainer>
        </Suspense>
      )}
    </>
  )
}

export default ProducerProfile
