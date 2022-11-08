/* eslint camelcase: 0 */
import React, { memo, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'

import styles from './styles'

const useStyles = makeStyles(styles)

const SearchBar = ({
  filters: rootFilters,
  onChange,
  chips,
  translationScope
}) => {
  const classes = useStyles()
  const { t } = useTranslation(translationScope)
  const [selected, setSelected] = useState(chips[0]?.name ?? '')
  const [filters, setFilters] = useState({})

  const handleOnChange = (key) => (event) => {
    setFilters({ ...filters, [key]: event.target.value })
  }

  const handleOnClick = () => {
    onChange(filters)
  }

  const handleOnClickChip = (value) => {
    setSelected(value)
    onChange({ ...filters, name: value })
  }

  const handleOnKeyDown = (event) => {
    if (event.keyCode !== 13) {
      return
    }

    onChange(filters)
  }

  useEffect(() => {
    setFilters(rootFilters || {})
  }, [rootFilters])

  return (
    <div>
      <div>
        <Card>
          <CardContent className={classes.cardContent}>
            <Typography className={classes.title}>
              {`${t('title')}:`}
            </Typography>
            <TextField
              label={t('placeholder')}
              variant="outlined"
              className={classes.formControl}
              value={filters.owner || ''}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleOnClick}
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
            <div className={classes.chipWrapper}>
              {chips.map((chip, index) => (
                <Chip
                  key={`chip-${chip.name}-${index}`}
                  label={t(chip.name)}
                  clickable
                  onClick={() => handleOnClickChip(chip.name)}
                  className={clsx({
                    [classes.selected]: selected === chip.name
                  })}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

SearchBar.propTypes = {
  filters: PropTypes.any,
  onChange: PropTypes.func,
  translationScope: PropTypes.string,
  chips: PropTypes.array
}

SearchBar.defaultProps = {
  onChange: () => {},
  chips: []
}

export default memo(SearchBar)
