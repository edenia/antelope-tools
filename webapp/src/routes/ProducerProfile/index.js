import React from 'react'
import { useParams, Navigate } from 'react-router-dom'
import Helmet from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

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
      <Card>
        <CardContent>
          <Typography variant="h3">{title}</Typography>
          <div className={classes.container}>{children}</div>
        </CardContent>
      </Card>
    )
  }

  const URLModal = ({ data }) => {
    if (!Array.isArray(data)) return <></>
    return (
      <MoreInfoModal>
        {data.map((url, index) => (
          <div key={`more-info-${url}-${index}`}>
            <a href={url} target="_blank" rel="noopener noreferrer">
              {url}
            </a>
          </div>
        ))}
      </MoreInfoModal>
    )
  }

  const OrganizationItem = ({ title, value, url = '', type = 'text' }) => {
    return (
      <span className={classes.OrgDataItem}>
        <p>
          <Typography variant="caption">{title}</Typography> <br />
          {type === 'text' && value}
          {type === 'hiddenLink' && <VisitSite url={url || value} />}
          {type === 'modal' && <URLModal data={value} />}
          {type === 'link' && (
            <Link href={url || value} target="_blank" rel="noopener noreferrer">
              {value}
            </Link>
          )}
        </p>
      </span>
    )
  }

  const OrganizationData = ({ producer }) => {
    return (
      <Card className={classes.OrgDataContainer}>
        <OrganizationItem
          title={t('location')}
          value={producer?.bp_json?.org?.location?.name}
        />
        <OrganizationItem
          title={t('email')}
          value={producer?.bp_json?.org?.email}
          url={`mailto:${producer?.bp_json?.org?.email}`}
          type="link"
        />
        <OrganizationItem
          title={t('website')}
          value={producer?.bp_json?.org?.website}
          type="link"
        />
        <OrganizationItem
          title={t('codeofconduct')}
          value={producer?.bp_json?.org?.code_of_conduct}
          type="hiddenLink"
        />
        <OrganizationItem
          title={t('ownershipDisclosure')}
          value={producer?.bp_json?.org?.ownership_disclosure}
          type="hiddenLink"
        />
        <OrganizationItem
          title={t('chainResources')}
          value={producer?.bp_json?.org?.chain_resources}
          type="hiddenLink"
        />
        {producer?.bp_json?.org?.other_resources?.length && (
          <OrganizationItem
            title={t('otherResources')}
            value={producer?.bp_json?.org?.other_resources}
            type="modal"
          />
        )}
      </Card>
    )
  }

  return (
    <>
      <Helmet title={producer?.owner}>
        {ldJson && <script type="application/ld+json">{ldJson}</script>}
      </Helmet>
      <Card className={classes.profile}>
        {Object.keys(producer?.bp_json?.org?.social || {})?.length && (
          <div className={classes.socialLinks}>
            <ProducerSocialLinks items={producer?.bp_json?.org?.social} />
          </div>
        )}
        <ProducerName name={producer?.bp_json?.org?.candidate_name} account={producer?.owner} text={"Block Producer"} size="big"/>
      </Card>
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
