import { useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { useLocation } from 'react-router-dom'
import moment from 'moment'

import {
  FASTEST_ENDPOINTS_QUERY,
  HISTORY_ENDPOINTS_BY_PRODUCER_QUERY,
  PRODUCERS_QUERY,
} from '../../gql'

const useHealthCheckState = () => {
  const [
    loadEndpoints,
    { loading = true, data: { endpoints: fastestEndpoints } = {} },
  ] = useLazyQuery(FASTEST_ENDPOINTS_QUERY)
  const [
    loadProducers,
    { loading: loadingProducers = true, data: { producers } = {} },
  ] = useLazyQuery(PRODUCERS_QUERY)
  const [
    loadHistory,
    {
      loading: loadingHistory = true,
      data: { endpoints: history, dates } = {},
    },
  ] = useLazyQuery(HISTORY_ENDPOINTS_BY_PRODUCER_QUERY)
  const [producersNames, setProducersNames] = useState()
  const [selected, setSelected] = useState()
  const [historyData, setHistoryData] = useState()
  const [statsAverage, setStatsAverage] = useState()
  const [formattedDates, setFormattedDates] = useState()
  const location = useLocation()

  useEffect(() => {
    const endpointFilter = {
      _and: [{ type: { _in: ['ssl', 'api'] } }, { value: { _gt: '' } }],
    }

    loadProducers({
      variables: {
        where: { nodes: { endpoints: endpointFilter } },
        endpointFilter,
        limit: null,
      },
    })
    loadEndpoints({ variables: { today: new Date() } })
  }, [loadProducers, loadEndpoints])

  useEffect(() => {
    if (!producers?.length) return

    setProducersNames(
      producers.map(producer => ({
        id: producer.id,
        name: producer?.bp_json?.org?.candidate_name,
      })),
    )
    setSelected(location?.state?.producerId || producers[0]?.id)
    window.history.replaceState({}, document.title)
  }, [producers, location])

  useEffect(() => {
    if (!selected) return

    loadHistory({ variables: { id: selected } })
  }, [loadHistory, selected])

  useEffect(() => {
    if (!history) return

    let previous = ''

    const { data, stats } = history.reduce(
      (aux, curr) => {
        if (previous !== curr.value) {
          aux.data.push({
            name: curr.value,
            data: [curr.avg_time],
          })
          aux.stats.push({
            value: curr.value,
            avg_time: curr.avg_time,
            availability: curr.availability,
            total: 1,
          })

          previous = curr.value
        } else {
          const index = aux.data.length  - 1

          aux.data[index].data.push(curr.avg_time)
          aux.stats[index].availability += curr.availability
          aux.stats[index].avg_time += curr.avg_time
          aux.stats[index].total++
        }

        return aux
      },
      { data: [], stats: [] },
    )

    setHistoryData(data)
    setStatsAverage(stats)
    setFormattedDates(dates.map(item => moment(item.date).format('ll')))
  }, [history, dates])

  return [
    {
      fastestEndpoints,
      producersNames,
      historyData,
      statsAverage,
      selected,
      dates: formattedDates,
      loading,
      loadingHistory,
      loadingProducers,
    },
    { setSelected },
  ]
}

export default useHealthCheckState
