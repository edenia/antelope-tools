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
import 'flag-icon-css/css/flag-icon.min.css'

import { parseVotesToEOS, formatWithThousandSeparator } from '../../utils'

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
  const producers = useSelector((state) => state.eos.producers)
  const classes = useStyles()

  const useDefaultLogo = (ev) => {
    ev.target.src = defaultLogo
  }

  useEffect(() => {
    dispatch.eos.startTrackingProducers({ interval: 300000 })
  }, [dispatch])

  return (
    <Grid item sm={12}>
      <Card>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Block Producer</TableCell>
                <TableCell>Votes %</TableCell>
                <TableCell>Total Votes</TableCell>
                <TableCell>Location</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {producers.rows.map((product, index) => (
                <TableRow key={`product-table-row-${index}`}>
                  <TableCell className={classes.owner}>
                    <img
                      className={classes.logo}
                      src={
                        product.bpJSON?.org?.branding?.logo_256 || defaultLogo // eslint-disable-line camelcase
                      }
                      onError={useDefaultLogo}
                      alt="logo"
                    />
                    {product.owner}
                  </TableCell>
                  <TableCell>
                    {formatWithThousandSeparator(
                      (product.total_votes /
                        producers.total_producer_vote_weight) *
                        100,
                      3
                    )}
                    %
                  </TableCell>
                  <TableCell>
                    {formatWithThousandSeparator(
                      parseVotesToEOS(product.total_votes),
                      0
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`flag-icon flag-icon-squared flag-icon-${product.bpJSON?.org?.location?.country?.toLocaleLowerCase()}`}
                    />
                    <span className={classes.country}>
                      {product.bpJSON?.org?.location?.name || 'N/A'}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Grid>
  )
}

Producers.propTypes = {}

export default Producers
