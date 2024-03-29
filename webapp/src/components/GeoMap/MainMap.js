import React, { useEffect, useRef, useCallback } from 'react'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { useTheme } from '@mui/material/styles'

import { countries } from '../../utils/countries'

import HighMapsWrapper from './HighMapsWrapper'
import styles from './styles'

const useStyles = makeStyles(styles)

const MainMap = ({ data, map, setMap }) => {
  const classes = useStyles()
  const { t } = useTranslation('mainMapComponent')
  const myRef = useRef()
  const theme = useTheme()

  const setupMapData = useCallback(
    (data = [], map) => {
      const options = {
        chart: {
          backgroundColor: theme.palette.background.default,
        },
        title: {
          text: '',
        },
        colorAxis: {
          min: 0,
          max: 19170,
        },
        legend: {
          enabled: false,
        },
        exporting: {
          enabled: false,
        },
        credits: {
          enabled: false,
        },
        mapNavigation: {
          enabled: false,
        },
        tooltip: {
          headerFormat: '<b>{series.name}</b><br>',
          borderRadius: 10,
          borderWidth: 1,
          borderColor: theme.palette.primary.main,
          backgroundColor: theme.palette.background.default,
          style: {
            color: theme.palette.text.primary,
          },
        },
        series: [
          {
            data: data.map(item => ({
              ...item,
              color: theme.palette.neutral.lighter,
            })),
            mapData: map,
            joinBy: ['iso-a2', 'country'],
            name: t('numberOfNodes'),
            cursor: 'pointer',
            borderColor: theme.palette.neutral.main,
            nullColor: theme.palette.neutral.light,
            point: {
              events: {
                click: function (e) {
                  setMap((e.point.country || '').toLowerCase())
                },
              },
            },
            states: {
              hover: {
                color: theme.palette.primary.main,
              },
            },
            dataLabels: {
              enabled: true,
              formatter: function () {
                const node = data.find(
                  ({ country }) => country === this.point.country,
                )

                return this.point.country
                  ? `${
                      countries[this.point.country]?.flag || this.point.country
                    } ${node.value}`
                  : null
              },
            },
          },
        ],
      }

      new HighMapsWrapper['Map'](myRef.current, options)
    },
    [setMap, t, theme.palette],
  )

  useEffect(() => {
    if (myRef.current) {
      setupMapData(data, map)
    }
  }, [data, map, setupMapData])

  return <div ref={myRef} className={classes.divRef} />
}

MainMap.propTypes = {
  data: PropTypes.array,
  map: PropTypes.object,
  setMap: PropTypes.func,
}

export default MainMap
