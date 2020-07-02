/* eslint camelcase: 0 */
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
import LinearProgress from '@material-ui/core/LinearProgress'
import 'flag-icon-css/css/flag-icon.min.css'

import { formatWithThousandSeparator, onImgError } from '../../utils'
import { generalConfig } from '../../config'
import ProducersChart from '../../components/ProducersChart'
import TransactionsChart from '../../components/TransactionsChart'

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
  },
  chartWrapper: {
    minWidth: 280,
    width: '100%'
  },
  chartSkeletonWrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  gridItem: {
    marginBottom: theme.spacing(2)
  },
  tableWrapper: {
    width: ' 100%',
    overflow: 'scroll'
  }
}))

const Producers = () => {
  const dispatch = useDispatch()
  const info = useSelector((state) => state.eos.info)
  const tps = useSelector((state) => state.eos.tps)
  const tpb = useSelector((state) => state.eos.tpb)
  const producers = useSelector((state) => state.eos.producers)
  const classes = useStyles()

  useEffect(() => {
    dispatch.eos.startTrackingInfo({ interval: 500 })
    dispatch.eos.getProducers()
    dispatch.eos.getRate()
  }, [dispatch])

  return (
    <Grid item xs={12}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Current Producer</Typography>
              <Typography variant="h3">{info.head_block_producer}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Head Block</Typography>
              <Typography variant="h3">
                {formatWithThousandSeparator(info.head_block_num)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Last Irreversible Block</Typography>
              <Typography variant="h3">
                {formatWithThousandSeparator(info.last_irreversible_block_num)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {!producers.rows.length && <LinearProgress />}
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6">Block Producer Schedule</Typography>
              {!producers.rows.length && (
                <div className={classes.chartSkeletonWrapper}>
                  <Skeleton
                    variant="circle"
                    width={280}
                    height={280}
                    animation="wave"
                  />
                </div>
              )}
              {producers.rows.length > 0 && (
                <ProducersChart info={info} producers={producers.rows} />
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Transactions Per Second</Typography>
                  {!producers.rows.length && (
                    <div className={classes.chartSkeletonWrapper}>
                      <Skeleton
                        variant="rect"
                        width={280}
                        height={100}
                        animation="wave"
                      />
                    </div>
                  )}
                  {producers.rows.length > 0 && (
                    <TransactionsChart data={tps} />
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Transactions Per Block</Typography>
                  {!producers.rows.length && (
                    <div className={classes.chartSkeletonWrapper}>
                      <Skeleton
                        variant="rect"
                        width={280}
                        height={100}
                        animation="wave"
                      />
                    </div>
                  )}
                  {producers.rows.length > 0 && (
                    <TransactionsChart data={tpb} />
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} className={classes.tableWrapper}>
        <Card>
          <CardContent>
            <Typography variant="h6">Block Producer Votes</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Rank</TableCell>
                  <TableCell>Block Producer</TableCell>
                  {generalConfig.useVotes && (
                    <>
                      <TableCell>Votes %</TableCell>
                      <TableCell>Total Votes</TableCell>
                    </>
                  )}
                  <TableCell>Location</TableCell>
                  {generalConfig.useRewards && (
                    <TableCell>Expected Rewards</TableCell>
                  )}
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
                          generalConfig.defaultProducerLogo
                        }
                        onError={onImgError(generalConfig.defaultProducerLogo)}
                        alt="logo"
                      />
                      {producer?.owner}
                    </TableCell>
                    {generalConfig.useVotes && (
                      <>
                        <TableCell>
                          {formatWithThousandSeparator(
                            (producer?.total_votes_percent || 0) * 100,
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
                      </>
                    )}
                    <TableCell>
                      <span
                        className={`flag-icon flag-icon-squared flag-icon-${producer?.bp_json?.org?.location?.country?.toLocaleLowerCase()}`}
                      />
                      <span className={classes.country}>
                        {producer?.bp_json?.org?.location?.name || 'N/A'}
                      </span>
                    </TableCell>
                    {generalConfig.useRewards && (
                      <TableCell>
                        {formatWithThousandSeparator(producer?.total_reward, 2)}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
                {!producers.rows.length &&
                  [1, 2, 3].map((_, i) => (
                    <TableRow key={`producer-table-row-${i}`}>
                      <TableCell>
                        <Skeleton
                          variant="text"
                          width="100%"
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
                            width="calc(100% - 40px)"
                            height={30}
                            animation="wave"
                          />
                        </div>
                      </TableCell>
                      {generalConfig.useVotes && (
                        <>
                          <TableCell>
                            <Skeleton
                              variant="text"
                              width="100%"
                              height={30}
                              animation="wave"
                            />
                          </TableCell>
                          <TableCell>
                            <Skeleton
                              variant="text"
                              width="100%"
                              height={30}
                              animation="wave"
                            />
                          </TableCell>
                        </>
                      )}
                      <TableCell>
                        <Skeleton
                          variant="text"
                          width="100%"
                          height={30}
                          animation="wave"
                        />
                      </TableCell>
                      {generalConfig.useRewards && (
                        <TableCell>
                          <Skeleton
                            variant="text"
                            width="100%"
                            height={30}
                            animation="wave"
                          />
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

Producers.propTypes = {}

export default Producers
