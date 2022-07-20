/* eslint camelcase: 0 */
import React, { memo, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import styles from './styles'

const useStyles = makeStyles(styles)
const CHIPS = {
  lacchain: [
    { value: 'all', label: 'all' },
    { value: 1, label: 'partners' },
    { value: 2, label: 'nonPartners' }
  ],
  net: [
    { value: 'all', label: 'allBPs' },
    { value: 1, label: 'top21' },
    { value: 2, label: 'paidStandby' },
    { value: 3, label: 'nonPaidStandby' }
  ]
}

const ProducerSearch = ({
  filters: rootFilters,
  onSearch,
  onChange,
  networkName
}) => {
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
            <Typography className={classes.title}>{`${t(
              'title'
            )}:`}</Typography>
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
              {(CHIPS[networkName] || CHIPS.net).map((chip) => (
                <Chip
                  key={chip.value}
                  label={t(chip.label)}
                  clickable
                  onClick={() => handleOnClickChip(chip.value)}
                  className={clsx({
                    [classes.selected]: selected === chip.value
                  })}
                />
              ))}
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
  onChange: PropTypes.func,
  networkName: PropTypes.string
}

ProducerSearch.defaultProps = {
  filters: {},
  onSearch: () => {},
  onChange: () => {},
  networkName: ''
}

export default memo(ProducerSearch)
