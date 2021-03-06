import angular from "angular";
// repeated dependencies will be ignored
import uirouter from "angular-ui-router";
// import style for this state
import "./home.scss";
// import classes
import routing from "./home.routes";
import HomeController from "./home.controller";
export default angular.module("app.home", [uirouter])
  .config(routing)
  .controller("HomeController", HomeController)
  .name; // also, return module name
