import { useState, useRef } from 'react'

const useBPLogoState = ( logo, defaultLogo ) => {
  const [src, setSrc] = useState(logo?.startsWith('https') ? logo : defaultLogo)
  const logoRef = useRef(null)

  const handleLoad = () => {
    if (!logoRef?.current) return

    const { naturalHeight, naturalWidth } = logoRef.current

    if (naturalHeight < 100 || naturalHeight !== naturalWidth) {
      setSrc(defaultLogo)
    }
  }

  return [{ src, logoRef }, { handleLoad }]
}

export default useBPLogoState
