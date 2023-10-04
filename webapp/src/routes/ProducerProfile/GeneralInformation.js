import React from 'react'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import Typography from '@mui/material/Typography'

import { eosConfig, generalConfig } from '../../config'
import { formatWithThousandSeparator } from 'utils'
import LightIcon from 'components/HealthCheck/LightIcon'
import SimpleDataCard from 'components/SimpleDataCard'
import VisitSite from 'components/VisitSite'

import styles from './styles'

const useStyles = makeStyles(styles)

const GeneralInformation = ({ producer }) => {
  const classes = useStyles()
  const { t } = useTranslation('producerCardComponent')
  const { healthLights } = generalConfig

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
      {producer?.eosRate && (
        <SimpleDataCard title={t('eosRate')}>
          <div className={classes.eosRateContainer}>
            <Typography component="p" variant="h6">
              {producer?.eosRate.average.toFixed(2)}
            </Typography>
            <span>
              <Typography variant="body1">
                {` ${t('average')} (${producer?.eosRate.ratings_cntr} ${t(
                  'ratings',
                )})`}
                <VisitSite
                  title={t('openLink')}
                  url={`${generalConfig.eosRateLink}block-producers/${producer?.eosRate.bp}`}
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

export default GeneralInformation
