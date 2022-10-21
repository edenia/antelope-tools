import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import { Button } from '@mui/material'
import axios from 'axios'

import ChipList from '../ChipList'
import Tooltip from '../Tooltip'

import styles from './styles'

const useStyles = makeStyles(styles)

const SupportedAPIs = ({ node }) => {
  const classes = useStyles()
  const { t } = useTranslation('nodeCardComponent')
  const [APIs, setAPIs] = useState([])
  const [anchorEl, setAnchorEl] = useState(null)

  const handlePopoverOpen = (target) => {
    setAnchorEl(target)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    const getAPIs = async () => {
      let api = ''

      for (let i = 0; i < node.endpoints.length; i++) {
        const endpoint = node.endpoints[i]

        if (endpoint.type === 'ssl') {
          api = endpoint.value
          break
        }
      }

      try {
        const { data } = await axios.get(`${api}/v1/node/get_supported_apis`, {
          mode: 'cors',
        })

        if (data.apis && Array.isArray(data.apis)) {
          setAPIs(data.apis)
        }
      } catch (error) {}
    }

    getAPIs()
  }, [node.endpoints])

  return (
    !!APIs.length && (
      <>
        <Tooltip
          anchorEl={anchorEl}
          open={anchorEl !== null}
          onClose={handlePopoverClose}
        >
          <ChipList title={t('supportedApis')} list={APIs} />
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
