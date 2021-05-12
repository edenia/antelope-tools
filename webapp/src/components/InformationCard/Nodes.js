import React, { memo } from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'

const Nodes = ({ nodes, producer, onNodeClick, t, type, classes }) => {
  if (type === 'node') return <></>

  if (!nodes.length)
    return (
      <Box className={classes.nodes}>
        <Typography variant="overline">{t('nodes')}</Typography>
        <Box className={classes.borderLine}>
          <Typography>{t('noData')}</Typography>
        </Box>
      </Box>
    )

  return (
    <Box className={classes.nodes}>
      <Typography variant="overline">{t('nodes')}</Typography>
      <Box className={classes.borderLine}>
        <Box>
          {nodes.map((node, i) => (
            <Box className={classes.rowWrapper} key={`node-${i}`}>
              <Typography variant="body1">
                {node.node_name || node.node_type}{' '}
              </Typography>
              <InfoOutlinedIcon onClick={onNodeClick({ node, producer })} />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

Nodes.propTypes = {
  nodes: PropTypes.array,
  producer: PropTypes.object,
  onNodeClick: PropTypes.func,
  classes: PropTypes.object,
  t: PropTypes.func,
  type: PropTypes.string
}

Nodes.defaultProps = {
  type: '',
  nodes: [],
  producer: {},
  onNodeClick: () => {},
  classes: {}
}

export default memo(Nodes)
