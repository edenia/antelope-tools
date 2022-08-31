const isLogoValid = (imgUrl) => {
  const img = new Image()
  img.src = imgUrl
  return img.width >= 256 && img.height >= 256 
}

export default isLogoValid