routing.$inject = ["$urlRouterProvider", "$locationProvider"];
export default function routing($urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  // send us to / on startup
  $urlRouterProvider.otherwise("/");
}
