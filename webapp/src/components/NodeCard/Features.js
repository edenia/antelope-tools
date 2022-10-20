import React from 'react'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'

import styles from './styles'

const useStyles = makeStyles(styles)

const Features = ({ node }) => {
  const classes = useStyles()
  const { t } = useTranslation('nodeCardComponent')

  if (!node.features?.length)
    return <></>

  return (
    <>
      <dt className={classes.bold}>{t('features')}</dt>
      {node.features.map((feature, i) => (
        <dd key={i}>{feature}</dd>
      ))}
    </>
  )
}

export default Features
