import React, { useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
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
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import QueryStatsIcon from '@mui/icons-material/QueryStats'

import CopyToClipboard from '../CopyToClipboard'
import HealthCheck from '../HealthCheck'
import HealthCheckInfo from '../HealthCheck/HealthCheckInfo'
import { getStatus } from 'utils'
import { ENDPOINTS_QUERY } from '../../gql'

import styles from './styles'

const useStyles = makeStyles(styles)

const EndpointsTable = ({ producers }) => {
  const classes = useStyles()
  const { t } = useTranslation('endpointsListRoute')
  const [textLists, setTextLists] = useState({})
  const [loadProducers, { data: { producers: bpsWorkingEndpoints } = {} }] =
    useLazyQuery(ENDPOINTS_QUERY)

  useEffect(()=>{
    loadProducers({
      variables: {
        where: {
          response: { _contains: { isWorking: true } },
        },
      },
    })
  },[loadProducers])

  useEffect(() => {
    if (!bpsWorkingEndpoints?.length) return

    let endpointsList = {api:'',p2p:'',ssl:''}

    Object.keys(endpointsList).forEach(type => {
      endpointsList[type] += `# List of available ${type.toUpperCase()} endpoints \n`

      bpsWorkingEndpoints.forEach(producer => {
        if (!!producer?.endpoints?.length && producer.endpoints.some(endpoint=>endpoint.type===type)) {
          endpointsList[type] += `# ${producer.owner} \n`
          producer.endpoints.forEach(endpoint => {
            if (endpoint.type === type) {
              endpointsList[type] += `${type === 'p2p' ? 'p2p-peer-address = ' : ''} ${
                endpoint.value
              } \n`
            }
          })
          endpointsList[type] += '\n'
        }
      })
    })
    
    setTextLists(endpointsList)
  }, [bpsWorkingEndpoints])

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
                  <CopyToClipboard text={textLists.api}/>
                </div> 
              </TableCell>
              <TableCell>
                <div className={classes.titleCell}>
                  {t('ssl')}
                  <CopyToClipboard text={textLists.ssl}/>
                </div>
              </TableCell>
              <TableCell>
                <div className={classes.titleCell}>
                  {t('p2p')}
                  <CopyToClipboard text={textLists.p2p}/>
                </div>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {producers.map((producer, index) => (
              <TableRow key={`${producer.name}-${index}`}>
                <TableCell>
                  <div className={classes.healthContainer}>
                    {producer.name}
                    {!!producer.endpoints.api.length +
                      producer.endpoints.ssl.length && (
                      <MUITooltip title={t('linkToStats')} arrow>
                        <Link
                          aria-label={`Link to endpoints stats of ${producer.name}`}
                          component={RouterLink}
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
}

export default EndpointsTable
