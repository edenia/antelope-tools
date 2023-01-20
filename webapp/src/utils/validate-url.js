const isUrlValid = (url) => {
  const urlRegex =
    /(http|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])/

  return url && urlRegex.test(url)
}

export default isUrlValid
