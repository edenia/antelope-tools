import React, { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { getLocalePath } from '../../utils/url-localization'

const LocaleLink = forwardRef((props, ref) => {
  const { i18n } = useTranslation()

  return <Link {...props} to={getLocalePath(props.to,props.locale || i18n.language)} ref={ref}/>
})

export default LocaleLink
