import React, { useEffect, useRef, useCallback } from 'react'
import { makeStyles } from '@material-ui/styles'
import PropTypes from 'prop-types'

import { countries } from '../../utils/countries'

import HighMapsWrapper from './HighMapsWrapper'
import styles from './styles'

const useStyles = makeStyles(styles)

const MainMap = ({ data, map, setMap }) => {
  const classes = useStyles()
  const myRef = useRef()

  const setupMapData = useCallback(
    (data = [], map) => {
      const options = {
        title: {
          text: ''
        },
        colorAxis: {
          min: 0,
          max: 19170
        },
        legend: {
          enabled: false
        },
        exporting: {
          enabled: false
        },
        credits: {
          enabled: false
        },
        mapNavigation: {
          enabled: false
        },
        tooltip: {
          headerFormat: '<b>{series.name}</b><br>'
        },
        series: [
          {
            data,
            mapData: map,
            joinBy: ['iso-a2', 'country'],
            name: 'Number of Nodes',
            cursor: 'pointer',
            borderColor: '#8F9DA4',
            nullColor: '#EEEEEE',
            point: {
              events: {
                click: function (e) {
                  setMap((e.point.country || '').toLowerCase())
                }
              }
            },
            states: {
              hover: {
                color: '#1565C0'
              }
            },
            dataLabels: {
              enabled: true,
              useHTML: true,
              formatter: function () {
                const node = data.find(
                  ({ country }) => country === this.point.country
                )

                return this.point.country
                  ? `${
                      countries[this.point.country]?.flag || this.point.country
                    } ${node.value}`
                  : null
              }
            }
          }
        ]
      }

      // eslint-disable-next-line
      const highMap = new HighMapsWrapper['Map'](myRef.current, options)
      highMap.redraw()
    },
    [setMap]
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
  setMap: PropTypes.func
}

export default MainMap
