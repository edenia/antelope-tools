import React, { memo, useState } from 'react'
import PropTypes from 'prop-types'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { Popover } from '@mui/material'
import CountryFlag from '../CountryFlag'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LaunchIcon from '@mui/icons-material/Launch';



const ProducerInformation = ({ info, classes, t }) => {

  console.log(info)
  const [anchor, setAnchor] = useState(null)
  const openPopover = (event) => {
    setAnchor(event.currentTarget)
  }

  const RowUrl = ({ title, value, href }) => {
    return (
      <div className={classes.rowWrapper}>
        <Typography variant="body1" className={classes.textEllipsis}>
          {`${title}: `}
          {!!value ? (
            <Link
              href={href ?? value}
              target="_blank"
              rel="noopener noreferrer"
            >
              {value}
            </Link>
          ) : (
            'N/A'
          )}
        </Typography>
      </div>
    )
  }

  return (
    <>
      <div className={classes.borderLine}>
        <div className={classes.rowWrapper}>
          {info?.location && info?.location !== 'N/A' && (
            <Typography variant="body1">
              {`${t('location')}: ${info?.location} `}
              <CountryFlag code={info?.country} />
            </Typography>
          )}
        </div>
        <RowUrl title={t('website')} value={info?.website} />
        <RowUrl
          title={t('email')}
          value={info?.email}
          href={`mailto:${info.email}`}
        />

        <div className={classes.flex}>
          {!!info?.ownership ? (
            <><><Typography variant="body1" className={classes.textEllipsis}>
              {t('codeofconduct')}
            </Typography>
              <LaunchIcon onClick={() => window.open(info.ownership, '_blank')} className={classes.clickableIcon}>

              </LaunchIcon>
              <InfoOutlinedIcon className={classes.clickableIcon} onClick={openPopover}></InfoOutlinedIcon></><Popover
                className={classes.shadow}
                open={Boolean(anchor)}
                onClose={() => setAnchor(null)}
                anchorEl={anchor}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              ><Link target="_blank" rel="noopener noreferrer">{info.ownership}</Link>
              </Popover></>

          ) : null}
        </div>

        <div className={classes.flex}>
          {!!info?.code_of_conduct ? (
            <><><Typography variant="body1" className={classes.textEllipsis}>
              {t('codeofconduct')}
            </Typography>
              <LaunchIcon onClick={() => window.open(info.code_of_conduct, '_blank')} className={classes.clickableIcon}>

              </LaunchIcon>
              <InfoOutlinedIcon className={classes.clickableIcon} onClick={openPopover}></InfoOutlinedIcon></><Popover
                className={classes.shadow}
                open={Boolean(anchor)}
                onClose={() => setAnchor(null)}
                anchorEl={anchor}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              ><Link target="_blank" rel="noopener noreferrer">{info.code_of_conduct}</Link>
              </Popover></>

          ) : null}
        </div>
        <div className={classes.flex}>
          {!!info?.chain ? (
            <><><Typography variant="body1" className={classes.textEllipsis}>
              {t('chainResources')}
            </Typography>
              <LaunchIcon onClick={() => window.open(info.chain, '_blank')} className={classes.clickableIcon}>

              </LaunchIcon>
              <InfoOutlinedIcon className={classes.clickableIcon} onClick={openPopover}></InfoOutlinedIcon></><Popover
                className={classes.shadow}
                open={Boolean(anchor)}
                onClose={() => setAnchor(null)}
                anchorEl={anchor}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              ><Link target="_blank" rel="noopener noreferrer">{info.chain}</Link>
              </Popover></>

          ) : null}
        </div>


        {!!info?.otherResources.length && (
          <div className={classes.rowWrapper}>
            <dt className={classes.dt}>
              <Typography variant="body1" className={classes.textEllipsis}>
                {t('otherResources')}
              </Typography>
            </dt>
            <InfoOutlinedIcon onClick={openPopover}></InfoOutlinedIcon>
            <Popover
              className={classes.shadow}
              open={Boolean(anchor)}
              onClose={() => setAnchor(null)}
              anchorEl={anchor}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
              {info.otherResources.map((url, i) => (
                <div className={classes.dd} key={i}>
                  <Link href={url} target="_blank" rel="noopener noreferrer">
                    {info?.otherResources}
                  </Link>
                </div>
              ))}
            </Popover>
          </div>
        )}


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
