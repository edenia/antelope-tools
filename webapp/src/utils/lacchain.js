export const getNodeTypes = () => ({
  1: 'validator',
  2: 'writer',
  3: 'boot',
  4: 'observer'
})

export const getNewFieldPayload = (field, event, value, payload = {}) => {
  let newPayload = {}
  let newValue = ''

  if (
    typeof event?.target?.value === 'string' ||
    Array.isArray(event?.target?.value)
  ) {
    newValue = event.target.value
  } else if (typeof value === 'string' || Array.isArray(value)) {
    newValue = value
  } else if (typeof event === 'string' || Array.isArray(event)) {
    newValue = event
  }

  if (field.includes('.')) {
    const [parent, child] = field.split('.')
    newPayload = {
      ...payload,
      [parent]: {
        ...payload[parent],
        [child]: newValue
      }
    }
  } else {
    newPayload = {
      ...payload,
      [field]: newValue
    }
  }

  return newPayload
}
