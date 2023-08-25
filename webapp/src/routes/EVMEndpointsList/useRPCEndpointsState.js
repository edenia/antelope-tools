import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'

import { evmConfig } from '../../config'

const useRPCEndpointsState = () => {
  const [endpoints, setEndpoints] = useState(evmConfig.endpoints.map(url => ({ url, response: {} })))

  const customAxios = axios.create()

  customAxios.interceptors.request.use(
    config => {
      config.startTime = new Date()

      return config
    },
    error => Promise.reject(error),
  )

  customAxios.interceptors.response.use(
    response => {
      response.latency = new Date() - response.config?.startTime

      return response
    },
    error => Promise.reject(error),
  )

  const getEndpointHealthCheck = async endpointUrl => {
    try {
      const {
        data: { result: height },
      } = await axios.post(endpointUrl, {
        method: 'eth_blockNumber',
        params: [],
        id: 1,
        jsonrpc: '2.0',
      })

      const { data, latency, status, statusText } = await customAxios.post(
        endpointUrl,
        {
          method: 'eth_getBlockByNumber',
          params: [height.toString(), false],
          id: 2,
          jsonrpc: '2.0',
        },
      )

      return {
        url: endpointUrl,
        latency,
        height: parseInt(height),
        updated_at: new Date(),
        head_block_time: new Date(parseInt(data?.result?.timestamp) * 1000),
        response: { status, statusText, isWorking: status === 200 },
      }
    } catch (error) {
      return {
        url: endpointUrl,
        updated_at: new Date(),
        response: {
          statusText: error?.message,
          status: null,
          isWorking: false,
        },
      }
    }
  }

  const runHealthCheck = useCallback(() => {
    setEndpoints(prev => prev.map(endpoint => ({ url: endpoint.url, response: {} })))

    const rpcList = JSON.parse(JSON.stringify(endpoints))

    rpcList.forEach(async ({ url }, index) => {
      const endpoint = await getEndpointHealthCheck(url)

      setEndpoints(prev => {
        const newEndpoints = [
          ...prev.slice(0, index),
          endpoint,
          ...prev.slice(index + 1),
        ]

        if (newEndpoints.every(endpoint => !!endpoint.response.statusText)) {
          newEndpoints.sort((e1, e2) =>
            e1?.height === e2?.height
              ? e1?.latency - e2?.latency
              : e2?.height - e1?.height,
          )
        }

        return newEndpoints
      })
    })
    // eslint-disable-next-line
  }, [endpoints])

  useEffect(() => {
    runHealthCheck()
     // eslint-disable-next-line
  }, [])

  return [{ endpoints }, { runHealthCheck }]
}

export default useRPCEndpointsState
