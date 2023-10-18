/* eslint camelcase: 0 */

import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'

import { eosConfig } from '../../config'
import { formatData } from '../../utils'
import NodesCard from '../NodeCard/NodesCard'
import ProducerName from 'components/ProducerName'
import ViewBPProfile from 'components/ViewBPProfile'
import Tooltip from 'components/Tooltip'

import styles from './styles'

const useStyles = makeStyles(styles)

const NodesRow = ({ producer }) => {
  const classes = useStyles()
  const { t } = useTranslation('producerCardComponent')
  const [producerOrg, setProducerOrg] = useState({})
  const [anchorEl, setAnchorEl] = useState(null)

  const handlePopoverOpen = (target) => {
    setAnchorEl(target)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  const openPopOver = (event) => {
    handlePopoverOpen(event.target)
  }

  useEffect(() => {
    setProducerOrg(
      formatData({
        data: producer.bp_json?.org || {},
        rank: producer.rank,
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
    <Card className={`${classes.cardRow} ${classes.nodesRow}`}>
      <Tooltip
        anchorEl={anchorEl}
        open={anchorEl !== null}
        onClose={handlePopoverClose}
      >
        <>
          <Typography variant="h2" component="p" padding={4}>
            {t('bpNodes', {bpName: producerOrg?.media?.name })}
          </Typography>
          <NodesCard nodes={producer.bp_json?.nodes} hideFeatures />{' '}
        </>
      </Tooltip>
      {producer?.rank && eosConfig.producerColumns?.includes('rank') ? (
        <Typography
          variant="h2"
          component="p"
          textAlign="center"
        >{`${producer?.rank}`}</Typography>
      ) : (
        <span />
      )}
      <span>
        <ProducerName
          logo={producerOrg?.media?.logo}
          text={producerOrg?.media?.account}
          name={producerOrg?.media?.name}
          lazy={producer?.rank > 5}
        />
        <div className={`${classes.buttonContainer} ${classes.hideOnDesktop}`}>
          <Button variant="outlined" color="primary" onClick={openPopOver}>
            {t('viewNodes', { totalNodes: producer?.bp_json?.nodes?.length })}
          </Button>
        </div>
        <div className={classes.buttonContainer}>
          <ViewBPProfile producer={producer} />
        </div>
      </span>
      <div className={`${classes.nodesContainer} ${classes.hideOnMobile}`}>
        <NodesCard nodes={producer?.bp_json?.nodes} hideFeatures />{' '}
      </div>
    </Card>
  )
}

NodesRow.propTypes = {
  producer: PropTypes.object,
}

NodesRow.defaultProps = {
  producer: {},
}

export default NodesRow
