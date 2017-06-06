import angular from "angular";
import uirouter from "angular-ui-router";
// my application routes
import routing from "./app.config.js";
// my modules
import home from "./home/home"; // home.js from home folder
angular.module("app", [uirouter, home]).config(routing);
