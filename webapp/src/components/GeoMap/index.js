import React, { useEffect, useState, useCallback } from 'react'
import { makeStyles } from '@mui/styles'
import PropTypes from 'prop-types'
import axios from 'axios'
import clsx from 'clsx'
import Button from '@mui/material/Button'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

import { generalConfig } from '../../config'

import MainMap from './MainMap'
import worldGeoData from './worldGeoData'
import CountryMap from './CountryMap'
import styles from './styles'

const useStyles = makeStyles(styles)

const GeoMap = ({ data }) => {
  const classes = useStyles()
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
      const mapDataSelected = data.filter(
        ({ country }) => country === mapSelected.toUpperCase(),
      )
      const { data: mapRes } = await axios.get(
        `${generalConfig.highchartsMapURL}${mapSelected}/${mapSelected}-all.geo.json`,
      )

      setMapOptions(mapDataSelected)
      setMapGeoData(mapRes)
    }

    getMap()
  }, [mapSelected, data])

  return (
    <div className={clsx({ [classes.mapWrapper]: mapSelected && mapGeoData })}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleGoBack}
        className={clsx(classes.goBackBtn, {
          [classes.goBackBtnHidden]: !mapSelected,
        })}
      >
        Go Back
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
    </div>
  )
}

GeoMap.propTypes = {
  data: PropTypes.array,
}

export default GeoMap
