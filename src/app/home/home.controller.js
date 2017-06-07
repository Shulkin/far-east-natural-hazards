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
  createMap() {
    this.map = new ol.Map({
      target: "map",
      layers: [new ol.layer.Tile({
        source: new ol.source.TileWMS({
          url: "http://gis.dvo.ru:8080/geoserver/wms",
          params: {"LAYERS": "Danger_Process_RE_FE:Danger_Process_FE_RF_MAP", "TILED": true},
          serverType: "geoserver"
        })
      })],
      view: new ol.View({
        center: [15826009, 9377938],
        zoom: 4
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
