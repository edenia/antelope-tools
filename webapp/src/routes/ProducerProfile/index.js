import React from 'react'
import { useParams, Navigate } from 'react-router-dom'
import Helmet from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'

import { eosConfig, generalConfig } from '../../config'
import ProducerName from 'components/ProducerName'
import SimpleDataCard from 'components/SimpleDataCard'
import NodesCard from 'components/NodeCard/NodesCard'
import ProducerSocialLinks from 'components/ProducerSocialLinks'
import EmptyState from 'components/InformationCard/EmptyState'
import { formatWithThousandSeparator } from 'utils'
import LightIcon from 'components/HealthCheck/LightIcon'
import VisitSite from 'components/VisitSite'
import MoreInfoModal from 'components/MoreInfoModal'

import styles from './styles'
import useProducerProfileState from './useProducerProfileState'

const useStyles = makeStyles(styles)

const ProducerProfile = () => {
  const classes = useStyles()
  const { t } = useTranslation('producerCardComponent')
  let { bpName } = useParams()
  const [{ ldJson, producer }] = useProducerProfileState(bpName)
  const { healthLights } = generalConfig

  if (!producer) return <></>

  if (!producer?.owner) return <Navigate to="/404" />

  const bpJsonHealthStatus = producer?.health_status?.find(
    (status) => status.name === 'bpJson',
  )

  if (!bpJsonHealthStatus?.valid && eosConfig.networkName !== 'lacchain')
    return <EmptyState t={t} />

  const GeneralInformation = ({ producer }) => {
    const eosRate = producer?.eosRate

    return (
      <>
        <SimpleDataCard title={t('rank')} value={`#${producer?.rank}`} />
        <SimpleDataCard
          title={t('votes')}
          value={`${formatWithThousandSeparator(
            producer?.total_votes_eos || 0,
            0,
          )}`}
        />
        <SimpleDataCard
          title={t('rewards')}
          value={`${formatWithThousandSeparator(
            producer?.total_rewards || 0,
            0,
          )} ${eosConfig.tokenSymbol}`}
        />
        {eosRate && (
          <SimpleDataCard
            title={t('eosRate')}
            value={eosRate.average.toFixed(2)}
          >
            <span>
              <Typography variant="body1">
                {` ${t('average')} (${eosRate.ratings_cntr} ${t('ratings')})`}
              </Typography>
              <VisitSite
                title={t('openLink')}
                url={`${generalConfig.eosRateLink}/block-producers/${eosRate.bp}`}
              />
            </span>
          </SimpleDataCard>
        )}
        <SimpleDataCard title={t('compliance')}>
          <div className={classes.healthContainer}>
            {producer?.health_status?.map((item, index) => (
              <span
                key={`health-indicator-${item?.name}-${index}`}
                className={classes.healthIndicator}
              >
                <LightIcon
                  status={
                    item.valid ? healthLights.greenLight : healthLights.redLight
                  }
                />
                <p>{t(item.name)}</p>
              </span>
            ))}
          </div>
        </SimpleDataCard>
      </>
    )
  }

  const WrapperContainer = ({ title, children }) => {
    return (
      <div className={classes.card}>
        <Typography variant="h3">{title}</Typography>
        <div className={classes.container}>{children}</div>
      </div>
    )
  }

  const URLModal = ({ data }) => {
    if (!Array.isArray(data)) return <></>
    return (
      <MoreInfoModal>
        {data.map((url, index) => (
          <div className={classes.dd} key={`more-info-${url}-${index}`}>
            <a href={url} target="_blank" rel="noopener noreferrer">
              {url}
            </a>
          </div>
        ))}
      </MoreInfoModal>
    )
  }

  const OrganizationData = ({ producer }) => {
    return (
      <div className={classes.OrgDataContainer}>
        <span className={classes.OrgDataItem}>
          <p>
            {t('location')} <br />
            {producer?.bp_json?.org?.location?.name}
          </p>
        </span>
        <span className={classes.OrgDataItem}>
          <p>
            {t('email')} <br />
            <Link
              href={`mailto:${producer?.bp_json?.org?.email}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {producer?.bp_json?.org?.email}
            </Link>
          </p>
        </span>
        <span className={classes.OrgDataItem}>
          <p>
            {t('website')} <br />
            <Link
              href={producer?.bp_json?.org?.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              {producer?.bp_json?.org?.website}
            </Link>
          </p>
        </span>
        <span className={classes.OrgDataItem}>
          <p>
            {t('codeofconduct')} <br />
            <VisitSite url={producer?.bp_json?.org?.code_of_conduct} />
          </p>
        </span>
        <span className={classes.OrgDataItem}>
          <p>
            {t('ownershipDisclosure')} <br />
            <VisitSite url={producer?.bp_json?.org?.ownership_disclosure} />
          </p>
        </span>
        <span className={classes.OrgDataItem}>
          <p>
            {t('chainResources')} <br />
            <VisitSite url={producer?.bp_json?.org?.chain_resources} />
          </p>
        </span>
        {producer?.bp_json?.org?.other_resources?.length && (
          <span className={classes.OrgDataItem}>
            <p>
              {t('otherResources')} <br />
              <URLModal data={producer?.bp_json?.org?.other_resources} />
            </p>
          </span>
        )}
      </div>
    )
  }

  return (
    <>
      <Helmet title={producer?.owner}>
        {ldJson && <script type="application/ld+json">{ldJson}</script>}
      </Helmet>
      <div className={classes.profile}>
        {Object.keys(producer?.bp_json?.org?.social || {})?.length && (
          <div className={classes.socialLinks}>
            <ProducerSocialLinks items={producer?.bp_json?.org?.social} />
          </div>
        )}
        <ProducerName name={producer?.owner} />
      </div>
      <OrganizationData producer={producer} />
      <WrapperContainer title={'General Information'}>
        <GeneralInformation producer={producer} />
      </WrapperContainer>
      <WrapperContainer title={t('nodes')}>
        <NodesCard nodes={producer.nodes} />
      </WrapperContainer>
    </>
  )
}

export default ProducerProfile
