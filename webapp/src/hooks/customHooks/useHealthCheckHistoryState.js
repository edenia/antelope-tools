import { useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'

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
    { loading: loadingHistory = true, data: { endpoints: history } = {} },
  ] = useLazyQuery(HISTORY_ENDPOINTS_BY_PRODUCER_QUERY)
  const [producersNames, setProducersNames] = useState()
  const [selected, setSelected] = useState()
  const [historyData, setHistoryData] = useState()
  const [statsAverage, setStatsAverage] = useState()

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
  }, [])

  useEffect(() => {
    if (!producers?.length) return

    setProducersNames(
      producers.map((producer) => ({
        id: producer.id,
        name: producer?.bp_json?.org?.candidate_name,
      })),
    )
    setSelected(producers[0]?.id)
  }, [producers])

  useEffect(() => {
    loadHistory({ variables: { id: selected } })
  }, [selected])

  useEffect(() => {
    if (!history) return

    const data = history.reduce((aux, curr) => {
        const index = aux.findIndex((x) => x.name === curr.value)
        if (index < 0) {
          aux.push({ name: curr.value, data: [curr.avg_time],avg_time:curr.avg_time, availability: curr.availability})
        } else {
          aux[index].data.push(curr.avg_time)
          aux[index].availability = aux[index].availability + curr.availability
          aux[index].avg_time = aux[index].avg_time + curr.avg_time
        }
  
        return aux
      }, [])
    setHistoryData(data)
    setStatsAverage(data.map(x=>({value:x.name,avg_time:x.avg_time/x.data.length,availability:x.availability/x.data.length})))
      
  }, [history])

  return [
    { fastestEndpoints, producersNames, historyData, statsAverage, selected, loading },
    { setSelected },
  ]
}

export default useHealthCheckState
