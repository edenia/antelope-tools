/* eslint camelcase: 0 */

import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
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
      <Card
        className={`${classes.columnsContainer} ${classes.cardRow} ${classes.hideOnMobile}`}
      >
        {eosConfig.producerColumns?.includes('rank') ? (
          <Typography variant="capSubtitle">{t('rank')}</Typography>
        ) : (
          <span />
        )}
        <Typography variant="capSubtitle">{t('producerName')}</Typography>
        <Typography variant="capSubtitle">{t('nodes')}</Typography>
        <span />
      </Card>
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
