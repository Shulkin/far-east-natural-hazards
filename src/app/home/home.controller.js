import ol3 from "openlayers3";
import "ol3css"; // openlayers style
export default class HomeController {
  constructor() {
    this.copyright = "Evgeny Shulkin";
    this.license = "https://opensource.org/licenses/GPL-3.0";
    this.github = "https://github.com/Shulkin/far-east-natural-hazards";
    var map = new ol3.ol.Map({
      target: "map",
      layers: [
        new ol3.ol.layer.Tile({
          source: new ol3.ol.source.OSM()
        })
      ],
      view: new ol3.ol.View({
        center: [0, 0],
        zoom: 4
      })
    });
  }
}
