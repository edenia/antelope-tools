import React from 'react'
import Helmet from 'react-helmet'
import PropTypes from 'prop-types'

import { generalConfig } from '../../config'

const PageTitle = ({ title, metaTitle, metaDescription, ldJson, language }) => (
  <Helmet>
    {language && <html lang={language} />}
    <title>{title}</title>
    <meta name="title" content={metaTitle} />
    <meta name="description" content={metaDescription} />
    <meta property="og:title" content={metaTitle} />
    <meta property="og:description" content={metaDescription} />
    {ldJson && <script type="application/ld+json">{ldJson}</script>}
  </Helmet>
)

PageTitle.propTypes = {
  title: PropTypes.string,
  metaTitle: PropTypes.string,
  metaDescription: PropTypes.string,
  language: PropTypes.string,
}

PageTitle.defaultProps = {
  title: generalConfig.title,
  metaTitle: '',
  metaDescription: '',
  ldJson: null,
  language: '',
}

export default PageTitle
