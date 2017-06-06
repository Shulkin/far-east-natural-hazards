export default class HomeController {
  constructor() {
    this.copyright = "Evgeny Shulkin";
    this.license = "https://opensource.org/licenses/GPL-3.0";
    this.github = "https://github.com/Shulkin/far-east-natural-hazards";
    var map = new ol.Map({
      target: "map",
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: new ol.View({
        center: [0, 0],
        zoom: 4
      })
    });
  }
}
