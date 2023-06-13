import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined'

import styles from './styles'

const useStyles = makeStyles(styles)

const CopyToClipboard = ({ text }) => {
  const classes = useStyles()
  const { t } = useTranslation('copyToClipboardComponent')
  const [status, setStatus] = useState('copyToClipboard')

  const copyText = () => {
    navigator.clipboard.writeText(text)
    setStatus('copied')
  }

  return (
    <Tooltip
      title={t(status)}
      onMouseLeave={() => {
        setStatus('copyToClipboard')
      }}
      arrow
    >
      <Button
        variant="contained"
        color="primary"
        onClick={copyText}
        className={classes.icon}
        startIcon={<FileCopyOutlinedIcon />}
      >
         {t('copy')}
      </Button>
    </Tooltip>
  )
}

export default CopyToClipboard
