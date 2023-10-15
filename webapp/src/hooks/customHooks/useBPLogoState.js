import { useState, useRef } from 'react'

const useBPLogoState = (logo, defaultLogo) => {
  const [src, setSrc] = useState(logo?.startsWith('https') ? logo : defaultLogo)
  const logoRef = useRef(null)

  const handleLoad = () => {
    if (!logoRef?.current) return

    const { naturalHeight, naturalWidth } = logoRef.current

    const ratio =
      Math.min(naturalHeight, naturalWidth) /
      Math.max(naturalHeight, naturalWidth)

    if (naturalHeight < 100 || naturalWidth < 100 || ratio < 0.8) {
      setSrc(defaultLogo)
    }
  }

  return [{ src, logoRef }, { handleLoad }]
}

export default useBPLogoState
