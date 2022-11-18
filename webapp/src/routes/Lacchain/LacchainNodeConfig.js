import React from 'react'
import { makeStyles } from '@mui/styles'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'

import { eosConfig } from '../../config'

import useLacchainNodeConfigState from './useLacchainNodeConfigState'

const useStyles = makeStyles((theme) => ({
  formField: {
    marginBottom: theme.spacing(2),
  },
}))

const LacchainNodeConfig = () => {
  const classes = useStyles()
  const [
    { nodeType, ual, entityNodes, node, fileDownloadUrl },
    { handleOnChangeNode, handleOnChangeNodeType, t },
  ] = useLacchainNodeConfigState()

  return (
    <div>
      <Card>
        <CardContent>
          <Autocomplete
            className={classes.formField}
            options={eosConfig.nodeTypes.map((node) => node.name)}
            value={nodeType || ''}
            onChange={handleOnChangeNodeType}
            renderInput={(params) => (
              <TextField {...params} label={t('nodeType')} variant="outlined" />
            )}
          />

          {ual.activeUser && (
            <Autocomplete
              className={classes.formField}
              options={entityNodes.map((node) => node.name)}
              value={node || ''}
              onChange={handleOnChangeNode}
              renderInput={(params) => (
                <TextField {...params} label={t('node')} variant="outlined" />
              )}
            />
          )}

          <Button
            component="a"
            target="_blank"
            rel="noopener"
            download={`${nodeType}.ini`}
            href={fileDownloadUrl}
            type="submit"
            variant="contained"
            color="primary"
            disabled={!fileDownloadUrl}
          >
            {t('download')}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default LacchainNodeConfig
