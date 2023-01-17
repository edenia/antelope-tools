/* eslint camelcase: 0 */
import React, { memo } from 'react'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
import moment from 'moment'

import { eosConfig } from '../../config'
import useNonCompliantState from '../../hooks/customHooks/useNonCompliantState'
import NoResults from '../../components/NoResults'
import { formatWithThousandSeparator } from '../../utils'
import VisitSite from 'components/VisitSite'

import styles from './styles'

const useStyles = makeStyles(styles)

const NonCompliantBPs = () => {
  const classes = useStyles()
  const { t } = useTranslation('producerCardComponent')
  const [{ items, stats, loading }] = useNonCompliantState()

  const RewardsCards = ({ stats }) => {
    const { t } = useTranslation('rewardsDistributionRoute')

    return (
      <>
        <div className={`${classes.cardHeader} ${classes.cardShadow}`}>
          <div className={classes.rewardsCards}>
            <Typography variant="h6">{t('paidProducers')}</Typography>
            <Typography variant="h3" className={classes.statsText}>
              {items.length}
            </Typography>
          </div>
        </div>
        <div className={`${classes.cardHeader} ${classes.cardShadow}`}>
          <div className={classes.rewardsCards}>
            <Typography variant="h6">{`${t('dailyRewards')} (USD)`}</Typography>
            <Typography variant="h3" className={classes.statsText}>
              {`${formatWithThousandSeparator(
                stats.dailyRewards * stats.tokenPrice,
                0,
              )} USD`}
            </Typography>
          </div>
        </div>
        <div className={`${classes.cardHeader} ${classes.cardShadow}`}>
          <div className={classes.rewardsCards}>
            <Typography variant="h6">
              {`${t('dailyRewards')} (${eosConfig.tokenSymbol})`}
            </Typography>
            <Typography variant="h3" className={classes.statsText}>
              {`${formatWithThousandSeparator(stats.dailyRewards, 0)} ${
                eosConfig.tokenSymbol
              }`}
            </Typography>
          </div>
        </div>
        <div className={`${classes.cardHeader} ${classes.cardShadow}`}>
          <div className={classes.rewardsCards}>
            <Typography variant="h6">{t('rewardsPercentage')}</Typography>
            <Typography variant="h3" className={classes.statsText}>
              {`${stats.percentageRewards?.toFixed(2)}%`}
            </Typography>
          </div>
        </div>
      </>
    )
  }

  const ProducerCard = ({ producer }) => {
    return (
      <>
        <div className={`${classes.content} ${classes.account}`}>
          <Typography variant="h3">{producer.owner}</Typography>
          <Typography variant="body1">{t('noInfo')}</Typography>
        </div>
        <div className={`${classes.content} ${classes.borderLine}`}>
          <Typography variant="overline">{t('info')}</Typography>
          <div className={classes.website}>
            <Typography variant="body1" className={classes.textEllipsis}>
              {t('website')}:
            </Typography>
            <VisitSite title={t('openLink')} url={producer.url} />
          </div>
          <Typography variant="body1">
            {`${t('votes')}: ${formatWithThousandSeparator(
              producer.total_votes_eos,
              0,
            )}`}
          </Typography>
          <Typography variant="body1">
            {`${t('lastClaimTime')}: ${moment(producer.last_claim_time).format(
              'll',
            )}`}
          </Typography>
        </div>
        <div
          className={`${classes.content} ${classes.borderLine} ${classes.hideRewards}`}
        >
          <Typography variant="overline">{t('rewards')}</Typography>
          <Typography variant="body1">
            {`${t('rewards')} (USD): $${formatWithThousandSeparator(
              producer.total_rewards * stats.tokenPrice,
              0,
            )}`}
          </Typography>
          <Typography variant="body1">
            {`${t('rewards')} (${
              eosConfig.tokenSymbol
            }): ${formatWithThousandSeparator(producer.total_rewards, 0)}`}
          </Typography>
        </div>
      </>
    )
  }

  return (
    <>
      {loading ? (
        <LinearProgress />
      ) : (
        <>
          {!!items?.length && stats ? (
            <>
              <div className={classes.statsContainer}>
                <RewardsCards stats={stats} />
              </div>
              <div className={classes.container}>
                {items.map((producer, index) => (
                  <div
                    className={`${classes.card} ${classes.cardShadow}`}
                    key={`producer-card-${index}`}
                  >
                    <ProducerCard producer={producer} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <NoResults />
          )}
        </>
      )}
    </>
  )
}

NonCompliantBPs.propTypes = {}

export default memo(NonCompliantBPs)
