const isValidAccountName = name => {
  const regex = /^[.12345abcdefghijklmnopqrstuvwxyz]+$/

  return name?.length < 13 && regex.test(name)
}

export default isValidAccountName
