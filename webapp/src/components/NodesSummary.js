/* eslint camelcase: 0 */
import React, { memo, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import { useQuery } from '@apollo/react-hooks'
import { useTranslation } from 'react-i18next'

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

const NodesSummary = ({ t, classes }) => {
  const { data, loading } = useQuery(NODES_SUMMARY_QUERY)
  const { i18n } = useTranslation('translations')
  const [currentLanguaje, setCurrentLanguaje] = useState('')
  const [total, setTotal] = useState()
  const [nodes, setNodes] = useState()

  useEffect(() => {
    if (!data?.stats) {
      return
    }

    const { total, ...nodes } = data?.stats[0]?.nodes_summary || {}
    setTotal(total)
    setNodes(nodes)
  }, [data])

  useEffect(() => {
    setCurrentLanguaje(i18n.language.substring(0, 2))
  }, [i18n.language])

  return (
    <>
      <Grid item xs={12} sm={4} lg={3}>
        <Card>
          <CardContent className={classes.cards}>
            <Typography>{`${t('total')} ${t('nodes')}`}</Typography>
            <BodyGraphValue value={total} loading={loading} />
          </CardContent>
        </Card>
      </Grid>

      {nodes &&
        Object.keys(nodes).map((type) => {
          const label = type.replaceAll(/("|\[|\])/gi, '')

          return (
            <Grid item xs={12} sm={4} lg={3} key={type}>
              <Card>
                <CardContent className={classes.cards}>
                  <Typography>
                    {currentLanguaje === 'es' ? t('nodes') : ''} {t(label)}{' '}
                    {currentLanguaje !== 'es' ? t('nodes') : ''}
                  </Typography>
                  <BodyGraphValue value={nodes[type] || 0} loading={loading} />
                </CardContent>
              </Card>
            </Grid>
          )
        })}
    </>
  )
}

NodesSummary.propTypes = {
  t: PropTypes.func,
  classes: PropTypes.object
}

NodesSummary.defaultProps = {
  t: (text) => text,
  classes: {}
}

export default memo(NodesSummary)
