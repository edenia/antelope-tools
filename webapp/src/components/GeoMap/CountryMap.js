import React, { useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { makeStyles } from '@mui/styles'
import PropTypes from 'prop-types'

import { countries } from '../../utils/countries'
import { eosConfig } from '../../config'

import HighMapsWrapper from './HighMapsWrapper'
import styles from './styles'

const useStyles = makeStyles(styles)

const ClusterMap = ({ data, map, mapCode }) => {
  const classes = useStyles()
  const navigate = useNavigate()
  const myRef = useRef()

  const setupMapData = useCallback(
    (data, map, mapCode = '') => {
      const options = {
        chart: {
          map,
        },
        legend: {
          enabled: false,
        },
        title: {
          text: countries[mapCode].name,
        },
        mapNavigation: {
          enableButtons: false,
          enabled: false,
          enableDoubleClickZoom: false,
          enableDoubleClickZoomTo: false,
          enableMouseWheelZoom: false,
          enableTouchZoom: false,
        },
        tooltip: {
          enabled: false,
        },
        colorAxis: {
          min: 0,
          max: 20,
        },
        credits: {
          enabled: false,
        },
        plotOptions: {
          series: {
            dataLabels: {
              enabled: true,
              formatter: function () {
                const producer = this?.point?.producer

                return producer?.owner
                  ? `<a href=/${eosConfig.producersRoute}/${producer?.owner}>${producer?.owner}</a>`
                  : ''
              },
            },
            events: {
              click: function (e) {
                navigate(
                  `/${eosConfig.producersRoute}/${e.point.producer?.owner}`,
                )
              },
            },
          },
        },
        series: [
          {
            name: 'NodeDistribution',
            borderColor: '#8F9DA4',
            nullColor: '#EEEEEE',
            showInLegend: false,
          },
          {
            cursor: 'pointer',
            type: 'mappoint',
            enableMouseTracking: true,
            colorKey: 'clusterPointsAmount',
            name: 'Countries',
            data: data || [],
          },
        ],
      }

      new HighMapsWrapper['Map'](myRef.current, options)
    },
    [navigate],
  )

  useEffect(() => {
    if (myRef.current) {
      setupMapData(data, map, mapCode)
    }
  }, [data, map, mapCode, setupMapData])

  return (
    <>
      <div ref={myRef} className={classes.divRef} />
    </>
  )
}

ClusterMap.propTypes = {
  data: PropTypes.array,
  map: PropTypes.object,
  mapCode: PropTypes.string,
}

export default ClusterMap
