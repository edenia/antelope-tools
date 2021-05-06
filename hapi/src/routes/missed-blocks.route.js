const { missedBlocksService } = require('../services')

module.exports = {
  method: 'POST',
  path: '/missed-blocks',
  handler: () => missedBlocksService.getMissedBlocks(),
  options: {
    auth: false
  }
}
