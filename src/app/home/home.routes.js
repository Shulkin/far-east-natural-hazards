routes.$inject = ["$stateProvider"];
export default function routes($stateProvider) {
  $stateProvider.state("home", {
    url: "/",
    // load template as string
    template: require("./home.html"),
    controller: "HomeController",
    controllerAs: "home"
  });
}
