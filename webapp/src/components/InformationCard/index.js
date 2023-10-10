/* eslint camelcase: 0 */
import React, { memo, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import useMediaQuery from '@mui/material/useMediaQuery'

import { formatData } from '../../utils'
import NodesCard from '../NodeCard/NodesCard'
import ProducerName from 'components/ProducerName'
import ViewBPProfile from 'components/ViewBPProfile'

import styles from './styles'

const useStyles = makeStyles(styles)

const InformationCard = ({ producer, rank, type }) => {
  const classes = useStyles()
  const theme = useTheme()
  const { t } = useTranslation('producerCardComponent')
  const matches = useMediaQuery(theme.breakpoints.up('lg'))
  const [expanded, setExpanded] = useState(false)
  const [producerOrg, setProducerOrg] = useState({})

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  useEffect(() => {
    setProducerOrg(
      formatData({
        data: producer.bp_json?.org || {},
        rank,
        owner: producer.owner,
        healthStatus: producer.health_status,
        dataType: producer.bp_json?.type,
        totalRewards: producer.total_rewards,
      }),
    )
    // eslint-disable-next-line
  }, [producer])

  if (!producerOrg || !Object.keys(producerOrg)?.length) return <></>

  return (
    <Card className={classes.root}>
      <CardHeader />
      <div
        className={`${classes.wrapper} ${
          type === 'node' ? classes.hideScroll : ''
        }`}
      >
        {producer?.rank && (
          <Typography
            variant="h2"
            component="p"
          >{`${producer?.rank}`}</Typography>
        )}
        <ProducerName
          logo={producerOrg?.media?.logo}
          text={producerOrg?.media?.account}
          name={producerOrg?.media?.name}
          lazy={producer?.rank > 5}
        />
        {type === 'node' && (
          <>
            <Collapse
              in={matches ? true : expanded}
              timeout="auto"
              unmountOnExit
              className={classes.collapse}
            >
              <div className={classes.nodesContainer}>
                <NodesCard nodes={producer.bp_json?.nodes} hideFeatures />{' '}
              </div>
            </Collapse>
          </>
        )}
        <ViewBPProfile producer={producer} />
      </div>
      {type === 'node' && !matches && (
        <CardActions disableSpacing className={classes.cardActions}>
          <div className={classes.expandMore}>
            <Button color="primary" onClick={handleExpandClick}>
              {expanded ? t('collapse') : t('moreInfo')}
            </Button>
          </div>
        </CardActions>
      )}
    </Card>
  )
}

InformationCard.propTypes = {
  producer: PropTypes.any,
  rank: PropTypes.number,
  type: PropTypes.string,
}

InformationCard.defaultProps = {
  producer: {},
  rank: 0,
  type: '',
}

export default memo(InformationCard)
