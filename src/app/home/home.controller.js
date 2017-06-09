import ol from "openlayers3";
import "ol3css"; // openlayers style
class HomeController {
  constructor($timeout) {
    // remember injected objects
    this.$timeout = $timeout;
    // copyright in footer
    this.copyright = "Evgeny Shulkin";
    this.license = "https://opensource.org/licenses/GPL-3.0";
    this.github = "https://github.com/Shulkin/far-east-natural-hazards";
    // create openlayers3 map
    this.createMap();
    // show legend by default
    this.showAside = true;
    this.updateMapSize();
    // some constants
    this.HAZARDS_TYPE = "hazards";
    this.DANGER_LEVEL = "danger";
    // show danger level by default
    this.displayMapType = this.DANGER_LEVEL;
  }
  transform(extent) {
    // transform from WGS84 to Web Mercator
    return ol.proj.transformExtent(extent, "EPSG:4326", "EPSG:3857");
  }
  createMap() {
    // [minlon, minlat, maxlon, maxlat]
    var bounds = this.transform([90, 38, 204, 78]);
    var overlay = new ol.layer.Tile({
      extent: bounds, // clip layer by this extent
      source: new ol.source.TileWMS({
        url: "http://gis.dvo.ru:8080/geoserver/wms",
        params: {"LAYERS": "Danger_Process_RE_FE:Danger_Process_FE_RF_MAP", "TILED": true},
        serverType: "geoserver"
      })
    });
    this.map = new ol.Map({
      target: "map",
      layers: [overlay],
      view: new ol.View({
        center: ol.proj.fromLonLat([147, 63]),
        extent: overlay.getExtent(),
        zoom: 4, // default zoom
        // restrict zoom levels
        minZoom: 4, maxZoom: 6
        // default projection is Spherical Mercator (EPSG:3857)
      })
    });
  }
  updateMapSize() {
    // run after angular digest cycle
    var that = this;
    this.$timeout(function() {
      that.map.updateSize();
    }, 0, false); // false to prevent another digest cycle
  }
  // show/hide sidebar panel
  toggleAside() {
    // manipulate ng-class in template
    this.showAside = !this.showAside;
    this.updateMapSize();
  }
}
// inject controller with additional functions
HomeController.$inject = ["$timeout"];
export default HomeController;
