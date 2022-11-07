import React, { useEffect } from 'react'
import { makeStyles } from '@mui/styles'

import useEndpointsState from '../../hooks/customHooks/useEndpointsState'

import styles from './styles'

const useStyles = makeStyles(styles)

const EndpointsList = ({ type }) => {
  const classes = useStyles()
  const [{ loading, producers, updatedAt }, { handleFilter, setPagination }] =
    useEndpointsState({useCache: true})

  useEffect(() => {
    setPagination((prev) => ({ ...prev, limit: null }))
    handleFilter(type !== 'p2p')
    // eslint-disable-next-line
  }, [type])

  return (
    <>
      {!loading && producers?.length && (
        <div className={classes.container}>
          {`# List of available ${type} endpoints`}
          <br />
          {updatedAt && `# Updated at ${updatedAt}`}
          <br />
          {producers.map(
            (producer, index) =>
              !!producer?.endpoints[type]?.length && (
                <div
                  key={`producer-${producer.name}-endpoints-${type}-${index}`}
                >
                  {`# ${producer.name}`}
                  {producer.endpoints[type].map((endpoint, index) => (
                    <div key={`${producer.name}-endpoint-${type}-${index}`}>
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
