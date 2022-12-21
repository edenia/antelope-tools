import React, { memo, useState } from 'react'
import PropTypes from 'prop-types'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { Popover, Tooltip } from '@mui/material'
import CountryFlag from '../CountryFlag'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

import CopyToClipboard from '../CopyToClipboard'
import VisitSite from '../VisitSite'

const ProducerInformation = ({ info, classes, t }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [OtherRes, SetOtherRes] = useState(null)
  const [data, setData] = useState([])

  const handleClick = (target, data) => {
    setAnchorEl(target)
    setData(data)
  }

  const handleClose = () => {
    setAnchorEl(null)
    SetOtherRes(null)
  }

  const handleOther = (target) => {
    SetOtherRes(target)
  }

  const open = Boolean(anchorEl)
  const openRes = Boolean(OtherRes)
  const id = open ? 'simple-popover' : undefined

  return (
    <>
      <div className={classes.borderLine}>
        <div className={classes.flex}>
          {info?.location && info?.location !== 'N/A' && (
            <Typography variant="body1">
              {`${t('location')}: ${info?.location} `}
              <CountryFlag code={info?.country} />
            </Typography>
          )}
        </div>
        <div className={classes.flex}>
          {!!info?.website ? (
            <>
              <>
                <Typography variant="body1" className={classes.textEllipsis}>
                  {t('website')}:
                </Typography>
                <VisitSite title={t('openLink')} url={info?.website} />
                <Tooltip title={t('moreInfo')} arrow placement="right">
                  <InfoOutlinedIcon
                    className={classes.clickableIcon}
                    onClick={(e) => {
                      handleClick(e.target, info?.website)
                    }}
                  />
                </Tooltip>
              </>
              <Popover
                className={classes.shadow}
                id={id}
                open={anchorEl !== null}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <div className={classes.flex}>
                  <div className={classes.popoverStyle}>
                    <Link href={data} target="_blank" rel="noopener noreferrer">
                      {data}
                    </Link>
                  </div>
                  <CopyToClipboard text={data} />
                </div>
              </Popover>
            </>
          ) : (
            <Typography variant="body1" className={classes.textEllipsis}>
              {t('website')}: N/A
            </Typography>
          )}
        </div>
        <div className={classes.flex}>
          {!!info?.email ? (
            <>
              <>
                <Typography variant="body1" className={classes.textEllipsis}>
                  {t('email')}:
                </Typography>
                <VisitSite title={t('openLink')} url={`mailto:${info.email}`} />
                <Tooltip title={t('moreInfo')} arrow placement="right">
                  <InfoOutlinedIcon
                    className={classes.clickableIcon}
                    onClick={(e) => {
                      handleClick(e.target, info?.email)
                    }}
                  />
                </Tooltip>
              </>
              <Popover
                className={classes.shadow}
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <div className={classes.flex}>
                  <div className={classes.popoverStyle}>
                    <Link href={data} target="_blank" rel="noopener noreferrer">
                      {data}
                    </Link>
                  </div>
                  <CopyToClipboard text={data} />
                </div>
              </Popover>
            </>
          ) : (
            <Typography variant="body1" className={classes.textEllipsis}>
              {t('email')}: N/A
            </Typography>
          )}
        </div>
        <div className={classes.flex}>
          {!!info?.ownership ? (
            <>
              <>
                <Typography variant="body1" className={classes.textEllipsis}>
                  {t('ownershipDisclosure')}:
                </Typography>
                <VisitSite title={t('openLink')} url={info?.ownership} />
                <Tooltip title={t('moreInfo')} arrow placement="right">
                  <InfoOutlinedIcon
                    className={classes.clickableIcon}
                    onClick={(e) => {
                      handleClick(e.target, info?.ownership)
                    }}
                  />
                </Tooltip>
              </>
              <Popover
                className={classes.shadow}
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <div className={classes.flex}>
                  <div className={classes.popoverStyle}>
                    <Link href={data} target="_blank" rel="noopener noreferrer">
                      {data}
                    </Link>
                  </div>
                  <CopyToClipboard text={data} />
                </div>
              </Popover>
            </>
          ) : null}
        </div>
        <div className={classes.flex}>
          {!!info?.code_of_conduct ? (
            <>
              <>
                <Typography variant="body1" className={classes.textEllipsis}>
                  {t('codeofconduct')}:
                </Typography>
                <VisitSite title={t('openLink')} url={info?.code_of_conduct} />
                <Tooltip title={t('moreInfo')} arrow placement="right">
                  <InfoOutlinedIcon
                    className={classes.clickableIcon}
                    onClick={(e) => {
                      handleClick(e.target, info?.code_of_conduct)
                    }}
                  />
                </Tooltip>
              </>
              <Popover
                className={classes.shadow}
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <div className={classes.flex}>
                  <div className={classes.popoverStyle}>
                    <Link href={data} target="_blank" rel="noopener noreferrer">
                      {data}
                    </Link>
                  </div>
                  <CopyToClipboard text={data} />
                </div>
              </Popover>
            </>
          ) : null}
        </div>
        <div className={classes.flex}>
          {!!info?.chain ? (
            <>
              <>
                <Typography variant="body1" className={classes.textEllipsis}>
                  {t('chainResources')}:
                </Typography>
                <VisitSite title={t('openLink')} url={info?.chain} />
                <Tooltip title={t('moreInfo')} arrow placement="right">
                  <InfoOutlinedIcon
                    className={classes.clickableIcon}
                    onClick={(e) => {
                      handleClick(e.target, info?.chain)
                    }}
                  />
                </Tooltip>
              </>
              <Popover
                className={classes.shadow}
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <div className={classes.flex}>
                  <div className={classes.popoverStyle}>
                    <Link href={data} target="_blank" rel="noopener noreferrer">
                      {data}
                    </Link>
                  </div>
                  <CopyToClipboard text={data} />
                </div>
              </Popover>
            </>
          ) : null}
        </div>
        <div className={classes.rowWrapper}>
          {!!info?.otherResources.length && (
            <>
              <Typography variant="body1" className={classes.textEllipsis}>
                {t('otherResources')}:
              </Typography>
              <Tooltip title={t('moreInfo')} arrow placement="right">
                <InfoOutlinedIcon
                  className={classes.clickableIcon}
                  onClick={(e) => {
                    handleOther(e.target)
                  }}
                />
              </Tooltip>

              <Popover
                className={classes.shadow}
                id={id}
                open={openRes}
                anchorEl={OtherRes}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                {info.otherResources.map((url, i) => (
                  <div className={classes.dd} key={i}>
                    <Link href={url} target="_blank" rel="noopener noreferrer">
                      {url}
                    </Link>
                  </div>
                ))}
              </Popover>
            </>
          )}
        </div>
      </div>
    </>
  )
}

ProducerInformation.propTypes = {
  info: PropTypes.object,
  classes: PropTypes.object,
  t: PropTypes.func,
}

ProducerInformation.defaultProps = {
  info: {},
  classes: {},
}

export default memo(ProducerInformation)
