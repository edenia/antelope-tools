const { hasuraUtil } = require('../utils')

const save = async state => {
  const mutation = `
    mutation ($payload: demux_state_insert_input!) {
      insert_demux_state_one(object: $payload) {
        id
      }
    }  
  `
  const data = await hasuraUtil.request(mutation, {
    payload: {
      block_number: state.blockNumber,
      block_hash: state.blockHash,
      handler_version_name: state.handlerVersionName
    }
  })

  return data.insert_demux_state_one
}

const update = async (version, state) => {
  const mutation = `
    mutation ($version: String!, $payload: demux_state_set_input) {
      update_demux_state(where: {handler_version_name: {_eq: $version}}, _set: $payload) {
        affected_rows
      }
    }  
  `

  await hasuraUtil.request(mutation, {
    version,
    payload: {
      block_number: state.blockNumber,
      block_hash: state.blockHash,
      handler_version_name: state.handlerVersionName
    }
  })
}

const getByVersion = async version => {
  const query = `
    query ($version: String!) {
      demux_state(where: {handler_version_name: {_eq: $version}}) {
        id
        block_number
        block_hash
        handler_version_name
      }
    }  
  `
  const data = await hasuraUtil.request(query, { version })

  if (!data.demux_state.length) {
    return
  }

  const state = data.demux_state[0]

  return {
    blockNumber: state.block_number,
    blockHash: state.block_hash,
    handlerVersionName: state.handler_version_name
  }
}

const saveOrUpdate = async (version, newState) => {
  const currentState = await getByVersion(version)

  if (!currentState) {
    await save(newState)

    return
  }

  await update(version, newState)
}

module.exports = {
  save,
  update,
  getByVersion,
  saveOrUpdate
}
