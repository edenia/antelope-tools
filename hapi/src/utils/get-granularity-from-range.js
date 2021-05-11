const getGranularityFromRange = range => {
  let granularity

  switch (range) {
    case '3 Hours':
    case '6 Hours':
    case '12 Hours':
      granularity = 'minute'
      break
    case '1 Day':
    case '4 Days':
    case '7 Days':
    case '14 Days':
      granularity = 'hour'
      break
    case '1 Month':
    case '2 Months':
    case '3 Months':
    case '6 Months':
      granularity = 'day'
      break
    case '1 Year':
    case 'all':
      granularity = 'month'
      break
    default:
      granularity = 'minute'
      break
  }

  return granularity
}

module.exports = {
  getGranularityFromRange
}
