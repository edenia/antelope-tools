/* eslint camelcase: 0 */
import React, { memo, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import { useQuery } from '@apollo/react-hooks'

import { NODES_SUMMARY_QUERY } from '../gql'

const BodyGraphValue = ({ loading, value }) => {
  if (loading) return <LinearProgress />

  return (
    <Typography component="p" variant="h6">
      {value}
    </Typography>
  )
}

BodyGraphValue.propTypes = {
  loading: PropTypes.bool,
  value: PropTypes.number
}

BodyGraphValue.defaultProps = {
  value: 0,
  loading: false
}

const NodesSummary = ({ t }) => {
  const { data, loading } = useQuery(NODES_SUMMARY_QUERY)
  const [total, setTotal] = useState()
  const [nodes, setNodes] = useState()

  useEffect(() => {
    if (!data?.stats) {
      return
    }

    const { total, ...nodes } = data?.stats[0]?.nodes_summary

    setTotal(total)
    setNodes(nodes)
  }, [data])

  return (
    <>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography>{`${t('total')} ${t('nodes')}`}</Typography>
            <BodyGraphValue value={total} loading={loading} />
          </CardContent>
        </Card>
      </Grid>

      {nodes &&
        Object.keys(nodes).map((type) => (
          <Grid item xs={12} key={type}>
            <Card>
              <CardContent>
                <Typography>{`${t(type)} ${t('nodes')}`}</Typography>
                <BodyGraphValue value={nodes[type] || 0} loading={loading} />
              </CardContent>
            </Card>
          </Grid>
        ))}
    </>
  )
}

NodesSummary.propTypes = {
  t: PropTypes.func
}

NodesSummary.defaultProps = {
  t: (text) => text
}

export default memo(NodesSummary)
