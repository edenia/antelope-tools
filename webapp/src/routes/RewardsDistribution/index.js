/* eslint camelcase: 0 */
import React, { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@apollo/client'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Typography from '@mui/material/Typography'
import { Link as MuiLink } from '@mui/material'
import Skeleton from '@mui/material/Skeleton'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
import Popover from '@mui/material/Popover'

import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps'
import { scaleLinear } from 'd3-scale'
import { interpolateHcl } from 'd3-interpolate'

import UnknowFlagIcon from '../../components/UnknowFlagIcon'
import { formatWithThousandSeparator } from '../../utils'
import { countries } from '../../utils/countries'
import { PRODUCERS_QUERY, SETTING_QUERY } from '../../gql'
import CountryFlag from '../../components/CountryFlag'
import { eosConfig } from '../../config'

import styles from './styles'

const lowestRewardsColor = '#B6EBF3'
const highestRewardsColor = '#265F63'
const geoUrl =
  'https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/v2/topojson-maps/world-110m.json'

const useStyles = makeStyles((theme) =>
  styles(theme, lowestRewardsColor, highestRewardsColor),
)

const RewardsDistribution = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [currentNode, setCurrentNode] = useState(null)
  const [summary, setSummary] = useState(null)
  const { loading = true, data: { producers } = {} } = useQuery(
    PRODUCERS_QUERY,
    { variables: { limit: 2100, where: { total_rewards: { _gte: 100 } } } },
  )
  const { data: { setting } = {} } = useQuery(SETTING_QUERY)
  const [nodes, setNodes] = useState([])
  const classes = useStyles()
  const { t } = useTranslation('rewardsDistributionRoute')
  const open = Boolean(anchorEl)

  const handlePopoverOpen = (node) => (event) => {
    if (!nodes.length > 0) {
      return
    }
    setCurrentNode(node)
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  const colorScale = useCallback(
    scaleLinear()
      .domain([0, summary?.topCountryByRewards?.rewards - 1])
      .range([lowestRewardsColor, highestRewardsColor])
      .interpolate(interpolateHcl),
    [summary],
  )

  useEffect(() => {
    let stats = {
      'N/A': {
        code: 'N/A',
        name: t('notAvailable'),
        quantity: 0,
        items: [],
        rewards: 0,
      },
    }
    let dailyRewards = 0
    const items = producers || []
    const handleInvalidCountry = (producer) => {
      stats['N/A'].items.push(producer)
      stats['N/A'].rewards += producer.total_rewards
      stats['N/A'].quantity += 1
    }
    const handleValidCountry = (producer) => {
      if (!stats[producer.bp_json.org.location.country]) {
        stats = {
          ...stats,
          [producer.bp_json.org.location.country]: {
            code: producer.bp_json.org.location.country,
            name: countries[producer.bp_json.org.location.country]?.name,
            flag: countries[producer.bp_json.org.location.country]?.flag,
            quantity: 1,
            coordinates: [
              producer.bp_json.org.location.longitude,
              producer.bp_json.org.location.latitude,
            ],
            items: [producer],
            rewards: producer.total_rewards,
          },
        }
      } else {
        stats[producer.bp_json.org.location.country].items.push(producer)
        stats[producer.bp_json.org.location.country].rewards +=
          producer.total_rewards
        stats[producer.bp_json.org.location.country].quantity += 1
        if (
          producer.bp_json.org.location.longitude &&
          producer.bp_json.org.location.latitude
        ) {
          stats[producer.bp_json.org.location.country].coordinates = [
            producer.bp_json.org.location.longitude,
            producer.bp_json.org.location.latitude,
          ]
        }
      }
    }

    items
      .filter((a) => a.total_rewards >= 100)
      .forEach((producer) => {
        dailyRewards += producer.total_rewards || 0

        if (!producer?.bp_json?.org?.location?.country) {
          handleInvalidCountry(producer)
          return
        }

        handleValidCountry(producer)
      })

    const nodes = Object.values(stats)
    const topCountryByRewards = nodes.reduce(
      (prev, current) => {
        return current.rewards > prev.rewards && current.code !== 'N/A'
          ? current
          : prev
      },
      { rewards: 0 },
    )

    setSummary({
      dailyRewards,
      topCountryByRewards,
      producersWithoutProperBpJson: stats['N/A'],
    })
    setNodes(nodes)
  }, [producers, t])

  const TokenToUSD = ({ amount }) => {
    return (
      <span>
        {`${formatWithThousandSeparator(amount, 2)} ${
          eosConfig.tokenSymbol
        } / $${formatWithThousandSeparator(
          amount * setting?.token_price,
          2,
        )} USD`}
      </span>
    )
  }

  return (
    <div
      aria-owns={open ? 'mouse-over-popover' : undefined}
      aria-haspopup="true"
    >
      <Popover
        className={classes.shadow}
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        PaperProps={{ onMouseLeave: handlePopoverClose }}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        open={open}
        onClose={handlePopoverClose}
        id="mouse-over-popover"
      >
        <div className={classes.boxPadding}>
          <Typography>
            <span className={classes.popoverItem}>{t('country')}: </span>
            {!currentNode?.flag && (
              <span className={classes.countryFlagUnknown}>
                <UnknowFlagIcon />
              </span>
            )}
            <span>{currentNode?.name}</span>
            {currentNode?.flag && (
              <span className={classes.countryFlag}>{currentNode?.flag}</span>
            )}
          </Typography>
          {summary && (
            <Typography>
              <span className={classes.popoverItem}>
                {t('rewardsPercentage')}:{' '}
              </span>
              <span>
                {formatWithThousandSeparator(
                  (currentNode?.rewards / summary.dailyRewards) * 100,
                  2,
                )}
                %
              </span>
            </Typography>
          )}
          <Typography>
            <span className={classes.popoverItem}>{t('rewards')}: </span>
            <TokenToUSD amount={currentNode?.rewards} />
          </Typography>
          <span className={classes.popoverItem}>{t('producers')}:</span>
          <ul className={classes.producersList}>
            {currentNode?.items?.map((producer, i) => (
              <li key={`node-${i}`}>
                <MuiLink
                  href={`${producer.owner === 'eosrainbowbp' ? 'http://' : ''}${
                    producer?.bp_json?.org?.website || producer.url
                  }/bp.json`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {producer?.bp_json?.org?.candidate_name || producer.owner}
                </MuiLink>
                <br />
                <TokenToUSD amount={producer?.total_rewards} />
              </li>
            ))}
          </ul>
        </div>
      </Popover>
      {loading && <LinearProgress className={classes.linearLoader} />}
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
                    <TokenToUSD amount={summary.topCountryByRewards.rewards} />
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
                  />
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
                  <span className={classes.itemLabel}>
                    {t('lowestRewards')}
                  </span>
                </Typography>
                <Typography
                  variant="subtitle1"
                  className={classes.rewardsColorSchema}
                >
                  <span
                    className={`${classes.squareRewards} ${classes.highestRewards}`}
                  />
                  <span className={classes.itemLabel}>
                    {t('highestRewards')}
                  </span>
                </Typography>
              </div>
              {setting?.token_price && (
                <Typography
                  variant="subtitle1"
                  className={`${classes.textMargin} ${classes.center}`}
                >
                  <span className={classes.exchangeRateLabel}>
                    {`${t('exchangeRate')}: `}
                  </span>
                  <span>
                    {`1 ${
                      eosConfig.tokenSymbol
                    } = $${formatWithThousandSeparator(
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
      {!loading && (
        <Paper className={`${classes.mapWrapper} ${classes.cardShadow}`}>
          <ComposableMap
            projectionConfig={{
              scale: 170,
            }}
          >
            <ZoomableGroup maxZoom={1}>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo, i) => {
                    const nodeData = nodes.find(
                      (node) => node.code === geo.properties.ISO_A2,
                    )

                    return (
                      <Geography
                        onMouseOver={
                          nodeData ? handlePopoverOpen(nodeData) : () => {}
                        }
                        className={classes.geography}
                        key={geo.rsmKey}
                        geography={geo}
                        stroke="#8F9DA4"
                        fill={
                          nodeData && nodeData.rewards > 0
                            ? colorScale(parseInt(nodeData.rewards))
                            : '#EEEEEE'
                        }
                      />
                    )
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
        </Paper>
      )}
    </div>
  )
}

RewardsDistribution.propTypes = {}

export default RewardsDistribution
