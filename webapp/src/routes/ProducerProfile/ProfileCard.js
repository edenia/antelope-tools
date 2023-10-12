import React from 'react'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'

import { eosConfig, generalConfig } from '../../config'
import isValidUrl from '../../utils/validate-url'
import ProducerName from 'components/ProducerName'
import ProducerSocialLinks from 'components/ProducerSocialLinks'
import LightIcon from 'components/HealthCheck/LightIcon'
import VisitSite from 'components/VisitSite'
import MoreInfoModal from 'components/MoreInfoModal'
import CountryFlag from 'components/CountryFlag'

import styles from './styles'

const useStyles = makeStyles(styles)

const ProfileCard = ({ producer }) => {
  const classes = useStyles()
  const { t } = useTranslation('producerCardComponent')
  const { healthLights } = generalConfig

  const URLModal = ({ data }) => {
    if (!Array.isArray(data)) return <></>
    return (
      <MoreInfoModal>
        {data.map((url, index) => (
          <div key={`more-info-${url}-${index}`}>
            <a href={url} target="_blank" rel="nofollow noopener noreferrer">
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
          <Typography variant="capSubtitle">{title}</Typography> <br />
          {value ? (
            <>
              {type === 'text' && value}
              {type === 'hiddenLink' && <VisitSite url={url || value} />}
              {type === 'modal' && <URLModal data={value} />}
              {type === 'link' && (
                <Link
                  href={url || value}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
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
              {producer?.location?.name}
              <CountryFlag code={producer?.location?.country} />{' '}
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
          value={isValidUrl(producer?.media?.website) ? producer?.media?.website : '' }
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
        {!!producer?.info?.otherResources?.length && (
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
      <div className={classes.profile}>
        <ProducerName
          name={producer?.media?.name}
          account={producer?.owner}
          text={t('BPonNetwork', {
            networkName: eosConfig.networkLabel,
            position: producer?.media?.account,
          })}
          logo={producer?.media?.logo}
          lazy={false}
          size="big"
        />
        {!!producer?.social?.length && (
          <div className={classes.socialLinks}>
            <ProducerSocialLinks items={producer?.social} />
          </div>
        )}
      </div>
      <OrganizationData producer={producer} />
    </>
  )
}

export default ProfileCard
