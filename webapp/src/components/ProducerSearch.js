/* eslint camelcase: 0 */
import React, { memo, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'

const useStyles = makeStyles(() => ({
  formControl: {
    width: '100%'
  }
}))

const ProducerSearch = ({ filters: rootFilters, onSearch }) => {
  const classes = useStyles()
  const { t } = useTranslation('dashboardProducer')
  const [filters, setFilters] = useState({})

  const handleOnChange = (key) => (event) => {
    setFilters({ ...filters, [key]: event.target.value })
  }

  const handleOnSearch = () => {
    onSearch(filters)
  }

  useEffect(() => {
    setFilters(rootFilters || {})
  }, [rootFilters])

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <TextField
              label={t('producerName')}
              variant="outlined"
              className={classes.formControl}
              value={filters.owner || ''}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleOnSearch}
                      edge="end"
                      aria-label="search"
                    >
                      <SearchOutlinedIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              onChange={handleOnChange('owner')}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

ProducerSearch.propTypes = {
  filters: PropTypes.any,
  onSearch: PropTypes.func
}

ProducerSearch.defaultProps = {
  filters: {},
  onSearch: () => {}
}

export default memo(ProducerSearch)
