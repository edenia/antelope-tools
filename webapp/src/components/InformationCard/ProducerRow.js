/* eslint camelcase: 0 */
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import TableCell from '@mui/material/TableCell'

import { formatData, formatWithThousandSeparator } from '../../utils'
import { eosConfig } from '../../config'
import ProducerName from 'components/ProducerName'
import ComplianceBar from 'components/ComplianceBar'
import CountryFlag from 'components/CountryFlag'
import ViewBPProfile from 'components/ViewBPProfile'

import styles from './styles'
import MainSocialLinks from './MainSocialLinks'
import EmptyStateRow from './EmptyStateRow'

const useStyles = makeStyles(styles)

const ProducerRow = ({ producer, index }) => {
  const classes = useStyles()
  const { t } = useTranslation('producerCardComponent')
  const [producerOrg, setProducerOrg] = useState({})

  const BlockProducerInfo = () => {
    if (producerOrg?.hasEmptyBPJson)
      return (
        <TableCell align="center" colSpan={eosConfig.networkName !== 'lacchain' ? 6 : 4}>
          <EmptyStateRow classes={classes} t={t} />
        </TableCell>
      )

    return (
      <>
        <TableCell>
          <Typography className={classes.country}>
            <span className={classes.hideOnMobile}>
              {producerOrg?.location}
            </span>
            <CountryFlag code={producerOrg?.country} />
          </Typography>
        </TableCell>
        <TableCell align="center">
          <Link
            href={producerOrg?.media?.website}
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            <Typography variant="body1" className={classes.website}>
              {producerOrg?.media?.website}
            </Typography>
          </Link>
        </TableCell>
        {eosConfig.producerColumns?.includes('votes') && (
          <TableCell align="center">
            <Typography variant="body1">
              {formatWithThousandSeparator(producer?.total_votes_eos || '0', 0)}
            </Typography>
          </TableCell>
        )}
        {eosConfig.producerColumns?.includes('rewards') && (
          <TableCell align="center">
            <Typography variant="body1">{`${formatWithThousandSeparator(
              producer?.total_rewards || '0',
              0,
            )} ${eosConfig.tokenSymbol}`}</Typography>
          </TableCell>
        )}
        <TableCell align="center">
          <ComplianceBar
            total={producerOrg?.compliance?.total}
            pass={producerOrg?.compliance?.pass}
          />
        </TableCell>
        <TableCell align="center">
          <MainSocialLinks
            social={producerOrg?.social}
            name={producerOrg?.media?.name}
          />
        </TableCell>
      </>
    )
  }

  useEffect(() => {
    setProducerOrg(
      formatData({
        data: producer.bp_json?.org || {},
        rank: producer?.rank,
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
    <>
      {producer?.rank && eosConfig.producerColumns?.includes('rank') && (
        <TableCell align="center">
          <Typography
            variant="h2"
            component="p"
          >{`${producer?.rank}`}</Typography>
        </TableCell>
      )}
      <TableCell>
        <ProducerName
          logo={producerOrg?.media?.logo}
          text={t(producerOrg?.media?.account)}
          name={producerOrg?.media?.name}
          lazy={index > 10}
        />
      </TableCell>
      <BlockProducerInfo />
      <TableCell align="center">
        <ViewBPProfile producer={producer} />
      </TableCell>
    </>
  )
}

ProducerRow.propTypes = {
  producer: PropTypes.any,
  index: PropTypes.number,
}

ProducerRow.defaultProps = {
  producer: {},
  index: 0,
}

export default ProducerRow
