import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import Typography from '@mui/material/Typography'
import { makeStyles } from '@mui/styles'

import jungleImg from '../../assets/jungle.png'
import waxImg from '../../assets/wax.png'
import lacchainImg from '../../assets/lacchain.png'
import telosImg from '../../assets/telos.png'
import protonImg from '../../assets/proton.png'
import eosImg from '../../assets/eos.png'
import airwireImg from '../../assets/airwire.png'
import ultraImg from '../../assets/ultra.jpg'
import libreImg from '../../assets/libre.png'

import styles from './styles'

const useStyles = makeStyles(styles)

const LogoSvg = ({ name }) => {
  const classes = useStyles()

  switch (name) {
    case 'jungle':
      return <img src={jungleImg} alt="jungle" className={classes.jungleImg} />

    case 'telos':
      return <img src={telosImg} alt="telos" className={classes.telosImg} />

    case 'wax':
      return <img src={waxImg} alt="wax" className={classes.waxImg} />

    case 'lacchain':
      return (
        <img src={lacchainImg} alt="lacchain" className={classes.lacchainImg} />
      )

    case 'proton':
      return <img src={protonImg} alt="proton" className={classes.protonImg} />

    case 'airwire':
      return (
        <img src={airwireImg} alt="airwire" className={classes.airwireImg} />
      )

    case 'ultra':
      return <img src={ultraImg} alt="ultra" className={classes.ultraImg} />

    case 'libre':
      return <img src={libreImg} alt="libre" className={classes.libreImg} />

    default:
      return <img src={eosImg} alt="eos" className={classes.eosImg} />
  }
}

LogoSvg.propTypes = {
  name: PropTypes.string,
}

LogoSvg.defaultProps = {
  name: '',
}

const NetworkSelector = ({ title, options, networkLogo }) => {
  const classes = useStyles()
  const [selected] = useState(-1)
  const [open, setOpen] = useState(false)
  const [networks, setNetworks] = useState({ testnet: [], mainnet: [] })

  const toggleDropdown = () => {
    setOpen(!open)
  }

  const sortItems = (a, b) => a.order - b.order

  useEffect(() => {
    const networks = options.reduce(
      (acc, current) => {
        let sorted = []

        if (!current.mainnet) {
          sorted = [...acc.testnet, current].sort(sortItems)

          return { ...acc, testnet: sorted }
        }

        sorted = [...acc.mainnet, current].sort(sortItems)

        return { ...acc, mainnet: sorted }
      },
      { testnet: [], mainnet: [] },
    )

    setNetworks(networks)
  }, [options])

  return (
    <div className={classes.dropdown}>
      <div onClick={toggleDropdown} className={clsx(classes.toggle)}>
        {!open && <ExpandMoreIcon className={classes.expandIcon} />}
        {open && <ExpandLessIcon className={classes.expandIcon} />}
        <Typography component="p" variant="h5">
          {title}
        </Typography>
      </div>
      <div className={clsx(classes.list, { [classes.listActive]: open })}>
        <div className="titles">
          <div className="titlesBoxLeft">
            <Typography>Mainnets</Typography>
          </div>
          <div className="titlesBoxRight">
            <Typography>Testnets</Typography>
          </div>
        </div>
        <div className="lists">
          <div className="listsBoxLeft">
            <ul>
              {networks.mainnet.map((option, i) => (
                <li
                  key={i}
                  className={clsx(classes.listItem, {
                    [classes.listItemActive]: i === selected,
                  })}
                >
                  <a href={option.value} target="_self">
                    <LogoSvg name={option.icon} />
                    {option.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="listsBoxRight">
            <ul>
              {networks.testnet.map((option, i) => (
                <li
                  key={i}
                  className={clsx(classes.listItem, {
                    [classes.listItemActive]: i === selected,
                  })}
                >
                  <a href={option.value} target="_self">
                    <LogoSvg name={option.icon} />
                    {option.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className={classes.networkLogo}>
        <img src={networkLogo} alt="network logo" />
      </div>
    </div>
  )
}

NetworkSelector.propTypes = {
  title: PropTypes.string,
  options: PropTypes.array,
  networkLogo: PropTypes.string,
}

NetworkSelector.defaultProps = {
  title: '',
  options: [],
  networkLogo: '',
}

export default NetworkSelector
