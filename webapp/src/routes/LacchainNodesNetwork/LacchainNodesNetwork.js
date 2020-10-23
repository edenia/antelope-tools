import React, { useCallback, useEffect, useState } from 'react'
import { Graph } from 'react-d3-graph'

import eosApi from '../../utils/eosapi'

const LacchainNodesNetwork = () => {
  const [data, setData] = useState({ links: [], nodes: [] })

  const myConfig = {
    automaticRearrangeAfterDropNode: true,
    directed: false,
    focusAnimationDuration: 0.75,
    height: window.innerHeight,
    width: window.innerWidth,
    nodeHighlightBehavior: true,
    staticGraphWithDragAndDrop: true,
    d3: {
      disableLinkForce: true
    },
    node: {
      fontColor: 'black',
      fontSize: 18,
      fontWeight: 'normal',
      highlightFontSize: 18,
      size: 500,
      symbolType: 'circle',
      mouseCursor: 'pointer'
    },
    link: {
      color: 'lightgray',
      highlightColor: '#f0a12b',
      strokeWidth: 2
    }
  }

  const initData = useCallback(async () => {
    const nodeTypes = {
      1: {
        type: 'validator',
        color: '#34eba2',
        y: 100
      },
      2: {
        type: 'writer',
        color: '#c23044',
        y: 300
      },
      3: {
        type: 'boot',
        color: '#1836de',
        y: 200
      },
      4: {
        type: 'observer',
        color: '#e8df8b',
        y: 300
      }
    }
    const { rows } = await eosApi.getTableRows({
      json: true,
      code: 'eosio',
      scope: 'eosio',
      table: 'node'
    })
    const { rows: entities } = await eosApi.getTableRows({
      json: true,
      code: 'eosio',
      scope: 'eosio',
      table: 'entity'
    })
    const nodes = rows.map((node) => ({
      ...nodeTypes[node.type],
      id: node.name,
      entity: entities.find((entity) => entity.name === node.entity)
    }))

    const stats = {
      validator: nodes.filter((item) => item.type === 'validator').length,
      boot: nodes.filter((item) => item.type === 'boot').length,
      writer: nodes.filter(
        (item) => item.type === 'writer' || item.type === 'observer'
      ).length,
      observer: nodes.filter(
        (item) => item.type === 'writer' || item.type === 'observer'
      ).length
    }

    nodes.forEach((node, index) => {
      if (typeof stats[node.y] === 'undefined') {
        stats[node.y] = 0
      } else {
        stats[node.y] += 1
      }

      if (stats[node.type] === 1) {
        nodes[index].x = 100 + window.innerWidth / 3
      } else {
        nodes[index].x =
          stats[node.y] * (window.innerWidth / stats[node.type]) + 100
      }
    })

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
              source: otherNode.id,
              target: node.id
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
              source: otherNode.id,
              target: node.id
            })
          })
      })

    setData({
      nodes,
      links
    })
  }, [])

  useEffect(() => {
    initData()
  }, [initData])

  return (
    <>
      {data.links.length > 0 && (
        <Graph id="graph-id" data={data} config={myConfig} />
      )}
    </>
  )
}

LacchainNodesNetwork.propTypes = {}

export default LacchainNodesNetwork
