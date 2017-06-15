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
      {name: "Землетрясения", selected: false},
      {name: "Лавины", selected: false},
      {name: "Сели", selected: false},
      {name: "Криогенные процессы", selected: false},
      {name: "Экстремально низкие температуры", selected: false},
      {name: "Снегоотложения", selected: false},
      {name: "Наводнения", selected: false},
      {name: "Наледи", selected: false},
      {name: "Грозы", selected: false},
      {name: "Пожары", selected: false},
      {name: "Перепады температур", selected: false},
      {name: "Метели", selected: false},
      {name: "Заторы", selected: false},
      {name: "Снеговые нагрузки", selected: false},
      {name: "Туманы", selected: false},
      {name: "Водная эрозия", selected: false},
      {name: "Карст", selected: false},
      {name: "Ледники", selected: false},
      {name: "Маловодье", selected: false},
      {name: "Сильный ветер", selected: false},
      {name: "Сильные дожди", selected: false},
      {name: "Экстремально высокие температуры", selected: false},
      {name: "Оползни", selected: false},
      {name: "Гололедно-изморозевые явления", selected: false}
    ];
    this.DANGER_LEGEND = [
      {color: "#2892c7", rank: 1},
      {color: "#68a6b3", rank: 2},
      {color: "#95bd9f", rank: 3},
      {color: "#bfd48a", rank: 4},
      {color: "#e7ed72", rank: 5},
      {color: "#fce45b", rank: 6},
      {color: "#fcb344", rank: 7},
      {color: "#fa7b32", rank: 8},
      {color: "#f25622", rank: 9},
      {color: "#e81014", rank: 10}
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
    // ===
    var hazardSource = new ol.source.Vector({
      format: new ol.format.GeoJSON(),
      url: function(extent) {
        // request vector features from geoserver
        return "http://gis.dvo.ru:8080/geoserver/Danger_Process_RE_FE/ows?" +
          // use WFS to transfer geometry in GeoJSON format
         "service=WFS&" + "version=1.0.0&" + "request=GetFeature&" +
         "typeName=Danger_Process_RE_FE:Dang_Process&" + "maxFeatures=5000&" +
         // requested coordinates in EPSG:3857, Web Mercator
         "srsname=EPSG:3857&" + "outputFormat=application/json&" +
         // filter by extent
         "bbox=" + extent.join(",") + ",EPSG:3857";
      },
      strategy: ol.loadingstrategy.bbox
    });
    var hazardLayer = new ol.layer.Vector({
      source: hazardSource,
      style: null // empty style
    });
    var selectedStyle = new ol.style.Style({
      fill: new ol.style.Fill({
        color: "rgba(255, 255, 255, 0.75)"
      }),
      stroke: new ol.style.Stroke({
        color: "#bc53db",
        width: 2
      })
    });
    var hazardHighlightSource = new ol.source.Vector();
    var hazardHighlightLayer = new ol.layer.Vector({
      source: hazardHighlightSource,
      style: selectedStyle
    })
    // ===
    var vectorSource = new ol.source.Vector();
    var vectorLayer = new ol.layer.Vector({
      source: vectorSource,
      style: selectedStyle
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
    this.hidePopup = hidePopup; // export function to scope
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
      layers: [wmsLayer, hazardLayer, hazardHighlightLayer, vectorLayer],
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
          self.hidePopup(); // clear overlay and hide previous popup
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
    // TEST FUNCTIONS!
    function showVectorHazardsOverlay() {
      hazardLayer.setVisible(true);
      hazardHighlightLayer.setVisible(true);
    }
    function hideVectorHazardsOverlay() {
      hazardLayer.setVisible(false);
      hazardHighlightLayer.setVisible(false);
    }
    function selectOnHazardLayer(combiArray) {
      hazardHighlightSource.clear(); // ???
      // combiArray - array of user selected hazards ids
      hazardSource.forEachFeature(function(feature) {
        var combi = feature.get("Combi").split(",");
        for (var i = 0; i < combi.length; i++) {
          var halt = false;
          for (var j = 0; j < combiArray.length; j++) {
            if (combi[i] == (combiArray[j] + 1)) {
              hazardHighlightSource.addFeature(feature);
              halt = true;
              break;
            }
          }
          if (halt) break;
        }
      });
    }
    this.showVectorHazardsOverlay = showVectorHazardsOverlay;
    this.hideVectorHazardsOverlay = hideVectorHazardsOverlay;
    this.selectOnHazardLayer = selectOnHazardLayer;
    hideVectorHazardsOverlay();
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
  changeDisplayType() {
    var type = this.displayMapType;
    this.hidePopup();
    // console.log("changeDisplayType: " + type);
    if (type === this.HAZARDS_TYPE) { // list of hazards
      // console.log("show hazards in regions");
      this.showVectorHazardsOverlay();
    } else { // danger level
      // console.log("show default map");
      this.hideVectorHazardsOverlay();
    }
  }
  toggleHazardType(index) {
    // console.log("toggleHazardType: " + this.HAZARDS_LIST[index]);
    this.HAZARDS_LIST[index].selected = !this.HAZARDS_LIST[index].selected;
    var array = [];
    this.HAZARDS_LIST.forEach(function(element, index) {
      if (element.selected) array.push(index);
    })
    this.selectOnHazardLayer(array);
  }
}
// inject controller with additional functions
HomeController.$inject = ["$timeout", "$scope"];
export default HomeController;
