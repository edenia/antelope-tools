import React from 'react'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'

import styles from './styles'

const useStyles = makeStyles(styles)

const Keys = ({ node }) => {
  const classes = useStyles()
  const { t } = useTranslation('nodeCardComponent')

  if (!Array.isArray(node?.keys) || !node?.keys?.length) {
    return <></>
  }

  return (
    <>
      <dt className={classes.bold}>{t('keys')}</dt>
      {Object.keys(node.keys).map((key, i) => (
        <dd key={i}>
          <p className={classes.bold}>{key}:</p>
          <p className={classes.breakLine}>{node.keys[key]}</p>
        </dd>
      ))}
    </>
  )
}

export default Keys