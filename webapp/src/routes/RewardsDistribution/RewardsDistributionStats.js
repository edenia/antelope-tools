import React from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'

import { formatWithThousandSeparator } from '../../utils'
import CountryFlag from '../../components/CountryFlag'
import { eosConfig } from '../../config'

import styles from './styles'
import TokenToUSD from './TokenToUSD'

const lowestRewardsColor = '#B6EBF3'
const highestRewardsColor = '#265F63'

const useStyles = makeStyles((theme) =>
  styles(theme, lowestRewardsColor, highestRewardsColor),
)

const RewardsDistributionStats = ({
  summary,
  nodes,
  setting,
  handlePopoverOpen,
}) => {
  const classes = useStyles()
  const { t } = useTranslation('rewardsDistributionRoute')

  return (
    <div className={classes.divMargin}>
      <div className={classes.cardHeader}>
        <Card className={classes.cardShadow}>
          <CardContent className={classes.cards}>
            <Typography variant="h6">{t('dailyRewards')}</Typography>
            <Typography variant="h3">
              {!nodes.length > 0 && (
                <Skeleton variant="text" width="100%" animation="wave" />
              )}
              {nodes.length > 0 && (
                <span>
                  {formatWithThousandSeparator(summary.dailyRewards, 2)}{' '}
                  {eosConfig.tokenSymbol}
                </span>
              )}
            </Typography>
            <Typography variant="h3">
              {!nodes.length > 0 && (
                <Skeleton variant="text" width="100%" animation="wave" />
              )}
              {nodes.length > 0 && setting?.token_price && (
                <span>
                  $
                  {formatWithThousandSeparator(
                    summary.dailyRewards * setting?.token_price,
                    0,
                  )}{' '}
                  USD
                </span>
              )}
            </Typography>
          </CardContent>
        </Card>
      </div>
      <div className={classes.cardHeader}>
        <Card className={classes.cardShadow}>
          <CardContent className={classes.cards}>
            <Typography variant="h6">{t('topCountryDailyRwards')}</Typography>
            <Typography variant="h3">
              {!nodes.length > 0 && (
                <Skeleton variant="text" width="100%" animation="wave" />
              )}
              {nodes.length > 0 && (
                <>
                  {summary.topCountryByRewards.name}
                  <CountryFlag code={summary.topCountryByRewards.code} />
                </>
              )}
            </Typography>
            <div className={`${classes.textMargin} ${classes.spaceBetween}`}>
              <Typography variant="subtitle1">
                {!nodes?.length > 0 && (
                  <Skeleton variant="text" width="100%" animation="wave" />
                )}
                {nodes?.length > 0 && setting?.token_price && (
                  <TokenToUSD
                    amount={summary.topCountryByRewards.rewards}
                    tokenPrice={setting?.token_price}
                  />
                )}
              </Typography>
              <ExpandMoreIcon
                className={classes.expandIcon}
                onClick={handlePopoverOpen(summary?.topCountryByRewards)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className={classes.cardHeader}>
        <Card className={classes.cardShadow}>
          <CardContent className={classes.cards}>
            <Typography variant="h6">{t('paidProducers')}</Typography>
            <Typography variant="h3">
              {!nodes.length > 0 && (
                <Skeleton variant="text" width="100%" animation="wave" />
              )}
              {nodes.length > 0 &&
                summary?.producersWithoutProperBpJson.quantity && (
                  <span className={classes.spaceBetween}>
                    {summary?.producersWithoutProperBpJson.quantity}
                    <Button
                      className={classes.nonCompliantButton}
                      component={Link}
                      to="/non-compliant-bps"
                      variant="contained"
                      color="secondary"
                      mt={2}
                    >
                      {t('viewList')}
                    </Button>
                  </span>
                )}
            </Typography>
            {!!summary?.producersWithoutProperBpJson.quantity && (
              <Typography variant="subtitle1" className={classes.textMargin}>
                <TokenToUSD
                  amount={summary?.producersWithoutProperBpJson.rewards}
                  tokenPrice={setting?.token_price}
                />{' '}
                {t('paidProducersText')}
              </Typography>
            )}
          </CardContent>
        </Card>
      </div>
      <div className={classes.cardHeader}>
        <Card className={classes.cardShadow}>
          <CardContent className={classes.cards}>
            <div className={classes.center}>
              <Typography
                variant="subtitle1"
                className={classes.rewardsColorSchema}
              >
                <span
                  className={`${classes.squareRewards} ${classes.lowestRewards}`}
                />
                <span className={classes.itemLabel}>{t('lowestRewards')}</span>
              </Typography>
              <Typography
                variant="subtitle1"
                className={classes.rewardsColorSchema}
              >
                <span
                  className={`${classes.squareRewards} ${classes.highestRewards}`}
                />
                <span className={classes.itemLabel}>{t('highestRewards')}</span>
              </Typography>
            </div>
            {setting?.token_price && (
              <Typography
                variant="subtitle1"
                className={`${classes.textMargin} ${classes.center}`}
              >
                <span className={classes.exchangeRateLabel}>
                  {`${t('exchangeRate')}: `}{' '}
                </span>
                <span>
                  {`1 ${eosConfig.tokenSymbol} = $${formatWithThousandSeparator(
                    setting.token_price,
                    4,
                  )}`}
                </span>
              </Typography>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default RewardsDistributionStats
