/* eslint camelcase: 0 */
import React, { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/react-hooks'
import { useTranslation } from 'react-i18next'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Box from '@material-ui/core/Box'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Pagination from '@material-ui/lab/Pagination'

import { PRODUCERS_QUERY } from '../gql'

const limitOptions = [10, 20, 30, 50, 80, 130]

const EndpointsList = () => {
  const { t } = useTranslation('endpointsListRoute')
  const [load, { loading, data }] = useLazyQuery(PRODUCERS_QUERY)
  const [producers, setProducers] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 80,
    totalPages: 0
  })

  useEffect(() => {
    load({
      variables: {
        offset: (pagination.page - 1) * pagination.limit,
        limit: pagination.limit
      }
    })
    // eslint-disable-next-line
  }, [pagination.page, pagination.limit])

  useEffect(() => {
    if (!data?.info) {
      return
    }

    setPagination((prev) => ({
      ...prev,
      totalPages: Math.ceil(data?.info.producers?.count / pagination.limit)
    }))
    // eslint-disable-next-line
  }, [data?.info, pagination.limit])

  useEffect(() => {
    if (!data?.producers) {
      return
    }

    setProducers(
      data.producers.map((producer) => ({
        name:
          producer.bp_json?.org?.candidate_name ||
          producer?.bp_json?.org?.organization_name ||
          producer?.owner,
        endpoints: {
          api: producer.bp_json?.endpoints?.api,
          ssl: producer.bp_json?.endpoints?.ssl,
          p2p: producer.bp_json?.endpoints?.p2p
        }
      }))
    )

    // eslint-disable-next-line
  }, [data?.producers])

  const handleOnPageChange = (_, page) => {
    setPagination((prev) => ({
      ...prev,
      page
    }))
  }

  return (
    <Grid item xs={12}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                p={1}
              >
                <Typography component="p" variant="h6">
                  {t('title')} {t('producer')}
                </Typography>
                <FormControl>
                  <InputLabel id="selectLabel">{t('itemsPerPage')}</InputLabel>
                  <Select
                    style={{
                      minWidth: 150
                    }}
                    labelId="selectLabel"
                    value={pagination.limit || ''}
                    onChange={(e) =>
                      setPagination((prev) => ({
                        ...prev,
                        limit: parseInt(e.target.value)
                      }))
                    }
                    fullWidth
                  >
                    {limitOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              {loading && <LinearProgress />}
              {!loading && producers.length > 0 && (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>{t('producer')}</TableCell>
                        <TableCell>{t('api')}</TableCell>
                        <TableCell>{t('ssl')}</TableCell>
                        <TableCell>{t('p2p')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {producers.map((producer, index) => (
                        <TableRow key={index}>
                          <TableCell>{producer.name}</TableCell>
                          <TableCell>
                            {producer.endpoints.api.map((endpoint, index) => (
                              <Typography key={index}>{endpoint}</Typography>
                            ))}
                            {!producer.endpoints.api.length && (
                              <Typography>{t('N/A')}</Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            {producer.endpoints.ssl.map((endpoint, index) => (
                              <Typography key={index}>{endpoint}</Typography>
                            ))}
                            {!producer.endpoints.ssl.length && (
                              <Typography>{t('N/A')}</Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            {producer.endpoints.p2p.map((endpoint, index) => (
                              <Typography key={index}>{endpoint}</Typography>
                            ))}
                            {!producer.endpoints.p2p.length && (
                              <Typography>{t('N/A')}</Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              {!loading && pagination.totalPages > 1 && (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  p={3}
                >
                  <Pagination
                    count={pagination.totalPages}
                    page={pagination.page}
                    onChange={handleOnPageChange}
                    variant="outlined"
                    shape="rounded"
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  )
}

EndpointsList.propTypes = {}

export default EndpointsList
