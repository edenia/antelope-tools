import React, { useCallback, useEffect } from 'react'
import { useTheme } from '@mui/material/styles'
import zc from '@dvsl/zoomcharts'
import { makeStyles } from '@mui/styles'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

import lacchain from '../../utils/lacchain'

const NetChart = zc.NetChart
const useStyles = makeStyles(() => ({
  root: {
    '& .DVSL-menu-container': {
      display: 'none'
    }
  }
}))

const LacchainNodesNetwork = () => {
  const classes = useStyles()
  const theme = useTheme()
  const initData = useCallback(async () => {
    const nodeTypes = {
      1: {
        type: 'validator',
        image: '/node-types/validator.svg'
      },
      2: {
        type: 'writer',
        image: '/node-types/writer.svg'
      },
      3: {
        type: 'boot',
        image: '/node-types/boot.svg'
      },
      4: {
        type: 'observer',
        image: '/node-types/observer.svg'
      }
    }
    const rows = await lacchain.getNodes()
    const nodes = rows.map((node) => ({
      ...nodeTypes[node.type],
      id: node.name,
      name: node.name,
      loaded: true
    }))
    const validators = nodes
      .filter((node) => node.type === 'validator')
      .map((node) => node.id)
    const links = []

    nodes
      .filter((node) => node.type === 'validator')
      .forEach((node) => {
        nodes
          .filter(
            (otherNode) =>
              otherNode.type === 'validator' && otherNode.id !== node.id
          )
          .forEach((otherNode) => {
            links.push({
              from: otherNode.id,
              to: node.id
            })
          })
      })

    nodes
      .filter((node) => node.type === 'boot')
      .forEach((node) => {
        nodes
          .filter((otherNode) => otherNode.id !== node.id)
          .forEach((otherNode) => {
            links.push({
              from: otherNode.id,
              to: node.id
            })
          })
      })

    const chart = new NetChart({
      container: document.getElementById('netChart'),
      area: { height: 600 },
      navigation: {
        focusNodeExpansionRadius: 2,
        initialNodes: validators,
        numberOfFocusNodes: validators.length,
        mode: 'focusnodes'
      },
      style: {
        node: {
          display: 'image',
          imageCropping: false,
          cursor: 'crosshair',
          fillColor: 'transparent',
          radius: 50
        },
        nodeFocused: {
          fillColor: 'transparent'
        },
        nodeHovered: {
          fillColor: theme.palette.neutral.light,
          radius: 60
        },
        nodeLabel: {
          padding: 4,
          backgroundStyle: {
            fillColor: theme.palette.neutral.light
          },
          textStyle: {
            fillColor: theme.palette.text.primary,
            font: '18px Nunito,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol'
          }
        },
        link: {
          toDecoration: 'arrow',
          radius: 2
        },
        linkHovered: {
          fillColor: theme.palette.error.main,
          radius: 4
        },
        nodeStyleFunction: (node) => {
          node.image = node.data.image
          node.label = node.data.name
        }
      },
      data: {
        dataFunction: (data, success) => {
          success({ nodes, links })
        }
      }
    })
    chart.clearHistory()
  }, [theme.palette])

  useEffect(() => {
    initData()
  }, [initData])

  return (
    <Card className={classes.root}>
      <CardContent>
        <div id="netChart" />
      </CardContent>
    </Card>
  )
}

LacchainNodesNetwork.propTypes = {}

export default LacchainNodesNetwork
