export const isTheSameObject = (obj1, obj2) => {
  if (typeof obj1 === 'object' && typeof obj2 === 'object') {
    if (Object.keys(obj1 || {}).length !== Object.keys(obj2 || {}).length)
      return false

    return Object.keys(obj1 || {}).every((key) => {
      return isTheSameObject(obj1[key], obj2[key])
    })
  }

  return obj1 === obj2
}

export default isTheSameObject
