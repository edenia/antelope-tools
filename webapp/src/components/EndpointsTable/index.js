import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import Button from '@mui/material/Button'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { Tooltip as MUITooltip } from '@mui/material'
import ListAltIcon from '@mui/icons-material/ListAlt'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import QueryStatsIcon from '@mui/icons-material/QueryStats'

import HealthCheck from '../HealthCheck'
import HealthCheckInfo from 'components/HealthCheck/HealthCheckInfo'
import { getStatus } from 'utils'

import styles from './styles'
import Tooltip from '../Tooltip'
import EndpointsTextList from '../EndpointsTextList'

const useStyles = makeStyles(styles)

const EndpointsTable = ({ producers }) => {
  const classes = useStyles()
  const { t } = useTranslation('endpointsListRoute')
  const [anchorEl, setAnchorEl] = useState(null)
  const [type, setType] = useState('')

  const handlePopoverOpen = (target, type) => {
    setAnchorEl(target)
    setType(type)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

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
      <Tooltip
        anchorEl={anchorEl}
        open={anchorEl !== null}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <EndpointsTextList type={type} />
      </Tooltip>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('producer')}</TableCell>
              <TableCell>
                <div className={classes.titleCell}>
                  {t('api')}
                  <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    startIcon={<ListAltIcon />}
                    onClick={(e) => {
                      handlePopoverOpen(e.target, 'api')
                    }}
                  >
                    {t('showList')}
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                <div className={classes.titleCell}>
                  {t('ssl')}
                  <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    startIcon={<ListAltIcon />}
                    onClick={(e) => {
                      handlePopoverOpen(e.target, 'ssl')
                    }}
                  >
                    {t('showList')}
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                <div className={classes.titleCell}>
                  {t('p2p')}
                  <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    startIcon={<ListAltIcon />}
                    onClick={(e) => {
                      handlePopoverOpen(e.target, 'p2p')
                    }}
                  >
                    {t('showList')}
                  </Button>
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
