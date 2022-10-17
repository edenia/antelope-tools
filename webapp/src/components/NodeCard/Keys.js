import React from 'react'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'

import styles from './styles'

const useStyles = makeStyles(styles)

const Keys = ({ node }) => {
  const classes = useStyles()
  const { t } = useTranslation('nodeCardComponent')

  if (!node.node_info?.length || !node.node_info[0]?.features?.keys)
    return <></>

  const keys = node.node_info[0].features.keys

  return (
    <>
      <dt className={classes.bold}>{t('keys')}</dt>
      {Object.keys(keys).map((key, i) => (
        <dd key={i}>
          <p className={classes.bold}>{key}:</p>
          <p className={classes.breakLine}>{keys[key]}</p>
        </dd>
      ))}
    </>
  )
}

export default Keys
