/* eslint camelcase: 0 */
import React, { memo } from 'react'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'

import { eosConfig } from '../../config'
import { formatWithThousandSeparator } from '../../utils'

import styles from './styles'

const useStyles = makeStyles(styles)

const RewardsStats = ({ stats }) => {
  const classes = useStyles()
  const { t } = useTranslation('rewardsDistributionRoute')

  return (
    <>
      <div className={`${classes.cardHeader} ${classes.cardShadow}`}>
        <div className={classes.rewardsCards}>
          <Typography component="h4">{t('paidProducers')}</Typography>
          <div className={`${classes.statsText} ${classes.verticallyCenter}`}>
            <Typography variant="h6" component="p">
              {stats.quantity || 0}
            </Typography>
          </div>
        </div>
      </div>
      <div className={`${classes.cardHeader} ${classes.cardShadow}`}>
        <div className={classes.rewardsCards}>
          <Typography component="h4">{t('dailyRewards')}</Typography>
          <div className={`${classes.statsText} ${classes.verticallyCenter}`}>
            <Typography variant="h6" component="p" className={classes.price}>
              {`${formatWithThousandSeparator(stats.dailyRewards, 0)} ${
                eosConfig.tokenSymbol
              }`}
            </Typography>
            <Typography variant="h6" component="p" className={classes.price}>
              {`$${formatWithThousandSeparator(
                stats.dailyRewards * stats.tokenPrice,
                0,
              )} USD`}
            </Typography>
          </div>
        </div>
      </div>
      <div className={`${classes.cardHeader} ${classes.cardShadow}`}>
        <div className={classes.rewardsCards}>
          <Typography component="h4">{t('yearlyRewards')}</Typography>
          <div className={`${classes.statsText} ${classes.verticallyCenter}`}>
            <Typography variant="h6" component="p" className={classes.price}>
              {`${formatWithThousandSeparator(stats.yearlyRewards, 0)} ${
                eosConfig.tokenSymbol
              }`}
            </Typography>
            <Typography variant="h6" component="p" className={classes.price}>
              {`$${formatWithThousandSeparator(
                stats.yearlyRewards * stats.tokenPrice,
                0,
              )} USD`}
            </Typography>
          </div>
        </div>
      </div>
      <div className={`${classes.cardHeader} ${classes.cardShadow}`}>
        <div className={classes.rewardsCards}>
          <Typography component="h4">{t('rewardsPercentage')}</Typography>
          <div className={`${classes.statsText} ${classes.verticallyCenter}`}>
            <Typography variant="h6" component="p">
              {`${stats.percentageRewards?.toFixed(2)}%`}
            </Typography>
          </div>
        </div>
      </div>
    </>
  )
}

RewardsStats.propTypes = {}

export default memo(RewardsStats)
