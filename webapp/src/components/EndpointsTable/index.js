import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { Tooltip as MUITooltip } from '@mui/material'
import Link from '@mui/material/Link'
import QueryStatsIcon from '@mui/icons-material/QueryStats'

import CopyToClipboard from '../CopyToClipboard'
import HealthCheck from '../HealthCheck'
import HealthCheckInfo from '../HealthCheck/HealthCheckInfo'
import { getStatus } from 'utils'
import { eosConfig } from '../../config'
import LocaleLink from 'components/LocaleLink'

import styles from './styles'

const useStyles = makeStyles(styles)

const EndpointsTable = ({ producers, textLists }) => {
  const classes = useStyles()
  const { t } = useTranslation('endpointsListRoute')

  const CellList = ({ producer, endpointType }) => {
    return (
      <TableCell>
        {!producer?.endpoints[endpointType].length ? (
          <Typography>N/A</Typography>
        ) : (
          producer.endpoints[endpointType].map((endpoint, index) => (
            <div
              className={classes.healthContainer}
              key={`${producer?.name}-${endpointType}-${index}`}
            >
              {endpoint.value}
              <HealthCheck status={getStatus(endpoint)}>
                <HealthCheckInfo healthCheck={endpoint} />
              </HealthCheck>
            </div>
          ))
        )}
      </TableCell>
    )
  }

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('producer')}</TableCell>
              <TableCell>
                <div className={classes.titleCell}>
                  {t('api')}
                  <CopyToClipboard text={textLists?.api} helperText={t('copyToClipboard')} />
                </div>
              </TableCell>
              <TableCell>
                <div className={classes.titleCell}>
                  {t('ssl')}
                  <CopyToClipboard text={textLists?.ssl} helperText={t('copyToClipboard')} />
                </div>
              </TableCell>
              <TableCell>
                <div className={classes.titleCell}>
                  {t('p2p')}
                  <CopyToClipboard text={textLists?.p2p} helperText={t('copyToClipboard')} />
                </div>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {producers.map((producer, index) => (
              <TableRow key={`${producer.name}-${index}`}>
                <TableCell>
                  <div className={classes.healthContainer}>
                    <Link
                      aria-label={`BP ${producer.name} Profile`}
                      component={LocaleLink}
                      to={`/${eosConfig.producersRoute}/${producer.name}`}
                      color="primary"
                    >
                      {producer.name}
                    </Link>
                    {(producer.endpoints.api.length +
                      producer.endpoints.ssl.length) > 0 && (
                      <MUITooltip title={t('linkToStats')} arrow>
                        <Link
                          aria-label={`Link to endpoints stats of ${producer.name}`}
                          title={`${producer.name} endpoints stats`}
                          component={LocaleLink}
                          state={{ producerId: producer.id }}
                          to="/endpoints-stats"
                          color="primary"
                        >
                          <QueryStatsIcon />
                        </Link>
                      </MUITooltip>
                    )}
                  </div>
                </TableCell>
                <CellList producer={producer} endpointType={'api'} />
                <CellList producer={producer} endpointType={'ssl'} />
                <CellList producer={producer} endpointType={'p2p'} />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

EndpointsTable.propTypes = {
  producers: PropTypes.array,
  textLists: PropTypes.object,
}

export default EndpointsTable
