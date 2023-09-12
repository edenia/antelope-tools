import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import { makeStyles } from '@mui/styles'

import styles from './styles'

const useStyles = makeStyles(styles)
const defaultIcon =
  'https://icons.iconarchive.com/icons/custom-icon-design/mono-general-2/512/document-icon.png'

const RicardianContract = ({ abi, hash }) => {
  const classes = useStyles()
  const [actions, setActions] = useState([])
  const [clauses, setClauses] = useState([])

  const useDefaultLogo = (ev) => {
    ev.target.src = defaultIcon
  }

  const formatRicardianClause = useCallback(
    (text = '', name) => {
      const [_version, content1] = text.split('\ntitle: ')
      const version = _version.replace(/---\n/g, '')
      const [_title, content2] = (content1 || '').split('\nsummary: ')
      const [summary, _icon] = (content2 || '').split('\nicon: ')

      return (
        <div key={`ricardian-item-${name}-${version}`}>
          <div className={classes.boxTitle}>
            <img
              alt="icon"
              src={_icon || defaultIcon}
              onError={useDefaultLogo}
            />
            <div className={classes.boxText}>
              {_title && name && (
                <Typography color="primary" variant="h5">
                  {_title || name}
                </Typography>
              )}
              {version && (
                <Typography color="primary" variant="subtitle2">
                  {version}
                </Typography>
              )}
            </div>
          </div>
          <Divider className={classes.divider} />
          <Typography variant="body1">
            {summary || 'Empty Ricardian Clause'}
          </Typography>
        </div>
      )
    },
    [classes],
  )

  useEffect(() => {
    if (!abi) return

    const actions = abi.actions.map(
      ({ ricardian_contract: ricardianContract, name }) =>
        formatRicardianClause(ricardianContract, name),
    )

    const clauses = abi.ricardian_clauses.map(({ body }) =>
      formatRicardianClause(body),
    )

    setActions(actions)
    setClauses(clauses)
  }, [abi, formatRicardianClause])

  return (
    <div className={classes.ricardianContractContainer}>
      <Typography variant="body1" className={classes.hash}>
        <span>Hash:</span> {hash || 'N/A'}
      </Typography>

      {!actions.length && (
        <Typography variant="body1">Empty actions</Typography>
      )}

      {actions.map((item) => item)}

      {clauses.map((clause) => clause)}
    </div>
  )
}

RicardianContract.propTypes = {
  abi: PropTypes.any,
  hash: PropTypes.string,
}

RicardianContract.defaultProps = {}

export default RicardianContract
