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

import useEndpointsState from '../../hooks/customHooks/useEndpointsState'
import HealthInfoModal from '../../components/HealthCheck/InfoModal'
import EndpointsTable from '../../components/EndpointsTable'
import NoResults from '../../components/NoResults'
import ProducersUpdateLog from '../../components/ProducersUpdateLog'
import SearchBar from '../../components/SearchBar'

import styles from './styles'

const useStyles = makeStyles(styles)

const limitOptions = [10, 20, 30, 50, 80, 130]

const EndpointsList = () => {
  const classes = useStyles()
  const { t } = useTranslation('endpointsListRoute')
  const [
    { loading, pagination, producers, filters },
    { handleFilter, handleOnSearch, handleOnPageChange, setPagination },
  ] = useEndpointsState({ useCache: false })

  return (
    <Card className={classes.cardShadow}>
      <CardContent>
        <div className={classes.titleContainer}>
          <div className={classes.dateContainer}>
            <Typography component="p" variant="h6">
              {t('title')} {t('producer')}
            </Typography>
            <ProducersUpdateLog />
          </div>
          <div className={classes.controlFormContainer}>
            <div className={classes.switchContainer}>
              <Typography component="p" variant="caption">
                {t('endpointsResponding')}
              </Typography>
              <Switch
                inputProps = {{ 'aria-label': t('filterEndpoints') }}
                onChange={(event) => {
                  handleFilter(event.target?.checked)
                }}
              />
            </div>
            <div className={classes.modalContainer}>
              <HealthInfoModal />
            </div>
            <FormControl variant="standard">
              <InputLabel htmlFor='selectLabel'>{t('itemsPerPage')}</InputLabel>
              <Select
                className={classes.select}
                inputProps={{id: 'selectLabel'}}
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
        </div>
        <div className={classes.searchWrapper}>
          <SearchBar
            filters={filters}
            onChange={handleOnSearch}
            translationScope="producerSearchComponent"
          />
        </div>
        {loading ? (
          <LinearProgress />
        ) : (
          <>
            {!!producers?.length ? (
              <EndpointsTable producers={producers} />
            ) : (
              <div className={classes.noShadow}>
                <NoResults />
              </div>
            )}
            {pagination.pages > 1 && (
              <div className={classes.pagination}>
                <Pagination
                  count={pagination.pages}
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
