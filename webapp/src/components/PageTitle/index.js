import React from 'react'
import Helmet from 'react-helmet'
import PropTypes from 'prop-types'

import { generalConfig } from '../../config'

const PageTitle = ({ title, metaTitle, metaDescription }) => (
  <Helmet>
    <title>{title}</title>
    <meta name="title" content={metaTitle} />
    <meta name="description" content={metaDescription} />
    <meta property="og:title" content={metaTitle} />
    <meta property="og:description" content={metaDescription} />
  </Helmet>
)

PageTitle.propTypes = {
  title: PropTypes.string,
  metaTitle: PropTypes.string,
  metaDescription: PropTypes.string,
}

PageTitle.defaultProps = {
  title: generalConfig.title,
  metaTitle: '',
  metaDescription: '',
}

export default PageTitle
