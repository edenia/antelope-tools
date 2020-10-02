import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Divider from '@material-ui/core/Divider'
import { makeStyles } from '@material-ui/core/styles'

const defaultIcon =
  'https://icons.iconarchive.com/icons/custom-icon-design/mono-general-2/512/document-icon.png'

const useStyles = makeStyles((theme) => ({
  ricardianContractContainer: {
    '& h3': {
      fontSize: 38
    },
    [theme.breakpoints.up('sm')]: {
      '& h3': {
        fontSize: 50
      }
    }
  },
  boxTitle: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(1),
    '& img': {
      width: 25
    }
  },
  boxText: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: theme.spacing(1),
    '& h6': {
      fontStyle: 'italic',
      lineHeight: 1
    },
    '& h5': {
      lineHeight: 1
    }
  },
  defaultIcon: {
    fontSize: 65,
    color: '#484158'
  },
  divider: {
    marginBottom: theme.spacing(2)
  },
  hash: {
    '& span': {
      fontWeight: 'bold'
    },
    wordBreak: 'break-all'
  }
}))

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
        <Box key={`ricardian-item-${name}`}>
          <Box className={classes.boxTitle}>
            <img
              alt="icon"
              src={_icon || defaultIcon}
              onError={useDefaultLogo}
            />
            <Box className={classes.boxText}>
              <Typography color="primary" variant="h5">
                {_title || name}
              </Typography>
              <Typography color="primary" variant="subtitle2">
                {version}
              </Typography>
            </Box>
          </Box>
          <Divider className={classes.divider} />
          <Typography variant="body1">
            {summary || 'Empty Ricardian Clause'}
          </Typography>
        </Box>
      )
    },
    [classes]
  )

  useEffect(() => {
    if (!abi) return

    const actions = abi.actions.map(
      ({ ricardian_contract: ricardianContract, name }) =>
        formatRicardianClause(ricardianContract, name)
    )

    const clauses = abi.ricardian_clauses.map(({ body }) =>
      formatRicardianClause(body)
    )

    setActions(actions)
    setClauses(clauses)
  }, [abi, formatRicardianClause])

  return (
    <Box className={classes.ricardianContractContainer}>
      <Typography variant="body1" className={classes.hash}>
        <span>Hash:</span> {hash || 'N/A'}
      </Typography>

      {!actions.length && (
        <Typography variant="body1">Empty actions</Typography>
      )}

      {actions.map((item) => item)}

      {clauses.map((clause) => clause)}
    </Box>
  )
}

RicardianContract.propTypes = {
  abi: PropTypes.any,
  hash: PropTypes.string
}

RicardianContract.defaultProps = {}

export default RicardianContract
