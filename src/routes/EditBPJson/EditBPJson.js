import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import EosApi from 'eosjs-api'
import axios from 'axios'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'
import Alert from '@material-ui/lab/Alert'
import { BPJsonGenerator } from '@eoscostarica/eoscr-components'

import { eosConfig } from '../../config'

const eosApi = EosApi({
  httpEndpoint: eosConfig.endpoint,
  verbose: false,
  fetchConfiguration: {}
})

const getBpJSONOffChain = async (producer) => {
  try {
    const { data: bpJson } = await axios.get(
      producer?.owner === 'okcapitalbp1'
        ? `${producer?.url}/bp.json`
        : `https://cors-anywhere.herokuapp.com/${producer?.url}/bp.json`,
      {
        timeout: 5000
      }
    )

    return bpJson
  } catch (error) {}
}

const getBpJSONOnChain = async (producer) => {
  const { rows } = await eosApi.getTableRows({
    code: eosConfig.bpJsonOnChainContract,
    scope: eosConfig.bpJsonOnChainScope,
    table: eosConfig.bpJsonOnChainTable,
    lower_bound: producer?.owner,
    json: true
  })
  const row =
    rows.find(
      (item) =>
        item.entity_name === producer?.owner || item.owner === producer?.owner
    ) || {}

  return row.json ? JSON.parse(row.json) : null
}

const EditBPJson = ({ ual }) => {
  const [producer, setProducer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const handleOnSubmit = async (owner, json) => {
    if (!ual.activeUser) return

    setLoading(true)
    try {
      await ual.activeUser.signTransaction(
        {
          actions: [
            {
              account: eosConfig.bpJsonOnChainContract,
              name: 'set',
              authorization: [
                {
                  actor: ual.activeUser.accountName,
                  permission: 'active'
                }
              ],
              data: {
                owner,
                json
              }
            }
          ]
        },
        {
          broadcast: true
        }
      )
    } catch (error) {
      setError(
        error?.cause?.message ||
          error?.message ||
          'Unknown error on submit.'
      )
      setTimeout(() => {
        setError(null)
      }, 5000)
    }
    setLoading(false)
  }

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      const { rows } = await eosApi.getProducers({
        json: true,
        limit: 1,
        lower_bound: ual.activeUser.accountName
      })
      console.log(rows)
      const producer = rows.find(
        (item) => item.owner === ual.activeUser.accountName
      )

      const bpJson = eosConfig.useBpJsonOnChain
        ? await getBpJSONOnChain(producer)
        : await getBpJSONOffChain(producer)

      producer && bpJson
        ? setProducer({ ...producer, bpJson })
        : setProducer(null)
      setLoading(false)
    }

    if (ual.activeUser) {
      init()
    } else {
      setTimeout(() => {
        setLoading(false)
      }, 5000)
    }
  }, [ual.activeUser])

  return (
    <Grid item xs={12}>
      <Card>
        <CardContent>
          {loading && (
            <>
              <Typography variant="h5" align="center">
                Loading node information . . .
              </Typography>
              <LinearProgress color="primary" />
            </>
          )}
          {!ual.activeUser && !loading && (
            <Alert severity="warning">Please log in to use this tool.</Alert>
          )}
          {ual.activeUser && !producer && !loading && (
            <Alert severity="warning">
              You must have an account registered as an active node to use this toool.
            </Alert>
          )}
          {error && <Alert severity="error">{error}</Alert>}
          {producer && (
            <BPJsonGenerator
              accountName={producer?.owner}
              bpJson={producer.bpJson}
              onSubmit={eosConfig.bpJsonOnChainContract ? handleOnSubmit : null}
            />
          )}
        </CardContent>
      </Card>
    </Grid>
  )
}

EditBPJson.propTypes = {
  ual: PropTypes.object
}

export default EditBPJson
