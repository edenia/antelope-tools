import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import Typography from '@mui/material/Typography'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'

import jungleImg from '../../assets/jungle.webp'
import waxImg from '../../assets/wax.webp'
import lacchainImg from '../../assets/lacchain.webp'
import telosImg from '../../assets/telos.webp'
import xprNetworkImg from '../../assets/xpr.webp'
import eosImg from '../../assets/eos.webp'
import airwireImg from '../../assets/airwire.png'
import ultraImg from '../../assets/ultra.webp'
import libreImg from '../../assets/libre.webp'
import { getLocaleUrl } from 'utils/url-localization'

import styles from './styles'

const useStyles = makeStyles(styles)

const LogoSvg = ({ name }) => {
  const classes = useStyles()

  switch (name) {
    case 'jungle':
      return <img src={jungleImg} alt="jungle logo" className={classes.jungleImg} />

    case 'telos':
      return <img src={telosImg} alt="telos logo" className={classes.telosImg} />

    case 'wax':
      return <img src={waxImg} alt="wax logo" className={classes.waxImg} />

    case 'lacchain':
      return (
        <img src={lacchainImg} alt="lacchain logo" className={classes.lacchainImg} />
      )

    case 'xpr':
      return <img src={xprNetworkImg} alt="xpr network logo" className={classes.xprNetworkImg} />

    case 'airwire':
      return (
        <img src={airwireImg} alt="airwire logo" className={classes.airwireImg} />
      )

    case 'ultra':
      return <img src={ultraImg} alt="ultra logo" className={classes.ultraImg} />

    case 'libre':
      return <img src={libreImg} alt="libre logo" className={classes.libreImg} />

    default:
      return <img src={eosImg} alt="eos logo" className={classes.eosImg} />
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
  const { i18n } = useTranslation('translations')

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
                  <a href={getLocaleUrl(option.value, i18n.language)} target="_self">
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
                  <a href={getLocaleUrl(option.value, i18n.language)} target="_self">
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
