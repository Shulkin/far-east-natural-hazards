import ol3 from "openlayers3";
import "ol3css"; // openlayers style
import $ from "jquery";
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
    $(".js-show-aside").on("click", function() {
      $(".aside-toggle").toggleClass("is-hidden");
      $(".aside-panel").removeClass("is-hidden");
      $(".main-panel").removeClass("is-12");
      $(".main-panel").addClass("is-9");
      map.updateSize();
    });
    $(".js-hide-aside").on("click", function() {
      $(".aside-toggle").toggleClass("is-hidden");
      $(".aside-panel").addClass("is-hidden");
      $(".main-panel").removeClass("is-9");
      $(".main-panel").addClass("is-12");
      map.updateSize();
    });
  }
}
