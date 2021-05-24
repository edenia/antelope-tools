/* eslint camelcase: 0 */
import React, { memo, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined'
import Chip from '@material-ui/core/Chip'
import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: '100%'
  },
  chipWrapper: {
    marginTop: theme.spacing(2),
    '& .MuiChip-root': {
      marginRight: theme.spacing(2)
    },
    textTransform: 'capitalize'
  },
  selected: {
    backgroundColor: `${theme.palette.primary.main} !important`,
    color: '#fff'
  },
  cardContent: {
    padding: `${theme.spacing(4)}px !important`
  }
}))

const ProducerSearch = ({ filters: rootFilters, onSearch, onChange }) => {
  const classes = useStyles()
  const { t } = useTranslation('producerSearchComponent')
  const [selected, setSelected] = useState('all')
  const [filters, setFilters] = useState({})

  const handleOnChange = (key) => (event) => {
    setFilters({ ...filters, [key]: event.target.value })
  }

  const handleOnSearch = () => {
    onSearch(filters)
  }

  const handleOnClickChip = (value) => {
    setSelected(value)
    onChange(value)
  }

  const handleOnKeyDown = (event) => {
    if (event.keyCode !== 13) {
      return
    }

    onSearch(filters)
  }

  useEffect(() => {
    setFilters(rootFilters || {})
  }, [rootFilters])

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card>
          <CardContent className={classes.cardContent}>
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
              onKeyDown={handleOnKeyDown}
              onChange={handleOnChange('owner')}
            />
            <Box className={classes.chipWrapper}>
              <Chip
                label={t('all')}
                clickable
                onClick={() => handleOnClickChip('all')}
                className={clsx({ [classes.selected]: selected === 'all' })}
              />
              <Chip
                label={t('partners')}
                clickable
                onClick={() => handleOnClickChip(1)}
                className={clsx({ [classes.selected]: selected === 1 })}
              />
              <Chip
                label={t('nonPartners')}
                clickable
                onClick={() => handleOnClickChip(2)}
                className={clsx({ [classes.selected]: selected === 2 })}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

ProducerSearch.propTypes = {
  filters: PropTypes.any,
  onSearch: PropTypes.func,
  onChange: PropTypes.func
}

ProducerSearch.defaultProps = {
  filters: {},
  onSearch: () => {},
  onChange: () => {}
}

export default memo(ProducerSearch)
