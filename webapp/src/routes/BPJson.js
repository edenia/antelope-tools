import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import EosApi from 'eosjs-api'
import axios from 'axios'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress'
import { useTranslation } from 'react-i18next'
import Typography from '@material-ui/core/Typography'
import Alert from '@material-ui/lab/Alert'
import { BPJsonGenerator } from '@eoscostarica/eoscr-components'

import { eosConfig } from '../config'

const eosApi = EosApi({
  httpEndpoint: eosConfig.endpoint,
  verbose: false,
  fetchConfiguration: {}
})

const getBpJSONOffChain = async (producer) => {
  try {
    const { data: bpJson } = await axios.get(`${producer?.url}/bp.json`, {
      timeout: 5000
    })

    return bpJson
  } catch (error) {
    console.log(error)
  }
}

const BPJson = ({ ual }) => {
  const [producer, setProducer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { t } = useTranslation('bpJsonRoute')

  const initData = {
    account_name: '',
    org: {
      candidate_name: '',
      website: '',
      code_of_conduct: '',
      ownership_disclosure: '',
      email: '',
      github_user: [],
      chain_resources: '',
      other_resources: [],
      branding: {
        logo_256: '',
        logo_1024: '',
        logo_svg: ''
      },
      location: {
        name: '',
        country: '',
        latitude: null,
        longitude: null
      },
      social: {
        keybase: '',
        telegram: '',
        twitter: '',
        github: '',
        youtube: '',
        facebook: '',
        hive: '',
        reddit: '',
        wechat: ''
      }
    },
    nodes: []
  }

  const handleOnSubmit = async (payload) => {
    if (!ual.activeUser || !payload.shouldUpdateChain) return

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
                owner: ual.activeUser.accountName,
                json: payload.bpJson
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
        error?.cause?.message || error?.message || 'Unknown error on submit.'
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
      const producer = rows.find(
        (item) => item.owner === ual.activeUser.accountName
      )

      if (producer) {
        const bpJson = await getBpJSONOffChain(producer)
        setProducer({ ...producer, bpJson })
      }

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
                {t('loadText')}
              </Typography>
              <LinearProgress color="primary" />
            </>
          )}
          {error && <Alert severity="error">{error}</Alert>}
          <BPJsonGenerator
            accountName={ual.activeUser?.accountName || initData.account_name}
            bpJson={producer?.bpJson || initData}
            onSubmit={eosConfig.bpJsonOnChainContract ? handleOnSubmit : null}
          />
        </CardContent>
      </Card>
    </Grid>
  )
}

BPJson.propTypes = {
  ual: PropTypes.object
}

export default BPJson
