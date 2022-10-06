/* eslint camelcase: 0 */
import React from 'react'
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
import Switch from '@mui/material/Switch'
import Pagination from '@mui/material/Pagination'
import moment from 'moment'

import useEndpointsState from '../../hooks/customHooks/useEndpointsState'
import HealthInfoModal from '../../components/HealthCheck/InfoModal'

import EndpointsTable from './EndpointsTable'
import styles from './styles'

const useStyles = makeStyles(styles)

const limitOptions = [10, 20, 30, 50, 80, 130]

const EndpointsList = () => {
  const classes = useStyles()
  const { t } = useTranslation('endpointsListRoute')
  const [
    { loading, pagination, producers, highestBlockNum, updatedAt },
    { handleFilter, handleOnPageChange, setPagination },
  ] = useEndpointsState()

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
          <div className={classes.switchContainer}>
            <Typography component="p" variant="caption">{t('endpointsResponding')}</Typography>
            <Switch onChange={(event)=>{handleFilter(event.target?.checked)}}/>
          </div>
          <div className={classes.modalContainer}>
            <HealthInfoModal />
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
                  page: 1,
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
          <>
            {!!producers.length && (
              <EndpointsTable
                producers={producers}
                blockNum={highestBlockNum}
              />
            )}
            {pagination.totalPages > 1 && (
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
          </>
        )}
      </CardContent>
    </Card>
  )
}

EndpointsList.propTypes = {}

export default EndpointsList
