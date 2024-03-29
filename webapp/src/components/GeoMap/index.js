import React, { useEffect, useState, useCallback } from 'react'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import axios from 'axios'
import clsx from 'clsx'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

import { generalConfig } from '../../config'

import MainMap from './MainMap'
import worldGeoData from './worldGeoData'
import CountryMap from './CountryMap'
import styles from './styles'

const useStyles = makeStyles(styles)

const GeoMap = ({ data }) => {
  const classes = useStyles()
  const { t } = useTranslation()
  const [mapOptions, setMapOptions] = useState()
  const [mapSelected, setMapSelected] = useState()
  const [mapGeoData, setMapGeoData] = useState()

  const getDataSeries = useCallback(() => {
    return data.reduce(
      (acc, curr, index) => {
        if (!acc.current) {
          if (index === data.length - 1) {
            acc.nodesSeries.push({ country: curr.country, value: 1 })
          }

          return { ...acc, current: { country: curr.country, value: 1 } }
        }

        if (acc.current.country === curr.country) {
          if (index === data.length - 1) {
            acc.nodesSeries.push({
              ...acc.current,
              value: acc.current.value + 1,
            })

            return {
              ...acc,
              current: { country: curr.country, value: 1 },
            }
          }

          return {
            ...acc,
            current: { ...acc.current, value: acc.current.value + 1 },
          }
        }

        acc.nodesSeries.push(acc.current)

        if (index === data.length - 1) {
          acc.nodesSeries.push({ country: curr.country, value: 1 })
        }

        return {
          ...acc,
          current: { country: curr.country, value: 1 },
        }
      },
      { current: null, nodesSeries: [] },
    )
  }, [data])

  const handleGoBack = () => {
    const dataSeries = getDataSeries()

    setMapSelected(null)
    setMapGeoData(null)
    setMapOptions(dataSeries.nodesSeries)
  }

  useEffect(() => {
    const dataSeries = getDataSeries()

    setMapOptions(dataSeries.nodesSeries)
  }, [data, getDataSeries])

  useEffect(() => {
    if (!mapSelected) return

    const getMap = async () => {
      const mapDataSelected = data.reduce((result, current) => {
        if (
          current.country === mapSelected.toUpperCase() &&
          result.every(node => node.name !== current.name)
        ) {
          result.push(current)
        }

        return result
      }, [])
      const { data: mapRes } = await axios.get(
        `${generalConfig.highchartsMapURL}${mapSelected}/${mapSelected}-all.geo.json`,
      )

      setMapOptions(mapDataSelected)
      setMapGeoData(mapRes)
    }

    getMap()
  }, [mapSelected, data])

  return (
    <Card className={clsx({ [classes.mapWrapper]: mapSelected && mapGeoData })}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleGoBack}
        className={clsx({
          [classes.goBackBtnHidden]: !mapSelected,
        })}
        color="primary"
        variant="outlined"
      >
        {t('goBack')}
      </Button>
      {mapSelected && mapGeoData ? (
        <CountryMap
          map={mapGeoData}
          data={mapOptions || []}
          mapCode={mapSelected.toUpperCase()}
        />
      ) : (
        <MainMap
          data={mapOptions || []}
          map={worldGeoData}
          setMap={setMapSelected}
        />
      )}
    </Card>
  )
}

GeoMap.propTypes = {
  data: PropTypes.array,
}

export default GeoMap
