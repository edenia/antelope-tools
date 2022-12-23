import React, { memo } from 'react'
import PropTypes from 'prop-types'
import Typography from '@mui/material/Typography'

import NodeCard from '../../components/NodeCard'
import MoreInfoModal from '../../components/MoreInfoModal'

const Nodes = ({ nodes, producer, t, classes }) => {
  if (!nodes?.length) {
    return (
      <div className={classes.nodes}>
        <Typography variant="overline">{t('nodes')}</Typography>
        <div className={classes.borderLine}>
          <Typography>{t('noData')}</Typography>
        </div>
      </div>
    )
  }

  return (
    <div className={classes.nodes}>
      <Typography variant="overline">{t('nodes')}</Typography>
      <div className={classes.borderLine}>
        <>
          {nodes.map((node, index) => (
            <div
              key={`node-${
                producer?.owner
              }-${node?.node_type?.toString()}-${index}`}
            >
              <div className={classes.flex}>
                <Typography
                  variant="body1"
                  className={classes.textEllipsisNodes}
                >
                  {node.name || node?.node_type?.toString() || 'node'}{' '}
                </Typography>
                <MoreInfoModal>
                  <NodeCard node={node} producer={producer} />
                </MoreInfoModal>
              </div>
            </div>
          ))}
        </>
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
}

Nodes.defaultProps = {
  nodes: [],
  producer: {},
  onNodeClick: () => {},
  classes: {},
}

export default memo(Nodes)
