import React, { memo } from 'react'
import PropTypes from 'prop-types'
import Typography from '@mui/material/Typography'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

const Nodes = ({ nodes, producer, onNodeClick, t, type, classes }) => {
  if (type === 'node') return <></>

  if (!nodes?.length)
    return (
      <div className={classes.nodes}>
        <Typography variant="overline">{t('nodes')}</Typography>
        <div className={classes.borderLine}>
          <Typography>{t('noData')}</Typography>
        </div>
      </div>
    )

  return (
    <div className={classes.nodes}>
      <Typography variant="overline">{t('nodes')}</Typography>
      <div className={classes.borderLine}>
        <div>
          {nodes.map((node, i) => (
            <div className={classes.rowWrapper} key={`node-${i}`}>
              <Typography variant="body1">
                {node.name || node.node_type.toString()}{' '}
              </Typography>
              <InfoOutlinedIcon onClick={onNodeClick({ node, producer })} />
            </div>
          ))}
        </div>
      </div>
    </div>
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
