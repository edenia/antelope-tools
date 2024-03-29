/* eslint camelcase: 0 */
import React, { memo } from 'react'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import { eosConfig } from '../../config'
import { formatWithThousandSeparator } from '../../utils'
import LocaleLink from '../../components/LocaleLink'
import SimpleDataCard from '../../components/SimpleDataCard'

import styles from './styles'

const useStyles = makeStyles(styles)

const RewardsStats = ({ stats }) => {
  const classes = useStyles()
  const { t } = useTranslation('rewardsDistributionRoute')

  return (
    <div className={classes.statsContainer}>
      <SimpleDataCard title={t('paidProducers')}>
        <div className={`${classes.statsText} ${classes.verticallyCenter}`}>
          <Typography variant="h6" component="p">
            {stats.quantity || 0}
          </Typography>
        </div>
      </SimpleDataCard>
      <SimpleDataCard title={t('dailyRewards')}>
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
      </SimpleDataCard>
      <SimpleDataCard title={t('yearlyRewards')}>
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
      </SimpleDataCard>
      <SimpleDataCard title={t('rewardsPercentage')}>
        <div className={`${classes.statsText} ${classes.verticallyCenter}`}>
          <Typography variant="h6" component="p">
            {`${stats.percentageRewards?.toFixed(2)}%`}
          </Typography>
        </div>
      </SimpleDataCard>
      <SimpleDataCard title={t('publishBPDetails')} helperText={t('tooltip.generateBPjson')}>
        <div className={`${classes.statsText} ${classes.verticallyCenter}`}>
        <Button
          aria-label={t('generateBPjson')}
          component={LocaleLink}
          to="/bpjson"
          variant="contained"
          color="primary"
          mt={2}
        >
          {t('generateBPjson')}
        </Button>
        </div>
      </SimpleDataCard>
    </div>
  )
}

RewardsStats.propTypes = {}

export default memo(RewardsStats)
