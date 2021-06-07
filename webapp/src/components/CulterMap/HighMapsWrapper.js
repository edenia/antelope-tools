import "./proj4Wrapper";
import Highcharts from "highcharts";
import HighchartsMap from "highcharts/modules/map";

import markerClusters from "highcharts/modules/marker-clusters";
markerClusters(Highcharts);

// NOTE: Again, if doing server side rendering, check for window before bothering.
// Highcharts modules crash on the server.
if (typeof window !== "undefined") {
  HighchartsMap(Highcharts);
}

const HighMapsWrapper = Highcharts;

export default HighMapsWrapper;
