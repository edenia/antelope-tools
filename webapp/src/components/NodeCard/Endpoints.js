import React from 'react'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'

import styles from './styles'

const useStyles = makeStyles(styles)

const Endpoints = ({ node }) => {
  const classes = useStyles()
  const { t } = useTranslation('nodeCardComponent')

  if (!node?.p2p_endpoint && !node?.api_endpoint && !node?.ssl_endpoint) {
    return <></>
  }

  const endpoints = [
    { key: 'p2p_endpoint', value: 'P2P' },
    { key: 'api_endpoint', value: 'API' },
    { key: 'ssl_endpoint', value: 'SSL' },
  ]

  return (
    <>
      <dt className={classes.bold}>{t('endpoints')}</dt>
      {endpoints.map(
        ({ key, value }, index) =>
          !!node[key]?.length && (
            <dd key={`endpoint-${node[key]}-${value}-${index}`}>
              <span>{value}</span>:{' '}
              <a href={node[key]} target="_blank" rel="noopener noreferrer">
                {node[key] || 'N/A'}
              </a>
            </dd>
          ),
      )}
    </>
  )
}

export default Endpoints
