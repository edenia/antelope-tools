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
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined'

import HealthCheck from 'components/HealthCheck'
import HealthCheckInfo from 'components/HealthCheck/HealthCheckInfo'
import HealthInfoModal from '../../components/HealthCheck/InfoModal'

import styles from './styles'
import useRPCEndpointsState from './useRPCEndpointsState'
import { getStatus } from 'utils'

const useStyles = makeStyles(styles)

const EVMEndpointsList = () => {
  const classes = useStyles()
  const { t } = useTranslation('evmEndpointsRoute')

  const [{ endpoints }, { runHealthCheck }] = useRPCEndpointsState()

  return (
    <Card className={classes.cardShadow}>
      <CardContent>
        <div className={classes.titleContainer}>
          <Typography component="p" variant="h6">
            {t('title')}
          </Typography>
          <HealthInfoModal />
        </div>
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
        <div className={classes.tableContainer}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('rpcEndpoint')}</TableCell>
                  <TableCell>{t('lastBlock')}</TableCell>
                  <TableCell>{t('latency')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {endpoints?.map((endpoint, index) => (
                  <TableRow key={`evm-endpoint-${index}`}>
                    <TableCell>
                      <div className={classes.healthContainer}>
                        {endpoint.url}
                        <HealthCheck status={getStatus(endpoint)}>
                          <HealthCheckInfo healthCheck={endpoint} />
                        </HealthCheck>
                      </div>
                    </TableCell>
                    <TableCell>{endpoint.height || 'N/A'}</TableCell>
                    <TableCell>
                      {endpoint.latency ? `${endpoint.latency} ms` : 'N/A'}
                    </TableCell>
                  </TableRow>
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
