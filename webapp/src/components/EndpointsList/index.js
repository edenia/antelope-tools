import React, { useEffect } from 'react'
import { makeStyles } from '@mui/styles'

import useEndpointsState from '../../hooks/customHooks/useEndpointsState'

import styles from './styles'

const useStyles = makeStyles(styles)

const EndpointsList = ({ type }) => {
  const classes = useStyles()
  const [{ loading, producers }, { handleFilter, setPagination }] =
    useEndpointsState({ useCache: true })

  useEffect(() => {
    setPagination(prev => ({ ...prev, limit: null }))
    handleFilter(type !== 'p2p')
  }, [type, handleFilter, setPagination])

  return (
    <>
      {!loading && producers?.length && (
        <div className={classes.container}>
          {`# List of available ${type} endpoints`}
          <br />
          {producers.map(
            (producer, pIndex) =>
              !!producer?.endpoints[type]?.length && (
                <div
                  key={`producer-${producer.name}-endpoints-${type}-${pIndex}`}
                >
                  {`# ${producer.name}`}
                  {producer.endpoints[type].map((endpoint, endIndex) => (
                    <div key={`${producer.name}-endpoint-${type}-${endIndex}`}>
                      {`${type === 'p2p' ? 'p2p-peer-address = ' : ''} ${
                        endpoint.value
                      }`}
                    </div>
                  ))}
                  <br />
                </div>
              ),
          )}
        </div>
      )}
    </>
  )
}

export default EndpointsList
