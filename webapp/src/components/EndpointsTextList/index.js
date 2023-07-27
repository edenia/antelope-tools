import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'

import useEndpointsState from '../../hooks/customHooks/useEndpointsState'
import CopyToClipboard from '../CopyToClipboard'

import styles from './styles'

const useStyles = makeStyles(styles)

const EndpointsTextList = ({ type }) => {
  const classes = useStyles()
  const { t } = useTranslation('endpointsListRoute')
  const [textList, setTextList] = useState('')
  const [{ loading, producers }, { handleFilter, setPagination }] =
    useEndpointsState({ useCache: true })

  // Gets all responding endpoints
  useEffect(() => {
    setPagination(prev => ({ ...prev, limit: null }))
    handleFilter(true)
  }, [type, handleFilter, setPagination])

  useEffect(() => {
    if (!producers?.length) return

    let endpointsList = `# List of available ${type.toUpperCase()} endpoints \n`

    producers.forEach(producer => {
      if (!!producer?.endpoints[type]?.length) {
        endpointsList += `# ${producer.name} \n`
        producer.endpoints[type].forEach(endpoint => {
          endpointsList += `${type === 'p2p' ? 'p2p-peer-address = ' : ''} ${
            endpoint.value
          } \n`
        })
        endpointsList += '\n'
      }
    })

    setTextList(endpointsList)
  }, [producers, type])

  return (
    <>
      {!loading && !!textList?.length && (
        <div className={classes.container}>
          <p>{t('listOfResponding')}</p>
          <CopyToClipboard text={textList} />
          {textList}
        </div>
      )}
    </>
  )
}

export default EndpointsTextList
