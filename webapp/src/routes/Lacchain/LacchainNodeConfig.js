import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import { useTranslation } from 'react-i18next'
import Box from '@material-ui/core/Box'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'

import { eosConfig } from '../../config'
import eosApi from '../../utils/eosapi'
import { NODE_TYPE_LABEL } from '../../utils/lacchain'

const useStyles = makeStyles((theme) => ({
  formField: {
    marginBottom: theme.spacing(2)
  }
}))

const LacchainNodeConfig = ({ ual }) => {
  const classes = useStyles()
  const { t } = useTranslation('lacchainNodeConfig')
  const [nodes, setNodes] = useState([])
  const [entityNodes, setEntityNodes] = useState([])
  const [nodeType, setNodeType] = useState()
  const [node, setNode] = useState()
  const [fileDownloadUrl, setFileDownloadUrl] = useState()

  const handleOnChangeNodeType = (event, value) => {
    setNodeType(value)
  }

  const handleOnChangeNode = (event, value) => {
    setNode(value)
    const node = nodes.find((node) => node.name === value)

    if (node?.type !== nodeType) {
      setNodeType(node?.type)
    }
  }

  useEffect(() => {
    const jsonParse = (data) => {
      try {
        return JSON.parse(data)
      } catch (error) {}
    }

    const loadNodes = async () => {
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

    loadNodes()
  }, [])

  useEffect(() => {
    let newNodes = nodes

    if (nodeType) {
      newNodes = newNodes.filter((node) => node.type === nodeType)
    }

    if (ual.activeUser?.accountName) {
      newNodes = newNodes.filter(
        (node) => node.entity === ual.activeUser.accountName
      )
    }

    if (!ual.activeUser) {
      setNode('')
    }

    setEntityNodes(newNodes)
  }, [nodes, nodeType, ual.activeUser])

  useEffect(() => {
    if (!node && !nodeType) {
      setFileDownloadUrl(null)

      return
    }

    const getTemplate = async (type, node) => {
      const response = await fetch(`/config/${type}.ini`)
      let base = await response.text()
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

      let validNodes = nodes.filter((node) =>
        peeringNodeTypes.includes(node.type)
      )

      if (node) {
        validNodes = validNodes.filter((n) => n.name !== node)
        base = base
          .replace('{your_producer_name}', node)
          .replace('{your_agent_name}', node)
      }

      const peering = []

      for (let index = 0; index < validNodes.length; index++) {
        const node = validNodes[index]
        const name = `# ${node.name} PEERING INFO`
        const p2p = `p2p-peer-address = ${
          node?.info?.[`${node.type}_endpoints`]?.[`${node.type}_p2p`] || ''
        }`
        // eslint-disable-next-line
        const keys = (node.info?.[`${node.type}_keys`]?.peer_keys || [''])
          .map((key) => `peer-key = ${key}`)
          .join('\r\n')
        peering.push(`\r\n${name}\r\n${keys}\r\n${p2p}`)
      }

      const template = `${base}${peering.join('\r\n')}`
      const blob = new Blob([template], {
        type: 'octet/stream'
      })
      setFileDownloadUrl(URL.createObjectURL(blob))
    }

    getTemplate(nodeType, node)
  }, [nodes, nodeType, node])

  return (
    <Box>
      <Card>
        <CardContent>
          <Autocomplete
            className={classes.formField}
            options={eosConfig.nodeTypes.map((node) => node.name)}
            value={nodeType || ''}
            onChange={handleOnChangeNodeType}
            renderInput={(params) => (
              <TextField {...params} label={t('nodeType')} variant="outlined" />
            )}
          />

          {ual.activeUser && (
            <Autocomplete
              className={classes.formField}
              options={entityNodes.map((node) => node.name)}
              value={node || ''}
              onChange={handleOnChangeNode}
              renderInput={(params) => (
                <TextField {...params} label={t('node')} variant="outlined" />
              )}
            />
          )}

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
        </CardContent>
      </Card>
    </Box>
  )
}

LacchainNodeConfig.propTypes = {
  ual: PropTypes.object
}

export default LacchainNodeConfig
