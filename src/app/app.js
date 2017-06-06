import angular from "angular";
import uirouter from "angular-ui-router";
// my application routes
import routing from "./app.config.js";
// my modules
import home from "./home/home" // home.js from home folder
import ol from "../vendor/ol3/ol-custom.js";
console.log(ol);
angular.module("app", [uirouter, home]).config(routing);
