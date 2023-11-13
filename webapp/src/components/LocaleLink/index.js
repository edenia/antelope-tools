import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { getLocaleUrl } from '../../utils/url-localization'

const LocaleLink = props => {
  const { i18n } = useTranslation()

  return <Link {...props} to={getLocaleUrl(props.to,props.locale || i18n.language)}/>
}

export default LocaleLink
