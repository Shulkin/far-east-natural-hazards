import $ from "jquery";
import ol from "openlayers3";
import "ol3css"; // openlayers style
// import style for map popup
import "./ol-popup.scss";
class HomeController {
  constructor($timeout, $scope) {
    // remember injected objects
    this.$timeout = $timeout;
    this.$scope = $scope;
    // copyright in footer
    this.copyright = "Evgeny Shulkin";
    this.license = "https://opensource.org/licenses/GPL-3.0";
    this.github = "https://github.com/Shulkin/far-east-natural-hazards";
    // wrap in $timeout to prevent exception
    this.$timeout(function() {
      // create openlayers3 map
      this.createMap();
    }.bind(this), 0, false);
    // show legend by default
    this.showAside = true;
    this.updateMapSize();
    // some constants
    this.HAZARDS_TYPE = "hazards";
    this.DANGER_LEVEL = "danger";
    this.HAZARDS_LIST = [
      "Землетрясения",
      "Лавины",
      "Сели",
      "Криогенные процессы",
      "Экстремально низкие температуры",
      "Снегоотложения",
      "Наводнения",
      "Наледи",
      "Грозы",
      "Пожары",
      "Перепады температур",
      "Метели",
      "Заторы",
      "Снеговые нагрузки",
      "Туманы",
      "Водная эрозия",
      "Карст",
      "Ледники",
      "Маловодье",
      "Сильный ветер",
      "Сильные дожди",
      "Экстремально высокие температуры",
      "Оползни",
      "Гололедно-изморозевые явления"
    ];
    // show danger level by default
    this.displayMapType = this.DANGER_LEVEL;
    // default object for selected feature
    this.selectedFeature = {rank: null, hazards: []};
  }
  transform(extent) {
    // transform extent from WGS84 to Web Mercator
    return ol.proj.transformExtent(extent, "EPSG:4326", "EPSG:3857");
  }
  createMap() {
    // [minlon, minlat, maxlon, maxlat]
    var bounds = this.transform([90, 38, 204, 78]);
    var wmsSource = new ol.source.TileWMS({
      url: "http://gis.dvo.ru:8080/geoserver/wms",
      params: {"LAYERS": "Danger_Process_RE_FE:Danger_Process_FE_RF_MAP", "TILED": true},
      serverType: "geoserver"
    });
    var wmsLayer = new ol.layer.Tile({
      extent: bounds, // clip layer by this extent
      source: wmsSource
    });
    var vectorSource = new ol.source.Vector();
    var vectorLayer = new ol.layer.Vector({
      source: vectorSource,
      style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: "rgba(255, 255, 255, 0.5)"
        }),
        stroke: new ol.style.Stroke({
          color: "#c04fe2",
          width: 2
        }),
      })
    });
    // elements that make up the popup
    var container = $("#popup")[0];
    var closer = $("#popup-closer")[0];
    // create an overlay to anchor the popup to the map
    var overlay = new ol.Overlay(/** @type {olx.OverlayOptions} */ ({
      element: container,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    }));
    function hidePopup() {
      // delete geometry on map
      vectorSource.clear();
      // hide modal popup window
      overlay.setPosition(undefined);
      closer.blur();
    }
    // add a click handler to hide the popup
    closer.onclick = function() {
      hidePopup(); // clear overlay and hide popup
      return false; // don't follow the href
    };
    var view = new ol.View({
      center: ol.proj.fromLonLat([147, 63]),
      extent: wmsLayer.getExtent(),
      zoom: 4, // default zoom
      // restrict zoom levels
      minZoom: 4, maxZoom: 6
      // default projection is Spherical Mercator (EPSG:3857)
    });
    this.map = new ol.Map({
      target: "map",
      layers: [wmsLayer, vectorLayer],
      overlays: [overlay],
      view: view
    });
    var self = this; // use self to avoid nested binds
    this.map.on("singleclick", function(evt) {
      var coordinate = evt.coordinate;
      var viewResolution = /** @type {number} */ (view.getResolution());
      var url = wmsSource.getGetFeatureInfoUrl(
        coordinate, viewResolution, "EPSG:3857",
        {
          "INFO_FORMAT": "application/json",
          "QUERY_LAYERS": "Danger_Process_RE_FE:Dang_Process"
        }
      );
      if (url) {
        fetch(url, {method: "GET"}).then(function(response) {
          return response.json();
        }).then(function(json) {
          // transform feature geometry from WGS84 to Web Mercator
          var features = new ol.format.GeoJSON({
            dataProjection: "EPSG:4326",
            featureProjection: "EPSG:3857"
          }).readFeatures(json);
          hidePopup(); // clear overlay and hide previous popup
          if (features.length > 0) {
            // tell angular to apply changes
            self.$scope.$apply(function() {
              // highlight selected feature
              vectorSource.addFeatures(features);
              // fill info about selected feature in popup
              self.selectedFeature = {
                rank: features[0].get("Rank"), // danger level
                hazards: features[0].get("Combi").split(",") // list of hazards
              };
              overlay.setPosition(coordinate); // show popup
            });
          }
        });
      }
    });
  }
  updateMapSize() {
    // run after angular digest cycle
    this.$timeout(function() {
      this.map.updateSize();
      // false to prevent another digest cycle
    }.bind(this), 0, false);
  }
  // show/hide sidebar panel
  toggleAside() {
    // manipulate ng-class in template
    this.showAside = !this.showAside;
    this.updateMapSize();
  }
}
// inject controller with additional functions
HomeController.$inject = ["$timeout", "$scope"];
export default HomeController;
