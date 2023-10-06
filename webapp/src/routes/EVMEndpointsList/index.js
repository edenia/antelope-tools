import React from 'react'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined'

import HealthCheck from '../../components/HealthCheck'
import HealthCheckInfo from '../../components/HealthCheck/HealthCheckInfo'
import HealthInfoModal from '../../components/HealthCheck/InfoModal'

import styles from './styles'
import useRPCEndpointsState from './useRPCEndpointsState'
import { getStatus, formatWithThousandSeparator } from 'utils'
import { generalConfig } from 'config'

const useStyles = makeStyles(styles)

const EVMEndpointsList = () => {
  const classes = useStyles()
  const { t } = useTranslation('evmEndpointsRoute')
  const [{ endpoints, filter }, { runHealthCheck, handleFilter }] =
    useRPCEndpointsState()
  const { healthLights } = generalConfig

  return (
    <Card className={classes.cardShadow}>
      <CardContent>
        <div className={classes.titleContainer}>
          <Typography component="h2" variant="h6">
            {t('title')}
          </Typography>
          <HealthInfoModal />
        </div>
        <div className={classes.formContainer}>
          <div className={classes.buttonContainer}>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              onClick={runHealthCheck}
              startIcon={<AutorenewOutlinedIcon />}
            >
              {t('rerun')}
            </Button>
          </div>
          <div className={classes.switchContainer}>
            <Typography component="p" variant="body1">
              {t('filterEndpoints')}
            </Typography>
            <Switch
              checked={filter}
              inputProps={{ 'aria-label': t('filterEndpoints') }}
              onChange={event => {
                handleFilter(event.target?.checked)
              }}
            />
          </div>
        </div>
        <div className={classes.tableContainer}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('rpcEndpoint')}</TableCell>
                  <TableCell align="right">{t('lastBlock')}</TableCell>
                  <TableCell align="right">{t('latency')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {endpoints?.map((endpoint, index) => (
                  (!filter || getStatus(endpoint) !== healthLights.redLight) && (
                    <TableRow key={`evm-endpoint-${index}`}>
                      <TableCell>
                        <div className={classes.healthContainer}>
                          {endpoint.url}
                          <HealthCheck status={getStatus(endpoint)}>
                            <HealthCheckInfo healthCheck={endpoint} />
                          </HealthCheck>
                        </div>
                      </TableCell>
                      <TableCell align="right">
                        {formatWithThousandSeparator(endpoint.height) || 'N/A'}
                      </TableCell>
                      <TableCell align="right">
                        {endpoint.latency
                          ? `${formatWithThousandSeparator(endpoint.latency)} ms`
                          : 'N/A'}
                      </TableCell>
                    </TableRow>
                  )
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export default EVMEndpointsList
