/* eslint camelcase: 0 */
import React, { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Pagination from '@mui/material/Pagination'
import moment from 'moment'

import { PRODUCERS_QUERY } from '../../gql'

const limitOptions = [10, 20, 30, 50, 80, 130]

const EndpointsList = () => {
  const { t } = useTranslation('endpointsListRoute')
  const [load, { loading, data }] = useLazyQuery(PRODUCERS_QUERY)
  const [producers, setProducers] = useState([])
  const [updatedAt, setUpdatedAt] = useState()
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
      data.producers
        .filter((producer) => {
          return (
            producer.endpoints?.api.length ||
            producer.endpoints?.ssl.length ||
            producer.endpoints?.p2p.length
          )
        })
        .map((producer) => ({
          name:
            producer.bp_json?.org?.candidate_name ||
            producer?.bp_json?.org?.organization_name ||
            producer?.owner,
          endpoints: {
            api: producer.endpoints?.api || [],
            ssl: producer.endpoints?.ssl || [],
            p2p: producer.endpoints?.p2p || []
          }
        }))
    )

    if (!data.producers?.[0]?.updated_at) {
      return
    }

    setUpdatedAt(data.producers[0].updated_at)
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
                <Box>
                  <Typography component="p" variant="h6">
                    {t('title')} {t('producer')}
                  </Typography>
                  {updatedAt && (
                    <Typography component="p" variant="caption">
                      {t('updatedAt')}: {moment(updatedAt).format('LL')}
                    </Typography>
                  )}
                </Box>
                <FormControl variant="standard">
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
