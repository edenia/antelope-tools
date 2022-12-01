const isLogoValid = (imgUrl) => {
  if (!imgUrl || !imgUrl.startsWith('https')) return false

  const img = new Image()

  img.src = imgUrl

  return img.width >= 100 && img.height === img.width
}

export default isLogoValid
