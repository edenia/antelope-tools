import React, { useState } from 'react'
import { makeStyles } from '@mui/styles'
import Tooltip from '@mui/material/Tooltip'
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined'

import styles from './styles'

const useStyles = makeStyles(styles)

const CopyToClipboard = ({ text }) => {
  const classes = useStyles()
  const [status, setStatus] = useState('Copy to clipboard')

  const copyText = () => {
    navigator.clipboard.writeText(text)
    setStatus('Copied')
  }

  return (
    <>
      <Tooltip
        title={status}
        onMouseLeave={() => {
          setStatus('Copy to clipboard')
        }}
        arrow
      >
        <FileCopyOutlinedIcon className={classes.icon} onClick={copyText} />
      </Tooltip>
    </>
  )
}

export default CopyToClipboard
