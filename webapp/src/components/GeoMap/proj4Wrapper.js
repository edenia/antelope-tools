import proj4 from 'proj4'

if (typeof window !== 'undefined') {
  window.proj4 = window.proj4 || proj4
}

const proj4Wrapper = proj4

export default proj4Wrapper
