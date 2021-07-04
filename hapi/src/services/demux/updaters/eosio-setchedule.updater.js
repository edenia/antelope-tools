const missedBlocksService = require('../../missed-blocks.service')

module.exports = {
  actionType: `eosio::setschedule`,
  apply: missedBlocksService.setScheduleByDemux
}
