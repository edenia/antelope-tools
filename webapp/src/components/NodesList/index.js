/* eslint camelcase: 0 */

import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'

import { eosConfig } from 'config'

import styles from './styles'
import NodesRow from './NodesRow'

const useStyles = makeStyles(styles)

const NodeList = ({ producers }) => {
  const classes = useStyles()
  const { t } = useTranslation('producerCardComponent')

  const Header = () => {
    return (
      <div
        className={`card ${classes.columnsContainer} ${classes.cardRow} ${classes.hideOnMobile}`}
      >
        {eosConfig.producerColumns?.includes('rank') ? (
          <Typography variant="caption">{t('rank')}</Typography>
        ) : (
          <span />
        )}
        <Typography variant="caption">{t('producerName')}</Typography>
        <Typography variant="caption">{t('nodes')}</Typography>
        <span />
      </div>
    )
  }

  return (
    <>
      <Header />
      {producers.map((producer, index) => (
        <NodesRow key={`node-${producer.owner}-${index}`} producer={producer} />
      ))}
    </>
  )
}

NodeList.propTypes = {
  producers: PropTypes.array,
}

NodeList.defaultProps = {
  producers: [],
}

export default NodeList
