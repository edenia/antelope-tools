import './proj4Wrapper'
import Highcharts from 'highcharts'
import HighchartsMap from 'highcharts/modules/map'

import markerClusters from 'highcharts/modules/marker-clusters'
markerClusters(Highcharts)

if (typeof window !== 'undefined') {
  HighchartsMap(Highcharts)
}

const HighMapsWrapper = Highcharts

export default HighMapsWrapper
