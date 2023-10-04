import React from 'react'
import { useParams, Navigate, useLocation } from 'react-router-dom'
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
import CountryFlag from 'components/CountryFlag'

import styles from './styles'
import useProducerProfileState from './useProducerProfileState'

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
  const { healthLights } = generalConfig

  window.history.replaceState({}, document.title)

  if (!producer) return <></>

  if (!producer?.owner) return <Navigate to="/404" />

  const GeneralInformation = ({ producer }) => {
    const eosRate = producer?.eosRate

    return (
      <>
        <SimpleDataCard title={t('rank')} value={`${producer?.rank}`} />
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
          <SimpleDataCard title={t('eosRate')}>
            <div className={classes.eosRateContainer}>
              <Typography component="p" variant="h6">
                {eosRate.average.toFixed(2)}
              </Typography>
              <span>
                <Typography variant="body1">
                  {` ${t('average')} (${eosRate.ratings_cntr} ${t('ratings')})`}
                  <VisitSite
                    title={t('openLink')}
                    url={`${generalConfig.eosRateLink}block-producers/${eosRate.bp}`}
                  />
                </Typography>
              </span>
            </div>
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
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h3">{title}</Typography>
          <div className={classes.dataContainer}>{children}</div>
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
          {value ? (
            <>
              {type === 'text' && value}
              {type === 'hiddenLink' && <VisitSite url={url || value} />}
              {type === 'modal' && <URLModal data={value} />}
              {type === 'link' && (
                <Link
                  href={url || value}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {value}
                </Link>
              )}
            </>
          ) : (
            <LightIcon status={healthLights.redLight} />
          )}
        </p>
      </span>
    )
  }

  const OrganizationData = ({ producer }) => {
    return (
      <div className={classes.OrgDataContainer}>
        <OrganizationItem
          title={t('location')}
          value={
            <>
              {producer?.location}
              <CountryFlag code={producer?.country} />{' '}
            </>
          }
        />
        <OrganizationItem
          title={t('email')}
          value={producer?.media?.email}
          url={`mailto:${producer?.media?.email}`}
          type="link"
        />
        <OrganizationItem
          title={t('website')}
          value={producer?.media?.website}
          type="link"
        />
        <OrganizationItem
          title={t('codeofconduct')}
          value={producer?.info?.codeOfConduct}
          type="hiddenLink"
        />
        <OrganizationItem
          title={t('ownershipDisclosure')}
          value={producer?.info?.ownership}
          type="hiddenLink"
        />
        <OrganizationItem
          title={t('chainResources')}
          value={producer?.info?.chainResources}
          type="hiddenLink"
        />
        {producer?.info?.otherResources?.length && (
          <OrganizationItem
            title={t('otherResources')}
            value={producer?.info?.otherResources}
            type="modal"
          />
        )}
      </div>
    )
  }

  return (
    <>
      <Helmet title={producer?.owner}>
        {ldJson && <script type="application/ld+json">{ldJson}</script>}
      </Helmet>
      <Card className={classes.card}>
        <div className={classes.profile}>
          <ProducerName
            name={producer?.media?.name}
            account={producer?.owner}
            text={t('BPonNetwork', {
              networkName: eosConfig.networkLabel,
              position: producer?.media?.account,
            })}
            logo={producer?.media?.logo}
            size="big"
          />
          {producer?.social?.length && (
            <div className={classes.socialLinks}>
              <ProducerSocialLinks items={producer?.social} />
            </div>
          )}
        </div>
        <OrganizationData producer={producer} />
      </Card>
      <WrapperContainer title={t('generalInformation')}>
        <GeneralInformation producer={producer} />
        {producer?.hasEmptyBPJson && <EmptyState t={t} classes={classes} />}
      </WrapperContainer>
      {!producer?.hasEmptyBPJson && !!producer?.nodes?.length && (
        <WrapperContainer title={t('nodes')}>
          <NodesCard nodes={producer.nodes} />
        </WrapperContainer>
      )}
    </>
  )
}

export default ProducerProfile
