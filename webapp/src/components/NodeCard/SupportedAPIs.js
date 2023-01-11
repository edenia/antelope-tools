import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import Button from '@mui/material/Button'

import ChipList from '../ChipList'
import Tooltip from '../Tooltip'

import styles from './styles'

const useStyles = makeStyles(styles)

const SupportedAPIs = ({ list }) => {
  const classes = useStyles()
  const { t } = useTranslation('nodeCardComponent')
  const [anchorEl, setAnchorEl] = useState(null)

  const handlePopoverOpen = (target) => {
    setAnchorEl(target)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  return (
    !!list?.length && (
      <>
        <Tooltip
          anchorEl={anchorEl}
          open={anchorEl !== null}
          onClose={handlePopoverClose}
        >
          <ChipList title={t('supportedApis')} list={list} />
        </Tooltip>
        <div className={classes.buttonApis}>
          <Button
            size="small"
            variant="outlined"
            color="primary"
            onClick={(event) => {
              handlePopoverOpen(event.target)
            }}
          >
            {t('supportedApis')}
          </Button>
        </div>
      </>
    )
  )
}

export default SupportedAPIs
