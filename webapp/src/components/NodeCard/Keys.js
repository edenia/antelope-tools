import React from 'react'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';

import MoreInfoModal from '../MoreInfoModal'

import styles from './styles'

const useStyles = makeStyles(styles)

const Keys = ({ node }) => {
  const classes = useStyles()
  const { t } = useTranslation('nodeCardComponent')

  if (!node?.node_info?.length || !node?.node_info[0]?.features?.keys)
    return <></>

  const keys = node.node_info[0].features.keys

  return (
    <>
      <span className={classes.bold}>{t('keys')}</span>
      {Object.keys(keys).map((key, i) => (
        <div key={i} className={classes.keysContainer}>
          <p className={classes.bold}>{key}:</p>
          <MoreInfoModal Icon={KeyOutlinedIcon}>
            <p className={classes.keys}>{keys[key]}</p>
          </MoreInfoModal>
        </div>
      ))}
    </>
  )
}

export default Keys
