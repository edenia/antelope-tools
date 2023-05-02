const { hasuraUtil } = require('../utils')

const newEndpointsHealthHistory = async (endpoints, payload) => {
  const mutation = `
    mutation insert($payload: health_check_history_insert_input!,$endpoints: [endpoints_check_history_insert_input!]!) {
        insert_health_check_history_one(object: $payload, on_conflict: {constraint: health_check_history_pkey, update_columns: [total_checks, date]}) {
          id
        }
        insert_endpoints_check_history(objects: $endpoints, on_conflict: {constraint: endpoints_check_history_pkey, update_columns: [producer_id, value, successful_checks, sum_total_time, date]}) {
          affected_rows
        }
    }
  `

  endpoints = endpoints.map(endpoint => ({
    successful_checks: endpoint.isWorking,
    sum_total_time: endpoint.time,
    value: endpoint.value,
    producer_id: endpoint.producer_id,
    date: payload.date
  }))

  await hasuraUtil.request(mutation, { payload, endpoints })
}

const updateEndpointsHealthHistory = async (endpoints, date) => {
  const mutation = `
    mutation insert($date: date!,$updates: [endpoints_check_history_updates!]!) {
      update_health_check_history(where: {date: {_eq: $date}}, _inc: {total_checks: 1}) {
        affected_rows
      }
      update_endpoints_check_history_many(updates: $updates) {
        affected_rows
      }
    }
  `
  const updates = endpoints.map(endpoint => ({
    where: {
      _and: [
        { producer_id: { _eq: endpoint.producer_id } },
        { value: { _eq: endpoint.value } },
        { date: { _eq: date } }
      ]
    },
    _inc: {
      successful_checks: endpoint.isWorking,
      sum_total_time: endpoint.time
    }
  }))

  await hasuraUtil.request(mutation, { date, updates })
}

const clearEndpointsHealthHistory = async (limit) => {
  const date = new Date()

  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() - limit)

  const mutation = `
    mutation clear($date: date){
      delete_endpoints_check_history(where: {date: {_eq: $date}}){
        affected_rows
      }
    }
  `

  await hasuraUtil.request(mutation, { date })
}

const saveHealthRegister = async endpoints => {
  const today = new Date()

  today.setHours(0, 0, 0, 0)

  const query = `
    query($today: date){
        history: health_check_history_aggregate{
            aggregate{
                count
            }
        }
        older: health_check_history(limit: 1, order_by: {date: asc}){
            id
        }
        current: health_check_history(limit: 1, where: {date: {_eq: $today}}){
            id
        }
    }`
  
  const limit = 30
  const {
    older,
    current,
    history: {
      aggregate: { count }
    }
  } = await hasuraUtil.request(query, { today })

  if (current?.length) {
    await updateEndpointsHealthHistory(endpoints, today)
  } else {
    const payload = { date: today, total_checks: 1 }

    if (count + 1 > limit) {
      payload.id = older[0].id
    }

    await newEndpointsHealthHistory(endpoints, payload)
    await clearEndpointsHealthHistory(limit)
  }
}

module.exports = {
  saveHealthRegister,
  clearEndpointsHealthHistory
}
