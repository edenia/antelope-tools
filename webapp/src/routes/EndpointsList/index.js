/* eslint camelcase: 0 */
import React, { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Pagination from '@mui/material/Pagination'
import moment from 'moment'

import { PRODUCERS_QUERY } from '../../gql'

import EndpointsTable from './EndpointsTable'
import styles from './styles'

const useStyles = makeStyles(styles)

const limitOptions = [10, 20, 30, 50, 80, 130]

const EndpointsList = () => {
  const classes = useStyles()
  const { t } = useTranslation('endpointsListRoute')
  const [load, { loading, data }] = useLazyQuery(PRODUCERS_QUERY)
  const [producers, setProducers] = useState([])
  const [updatedAt, setUpdatedAt] = useState()
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 80,
    totalPages: 0,
  })

  useEffect(() => {
    load({
      variables: {
        offset: (pagination.page - 1) * pagination.limit,
        limit: pagination.limit,
        where: { endpoints: { _neq: { api: [], ssl: [], p2p: [] } } },
      },
    })
    // eslint-disable-next-line
  }, [pagination.page, pagination.limit])

  useEffect(() => {
    if (!data?.info) return

    setPagination((prev) => ({
      ...prev,
      totalPages: Math.ceil(data?.info.producers?.count / pagination.limit),
    }))
    // eslint-disable-next-line
  }, [data?.info, pagination.limit])

  useEffect(() => {
    if (!data?.producers) return

    setProducers(
      data.producers.map((producer) => ({
        name:
          producer.bp_json?.org?.candidate_name ||
          producer?.bp_json?.org?.organization_name ||
          producer?.owner,
        endpoints: producer.endpoints,
      })),
    )

    if (!data.producers?.[0]?.updated_at) return

    setUpdatedAt(data.producers[0].updated_at)
    // eslint-disable-next-line
  }, [data?.producers])

  const handleOnPageChange = (_, page) => {
    setPagination((prev) => ({
      ...prev,
      page,
    }))
  }

  return (
    <Card>
      <CardContent>
        <div className={classes.titleContainer}>
          <div className={classes.dateContainer}>
            <Typography component="p" variant="h6">
              {t('title')} {t('producer')}
            </Typography>
            {updatedAt && (
              <Typography component="p" variant="caption">
                {t('updatedAt')}: {moment(updatedAt).format('LL')}
              </Typography>
            )}
          </div>
          <FormControl variant="standard">
            <InputLabel id="selectLabel">{t('itemsPerPage')}</InputLabel>
            <Select
              className={classes.select}
              labelId="selectLabel"
              value={pagination.limit || ''}
              onChange={(e) =>
                setPagination((prev) => ({
                  ...prev,
                  limit: parseInt(e.target.value),
                }))
              }
              fullWidth
            >
              {limitOptions.map((option, index) => (
                <MenuItem key={`limit-${option}-${index}`} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        {loading ? (
          <LinearProgress />
        ) : (
          !!producers.length && <EndpointsTable producers={producers} />
        )}
        {!loading && pagination.totalPages > 1 && (
          <div className={classes.pagination}>
            <Pagination
              count={pagination.totalPages}
              page={pagination.page}
              onChange={handleOnPageChange}
              variant="outlined"
              shape="rounded"
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

EndpointsList.propTypes = {}

export default EndpointsList
