import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import { useTranslation } from 'react-i18next'
import Box from '@material-ui/core/Box'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

import { eosConfig } from '../../config'
import eosApi from '../../utils/eosapi'
import { NODE_TYPE_LABEL } from '../../utils/lacchain'

const useStyles = makeStyles((theme) => ({
  formField: {
    marginBottom: theme.spacing(2)
  }
}))

const LacchainNodeConfig = () => {
  const classes = useStyles()
  const { t } = useTranslation('lacchainNodeConfig')
  const [nodes, setNodes] = useState([])
  const [nodeType, setNodeType] = useState()
  const [fileDownloadUrl, setFileDownloadUrl] = useState()

  const download = async (event, value) => {
    setNodeType(value)

    if (!value) {
      setFileDownloadUrl(null)

      return
    }

    const template = await getTemplate(value)
    const blob = new Blob([template], {
      type: 'octet/stream'
    })
    setFileDownloadUrl(URL.createObjectURL(blob))
  }

  const getTemplate = async (type) => {
    const response = await fetch(`/config/${type}.ini`)
    const base = await response.text()
    let peeringNodeTypes = []

    switch (type) {
      case 'validator':
        peeringNodeTypes = ['validator', 'boot']
        break
      case 'writer':
        peeringNodeTypes = ['boot']
        break
      case 'boot':
        peeringNodeTypes = ['validator', 'boot', 'writer', 'observer']
        break
      case 'observer':
        peeringNodeTypes = ['boot']
        break
      default:
        break
    }

    const validNodes = nodes.filter((node) =>
      peeringNodeTypes.includes(node.type)
    )
    const peering = []

    for (let index = 0; index < validNodes.length; index++) {
      const node = validNodes[index]
      const name = `# ${node.name} PEERING INFO`
      const p2p = `p2p-peer-address = ${
        node?.info?.[`${node.type}_endpoints`]?.[`${node.type}_p2p`] || ''
      }`
      const keys = (node.info?.[`${node.type}_keys`]?.peer_keys || [''])
        .map((key) => `peer-key = ${key}`)
        .join('\r\n')
      peering.push(`\r\n${name}\r\n${keys}\r\n${p2p}`)
    }

    return `${base}${peering.join('\r\n')}`
  }

  useEffect(() => {
    const jsonParse = (data) => {
      try {
        return JSON.parse(data)
      } catch (error) {}
    }

    const loadEntities = async () => {
      const { rows: nodes } = await eosApi.getTableRows({
        json: true,
        code: 'eosio',
        scope: 'eosio',
        table: 'node'
      })
      setNodes(
        nodes.map((node) => ({
          ...node,
          info: jsonParse(node.info),
          type: NODE_TYPE_LABEL[node.type]
        }))
      )
    }

    loadEntities()
  }, [])

  return (
    <Box>
      <Autocomplete
        className={classes.formField}
        options={eosConfig.nodeTypes.map((node) => node.name)}
        value={nodeType || ''}
        onChange={download}
        renderInput={(params) => (
          <TextField {...params} label={t('nodeType')} variant="outlined" />
        )}
      />

      <Button
        component="a"
        target="_blank"
        rel="noopener"
        download={`${nodeType}.ini`}
        href={fileDownloadUrl}
        type="submit"
        variant="contained"
        color="primary"
        disabled={!fileDownloadUrl}
      >
        {t('download')}
      </Button>
    </Box>
  )
}

LacchainNodeConfig.propTypes = {}

export default LacchainNodeConfig
