import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import { useDispatch, useSelector } from 'react-redux'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Skeleton from '@material-ui/lab/Skeleton'
import Typography from '@material-ui/core/Typography'
import 'flag-icon-css/css/flag-icon.min.css'

import { formatWithThousandSeparator } from '../../utils'

const defaultLogo = 'https://bloks.io/img/eosio.png'

const useStyles = makeStyles((theme) => ({
  country: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  owner: {
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center'
  },
  loader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    display: 'inline-block',
    width: '2em',
    height: '2em',
    borderRadius: '500rem'
  }
}))

const Producers = () => {
  const dispatch = useDispatch()
  const info = useSelector((state) => state.eos.info)
  const producers = useSelector((state) => state.eos.producers)
  const classes = useStyles()

  const useDefaultLogo = (ev) => {
    ev.target.src = defaultLogo
  }

  useEffect(() => {
    dispatch.eos.startTrackingInfo({ interval: 1000 })
    dispatch.eos.getProducers()
  }, [dispatch])

  return (
    <>
      <Grid item xl={3} lg={3} sm={6} xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6">Last Block</Typography>
            <Typography variant="h3">
              {formatWithThousandSeparator(info.head_block_num)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xl={3} lg={3} sm={6} xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6">Produced by</Typography>
            <Typography variant="h3">{info.head_block_producer}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xl={3} lg={3} sm={6} xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6">Last irreversible block</Typography>
            <Typography variant="h3">
              {formatWithThousandSeparator(info.last_irreversible_block_num)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xl={3} lg={3} sm={6} xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6">Server version</Typography>
            <Typography variant="h3">{info.server_version_string}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item sm={12}>
        <Card>
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Rank</TableCell>
                  <TableCell>Block Producer</TableCell>
                  <TableCell>Votes %</TableCell>
                  <TableCell>Total Votes</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Expected Rewards</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {producers.rows.map((producer, index) => (
                  <TableRow key={`producer-table-row-${index}`}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className={classes.owner}>
                      <img
                        className={classes.logo}
                        src={
                          producer?.bp_json?.org?.branding?.logo_256 ||
                          defaultLogo // eslint-disable-line camelcase
                        }
                        onError={useDefaultLogo}
                        alt="logo"
                      />
                      {producer?.owner}
                    </TableCell>
                    <TableCell>
                      {formatWithThousandSeparator(
                        producer?.total_votes_percent * 100,
                        3
                      )}
                      %
                    </TableCell>
                    <TableCell>
                      {formatWithThousandSeparator(
                        producer?.total_votes_eos,
                        0
                      )}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`flag-icon flag-icon-squared flag-icon-${producer?.bp_json?.org?.location?.country?.toLocaleLowerCase()}`}
                      />
                      <span className={classes.country}>
                        {producer?.bp_json?.org?.location?.name || 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {formatWithThousandSeparator(producer?.total_reward, 2)}
                    </TableCell>
                  </TableRow>
                ))}
                {!producers.rows.length &&
                  [1, 2, 3].map((_, i) => (
                    <TableRow key={`producer-table-row-${i}`}>
                      <TableCell>
                        <Skeleton
                          variant="text"
                          width={'100%'}
                          height={30}
                          animation="wave"
                        />
                      </TableCell>
                      <TableCell>
                        <div className={classes.loader}>
                          <Skeleton
                            variant="circle"
                            width={30}
                            height={30}
                            animation="wave"
                          />
                          <Skeleton
                            variant="text"
                            width={'calc(100% - 40px)'}
                            height={30}
                            animation="wave"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton
                          variant="text"
                          width={'100%'}
                          height={30}
                          animation="wave"
                        />
                      </TableCell>
                      <TableCell>
                        <Skeleton
                          variant="text"
                          width={'100%'}
                          height={30}
                          animation="wave"
                        />
                      </TableCell>
                      <TableCell>
                        <Skeleton
                          variant="text"
                          width={'100%'}
                          height={30}
                          animation="wave"
                        />
                      </TableCell>
                      <TableCell>
                        <Skeleton
                          variant="text"
                          width={'100%'}
                          height={30}
                          animation="wave"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Grid>
    </>
  )
}

Producers.propTypes = {}

export default Producers
