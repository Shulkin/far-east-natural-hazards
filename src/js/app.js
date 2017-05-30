import angular from "angular";
import uirouter from "angular-ui-router";
// my application routes
import routing from "./app.config.js";
angular.module("app", []).config(routing);
