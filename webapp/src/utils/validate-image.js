const isLogoValid = (imgUrl) => {
  const img = new Image()
  img.src = imgUrl
  return img.width >= 100 && img.height >= 100
}

export default isLogoValid
