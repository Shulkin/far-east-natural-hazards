routing.$inject = ["$urlRouterProvider", "$locationProvider"];
export default function routing($urlRouterProvider, $locationProvider) {
  // send us to / on startup
  $urlRouterProvider.otherwise("/");
  // enable html5 history
  $locationProvider.html5Mode(true);
}
