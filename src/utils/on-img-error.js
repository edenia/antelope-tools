export const onImgError = (defaultLogo) => (ev) => {
  ev.target.src = defaultLogo
}
